"""
Modelos de input para documentos del fuero Familia (CPF Ley 10305, Córdoba).
Documentos cubiertos:
  - AlimentosProvisioriosInput     → auto que fija cuota alimentaria provisoria
  - AdmisionAlimentosInput         → decreto de admisión de demanda de alimentos + citación a audiencia
  - AdmisionDivorcioInput          → decreto de admisión de divorcio (arts. 437-438 CCyCN)
  - AdmisionComunicacionInput      → decreto de admisión de régimen de comunicación + citación
"""

from datetime import date
from typing import Literal

from pydantic import Field

from ...base import ExpedienteBase


class AlimentosProvisioriosInput(ExpedienteBase):
    """
    Auto que fija cuota alimentaria provisoria mientras tramita el proceso
    principal (art. 544 CCyCN). Bajo apercibimiento de lo dispuesto por el
    art. 553 CCyCN en caso de incumplimiento.
    """
    cuota: float = Field(
        gt=0,
        description="Monto de la cuota alimentaria provisoria en pesos",
    )
    periodicidad: Literal["mensual", "quincenal", "semanal"] = Field(
        default="mensual",
        description="Periodicidad de pago de la cuota",
    )
    dia_vencimiento: int = Field(
        default=1,
        ge=1,
        le=31,
        description="Día del mes/período de vencimiento de la cuota (para periodicidad mensual)",
    )
    forma_pago: Literal["deposito_judicial", "transferencia_bancaria", "efectivo"] = Field(
        default="deposito_judicial",
        description="Forma en que deberá abonarse la cuota",
    )
    cbu_alias: str | None = Field(
        default=None,
        description="CBU o alias bancario para transferencia (obligatorio si forma_pago=transferencia_bancaria)",
    )

    def model_post_init(self, __context: object) -> None:
        if self.forma_pago == "transferencia_bancaria" and not self.cbu_alias:
            raise ValueError(
                "'cbu_alias' es obligatorio cuando forma_pago='transferencia_bancaria'"
            )


class AdmisionAlimentosInput(ExpedienteBase):
    """
    Decreto de admisión de demanda de alimentos y citación a audiencia
    (arts. 2 y 3 CPF Ley 10305; art. 544 CCyCN).
    """
    objeto: str = Field(
        default="fijación de cuota alimentaria",
        description="Objeto del proceso (ej: 'fijación de cuota alimentaria', 'aumento de cuota')",
    )
    fecha_audiencia: date = Field(
        description="Fecha de la audiencia de conciliación",
    )
    hora_audiencia: str = Field(
        default="09:00",
        description="Hora de la audiencia en formato HH:MM",
    )
    sala: str | None = Field(
        default=None,
        description="Sala o número de despacho (opcional)",
    )


class AdmisionDivorcioInput(ExpedienteBase):
    """
    Decreto de admisión formal de demanda/petición de divorcio vincular
    (arts. 437 y 438 CCyCN). Aplica tanto al divorcio unilateral como al
    presentado de común acuerdo.
    """
    tipo_divorcio: Literal["unilateral", "bilateral"] = Field(
        default="unilateral",
        description="'unilateral' = petición de uno de los cónyuges; 'bilateral' = petición conjunta",
    )
    plazo_retiro_documentos_dias: int = Field(
        default=10,
        gt=0,
        description="Plazo en días para que las partes retiren la documentación para protocolización",
    )


class AdmisionComunicacionInput(ExpedienteBase):
    """
    Decreto de admisión de demanda sobre régimen de comunicación (art. 555 CCyCN)
    y citación a audiencia de conciliación (CPF Ley 10305).
    """
    objeto: str = Field(
        default="fijación de régimen de comunicación y contacto",
        description="Objeto del proceso",
    )
    fecha_audiencia: date = Field(
        description="Fecha de la audiencia",
    )
    hora_audiencia: str = Field(
        default="09:00",
        description="Hora de la audiencia en formato HH:MM",
    )
    sala: str | None = Field(
        default=None,
        description="Sala o número de despacho (opcional)",
    )
