"""
Catálogo de procesos judiciales para la Provincia de Córdoba.

Estructura: Fuero → Tipo de proceso → Etapa → Documentos disponibles

Cada documento disponible referencia un tipo_documento que mapea exactamente
al modelo de input y al template Jinja2 correspondiente.

Fuentes normativas:
  - CPCC Ley 8465  (Civil y Comercial)
  - CPT  Ley 7987  (Laboral)
  - CPF  Ley 10305 (Familia)
  - CPCA Ley 7182  (Contencioso Administrativo)
  - CPP  Ley 8123  (Penal)
  - Ley  9283      (Violencia Familiar)
  - Ley  9944      (Niñez y Adolescencia)
  - Ley  24522     (Concursal)
"""

from dataclasses import dataclass, field


@dataclass(frozen=True)
class DocumentoDisponible:
    tipo: str           # clave que mapea al endpoint de generación
    label: str          # texto para mostrar al usuario
    descripcion: str    # qué hace este documento
    norma: str          # artículo de referencia


@dataclass(frozen=True)
class Etapa:
    id: str
    label: str
    descripcion: str
    documentos: list[DocumentoDisponible]


@dataclass(frozen=True)
class Proceso:
    id: str
    label: str
    descripcion: str
    etapas: list[Etapa]


@dataclass(frozen=True)
class Fuero:
    id: str
    label: str
    norma: str
    procesos: list[Proceso]


# ---------------------------------------------------------------------------
# CIVIL Y COMERCIAL — CPCC Ley 8465
# ---------------------------------------------------------------------------

