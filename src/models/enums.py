from enum import Enum


class Fuero(str, Enum):
    CIVIL_COMERCIAL = "civil_comercial"
    LABORAL = "laboral"
    FAMILIA = "familia"
    CONTENCIOSO_ADMINISTRATIVO = "contencioso_administrativo"
    PENAL = "penal"
    VIOLENCIA_FAMILIAR = "violencia_familiar"
    NINEZ = "ninez"
    CONCURSAL = "concursal"


class RolCivilComercial(str, Enum):
    ACTOR = "actor"
    DEMANDADO = "demandado"
    TERCERO = "tercero"
    GARANTE = "garante"
    OTRO = "otro"


class RolLaboral(str, Enum):
    ACTOR = "actor"
    DEMANDADO = "demandado"
    OTRO = "otro"


class RolFamilia(str, Enum):
    ACTOR = "actor"
    DEMANDADO = "demandado"
    ALIMENTANTE = "alimentante"
    ALIMENTADO = "alimentado"
    REQUIRENTE = "requirente"
    REQUERIDO = "requerido"
    OTRO = "otro"


class RolPenal(str, Enum):
    IMPUTADO = "imputado"
    VICTIMA = "victima"
    FISCAL = "fiscal"
    QUERELLANTE = "querellante"
    DEFENSOR = "defensor"
    OTRO = "otro"


class RolViolenciaFamiliar(str, Enum):
    DENUNCIANTE = "denunciante"
    DENUNCIADO = "denunciado"
    VICTIMA = "victima"
    REQUIRENTE = "requirente"   # alias legacy
    REQUERIDO = "requerido"     # alias legacy
    OTRO = "otro"


class RolNinez(str, Enum):
    PROGENITOR = "progenitor"
    MENOR = "menor"
    REPRESENTANTE_LEGAL = "representante_legal"
    DEFENSOR_PUBLICO = "defensor_publico"
    OTRO = "otro"


class RolContenciosoAdministrativo(str, Enum):
    ACTOR = "actor"
    DEMANDADO = "demandado"
    CODEMANDADO = "codemandado"
    OTRO = "otro"


class RolConcursal(str, Enum):
    CONCURSADO = "concursado"
    ACREEDOR = "acreedor"
    SINDICO = "sindico"
    OTRO = "otro"


# Mapa fuero → clase de rol (para uso en validaciones y frontend)
ROL_POR_FUERO: dict[Fuero, type[Enum]] = {
    Fuero.CIVIL_COMERCIAL: RolCivilComercial,
    Fuero.LABORAL: RolLaboral,
    Fuero.FAMILIA: RolFamilia,
    Fuero.PENAL: RolPenal,
    Fuero.VIOLENCIA_FAMILIAR: RolViolenciaFamiliar,
    Fuero.NINEZ: RolNinez,
    Fuero.CONTENCIOSO_ADMINISTRATIVO: RolContenciosoAdministrativo,
    Fuero.CONCURSAL: RolConcursal,
}


class TasaInteres(str, Enum):
    BNA_ACTIVA = "BNA_ACTIVA"       # Tasa activa Banco Nación Argentina
    BNA_PASIVA = "BNA_PASIVA"       # Tasa pasiva Banco Nación Argentina
    BCRA_PASIVA = "BCRA_PASIVA"     # Tasa pasiva BCRA
    OTRA = "OTRA"                   # Especificada por el actuario


