"""
Modelos de input para documentos del fuero Niñez y Adolescencia (Ley 9944, Córdoba).
Documentos cubiertos:
  - AutoControlLegalidadInput → auto de control de legalidad de medida de protección
                                 excepcional (art. 52 Ley 9944)
"""

from datetime import date

from pydantic import Field

from ...base import ExpedienteBase


class AutoControlLegalidadInput(ExpedienteBase):
    """
    Auto que avoca el control de legalidad de la medida de protección
    excepcional de derechos adoptada por la autoridad administrativa
    (art. 52 Ley Provincial N.° 9944 — Promoción y Protección de los
    Derechos de las Niñas, Niños y Adolescentes de Córdoba).
    """
    nombre_nnya: str = Field(
        description="Nombre y apellido del niño, niña o adolescente (NNyA)"
    )
    edad_nnya: int | None = Field(
        default=None,
        ge=0,
        le=17,
        description="Edad del NNyA en años cumplidos (opcional)",
    )
    organismo_administrativo: str = Field(
        default="la Secretaría de Niñez, Adolescencia y Familia",
        description="Organismo que adoptó la medida de protección excepcional",
    )
    medida_adoptada: str = Field(
        description=(
            "Descripción de la medida adoptada (ej: 'inclusión transitoria en "
            "familia alternativa / hogar convivencial')"
        )
    )
    fecha_medida_administrativa: date = Field(
        description="Fecha en que la autoridad administrativa adoptó la medida"
    )
    plazo_revision_dias: int = Field(
        default=30,
        gt=0,
        description="Plazo para la revisión periódica de la medida en días",
    )
