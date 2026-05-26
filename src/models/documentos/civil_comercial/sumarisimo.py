"""
Modelos de input para documentos del juicio sumarísimo (CPCC Ley 8465, Córdoba).
Documentos cubiertos:
  - AutoSumarisimoCitacionInput → decreto de admisión y citación a audiencia (art. 418 CPCC)
"""

from datetime import date

from pydantic import Field

from ...base import ExpedienteBase


class AutoSumarisimoCitacionInput(ExpedienteBase):
    """
    Decreto que admite la demanda sumarísima y cita al demandado a
    la audiencia única del art. 418 del CPCC Córdoba.
    """
    objeto: str = Field(
        description=(
            "Objeto de la demanda sumarísima (ej: 'cobro de pesos por "
            "alquileres adeudados')"
        )
    )
    fecha_audiencia: date = Field(
        description="Fecha de la audiencia única del art. 418 CPCC"
    )
    hora_audiencia: str = Field(
        default="09:00",
        description="Hora de la audiencia en formato HH:MM",
    )
    sala: str | None = Field(
        default=None,
        description="Sala o despacho del juzgado (opcional)",
    )
    plazo_contestacion_dias: int = Field(
        default=3,
        gt=0,
        description="Plazo para contestar la demanda (art. 418 CPCC prevé plazo abreviado)",
    )
