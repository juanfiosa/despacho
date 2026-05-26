"""
Modelos de input para documentos del fuero Concursal (Ley 24522, Córdoba).
Documentos cubiertos:
  - AutoAperturaConcursalInput         → auto de apertura del concurso preventivo (art. 14 Ley 24522)
  - AutoDeclaracionQuiebraInput        → sentencia de quiebra (art. 88 Ley 24522)
  - DecretoPeriodoExclusividadInput    → decreto de fijación del período de exclusividad (art. 43 Ley 24522)
  - AutoHomologacionAcuerdoInput       → auto de homologación del acuerdo preventivo (art. 52 Ley 24522)
  - CitacionAcreedoresEdictoInput      → citación de acreedores por edictos (art. 27 Ley 24522)
  - DesignacionSindicoInput            → decreto de designación del síndico (arts. 14/88 Ley 24522)
  - AutoVerificacionCreditosInput      → auto de resolución sobre créditos (art. 36 Ley 24522)
  - DecretoRealizacionBienesInput      → decreto de realización de bienes en quiebra (art. 203 Ley 24522)
"""

from datetime import date
from typing import Literal

from pydantic import Field, model_validator

from ...base import ExpedienteBase


class AutoAperturaConcursalInput(ExpedienteBase):
    """
    Auto de apertura del concurso preventivo (art. 14 Ley 24522).
    Designa síndico, fija período informativo, audiencia informativa y
    ordena medidas cautelares provisionales.
    """
    # Síndico
    sindico_nombre: str = Field(
        description="Nombre y apellido del síndico designado"
    )
    sindico_matricula: str | None = Field(
        default=None,
        description="Matrícula profesional del síndico (CPCE o equivalente)",
    )

    # Fechas clave del proceso (art. 14 incs. 3, 5, 6 Ley 24522)
    fecha_limite_verificacion: date = Field(
        description="Fecha límite para que los acreedores se presenten a verificar (art. 32 Ley 24522)"
    )
    fecha_informe_individual: date = Field(
        description="Fecha para la presentación del informe individual por el síndico (art. 35 Ley 24522)"
    )
    fecha_informe_general: date = Field(
        description="Fecha para la presentación del informe general por el síndico (art. 39 Ley 24522)"
    )
    fecha_audiencia_informativa: date = Field(
        description="Fecha de la audiencia informativa (art. 45 Ley 24522)"
    )

    # Medida cautelar provisional
    inhibicion_provisional: bool = Field(
        default=True,
        description="Decretar inhibición general de bienes provisoria sobre el concursado",
    )

    @model_validator(mode="after")
    def fechas_en_orden(self) -> "AutoAperturaConcursalInput":
        fechas = [
            ("fecha_limite_verificacion", self.fecha_limite_verificacion),
            ("fecha_informe_individual", self.fecha_informe_individual),
            ("fecha_informe_general", self.fecha_informe_general),
            ("fecha_audiencia_informativa", self.fecha_audiencia_informativa),
        ]
        for i in range(len(fechas) - 1):
            nombre_a, fecha_a = fechas[i]
            nombre_b, fecha_b = fechas[i + 1]
            if fecha_a is not None and fecha_b is not None and fecha_a >= fecha_b:
                raise ValueError(
                    f"'{nombre_a}' ({fecha_a}) debe ser anterior a '{nombre_b}' ({fecha_b})"
                )
        return self


class AutoDeclaracionQuiebraInput(ExpedienteBase):
    """
    Sentencia de quiebra (art. 88 Ley 24522). Declara la quiebra, designa
    síndico, fija período informativo y ordena medidas cautelares y de
    publicidad.
    """
    # Síndico
    sindico_nombre: str = Field(description="Nombre y apellido del síndico designado")
    sindico_matricula: str | None = Field(default=None, description="Matrícula CPCE (opcional)")

    # Fechas del período informativo (arts. 32, 35, 39)
    fecha_limite_verificacion: date = Field(
        description="Fecha límite para que los acreedores presenten sus créditos (art. 32)"
    )
    fecha_informe_individual: date = Field(
        description="Fecha de presentación del informe individual del síndico (art. 35)"
    )
    fecha_informe_general: date = Field(
        description="Fecha de presentación del informe general del síndico (art. 39)"
    )

    # Medidas típicas de la quiebra
    clausura_establecimiento: bool = Field(
        default=False,
        description="Ordenar la clausura del establecimiento comercial (art. 88 inc. 5)",
    )
    inhabilitacion_fallido: bool = Field(
        default=True,
        description="Declarar la inhabilitación del fallido (art. 238 LCQ)",
    )
    tipo_quiebra: str = Field(
        default="voluntaria",
        description="Tipo de quiebra: 'voluntaria' (pedida por el propio deudor) o 'necesaria' (pedida por acreedor)",
    )

    @model_validator(mode="after")
    def fechas_en_orden(self) -> "AutoDeclaracionQuiebraInput":
        if self.fecha_limite_verificacion >= self.fecha_informe_individual:
            raise ValueError(
                "'fecha_limite_verificacion' debe ser anterior a 'fecha_informe_individual'"
            )
        if self.fecha_informe_individual >= self.fecha_informe_general:
            raise ValueError(
                "'fecha_informe_individual' debe ser anterior a 'fecha_informe_general'"
            )
        return self


