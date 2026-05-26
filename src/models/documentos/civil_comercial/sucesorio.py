"""
Modelos de input para documentos del proceso sucesorio (CPCC Ley 8465, Córdoba).
Documentos cubiertos:
  - AutoAperturaSuccesorioInput → auto de apertura del proceso sucesorio (art. 655 CPCC)
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
