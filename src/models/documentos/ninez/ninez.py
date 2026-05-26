"""
Modelos de input para documentos del fuero Niñez y Adolescencia (Ley 9944, Córdoba).
Documentos cubiertos:
  - AutoControlLegalidadInput  → auto de control de legalidad de medida de protección excepcional (art. 52 Ley 9944)
  - ProrrogaMedidaNNAInput     → auto que prorroga la medida de protección excepcional (art. 55 Ley 9944)
  - CeseMedidaNNAInput         → auto que dispone el cese de la medida de protección (art. 52/55 Ley 9944)
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


class ProrrogaMedidaNNAInput(ExpedienteBase):
    """
    Auto que prorroga la medida de protección excepcional por un nuevo período
    (art. 55 Ley 9944 — máximo 180 días en total, prorrogable en circunstancias
    excepcionales).
    """
    nombre_nnya: str = Field(
        description="Nombre y apellido del NNyA"
    )
    edad_nnya: int | None = Field(
        default=None,
        ge=0,
        le=17,
        description="Edad del NNyA en años cumplidos (opcional)",
    )
    organismo_administrativo: str = Field(
        default="la Secretaría de Niñez, Adolescencia y Familia",
        description="Organismo que ejecuta la medida",
    )
    medida_adoptada: str = Field(
        description="Descripción de la medida que se prorroga"
    )
    motivo_prorroga: str = Field(
        description=(
            "Fundamento de la prórroga (ej: 'no han variado sustancialmente "
            "las circunstancias que motivaron la medida')"
        )
    )
    plazo_prorroga_dias: int = Field(
        default=30,
        gt=0,
        description="Días por los que se prorroga la medida",
    )


class CeseMedidaNNAInput(ExpedienteBase):
    """
    Auto que dispone el cese de la medida de protección excepcional por haberse
    superado la situación de riesgo o por otra causa legal (art. 52/55 Ley 9944).
    """
    nombre_nnya: str = Field(
        description="Nombre y apellido del NNyA"
    )
    edad_nnya: int | None = Field(
        default=None,
        ge=0,
        le=17,
        description="Edad del NNyA en años cumplidos (opcional)",
    )
    organismo_administrativo: str = Field(
        default="la Secretaría de Niñez, Adolescencia y Familia",
        description="Organismo que ejecutó la medida",
    )
    medida_adoptada: str = Field(
        description="Descripción de la medida que cesa"
    )
    motivo_cese: str = Field(
        description=(
            "Fundamento del cese (ej: 'han cesado las circunstancias que "
            "motivaron la medida excepcional'; 'reintegro al grupo familiar')"
        )
    )