_CIVIL_COMERCIAL = Fuero(
    id="civil_comercial",
    label="Civil y Comercial",
    norma="CPCC Ley 8465",
    procesos=[
        Proceso(
            id="ejecutivo",
            label="Juicio Ejecutivo",
            descripcion="Cobro de deudas con título ejecutivo (pagaré, cheque, hipoteca, etc.)",
            etapas=[
                Etapa(
                    id="admision",
                    label="Admisión de demanda",
                    descripcion="Primer proveído que da curso a la demanda ejecutiva",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Decreto de admisión",
                            descripcion="Tiene por presentada la demanda y corre traslado",
                            norma="Art. 175 CPCC",
                        ),
                    ],
                ),
                Etapa(
                    id="intimacion_pago",
                    label="Intimación de pago",
                    descripcion="Se intima al ejecutado a pagar bajo apercibimiento de embargo",
                    documentos=[
                        DocumentoDisponible(
                            tipo="intimacion_pago",
                            label="Decreto de intimación de pago",
                            descripcion="Intima al demandado a abonar en el plazo legal",
                            norma="Art. 529 CPCC",
                        ),
                        DocumentoDisponible(
                            tipo="mandamiento_pago",
                            label="Mandamiento de intimación y embargo",
                            descripcion="Libra mandamiento al Oficial de Justicia para intimar y embargar",
                            norma="Art. 531 CPCC",
                        ),
                    ],
                ),
                Etapa(
                    id="excepciones",
                    label="Excepciones",
                    descripcion="Traslado de las excepciones opuestas por el ejecutado",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Traslado de excepciones",
                            descripcion="Corre traslado de las excepciones al ejecutante",
                            norma="Art. 547 CPCC",
                        ),
                    ],
                ),
                Etapa(
                    id="apertura_prueba",
                    label="Apertura a prueba",
                    descripcion="Se abre el período probatorio sobre las excepciones",
                    documentos=[
                        DocumentoDisponible(
                            tipo="auto_apertura_prueba",
                            label="Auto de apertura a prueba",
                            descripcion="Fija el plazo probatorio y lista la prueba admitida",
                            norma="Art. 498 CPCC",
                        ),
                    ],
                ),
                Etapa(
                    id="alegatos",
                    label="Alegatos",
                    descripcion="Clausura de la prueba y presentación de alegatos",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Decreto de clausura y alegatos",
                            descripcion="Clausura el período probatorio y fija plazo para alegar",
                            norma="Art. 504 CPCC",
                        ),
                    ],
                ),
                Etapa(
                    id="autos_resolver",
                    label="Llamamiento de autos",
                    descripcion="Llamamiento de autos para dictar sentencia",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Llamamiento de autos para resolver",
                            descripcion="Llama autos para dictar sentencia definitiva",
                            norma="Art. 120 CPCC",
                        ),
                    ],
                ),
            ],
        ),
        Proceso(
            id="ordinario",
            label="Juicio Ordinario",
            descripcion="Proceso de conocimiento amplio para pretensiones sin trámite especial",
            etapas=[
                Etapa(
                    id="admision",
                    label="Admisión de demanda",
                    descripcion="Primer proveído; corre traslado de la demanda al demandado",
                    documentos=[
                        DocumentoDisponible(
                            tipo="traslado_demanda",
                            label="Traslado de demanda",
                            descripcion="Admite la demanda y corre traslado al demandado por 30 días hábiles",
                            norma="Art. 176 CPCC",
                        ),
                    ],
                ),
                Etapa(
                    id="contestacion",
                    label="Contestación de demanda",
                    descripcion="Proveídos posteriores a la contestación / traslado de reconvención",
                    documentos=[
                        DocumentoDisponible(
                            tipo="traslado_demanda",
                            label="Decreto post-contestación",
                            descripcion="Tiene por contestada la demanda; corre traslado de reconvención si hubiere",
                            norma="Art. 192 CPCC",
                        ),
                    ],
                ),
                Etapa(
                    id="apertura_prueba",
                    label="Apertura a prueba",
                    descripcion="Auto que abre el período probatorio de cuarenta días hábiles",
                    documentos=[
                        DocumentoDisponible(
                            tipo="auto_apertura_ordinario",
                            label="Auto de apertura a prueba",
                            descripcion="Fija 40 días hábiles de prueba y admite/rechaza la prueba ofrecida",
                            norma="Art. 493 CPCC",
                        ),
                    ],
                ),
                Etapa(
                    id="alegatos",
                    label="Alegatos y clausura",
                    descripcion="Clausura la prueba y habilita los alegatos",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Decreto de clausura y alegatos",
                            descripcion="Clausura el período probatorio y fija plazo para alegar",
                            norma="Art. 504 CPCC",
                        ),
                    ],
                ),
                Etapa(
                    id="autos_resolver",
                    label="Llamamiento de autos",
                    descripcion="Llamamiento de autos para dictar sentencia definitiva",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Llamamiento de autos para resolver",
                            descripcion="Llama los autos para dictar sentencia",
                            norma="Art. 120 CPCC",
                        ),
                    ],
                ),
            ],
        ),
        Proceso(
            id="sumarisimo",
            label="Juicio Sumarísimo",
            descripcion="Proceso abreviado para pretensiones de urgencia o cuantía menor",
            etapas=[
                Etapa(
                    id="admision",
                    label="Admisión y citación",
                    descripcion="Admite la demanda y cita al demandado a audiencia",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Decreto de admisión y citación a audiencia",
                            descripcion="Admite la demanda y fija audiencia",
                            norma="Art. 418 CPCC",
                        ),
                    ],
                ),
                Etapa(
                    id="autos_resolver",
                    label="Llamamiento de autos",
                    descripcion="Llamamiento de autos para resolver",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Llamamiento de autos para resolver",
                            descripcion="Llama autos para dictar sentencia",
                            norma="Art. 120 CPCC",
                        ),
                    ],
                ),
            ],
        ),
        Proceso(
            id="cautelares",
            label="Medidas Cautelares",
            descripcion="Embargo preventivo e inhibición general de bienes (arts. 456-466 CPCC)",
            etapas=[
                Etapa(
                    id="embargo",
                    label="Embargo preventivo",
                    descripcion="Auto que decreta embargo preventivo sobre bienes del demandado",
                    documentos=[
                        DocumentoDisponible(
                            tipo="embargo_preventivo",
                            label="Auto de embargo preventivo",
                            descripcion="Decreta embargo preventivo y comisiona al Oficial de Justicia",
                            norma="Art. 466 CPCC",
                        ),
                    ],
                ),
                Etapa(
                    id="inhibicion",
                    label="Inhibición general de bienes",
                    descripcion="Auto que decreta inhibición general para anotar en registros públicos",
                    documentos=[
                        DocumentoDisponible(
                            tipo="inhibicion_general",
                            label="Auto de inhibición general de bienes",
                            descripcion="Decreta inhibición general y ordena oficios al Registro General y AFIP",
                            norma="Art. 466 CPCC",
                        ),
                    ],
                ),
            ],
        ),
        Proceso(
            id="sucesorio",
            label="Proceso Sucesorio",
            descripcion="Tramitación de la sucesión de una persona fallecida",
            etapas=[
                Etapa(
                    id="apertura",
                    label="Apertura del proceso",
                    descripcion="Auto que declara abierto el proceso sucesorio",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Auto de apertura del sucesorio",
                            descripcion="Declara abierto el proceso sucesorio y ordena publicación de edictos",
                            norma="Art. 655 CPCC",
                        ),
                    ],
                ),
                Etapa(
                    id="declaratoria",
                    label="Declaratoria de herederos",
                    descripcion="Trámites previos a la declaratoria de herederos",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Citación de acreedores",
                            descripcion="Ordena la publicación de edictos para citar acreedores",
                            norma="Art. 3357 CCyCN / Art. 655 CPCC",
                        ),
                    ],
                ),
            ],
        ),
    ],
)

