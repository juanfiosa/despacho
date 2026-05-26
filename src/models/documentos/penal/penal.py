"""
Modelos de input para documentos del fuero Penal (CPP Ley 8123, Córdoba).
Documentos cubiertos:
  - CitacionImputacionInput         → citación del imputado al acto de imputación (art. 271 CPP)
  - AutoElevacionJuicioInput        → auto de elevación a juicio (art. 354 CPP)
  - FijacionAudienciaDebateInput    → decreto que fija fecha del debate oral (art. 374 CPP)
"""

from datetime import date

from pydantic import Field

from ...base import ExpedienteBase


class CitacionImputacionInput(ExpedienteBase):
    """
    Decreto que cita al imputado a comparecer al acto formal de imputación
    ante el fiscal de instrucción (art. 271 CPP Ley 8123, Córdoba).
    """
    fiscal_nombre: str = Field(
        description="Nombre y apellido del fiscal requirente"
    )
    fiscal_unidad: str | None = Field(
        default=None,
        description="Unidad Fiscal o Fiscalía (ej: Fiscalía de Instrucción N.° 4)",
    )
    objeto_imputacion: str = Field(
        description=(
            "Descripción del hecho imputado (ej: 'homicidio culposo en accidente "
            "de tránsito, art. 84 CP')"
        )
    )
    fecha_citacion: date = Field(
        description="Fecha en que deberá comparecer el imputado"
    )
    hora_citacion: str = Field(
        default="09:00",
        description="Hora de comparecencia en formato HH:MM",
    )


class AutoElevacionJuicioInput(ExpedienteBase):
    """
    Auto que clausura la investigación penal preparatoria y eleva la causa
    a juicio oral (art. 354 CPP Ley 8123, Córdoba).
    """
    fiscal_nombre: str = Field(
        description="Nombre del fiscal que formuló el requerimiento de elevación"
    )
    calificacion_legal: str = Field(
        description=(
            "Calificación legal del hecho (ej: 'robo calificado, arts. 164 y 166 inc. 2 CP')"
        )
    )
    tipo_juicio: str = Field(
        default="oral",
        description="Tipo de juicio: 'oral' (público y oral) o 'abreviado'",
    )


class FijacionAudienciaDebateInput(ExpedienteBase):
    """
    Decreto que fija fecha, hora y sede del debate oral y público
    (art. 374 CPP Ley 8123, Córdoba).
    """
    fiscal_nombre: str = Field(description="Nombre del fiscal que sostendrá la acusación")
    calificacion_legal: str = Field(
        description="Calificación legal del hecho (ej: 'estafa reiterada, art. 172 CP')"
    )
    fecha_debate: date = Field(description="Fecha del debate oral")
    hora_debate: str = Field(default="09:00", description="Hora de inicio del debate (HH:MM)")
    sala: str | None = Field(default=None, description="Sala o sede del tribunal (opcional)")
    dias_duracion_estimada: int | None = Field(
        default=None,
        ge=1,
        description="Duración estimada en días de audiencia (opcional)",
    )
