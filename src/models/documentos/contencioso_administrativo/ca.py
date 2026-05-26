"""
Modelos de input para documentos del fuero Contencioso Administrativo
(CPCA Ley 7182, Córdoba).
Documentos cubiertos:
  - ContenciosoAdmisibilidadInput → decreto de admisibilidad formal de la acción (art. 13 CPCA)
"""

from pydantic import Field

from ...base import ExpedienteBase


class ContenciosoAdmisibilidadInput(ExpedienteBase):
    """
    Decreto que declara formalmente admisible la acción contencioso
    administrativa y ordena el traslado al organismo demandado
    (art. 13 CPCA Ley 7182, Córdoba).
    """
    objeto_accion: str = Field(
        description=(
            "Objeto de la acción (ej: 'impugnación del Decreto N.° 123/2025 "
            "que dispuso la cesantía del actor')"
        )
    )
    organismo_demandado: str = Field(
        default="la Provincia de Córdoba",
        description="Organismo o ente demandado (ej: 'la Provincia de Córdoba', 'la Municipalidad de...')",
    )
    plazo_contestacion_dias: int = Field(
        default=30,
        gt=0,
        description="Plazo para contestar la demanda en días hábiles (art. 13 CPCA prevé 30 días)",
    )
    requiere_expediente_administrativo: bool = Field(
        default=True,
        description="Ordenar la remisión del expediente administrativo original",
    )
