"""
Modelos de input para documentos del proceso sucesorio (CPCC Ley 8465, Córdoba).
Documentos cubiertos:
  - AutoAperturaSuccesorioInput    → auto de apertura del proceso sucesorio (art. 655 CPCC)
  - DeclaratoriaHerederosInput     → auto de declaratoria de herederos (art. 2353 CCyCN)
"""

from datetime import date

from pydantic import Field

from ...base import ExpedienteBase


class AutoAperturaSuccesorioInput(ExpedienteBase):
    """
    Auto que declara abierto el proceso sucesorio, acepta el pedido de los
    herederos y ordena las medidas de publicidad (art. 655 CPCC Córdoba).
    """
    fallecido_nombre: str = Field(
        description="Nombre completo del causante (persona fallecida)"
    )
    fallecido_fecha_muerte: date = Field(
        description="Fecha de fallecimiento del causante"
    )
    fallecido_domicilio: str = Field(
        description="Último domicilio del causante (determina la competencia, art. 2336 CCyCN)"
    )
    perito_valuador_nombre: str | None = Field(
        default=None,
        description="Nombre del perito tasador/valuador a designar (opcional)",
    )
    dias_edictos: int = Field(
        default=5,
        gt=0,
        description="Días de publicación de edictos en el Boletín Oficial (art. 2340 CCyCN)",
    )
    inventario_judicial: bool = Field(
        default=False,
        description="Ordenar inventario y avalúo judicial de los bienes (art. 2341 CCyCN)",
    )


class DeclaratoriaHerederosInput(ExpedienteBase):
    """
    Auto de declaratoria de herederos —resuelve la vocación hereditaria en favor
    de los presentantes una vez vencido el plazo de edictos y acreditados los
    vínculos (arts. 2353 y ss. CCyCN; art. 655 y ss. CPCC Córdoba).
    """
    causante_nombre: str = Field(
        description="Nombre completo del causante"
    )
    vinculos: str | None = Field(
        default=None,
        description="Descripción libre de los vínculos y calidad invocada (ej: 'en calidad de hijos y cónyuge supérstite')",
    )
    bienes_inmuebles: bool = Field(
        default=True,
        description="La declaratoria incluye bienes inmuebles (se ordena anotación registral)",
    )
    bienes_muebles: bool = Field(
        default=True,
        description="La declaratoria incluye bienes muebles registrables",
    )
