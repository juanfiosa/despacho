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
    REQUIRENTE = "requirente"
    REQUERIDO = "requerido"
    VICTIMA = "victima"
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
    # Civil y Comercial — juicio ejecutivo
    INTIMACION_PAGO = "intimacion_pago"
    AUTO_APERTURA_PRUEBA = "auto_apertura_prueba"
    DECRETO_TRAMITE = "decreto_tramite"
    MANDAMIENTO_PAGO = "mandamiento_pago"
    # (se amplía por fuero en versiones siguientes)
