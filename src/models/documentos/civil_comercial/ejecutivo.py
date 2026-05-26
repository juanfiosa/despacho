"""
Modelos de input para documentos del juicio ejecutivo (CPCC Ley 8465, Córdoba).
Documentos cubiertos:
  - AdmisionEjecutivoInput   → decreto de admisión de la demanda ejecutiva (art. 175 CPCC)
  - IntimacionPagoInput      → decreto intimando pago bajo apercibimiento (art. 529 CPCC)
  - MandamientoPagoInput     → mandamiento de intimación y embargo (art. 531 CPCC)
  - AutoAperturaPruebaInput  → auto de apertura a prueba (art. 498 CPCC)
  - DecretoTramiteInput      → decretos de trámite (traslado, vista, etc.)
"""

from datetime import date
from enum import Enum

from pydantic import Field

from ...base import ExpedienteBase, DatosEconomicos


# ---------------------------------------------------------------------------
# Admisión de la demanda ejecutiva
# ---------------------------------------------------------------------------

class AdmisionEjecutivoInput(ExpedienteBase):
    """
    Primer decreto que da trámite a la demanda ejecutiva: tiene por presentada
    la demanda, verifica la suficiencia del título y, si corresponde, libra el
    mandamiento de intimación de pago y embargo (art. 175/529 CPCC Córdoba).
    """
    titulo_ejecutivo: str = Field(
        description="Tipo de título ejecutivo (ej: 'pagaré', 'cheque', 'hipoteca', 'sentencia firme')"
    )
    objeto: str = Field(
        default="cobro de pesos",
        description="Objeto del proceso ejecutivo",
    )
    librar_mandamiento: bool = Field(
        default=True,
        description=(
            "Si True, el decreto también libra el mandamiento de intimación y embargo "
            "en el mismo acto; si False, solo admite la demanda y ordena la intimación "
            "por cédula"
        ),
    )


# ---------------------------------------------------------------------------
# Intimación de pago
# ---------------------------------------------------------------------------

class IntimacionPagoInput(ExpedienteBase):
    """
    Decreto que intima al demandado a abonar el capital reclamado bajo
    apercibimiento de embargo (art. 529 CPCC).
    """
    datos_economicos: DatosEconomicos
    plazo_dias: int = Field(
        default=5,
        gt=0,
        description="Plazo en días hábiles para el pago (art. 529 CPCC: 5 días)",
    )
    domicilio_intimacion: str = Field(
        description="Domicilio donde se practicará la intimación"
    )


# ---------------------------------------------------------------------------
# Mandamiento de intimación y embargo
# ---------------------------------------------------------------------------

class MandamientoPagoInput(ExpedienteBase):
    """
    Mandamiento para que el oficial de justicia intime el pago y, en caso de
    incumplimiento, trabe embargo sobre bienes del ejecutado (art. 531 CPCC).
    """
    datos_economicos: DatosEconomicos
    plazo_dias: int = Field(default=5, gt=0)
    bienes_a_embargar: str | None = Field(
        default=None,
        description="Descripción de los bienes a embargar. Si None, embargo genérico.",
    )
    domicilio_diligenciamiento: str = Field(
        description="Domicilio donde se diligenciará el mandamiento"
    )


# ---------------------------------------------------------------------------
# Auto de apertura a prueba
# ---------------------------------------------------------------------------

class TipoPrueba(str, Enum):
    DOCUMENTAL = "documental"
    TESTIMONIAL = "testimonial"
    PERICIAL = "pericial"
    INFORMATIVA = "informativa"
    CONFESIONAL = "confesional"
    RECONOCIMIENTO_JUDICIAL = "reconocimiento_judicial"


class AutoAperturaPruebaInput(ExpedienteBase):
    """
    Auto que abre el período probatorio, fija el plazo y lista la prueba admitida
    (art. 498 CPCC).
    """
    plazo_dias: int = Field(
        default=40,
        gt=0,
        description="Plazo del período de prueba en días hábiles (art. 498 CPCC: 40 días)",
    )
    fecha_inicio_prueba: date = Field(description="Fecha desde la que corre el plazo")
    prueba_admitida: list[TipoPrueba] = Field(
        min_length=1,
        description="Tipos de prueba admitidos por el tribunal",
    )
    prueba_rechazada: list[TipoPrueba] = Field(
        default_factory=list,
        description="Tipos de prueba expresamente rechazados",
    )
    fundamento_rechazo: str | None = Field(
        default=None,
        description="Fundamento del rechazo de prueba (obligatorio si hay prueba_rechazada)",
    )

    def model_post_init(self, __context: object) -> None:
        if self.prueba_rechazada and not self.fundamento_rechazo:
            raise ValueError(
                "fundamento_rechazo es obligatorio cuando se rechaza algún tipo de prueba"
            )


# ---------------------------------------------------------------------------
# Decreto de trámite
# ---------------------------------------------------------------------------

class TipoDecretoTramite(str, Enum):
    TRASLADO = "traslado"
    VISTA = "vista"
    LLAMAMIENTO_AUTOS = "llamamiento_autos"
    AUTOS_PARA_RESOLVER = "autos_para_resolver"
    NOTIFICACION = "notificacion"
    OTRO = "otro"


class DecretoTramiteInput(ExpedienteBase):
    """
    Decretos de mero trámite: traslado, vista, llamamiento de autos, etc.
    Son los documentos más frecuentes en cualquier expediente.
    """
    tipo: TipoDecretoTramite
    tipo_descripcion: str | None = Field(
        default=None,
        description="Descripción cuando tipo=OTRO. Obligatorio en ese caso.",
    )
    destinatario_rol: str = Field(
        description="Rol de la parte a quien se corre el traslado/vista"
    )
    plazo_dias: int | None = Field(
        default=None,
        gt=0,
        description="Plazo en días hábiles. None para decretos sin plazo.",
    )

    def model_post_init(self, __context: object) -> None:
        if self.tipo == TipoDecretoTramite.OTRO and not self.tipo_descripcion:
            raise ValueError(
                "tipo_descripcion es obligatorio cuando tipo=OTRO"
            )
