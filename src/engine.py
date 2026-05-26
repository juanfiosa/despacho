"""
Motor de rendering de documentos judiciales.
Convierte un modelo de input (Pydantic) en texto renderizado via Jinja2.
"""

from datetime import date
from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader, StrictUndefined

from .models.documentos.civil_comercial.ejecutivo import (
    AdmisionEjecutivoInput,
    IntimacionPagoInput,
    MandamientoPagoInput,
    AutoAperturaPruebaInput,
    DecretoTramiteInput,
)
from .models.documentos.civil_comercial.ordinario import (
    TrasladoDemandaInput,
    AutoAperturaOrdinarioInput,
)
from .models.documentos.civil_comercial.cautelares import (
    EmbargoPreventivoInput,
    InhibicionGeneralInput,
)
from .models.documentos.civil_comercial.sucesorio import AutoAperturaSuccesorioInput, DeclaratoriaHerederosInput
from .models.documentos.civil_comercial.sumarisimo import AutoSumarisimoCitacionInput
from .models.documentos.contencioso_administrativo import ContenciosoAdmisibilidadInput
from .models.documentos.violencia_familiar import MedidasUrgentesVFInput, CitacionAudienciaVFInput
from .models.documentos.familia import (
    AlimentosProvisioriosInput,
    AdmisionAlimentosInput,
    AdmisionDivorcioInput,
    AdmisionComunicacionInput,
    HomologacionAcuerdoFamiliaInput,
)
from .models.documentos.laboral import AutoAdmisionLaboralInput, AutoAperturaLaboralInput
from .models.documentos.concursal import AutoAperturaConcursalInput, AutoDeclaracionQuiebraInput
from .models.documentos.penal import (
    CitacionImputacionInput,
    AutoElevacionJuicioInput,
    FijacionAudienciaDebateInput,
    SobreseimientoInput,
    DesestimacionDenunciaInput,
)
from .models.documentos.ninez import AutoControlLegalidadInput, ProrrogaMedidaNNAInput, CeseMedidaNNAInput

# ---------------------------------------------------------------------------
# Filtros personalizados
# ---------------------------------------------------------------------------

_MESES = [
    "", "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
]

_UNIDADES = [
    "", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete",
    "ocho", "nueve", "diez", "once", "doce", "trece", "catorce",
    "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve",
]

_DECENAS = [
    "", "", "veinte", "treinta", "cuarenta", "cincuenta",
    "sesenta", "setenta", "ochenta", "noventa",
]


def _numero_letras(n: int) -> str:
    """Convierte entero 1-99 a palabras en español."""
    if not 1 <= n <= 99:
        return str(n)
    if n < 20:
        return _UNIDADES[n]
    d, u = divmod(n, 10)
    if u == 0:
        return _DECENAS[d]
    if d == 2:
        return f"veinti{_UNIDADES[u]}"
    return f"{_DECENAS[d]} y {_UNIDADES[u]}"


def _nombre_mes(d: date) -> str:
    return _MESES[d.month]


# ---------------------------------------------------------------------------
# Mapa: tipo de modelo → ruta de template
# ---------------------------------------------------------------------------

