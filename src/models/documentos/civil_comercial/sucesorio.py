"""
Modelos de input para documentos del proceso sucesorio (CPCC Ley 8465, Córdoba).
Documentos cubiertos:
  - AutoAperturaSuccesorioInput           → auto de apertura del proceso sucesorio (art. 655 CPCC)
  - DeclaratoriaHerederosInput            → auto de declaratoria de herederos (art. 2353 CCyCN)
  - CitacionHerederosAcreedoresInput      → decreto de citación de herederos y acreedores (art. 2340 CCyCN)
  - AprobacionInventarioAvaluoInput       → decreto de aprobación de inventario y avalúo (art. 2341 CCyCN)
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


class CitacionHerederosAcreedoresInput(ExpedienteBase):
    """
    Decreto que cita a los herederos y acreedores del causante a presentarse
    en el juicio sucesorio, mediante edictos en el Boletín Oficial y en un
    diario local (art. 2340 CCyCN; art. 655 CPCC Córdoba).
    """
    causante_nombre: str = Field(
        description="Nombre completo del causante",
    )
    dias_edictos: int = Field(
        default=5,
        gt=0,
        description="Días de publicación de edictos (art. 2340 CCyCN: no menos de 5 días)",
    )
    publicar_boletin_oficial: bool = Field(
        default=True,
        description="Publicar en el Boletín Oficial de la Provincia",
    )
    publicar_diario_local: bool = Field(
        default=True,
        description="Publicar en un diario local de amplia circulación",
    )
    plazo_presentacion_dias: int = Field(
        default=30,
        gt=0,
        description="Plazo en días para que los interesados se presenten",
    )


class AprobacionInventarioAvaluoInput(ExpedienteBase):
    """
    Decreto que aprueba el inventario y avalúo de los bienes hereditarios
    practicado por el perito tasador (art. 2341 CCyCN; art. 655 y ss. CPCC).
    """
    causante_nombre: str = Field(
        description="Nombre completo del causante",
    )
    perito_nombre: str = Field(
        description="Nombre del perito tasador que practicó el inventario",
    )
    monto_total_avaluo: float | None = Field(
        default=None,
        gt=0,
        description="Monto total del avalúo en pesos (opcional)",
    )
    bienes_descripcion: str | None = Field(
        default=None,
        description="Descripción sintética de los bienes inventariados (opcional)",
    )
    con_impugnacion: bool = Field(
        default=False,
        description="Si True, alguna parte impugnó el inventario/avalúo (se resuelve en el decreto)",
    )
    resolucion_impugnacion: str | None = Field(
        default=None,
        description="Resolución de la impugnación (obligatorio si con_impugnacion=True)",
    )

    def model_post_init(self, __context: object) -> None:
        if self.con_impugnacion and not self.resolucion_impugnacion:
            raise ValueError(
                "'resolucion_impugnacion' es obligatorio cuando con_impugnacion=True"
            )
