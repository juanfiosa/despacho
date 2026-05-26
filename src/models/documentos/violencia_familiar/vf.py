"""
Modelos de input para documentos de violencia familiar (Ley 9283, Córdoba).
Documentos cubiertos:
  - MedidasUrgentesVFInput      → auto de medidas urgentes de protección
  - CitacionAudienciaVFInput    → decreto de citación a audiencia (art. 27 Ley 9283)
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
