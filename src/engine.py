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
    LlamamientoAutosCivilInput,
)
from .models.documentos.civil_comercial.cautelares import (
    EmbargoPreventivoInput,
    InhibicionGeneralInput,
)
from .models.documentos.civil_comercial.sucesorio import (
    AutoAperturaSuccesorioInput,
    DeclaratoriaHerederosInput,
    CitacionHerederosAcreedoresInput,
    AprobacionInventarioAvaluoInput,
)
from .models.documentos.civil_comercial.incidentes import (
    CaducidadInstanciaInput,
    DesignacionPeritoInput,
    IntimacionCumplimientoSentenciaInput,
    AutoDesgloseInput,
    CitacionAudienciaConciliacionInput,
    DecretoVistaInput,
    ProvidenciaAgregacionInput,
)
from .models.documentos.civil_comercial.sumarisimo import AutoSumarisimoCitacionInput
from .models.documentos.contencioso_administrativo import (
    ContenciosoAdmisibilidadInput,
    TrasladoDemandaCAInput,
    AperturaPruebaCAInput,
    CitacionAudienciaPreliminarCAInput,
    SuspensionActoAdministrativoInput,
    LlamamientoAutosCAInput,
    IntimacionOrganismoDemandadoInput,
)
from .models.documentos.violencia_familiar import (
    MedidasUrgentesVFInput,
    CitacionAudienciaVFInput,
    ProrrogaMedidasVFInput,
    CeseMedidasVFInput,
    OficioPoliciaVFInput,
)
from .models.documentos.familia import (
    AlimentosProvisioriosInput,
    AdmisionAlimentosInput,
    AdmisionDivorcioInput,
    AdmisionComunicacionInput,
    HomologacionAcuerdoFamiliaInput,
    ExclusionHogarInput,
    RegimenComunicacionProvisorioInput,
    IntimacionPagoCuotasAlimentariasInput,
    AtribucionHogarConyugalInput,
    CitacionConciliacionFamiliaInput,
)
from .models.documentos.laboral import (
    AutoAdmisionLaboralInput,
    AutoAperturaLaboralInput,
    TrasladoContestacionLaboralInput,
    CitacionVistaCausaInput,
    IntimacionPagoLiquidacionInput,
    HomologacionAcuerdoLaboralInput,
    AutoLiquidacionAprobadaInput,
)
from .models.documentos.concursal import (
    AutoAperturaConcursalInput,
    AutoDeclaracionQuiebraInput,
    DecretoPeriodoExclusividadInput,
    AutoHomologacionAcuerdoInput,
    CitacionAcreedoresEdictoInput,
    DesignacionSindicoInput,
    AutoVerificacionCreditosInput,
    DecretoRealizacionBienesInput,
)
from .models.documentos.penal import (
    CitacionImputacionInput,
    AutoElevacionJuicioInput,
    FijacionAudienciaDebateInput,
    SobreseimientoInput,
    DesestimacionDenunciaInput,
    PrisionPreventivaInput,
    CesePrisionPreventivaInput,
    AdmisionPartesCivilesInput,
    TrasladoVistaFiscalInput,
    CitacionTestigosPeritosInput,
    SuspensionJuicioPruebaInput,
    ExtraccionTestimoniosInput,
    ArchivoNotificacionInput,
)
from .models.documentos.ninez import (
    AutoControlLegalidadInput,
    ProrrogaMedidaNNAInput,
    CeseMedidaNNAInput,
    AutoMedidaAbrigoInput,
    NotificacionSENAFInput,
    AutoInternacionSaludMentalInput,
    DecretoVisitasSupervisadasInput,
    AutoReintegroFamiliarInput,
    CitacionSeguimientoNNAInput,
)

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
    TrasladoDemandaInput:         "civil_comercial/ordinario/traslado_demanda.j2",
    AutoAperturaOrdinarioInput:   "civil_comercial/ordinario/auto_apertura_prueba.j2",
    LlamamientoAutosCivilInput:   "civil_comercial/ordinario/llamamiento_autos.j2",
    # Cautelares
    EmbargoPreventivoInput:          "civil_comercial/cautelares/embargo_preventivo.j2",
    InhibicionGeneralInput:          "civil_comercial/cautelares/inhibicion_general.j2",
    # Sucesorio
    AutoAperturaSuccesorioInput:     "civil_comercial/sucesorio/auto_apertura_sucesorio.j2",
    DeclaratoriaHerederosInput:      "civil_comercial/sucesorio/declaratoria_herederos.j2",
    # Sumarísimo
    AutoSumarisimoCitacionInput:     "civil_comercial/sumarisimo/citacion_audiencia.j2",
    # Contencioso Administrativo
    ContenciosoAdmisibilidadInput:          "contencioso_administrativo/admisibilidad.j2",
    TrasladoDemandaCAInput:                 "contencioso_administrativo/traslado_demanda_ca.j2",
    AperturaPruebaCAInput:                  "contencioso_administrativo/apertura_prueba_ca.j2",
    CitacionAudienciaPreliminarCAInput:     "contencioso_administrativo/citacion_audiencia_preliminar_ca.j2",
    SuspensionActoAdministrativoInput:      "contencioso_administrativo/suspension_acto_administrativo.j2",
    LlamamientoAutosCAInput:                "contencioso_administrativo/llamamiento_autos_ca.j2",
    IntimacionOrganismoDemandadoInput:      "contencioso_administrativo/intimacion_organismo_demandado.j2",
    # Violencia Familiar
    MedidasUrgentesVFInput:          "violencia_familiar/medidas_urgentes.j2",
    CitacionAudienciaVFInput:        "violencia_familiar/citacion_audiencia.j2",
    ProrrogaMedidasVFInput:          "violencia_familiar/prorroga_medidas.j2",
    CeseMedidasVFInput:              "violencia_familiar/cese_medidas.j2",
    OficioPoliciaVFInput:            "violencia_familiar/oficio_policia.j2",
    # Familia
    AlimentosProvisioriosInput:             "familia/alimentos_provisorios.j2",
    AdmisionAlimentosInput:                 "familia/admision_alimentos.j2",
    AdmisionDivorcioInput:                  "familia/admision_divorcio.j2",
    AdmisionComunicacionInput:              "familia/admision_comunicacion.j2",
    HomologacionAcuerdoFamiliaInput:        "familia/homologacion_acuerdo.j2",
    ExclusionHogarInput:                    "familia/exclusion_hogar.j2",
    RegimenComunicacionProvisorioInput:     "familia/regimen_comunicacion_provisorio.j2",
    IntimacionPagoCuotasAlimentariasInput:  "familia/intimacion_pago_cuotas.j2",
    AtribucionHogarConyugalInput:           "familia/atribucion_hogar_conyugal.j2",
    CitacionConciliacionFamiliaInput:       "familia/citacion_conciliacion.j2",
    # Laboral
    AutoAdmisionLaboralInput:           "laboral/auto_admision.j2",
    AutoAperturaLaboralInput:           "laboral/auto_apertura_prueba.j2",
    TrasladoContestacionLaboralInput:   "laboral/traslado_contestacion.j2",
    CitacionVistaCausaInput:            "laboral/citacion_vista_causa.j2",
    IntimacionPagoLiquidacionInput:     "laboral/intimacion_pago_liquidacion.j2",
    HomologacionAcuerdoLaboralInput:    "laboral/homologacion_acuerdo.j2",
    AutoLiquidacionAprobadaInput:       "laboral/auto_liquidacion_aprobada.j2",
    # Concursal
    AutoAperturaConcursalInput:         "concursal/auto_apertura_concurso.j2",
    AutoDeclaracionQuiebraInput:        "concursal/auto_quiebra.j2",
    DecretoPeriodoExclusividadInput:    "concursal/decreto_periodo_exclusividad.j2",
    AutoHomologacionAcuerdoInput:       "concursal/auto_homologacion_acuerdo.j2",
    CitacionAcreedoresEdictoInput:      "concursal/citacion_acreedores_edicto.j2",
    DesignacionSindicoInput:            "concursal/designacion_sindico.j2",
    AutoVerificacionCreditosInput:      "concursal/auto_verificacion_creditos.j2",
    DecretoRealizacionBienesInput:      "concursal/decreto_realizacion_bienes.j2",
    # Penal
    CitacionImputacionInput:        "penal/citacion_imputacion.j2",
    AutoElevacionJuicioInput:       "penal/auto_elevacion_juicio.j2",
    FijacionAudienciaDebateInput:   "penal/fijacion_debate.j2",
    SobreseimientoInput:            "penal/sobreseimiento.j2",
    DesestimacionDenunciaInput:     "penal/desestimacion_denuncia.j2",
    PrisionPreventivaInput:         "penal/prision_preventiva.j2",
    CesePrisionPreventivaInput:     "penal/cese_prision_preventiva.j2",
    AdmisionPartesCivilesInput:     "penal/admision_partes_civiles.j2",
    TrasladoVistaFiscalInput:       "penal/traslado_vista_fiscal.j2",
    CitacionTestigosPeritosInput:   "penal/citacion_testigos_peritos.j2",
    SuspensionJuicioPruebaInput:    "penal/suspension_juicio_prueba.j2",
    ExtraccionTestimoniosInput:     "penal/extraccion_testimonios.j2",
    ArchivoNotificacionInput:       "penal/archivo_notificacion.j2",
    # Niñez
    AutoControlLegalidadInput:          "ninez/auto_control_legalidad.j2",
    ProrrogaMedidaNNAInput:             "ninez/prorroga_medida_nna.j2",
    CeseMedidaNNAInput:                 "ninez/cese_medida_nna.j2",
    AutoMedidaAbrigoInput:              "ninez/auto_medida_abrigo.j2",
    NotificacionSENAFInput:             "ninez/notificacion_senaf.j2",
    AutoInternacionSaludMentalInput:    "ninez/auto_internacion_salud_mental.j2",
    DecretoVisitasSupervisadasInput:    "ninez/decreto_visitas_supervisadas.j2",
    AutoReintegroFamiliarInput:         "ninez/auto_reintegro_familiar.j2",
    CitacionSeguimientoNNAInput:        "ninez/citacion_seguimiento_nna.j2",
    # Sucesorio (nuevos)
    CitacionHerederosAcreedoresInput:   "civil_comercial/sucesorio/citacion_herederos_acreedores.j2",
    AprobacionInventarioAvaluoInput:    "civil_comercial/sucesorio/aprobacion_inventario_avaluo.j2",
    # Incidentes civiles
    CaducidadInstanciaInput:                "civil_comercial/incidentes/caducidad_instancia.j2",
    DesignacionPeritoInput:                 "civil_comercial/incidentes/designacion_perito.j2",
    IntimacionCumplimientoSentenciaInput:   "civil_comercial/incidentes/intimacion_cumplimiento_sentencia.j2",
    AutoDesgloseInput:                      "civil_comercial/incidentes/auto_desglose.j2",
    CitacionAudienciaConciliacionInput:     "civil_comercial/incidentes/citacion_audiencia_conciliacion.j2",
    DecretoVistaInput:                      "civil_comercial/incidentes/decreto_vista.j2",
    ProvidenciaAgregacionInput:             "civil_comercial/incidentes/providencia_agregacion.j2",
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
