"""
Modelos de input para documentos del fuero Laboral (CPT Ley 7987, Córdoba).
Documentos cubiertos:
  - AutoAdmisionLaboralInput      → decreto de admisión + citación a audiencia de conciliación
  - AutoAperturaLaboralInput      → auto de apertura a prueba laboral (art. 83 CPT)
"""

from datetime import date

from pydantic import Field

from ...base import ExpedienteBase
from ..civil_comercial.ejecutivo import AutoAperturaPruebaInput


class AutoAdmisionLaboralInput(ExpedienteBase):
    """
    Decreto que tiene por presentada la demanda laboral ordinaria, admite la
    pretensión y cita a las partes a audiencia de conciliación
    (art. 83 CPT Ley 7987 Córdoba).
    """
    objeto: str = Field(
        description=(
            "Objeto del reclamo laboral (ej: 'indemnización por despido "
            "injustificado, diferencias salariales y demás rubros emergentes "
            "de la relación laboral')"
        )
    )
    fecha_audiencia: date = Field(
        description="Fecha de la audiencia de conciliación",
    )
    hora_audiencia: str = Field(
        default="10:00",
        description="Hora de la audiencia en formato HH:MM",
    )
    sala: str | None = Field(
        default=None,
        description="Sala o número de sala donde se celebrará la audiencia (opcional)",
    )


class AutoAperturaLaboralInput(AutoAperturaPruebaInput):
    """
    Auto de apertura a prueba en el proceso laboral ordinario (art. 83 CPT).
    Mismos campos que el civil pero apunta a template con referencia CPT.
    """
    pass