# ---------------------------------------------------------------------------
# LABORAL — CPT Ley 7987
# ---------------------------------------------------------------------------

_LABORAL = Fuero(
    id="laboral",
    label="Laboral",
    norma="CPT Ley 7987",
    procesos=[
        Proceso(
            id="ordinario_laboral",
            label="Demanda Laboral Ordinaria",
            descripcion="Reclamo de créditos laborales (indemnizaciones, salarios, etc.)",
            etapas=[
                Etapa(
                    id="admision",
                    label="Admisión de demanda",
                    descripcion="Admite la demanda y cita a las partes a audiencia de conciliación",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Decreto de admisión y citación a conciliación",
                            descripcion="Admite la demanda y fija audiencia de conciliación",
                            norma="Art. 83 CPT",
                        ),
                    ],
                ),
                Etapa(
                    id="apertura_prueba",
                    label="Apertura a prueba",
                    descripcion="Frustrada la conciliación, se abre la causa a prueba",
                    documentos=[
                        DocumentoDisponible(
                            tipo="auto_apertura_prueba",
                            label="Auto de apertura a prueba",
                            descripcion="Abre el período probatorio conforme ofrecimiento de partes",
                            norma="Art. 83 CPT",
                        ),
                    ],
                ),
                Etapa(
                    id="autos_resolver",
                    label="Llamamiento de autos",
                    descripcion="Causa en condiciones de dictar sentencia",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Llamamiento de autos para resolver",
                            descripcion="Llama los autos para dictar sentencia definitiva",
                            norma="Art. 120 CPCC (supletorio)",
                        ),
                    ],
                ),
            ],
        ),
        Proceso(
            id="ejecucion_laboral",
            label="Ejecución de Sentencia Laboral",
            descripcion="Ejecución forzada de sentencia firme en materia laboral",
            etapas=[
                Etapa(
                    id="liquidacion",
                    label="Liquidación",
                    descripcion="Aprobación de la liquidación practicada",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Traslado de liquidación",
                            descripcion="Corre traslado de la liquidación a la parte contraria",
                            norma="Art. 812 CPCC (supletorio)",
                        ),
                    ],
                ),
                Etapa(
                    id="intimacion_pago",
                    label="Intimación de pago",
                    descripcion="Intimación al condenado a pagar el importe de la liquidación aprobada",
                    documentos=[
                        DocumentoDisponible(
                            tipo="intimacion_pago",
                            label="Decreto de intimación de pago",
                            descripcion="Intima al deudor a abonar la suma liquidada",
                            norma="Art. 529 CPCC (supletorio)",
                        ),
                    ],
                ),
            ],
        ),
    ],
)

