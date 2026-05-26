import re
from datetime import date
from typing import Annotated

from pydantic import BaseModel, field_validator, model_validator, Field

from .enums import Fuero, TasaInteres


# ---------------------------------------------------------------------------
# Validador de número de expediente — formato TSJA: NNNNNNN/YYYY
# ---------------------------------------------------------------------------

_RE_EXPEDIENTE = re.compile(r"^\d{1,7}/\d{4}$")


def _validar_numero_expediente(v: str) -> str:
    if not _RE_EXPEDIENTE.match(v):
        raise ValueError("Formato inválido. Use NNNNNNN/YYYY (ej: 1234567/2026)")
    anio = int(v.split("/")[1])
    if anio < 1900 or anio > date.today().year + 1:
        raise ValueError(f"Año de expediente fuera de rango: {anio}")
    return v


# ---------------------------------------------------------------------------
# Identificación del expediente
# ---------------------------------------------------------------------------

class IdentificacionExpediente(BaseModel):
    numero: Annotated[str, Field(description="Número de expediente (NNNNNNN/YYYY)")]
    caratula: str = Field(description="Carátula del expediente")
    fuero: Fuero
    juzgado: str = Field(description="Nombre o número del juzgado")
    secretaria: str | None = Field(default=None, description="Secretaría (si aplica)")
    ciudad: str = Field(default="Córdoba", description="Ciudad sede del juzgado")

    @field_validator("numero")
    @classmethod
    def validar_numero(cls, v: str) -> str:
        return _validar_numero_expediente(v)


# ---------------------------------------------------------------------------
# Parte interviniente
# ---------------------------------------------------------------------------

class Letrado(BaseModel):
    nombre: str
    matricula: str | None = None
    domicilio_constituido: str | None = None


class Parte(BaseModel):
    rol: str = Field(description="Rol según fuero (usar enum del fuero correspondiente)")
    nombre: str
    dni_cuit: str | None = Field(default=None, description="DNI o CUIT/CUIL")
    domicilio_real: str | None = None
    domicilio_constituido: str | None = None
    letrado: Letrado | None = None


# ---------------------------------------------------------------------------
# Datos económicos (solo para documentos que los requieren)
# ---------------------------------------------------------------------------

class DatosEconomicos(BaseModel):
    capital: float = Field(gt=0, description="Monto de capital en pesos")
    tasa: TasaInteres
    tasa_descripcion: str | None = Field(
        default=None,
        description="Descripción de la tasa cuando tasa=OTRA. Obligatorio si tasa=OTRA.",
    )
    fecha_mora: date = Field(description="Fecha desde la que corren intereses")
    costas: bool = Field(default=True, description="Si se imponen costas al demandado")

    @model_validator(mode="after")
    def tasa_otra_requiere_descripcion(self) -> "DatosEconomicos":
        from .enums import TasaInteres
        if self.tasa == TasaInteres.OTRA and not self.tasa_descripcion:
            raise ValueError("tasa_descripcion es obligatorio cuando tasa=OTRA")
        return self


# ---------------------------------------------------------------------------
# Base de todo expediente ingresado a Despacho
# ---------------------------------------------------------------------------

class ExpedienteBase(BaseModel):
    identificacion: IdentificacionExpediente
    partes: list[Parte] = Field(min_length=1, description="Al menos una parte")
    texto_libre: str | None = Field(
        default=None,
        description="Observaciones del actuario (campo optativo, procesado por LLM si presente)",
    )