class DecretoPeriodoExclusividadInput(ExpedienteBase):
    """
    Decreto que fija el período de exclusividad para que el concursado
    negocie con sus acreedores y obtenga las conformidades necesarias
    (art. 43 Ley 24522 — 90 días hábiles prorrogables por 30 más).
    """
    fecha_inicio_exclusividad: date = Field(
        description="Fecha de inicio del período de exclusividad",
    )
    plazo_dias_habiles: int = Field(
        default=90,
        gt=0,
        description="Duración del período en días hábiles (art. 43 LCQ: 90 días, prorrogable 30)",
    )
    porcentaje_conformidades: int = Field(
        default=66,
        ge=1,
        le=100,
        description=(
            "Porcentaje mínimo de conformidades requerido en cada categoría "
            "(art. 45 LCQ: mayoría absoluta de capital por categoría)"
        ),
    )


class AutoHomologacionAcuerdoInput(ExpedienteBase):
    """
    Auto que homologa el acuerdo preventivo una vez obtenidas las conformidades
    necesarias (art. 52 Ley 24522). Pone fin al período de exclusividad.
    """
    tipo_acuerdo: Literal["unificado", "por_categorias"] = Field(
        default="unificado",
        description="'unificado' para acuerdo único; 'por_categorias' si se aprobó por categorías",
    )
    descripcion_acuerdo: str = Field(
        description=(
            "Descripción de las principales cláusulas del acuerdo homologado "
            "(quita, espera, modalidad de pago)"
        )
    )
    plazo_cumplimiento_anos: int | None = Field(
        default=None,
        ge=1,
        description="Plazo máximo de cumplimiento del acuerdo en años (opcional)",
    )


class CitacionAcreedoresEdictoInput(ExpedienteBase):
    """
    Decreto que ordena publicar edictos citando a los acreedores del concursado
    o fallido a presentarse a verificar sus créditos ante el síndico
    (art. 27 y 200 Ley 24522).
    """
    sindico_nombre: str = Field(
        description="Nombre del síndico ante quien se presentarán los créditos",
    )
    sindico_domicilio: str = Field(
        description="Domicilio del síndico para la presentación de créditos",
    )
    fecha_limite_verificacion: date = Field(
        description="Fecha límite para presentarse a verificar (art. 32 LCQ)",
    )
    dias_publicacion: int = Field(
        default=5,
        ge=1,
        description="Días de publicación de edictos en el Boletín Oficial (art. 27 LCQ: 5 días)",
    )
    tipo_proceso: Literal["concurso_preventivo", "quiebra"] = Field(
        default="concurso_preventivo",
        description="Tipo de proceso a que refieren los edictos",
    )


class DesignacionSindicoInput(ExpedienteBase):
    """
    Decreto que designa al síndico concursal, le notifica el cargo y le fija
    plazo para su aceptación (arts. 14, 88 y conc. Ley 24522).
    """
    sindico_nombre: str = Field(
        description="Nombre y apellido del síndico designado",
    )
    sindico_matricula: str | None = Field(
        default=None,
        description="Matrícula del CPCE (opcional)",
    )
    tipo_proceso: Literal["concurso_preventivo", "quiebra"] = Field(
        default="concurso_preventivo",
        description="Proceso para el que se designa al síndico",
    )
    plazo_aceptacion_dias: int = Field(
        default=5,
        ge=1,
        description="Plazo en días hábiles para que el síndico acepte el cargo",
    )


class AutoVerificacionCreditosInput(ExpedienteBase):
    """
    Auto del juez que resuelve sobre los créditos verificados, admitidos o
    declarados inadmisibles en la lista del síndico (art. 36 Ley 24522).
    """
    sindico_nombre: str = Field(
        description="Nombre del síndico que practicó la verificación",
    )
    creditos_verificados: int = Field(
        ge=0,
        description="Cantidad de créditos que se verifican (declaran admisibles)",
    )
    creditos_inadmisibles: int = Field(
        default=0,
        ge=0,
        description="Cantidad de créditos declarados inadmisibles",
    )
    monto_total_verificado: float | None = Field(
        default=None,
        gt=0,
        description="Monto total verificado en pesos (opcional)",
    )
    con_privilegio_especial: int = Field(
        default=0,
        ge=0,
        description="Cantidad de créditos con privilegio especial reconocido",
    )
    con_privilegio_general: int = Field(
        default=0,
        ge=0,
        description="Cantidad de créditos con privilegio general reconocido",
    )


class DecretoRealizacionBienesInput(ExpedienteBase):
    """
    Decreto que ordena la realización (liquidación) de los bienes del fallido
    en la quiebra (art. 203 Ley 24522). Fija la modalidad de venta.
    """
    modalidad_realizacion: Literal[
        "subasta_judicial",
        "venta_directa",
        "licitacion",
        "fondo_comercio",
        "concurso_de_precios",
    ] = Field(
        default="subasta_judicial",
        description=(
            "Modalidad de realización de bienes: "
            "'subasta_judicial' (martillero designado); "
            "'venta_directa' (arts. 205/213 LCQ); "
            "'licitacion'; "
            "'fondo_comercio' (art. 204 LCQ); "
            "'concurso_de_precios'"
        ),
    )
    descripcion_bienes: str = Field(
        description="Descripción de los bienes a realizar (ej: 'inmueble de calle X N.° Y', 'rodados')",
    )
    martillero_nombre: str | None = Field(
        default=None,
        description="Nombre del martillero designado (si modalidad=subasta_judicial)",
    )
    base_subasta: float | None = Field(
        default=None,
        gt=0,
        description="Base de la subasta en pesos (opcional)",
    )
    fecha_subasta: date | None = Field(
        default=None,
        description="Fecha fijada para la subasta (opcional; se completa con auto posterior si no se sabe aún)",
    )