# ---------------------------------------------------------------------------
# FAMILIA — CPF Ley 10305
# ---------------------------------------------------------------------------

_FAMILIA = Fuero(
    id="familia",
    label="Familia",
    norma="CPF Ley 10305",
    procesos=[
        Proceso(
            id="alimentos",
            label="Alimentos",
            descripcion="Fijación y cobro de cuota alimentaria",
            etapas=[
                Etapa(
                    id="admision",
                    label="Admisión y citación",
                    descripcion="Admite la demanda y cita al demandado a audiencia",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Decreto de admisión y citación a audiencia",
                            descripcion="Admite la demanda de alimentos y fija audiencia",
                            norma="Art. 638 CCyCN / CPF Ley 10305",
                        ),
                    ],
                ),
                Etapa(
                    id="alimentos_provisorios",
                    label="Alimentos provisorios",
                    descripcion="Fijación de cuota alimentaria provisoria",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Auto de alimentos provisorios",
                            descripcion="Fija cuota provisoria hasta la sentencia definitiva",
                            norma="Art. 544 CCyCN",
                        ),
                    ],
                ),
                Etapa(
                    id="intimacion_pago",
                    label="Intimación de pago",
                    descripcion="Cobro de cuotas impagas",
                    documentos=[
                        DocumentoDisponible(
                            tipo="intimacion_pago",
                            label="Intimación de pago de cuotas alimentarias",
                            descripcion="Intima al alimentante a abonar las cuotas adeudadas",
                            norma="Art. 550 CCyCN",
                        ),
                    ],
                ),
            ],
        ),
        Proceso(
            id="divorcio",
            label="Divorcio Vincular",
            descripcion="Disolución del vínculo matrimonial",
            etapas=[
                Etapa(
                    id="admision",
                    label="Admisión de la petición",
                    descripcion="Tiene por presentada la petición de divorcio",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Decreto de admisión",
                            descripcion="Admite la petición y fija audiencia si es unilateral",
                            norma="Art. 437 CCyCN / CPF Ley 10305",
                        ),
                    ],
                ),
            ],
        ),
        Proceso(
            id="regimen_comunicacion",
            label="Régimen de Comunicación",
            descripcion="Fijación del régimen de comunicación entre progenitores e hijos",
            etapas=[
                Etapa(
                    id="admision",
                    label="Admisión y citación",
                    descripcion="Admite y fija audiencia para intentar acuerdo",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Decreto de admisión y citación",
                            descripcion="Admite la petición y cita a las partes a audiencia",
                            norma="Art. 656 CCyCN",
                        ),
                    ],
                ),
            ],
        ),
    ],
)

# ---------------------------------------------------------------------------
# CONTENCIOSO ADMINISTRATIVO — CPCA Ley 7182
# ---------------------------------------------------------------------------

_CONTENCIOSO = Fuero(
    id="contencioso_administrativo",
    label="Contencioso Administrativo",
    norma="CPCA Ley 7182",
    procesos=[
        Proceso(
            id="accion_ca",
            label="Acción Contencioso Administrativa",
            descripcion="Impugnación de actos administrativos provinciales o municipales",
            etapas=[
                Etapa(
                    id="admisibilidad",
                    label="Admisibilidad formal",
                    descripcion="Examen de admisibilidad formal de la demanda",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Decreto de admisibilidad",
                            descripcion="Declara formalmente admisible la acción y corre traslado",
                            norma="Art. 13 CPCA",
                        ),
                    ],
                ),
                Etapa(
                    id="apertura_prueba",
                    label="Apertura a prueba",
                    descripcion="Apertura del período probatorio",
                    documentos=[
                        DocumentoDisponible(
                            tipo="auto_apertura_prueba",
                            label="Auto de apertura a prueba",
                            descripcion="Abre el período probatorio conforme art. 498 CPCC aplicado supletoriamente",
                            norma="Art. 13 CPCA / Art. 498 CPCC (supletorio)",
                        ),
                    ],
                ),
                Etapa(
                    id="autos_resolver",
                    label="Llamamiento de autos",
                    descripcion="Causa en estado de dictar sentencia",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Llamamiento de autos para resolver",
                            descripcion="Llama los autos para dictar sentencia",
                            norma="Art. 120 CPCC (supletorio)",
                        ),
                    ],
                ),
            ],
        ),
    ],
)

