"""
Modelos de input para documentos de violencia familiar (Ley 9283, Córdoba).
Documentos cubiertos:
  - MedidasUrgentesVFInput      → auto de medidas urgentes de protección (art. 26 Ley 9283)
  - CitacionAudienciaVFInput    → decreto de citación a audiencia (art. 27 Ley 9283)
  - ProrrogaMedidasVFInput      → auto de prórroga de medidas de protección (art. 26 Ley 9283)
  - CeseMedidasVFInput          → auto de cese de medidas de protección (art. 26 Ley 9283)
  - OficioPoliciaVFInput        → decreto de oficio a policía para custodia/vigilancia
"""

from datetime import date
from typing import Literal

from pydantic import Field

from ...base import ExpedienteBase


class MedidasUrgentesVFInput(ExpedienteBase):
    """
    Auto que dicta medidas urgentes de protección en causas de violencia
    familiar (art. 26 Ley 9283 Córdoba):
      - exclusión del hogar del agresor
      - restricción de acercamiento (perímetro en metros)
      - prohibición de contacto (llamadas, mensajes, redes sociales)
    Las medidas se activan con los booleanos correspondientes.
    """
    exclusion_hogar: bool = Field(
        default=True,
        description="Ordenar la exclusión del agresor del hogar familiar",
    )
    domicilio_hogar: str | None = Field(
        default=None,
        description="Domicilio del hogar familiar (obligatorio si exclusion_hogar=True)",
    )
    restriccion_acercamiento: bool = Field(
        default=True,
        description="Ordenar restricción de acercamiento con perímetro",
    )
    metros_restriccion: int = Field(
        default=300,
        gt=0,
        description="Distancia en metros del perímetro de restricción",
    )
    prohibicion_contacto: bool = Field(
        default=True,
        description="Prohibir todo tipo de contacto (llamadas, mensajes, etc.)",
    )
    plazo_dias: int = Field(
        default=90,
        gt=0,
        description="Vigencia de las medidas en días corridos",
    )

    def model_post_init(self, __context: object) -> None:
        if self.exclusion_hogar and not self.domicilio_hogar:
            raise ValueError("'domicilio_hogar' es obligatorio cuando exclusion_hogar=True")


class CitacionAudienciaVFInput(ExpedienteBase):
    """
    Decreto de citación a audiencia en causa de violencia familiar
    (art. 27 Ley 9283 Córdoba). Se utiliza para la audiencia de conciliación,
    seguimiento de medidas o revisión periódica.
    """
    tipo_audiencia: Literal["conciliacion", "seguimiento", "revision"] = Field(
        default="conciliacion",
        description="Tipo de audiencia: conciliación / seguimiento de medidas / revisión periódica",
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


class ProrrogaMedidasVFInput(ExpedienteBase):
    """
    Auto que prorroga las medidas de protección urgentes dictadas en la causa
    de violencia familiar (art. 26 Ley 9283 Córdoba), por subsistir la
    situación de riesgo.
    """
    plazo_prorroga_dias: int = Field(
        default=90,
        gt=0,
        description="Días de prórroga de las medidas",
    )
    medidas_vigentes: list[str] = Field(
        default_factory=list,
        description=(
            "Lista de medidas que se prorrogan (ej: 'exclusión del hogar', "
            "'restricción de acercamiento 300 m', 'prohibición de contacto')"
        ),
    )
    motivo_prorroga: str = Field(
        default="subsisten las circunstancias de riesgo que motivaron las medidas originales",
        description="Fundamento de la prórroga",
    )


class CeseMedidasVFInput(ExpedienteBase):
    """
    Auto que dispone el cese de las medidas de protección en la causa de
    violencia familiar por haberse superado la situación de riesgo o a
    pedido de la víctima (art. 26 Ley 9283 Córdoba).
    """
    medidas_que_cesan: list[str] = Field(
        default_factory=list,
        description=(
            "Lista de medidas que se levantan (ej: 'exclusión del hogar', "
            "'restricción de acercamiento')"
        ),
    )
    motivo_cese: Literal[
        "superacion_riesgo",
        "pedido_victima",
        "acuerdo_partes",
        "vencimiento_plazo",
        "archivo_causa",
        "otro",
    ] = Field(
        default="superacion_riesgo",
        description="Causal del cese de las medidas de protección",
    )
    motivo_descripcion: str | None = Field(
        default=None,
        description="Descripción adicional cuando motivo_cese='otro'",
    )


class OficioPoliciaVFInput(ExpedienteBase):
    """
    Decreto que libra oficio a la Policía de la Provincia de Córdoba para
    que realice custodia, vigilancia o verificación de cumplimiento de
    medidas en causa de violencia familiar (Ley 9283, Córdoba).
    """
    tipo_oficio: Literal["custodia", "verificacion_cumplimiento", "traslado", "otro"] = Field(
        default="custodia",
        description=(
            "Tipo de intervención policial: "
            "'custodia' (vigilancia del domicilio de la víctima); "
            "'verificacion_cumplimiento' (constatar que el agresor cumple las medidas); "
            "'traslado' (acompañar a la víctima a retirar pertenencias); "
            "'otro'"
        ),
    )
    domicilio_intervencion: str = Field(
        description="Domicilio donde debe actuar la policía",
    )
    descripcion_instrucciones: str = Field(
        description="Instrucciones específicas para la fuerza policial",
    )
    unidad_policial: str | None = Field(
        default=None,
        description="Destacamento o comisaría de la jurisdicción (opcional)",
    )