class TipoDocumento(str, Enum):
    # Civil y Comercial — ejecutivo
    INTIMACION_PAGO = "intimacion_pago"
    MANDAMIENTO_PAGO = "mandamiento_pago"
    AUTO_APERTURA_PRUEBA = "auto_apertura_prueba"
    DECRETO_TRAMITE = "decreto_tramite"
    # Civil y Comercial — ordinario
    TRASLADO_DEMANDA = "traslado_demanda"
    AUTO_APERTURA_ORDINARIO = "auto_apertura_ordinario"
    # Civil y Comercial — cautelares
    EMBARGO_PREVENTIVO = "embargo_preventivo"
    INHIBICION_GENERAL = "inhibicion_general"
    # Familia
    ALIMENTOS_PROVISORIOS = "alimentos_provisorios"
    # Laboral
    ADMISION_LABORAL = "admision_laboral"
    # Violencia Familiar
    MEDIDAS_URGENTES_VF = "medidas_urgentes_vf"
    # Laboral adicional
    AUTO_APERTURA_LABORAL = "auto_apertura_laboral"
    # Concursal
    AUTO_APERTURA_CONCURSO = "auto_apertura_concurso"
    DECLARACION_QUIEBRA = "declaracion_quiebra"
    # Penal
    CITACION_IMPUTACION = "citacion_imputacion"
    AUTO_ELEVACION_JUICIO = "auto_elevacion_juicio"
    FIJACION_DEBATE = "fijacion_debate"
    # Niñez
    CONTROL_LEGALIDAD_NNA = "control_legalidad_nna"
    # Civil y Comercial — sucesorio
    APERTURA_SUCESORIO = "apertura_sucesorio"
    # Civil y Comercial — sumarísimo
    SUMARISIMO_CITACION = "sumarisimo_citacion"
    # Contencioso Administrativo
    ADMISIBILIDAD_CA = "admisibilidad_ca"
    # Familia
    ADMISION_ALIMENTOS = "admision_alimentos"
    ADMISION_DIVORCIO = "admision_divorcio"
    ADMISION_COMUNICACION = "admision_comunicacion"
    # Violencia Familiar — audiencia
    CITACION_AUDIENCIA_VF = "citacion_audiencia_vf"
    # Civil/Sucesorio — declaratoria
    DECLARATORIA_HEREDEROS = "declaratoria_herederos"
    # Civil/Ejecutivo — admisión
    ADMISION_EJECUTIVO = "admision_ejecutivo"
    # Niñez — seguimiento y cese
    PRORROGA_MEDIDA_NNA = "prorroga_medida_nna"
    CESE_MEDIDA_NNA = "cese_medida_nna"
    # Penal — resoluciones definitivas
    SOBRESEIMIENTO = "sobreseimiento"
    DESESTIMACION_DENUNCIA = "desestimacion_denuncia"
    # Familia — homologación
    HOMOLOGACION_ACUERDO_FAMILIA = "homologacion_acuerdo_familia"
    # Penal — cautelares y trámite
    PRISION_PREVENTIVA = "prision_preventiva"
    CESE_PRISION_PREVENTIVA = "cese_prision_preventiva"
    ADMISION_PARTES_CIVILES = "admision_partes_civiles"
    TRASLADO_VISTA_FISCAL = "traslado_vista_fiscal"
    CITACION_TESTIGOS_PERITOS = "citacion_testigos_peritos"
    SUSPENSION_JUICIO_PRUEBA = "suspension_juicio_prueba"
    EXTRACCION_TESTIMONIOS = "extraccion_testimonios"
    ARCHIVO_NOTIFICACION = "archivo_notificacion"
    # Civil — sucesorio ampliado
    CITACION_HEREDEROS_ACREEDORES = "citacion_herederos_acreedores"
    APROBACION_INVENTARIO_AVALUO = "aprobacion_inventario_avaluo"
    # Civil — incidentes
    CADUCIDAD_INSTANCIA = "caducidad_instancia"
    DESIGNACION_PERITO = "designacion_perito"
    INTIMACION_CUMPLIMIENTO_SENTENCIA = "intimacion_cumplimiento_sentencia"
    AUTO_DESGLOSE = "auto_desglose"
    CITACION_AUDIENCIA_CONCILIACION = "citacion_audiencia_conciliacion"
    # Contencioso Administrativo — ampliado
    TRASLADO_DEMANDA_CA = "traslado_demanda_ca"
    APERTURA_PRUEBA_CA = "apertura_prueba_ca"
    CITACION_AUDIENCIA_PRELIMINAR_CA = "citacion_audiencia_preliminar_ca"
    SUSPENSION_ACTO_ADMINISTRATIVO = "suspension_acto_administrativo"
    LLAMAMIENTO_AUTOS_CA = "llamamiento_autos_ca"
    INTIMACION_ORGANISMO_DEMANDADO = "intimacion_organismo_demandado"
    # Violencia Familiar — ampliado
    PRORROGA_MEDIDAS_VF = "prorroga_medidas_vf"
    CESE_MEDIDAS_VF = "cese_medidas_vf"
    OFICIO_POLICIA_VF = "oficio_policia_vf"
    # Familia — ampliado
    EXCLUSION_HOGAR = "exclusion_hogar"
    REGIMEN_COMUNICACION_PROVISORIO = "regimen_comunicacion_provisorio"
    INTIMACION_PAGO_CUOTAS_ALIMENTARIAS = "intimacion_pago_cuotas_alimentarias"
    ATRIBUCION_HOGAR_CONYUGAL = "atribucion_hogar_conyugal"
    CITACION_CONCILIACION_FAMILIA = "citacion_conciliacion_familia"
    # Laboral — ampliado
    TRASLADO_CONTESTACION_LABORAL = "traslado_contestacion_laboral"
    CITACION_VISTA_CAUSA = "citacion_vista_causa"
    INTIMACION_PAGO_LIQUIDACION = "intimacion_pago_liquidacion"
    HOMOLOGACION_ACUERDO_LABORAL = "homologacion_acuerdo_laboral"
    AUTO_LIQUIDACION_APROBADA = "auto_liquidacion_aprobada"
    # Concursal — ampliado
    DECRETO_PERIODO_EXCLUSIVIDAD = "decreto_periodo_exclusividad"
    AUTO_HOMOLOGACION_ACUERDO = "auto_homologacion_acuerdo"
    CITACION_ACREEDORES_EDICTO = "citacion_acreedores_edicto"
    DESIGNACION_SINDICO = "designacion_sindico"
    AUTO_VERIFICACION_CREDITOS = "auto_verificacion_creditos"
    DECRETO_REALIZACION_BIENES = "decreto_realizacion_bienes"
    # Niñez — ampliado
    AUTO_MEDIDA_ABRIGO = "auto_medida_abrigo"
    NOTIFICACION_SENAF = "notificacion_senaf"
    AUTO_INTERNACION_SALUD_MENTAL = "auto_internacion_salud_mental"
    DECRETO_VISITAS_SUPERVISADAS = "decreto_visitas_supervisadas"
    AUTO_REINTEGRO_FAMILIAR = "auto_reintegro_familiar"
    CITACION_SEGUIMIENTO_NNA = "citacion_seguimiento_nna"