# ---------------------------------------------------------------------------
# PENAL — CPP Ley 8123 (documentos de trámite solamente — no sentencias)
# ---------------------------------------------------------------------------

_PENAL = Fuero(
    id="penal",
    label="Penal",
    norma="CPP Ley 8123",
    procesos=[
        Proceso(
            id="investigacion_penal",
            label="Investigación Penal Preparatoria",
            descripcion="Etapa de investigación previo al juicio oral",
            etapas=[
                Etapa(
                    id="imputacion",
                    label="Acto de imputación",
                    descripcion="Citación al imputado para el acto de imputación",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Citación a acto de imputación",
                            descripcion="Cita al imputado a comparecer ante el fiscal",
                            norma="Art. 271 CPP",
                        ),
                    ],
                ),
                Etapa(
                    id="elevacion_juicio",
                    label="Elevación a juicio",
                    descripcion="Auto que eleva la causa a juicio oral",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Auto de elevación a juicio",
                            descripcion="Declara clausurada la investigación y eleva la causa a juicio",
                            norma="Art. 354 CPP",
                        ),
                    ],
                ),
            ],
        ),
        Proceso(
            id="juicio_oral",
            label="Juicio Oral",
            descripcion="Etapa del debate oral y público",
            etapas=[
                Etapa(
                    id="fijacion_audiencia",
                    label="Fijación de audiencia de debate",
                    descripcion="Se fija la fecha y hora del debate oral",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Decreto de fijación de audiencia de debate",
                            descripcion="Fija fecha, hora y lugar del debate oral",
                            norma="Art. 374 CPP",
                        ),
                    ],
                ),
            ],
        ),
    ],
)

# ---------------------------------------------------------------------------
# VIOLENCIA FAMILIAR — Ley 9283
# ---------------------------------------------------------------------------

_VIOLENCIA_FAMILIAR = Fuero(
    id="violencia_familiar",
    label="Violencia Familiar",
    norma="Ley 9283",
    procesos=[
        Proceso(
            id="medidas_urgentes",
            label="Medidas Urgentes de Protección",
            descripcion="Medidas cautelares urgentes para protección de la víctima",
            etapas=[
                Etapa(
                    id="admision",
                    label="Admisión y medidas",
                    descripcion="Admite la denuncia y dicta medidas de protección urgentes",
                    documentos=[
                        DocumentoDisponible(
                            tipo="medidas_urgentes_vf",
                            label="Auto de medidas urgentes",
                            descripcion="Dicta medidas de exclusión del hogar, restricción de acercamiento y/o prohibición de contacto",
                            norma="Art. 26 Ley 9283",
                        ),
                    ],
                ),
                Etapa(
                    id="audiencia",
                    label="Audiencia de partes",
                    descripcion="Citación a audiencia para escuchar a las partes",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Citación a audiencia",
                            descripcion="Cita a ambas partes a audiencia",
                            norma="Art. 28 Ley 9283",
                        ),
                    ],
                ),
            ],
        ),
    ],
)

# ---------------------------------------------------------------------------
# NIÑEZ Y ADOLESCENCIA — Ley 9944
# ---------------------------------------------------------------------------

_NINEZ = Fuero(
    id="ninez",
    label="Niñez y Adolescencia",
    norma="Ley 9944",
    procesos=[
        Proceso(
            id="medidas_proteccion",
            label="Medidas de Protección",
            descripcion="Medidas de protección excepcional de derechos de NNyA",
            etapas=[
                Etapa(
                    id="admision",
                    label="Admisión y control de legalidad",
                    descripcion="Control judicial de legalidad de las medidas administrativas",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Decreto de control de legalidad",
                            descripcion="Avoca el control de legalidad de la medida de protección excepcional",
                            norma="Art. 52 Ley 9944",
                        ),
                    ],
                ),
            ],
        ),
    ],
)