_TEMPLATE_MAP: dict[type, str] = {
    # Ejecutivo
    AdmisionEjecutivoInput:     "civil_comercial/ejecutivo/admision_ejecutivo.j2",
    IntimacionPagoInput:        "civil_comercial/ejecutivo/intimacion_pago.j2",
    MandamientoPagoInput:       "civil_comercial/ejecutivo/mandamiento_pago.j2",
    AutoAperturaPruebaInput:    "civil_comercial/ejecutivo/auto_apertura_prueba.j2",
    DecretoTramiteInput:        "civil_comercial/ejecutivo/decreto_tramite.j2",
    # Ordinario
    TrasladoDemandaInput:       "civil_comercial/ordinario/traslado_demanda.j2",
    AutoAperturaOrdinarioInput: "civil_comercial/ordinario/auto_apertura_prueba.j2",
    # Cautelares
    EmbargoPreventivoInput:          "civil_comercial/cautelares/embargo_preventivo.j2",
    InhibicionGeneralInput:          "civil_comercial/cautelares/inhibicion_general.j2",
    # Sucesorio
    AutoAperturaSuccesorioInput:     "civil_comercial/sucesorio/auto_apertura_sucesorio.j2",
    DeclaratoriaHerederosInput:      "civil_comercial/sucesorio/declaratoria_herederos.j2",
    # Sumarísimo
    AutoSumarisimoCitacionInput:     "civil_comercial/sumarisimo/citacion_audiencia.j2",
    # Contencioso Administrativo
    ContenciosoAdmisibilidadInput:   "contencioso_administrativo/admisibilidad.j2",
    # Violencia Familiar
    MedidasUrgentesVFInput:          "violencia_familiar/medidas_urgentes.j2",
    CitacionAudienciaVFInput:        "violencia_familiar/citacion_audiencia.j2",
    # Familia
    AlimentosProvisioriosInput:      "familia/alimentos_provisorios.j2",
    AdmisionAlimentosInput:          "familia/admision_alimentos.j2",
    AdmisionDivorcioInput:           "familia/admision_divorcio.j2",
    AdmisionComunicacionInput:       "familia/admision_comunicacion.j2",
    HomologacionAcuerdoFamiliaInput: "familia/homologacion_acuerdo.j2",
    # Laboral
    AutoAdmisionLaboralInput:    "laboral/auto_admision.j2",
    AutoAperturaLaboralInput:    "laboral/auto_apertura_prueba.j2",
    # Concursal
    AutoAperturaConcursalInput:  "concursal/auto_apertura_concurso.j2",
    AutoDeclaracionQuiebraInput: "concursal/auto_quiebra.j2",
    # Penal
    CitacionImputacionInput:       "penal/citacion_imputacion.j2",
    AutoElevacionJuicioInput:      "penal/auto_elevacion_juicio.j2",
    FijacionAudienciaDebateInput:  "penal/fijacion_debate.j2",
    SobreseimientoInput:           "penal/sobreseimiento.j2",
    DesestimacionDenunciaInput:    "penal/desestimacion_denuncia.j2",
    # Niñez
    AutoControlLegalidadInput:     "ninez/auto_control_legalidad.j2",
    ProrrogaMedidaNNAInput:        "ninez/prorroga_medida_nna.j2",
    CeseMedidaNNAInput:            "ninez/cese_medida_nna.j2",
}

# ---------------------------------------------------------------------------
# Motor
# ---------------------------------------------------------------------------

_TEMPLATES_DIR = Path(__file__).parent / "templates"


def _build_env() -> Environment:
    env = Environment(
        loader=FileSystemLoader(str(_TEMPLATES_DIR)),
        undefined=StrictUndefined,
        trim_blocks=True,
        lstrip_blocks=True,
        keep_trailing_newline=True,
    )
    env.filters["nombre_mes"] = _nombre_mes
    env.filters["numero_letras"] = _numero_letras
    return env


_env = _build_env()


def render(documento: Any, fecha_resolucion: date | None = None) -> str:
    """
    Renderiza un documento judicial a partir de su modelo de input.

    Args:
        documento: instancia de un modelo de input (ej. IntimacionPagoInput)
        fecha_resolucion: fecha a usar en el encabezado (por defecto: hoy)

    Returns:
        Texto del documento listo para insertar en DOCX o HTML.

    Raises:
        KeyError: si el tipo de documento no tiene template registrado.
        jinja2.UndefinedError: si el template referencia una variable no provista.
    """
    tipo = type(documento)
    template_path = _TEMPLATE_MAP.get(tipo)
    if template_path is None:
        raise KeyError(f"No hay template registrado para {tipo.__name__}")

    template = _env.get_template(template_path)

    # Serializar el modelo a dict plano para el contexto de Jinja2
    ctx: dict[str, Any] = documento.model_dump()
    ctx["fecha_resolucion"] = fecha_resolucion or date.today()

    # Re-inyectar objetos date reales (model_dump los convierte en date nativos, OK)
    # Re-inyectar enums como strings para los comparadores en templates
    ctx = _normalizar_enums(ctx)

    return template.render(**ctx)


def _normalizar_enums(obj: Any) -> Any:
    """Convierte recursivamente enums a su valor string para uso en templates."""
    if isinstance(obj, dict):
        return {k: _normalizar_enums(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_normalizar_enums(i) for i in obj]
    # Los Enum de str ya tienen .value como string; model_dump los entrega como valor
    return obj