# ---------------------------------------------------------------------------
# CONCURSAL — Ley 24522 + Acordadas TSJA
# ---------------------------------------------------------------------------

_CONCURSAL = Fuero(
    id="concursal",
    label="Concursal",
    norma="Ley 24522",
    procesos=[
        Proceso(
            id="concurso_preventivo",
            label="Concurso Preventivo",
            descripcion="Proceso de reorganización de empresa o persona insolvente",
            etapas=[
                Etapa(
                    id="apertura",
                    label="Auto de apertura",
                    descripcion="Auto que declara abierto el concurso preventivo",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Auto de apertura del concurso preventivo",
                            descripcion="Declara abierto el concurso, designa síndico y fija fechas",
                            norma="Art. 14 Ley 24522",
                        ),
                    ],
                ),
                Etapa(
                    id="verificacion",
                    label="Verificación de créditos",
                    descripcion="Período de verificación de créditos ante el síndico",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Decreto de presentación del informe individual",
                            descripcion="Tiene por presentado el informe individual del síndico y fija audiencia informativa",
                            norma="Art. 35 Ley 24522",
                        ),
                    ],
                ),
            ],
        ),
        Proceso(
            id="quiebra",
            label="Quiebra",
            descripcion="Proceso liquidatorio por cesación de pagos",
            etapas=[
                Etapa(
                    id="declaracion",
                    label="Declaración de quiebra",
                    descripcion="Sentencia que declara la quiebra",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_tramite",
                            label="Sentencia de quiebra",
                            descripcion="Declara la quiebra, designa síndico y ordena medidas cautelares",
                            norma="Art. 88 Ley 24522",
                        ),
                    ],
                ),
            ],
        ),
    ],
)

# ---------------------------------------------------------------------------
# Registro global
# ---------------------------------------------------------------------------

FUEROS: list[Fuero] = [
    _CIVIL_COMERCIAL,
    _LABORAL,
    _FAMILIA,
    _CONTENCIOSO,
    _PENAL,
    _VIOLENCIA_FAMILIAR,
    _NINEZ,
    _CONCURSAL,
]

_FUERO_POR_ID: dict[str, Fuero] = {f.id: f for f in FUEROS}


def get_fuero(fuero_id: str) -> Fuero:
    if fuero_id not in _FUERO_POR_ID:
        raise KeyError(f"Fuero desconocido: {fuero_id}")
    return _FUERO_POR_ID[fuero_id]


def get_proceso(fuero_id: str, proceso_id: str) -> Proceso:
    fuero = get_fuero(fuero_id)
    for p in fuero.procesos:
        if p.id == proceso_id:
            return p
    raise KeyError(f"Proceso desconocido: {proceso_id} en fuero {fuero_id}")


def get_etapa(fuero_id: str, proceso_id: str, etapa_id: str) -> Etapa:
    proceso = get_proceso(fuero_id, proceso_id)
    for e in proceso.etapas:
        if e.id == etapa_id:
            return e
    raise KeyError(f"Etapa desconocida: {etapa_id}")


def catalogo_serializable() -> list[dict]:
    """Devuelve el catálogo completo en formato JSON-serializable para la API."""
    resultado = []
    for fuero in FUEROS:
        resultado.append({
            "id":     fuero.id,
            "label":  fuero.label,
            "norma":  fuero.norma,
            "procesos": [
                {
                    "id":          p.id,
                    "label":       p.label,
                    "descripcion": p.descripcion,
                    "etapas": [
                        {
                            "id":          e.id,
                            "label":       e.label,
                            "descripcion": e.descripcion,
                            "documentos": [
                                {
                                    "tipo":        d.tipo,
                                    "label":       d.label,
                                    "descripcion": d.descripcion,
                                    "norma":       d.norma,
                                }
                                for d in e.documentos
                            ],
                        }
                        for e in p.etapas
                    ],
                }
                for p in fuero.procesos
            ],
        })
    return resultado
