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
                            tipo="admision_ejecutivo",
                            label="Decreto de admisión",
                            descripcion="Admite la demanda ejecutiva, verifica el título y libra mandamiento de intimación",
                            norma="Art. 175 / Art. 529 CPCC",
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
                    descripcion="Admite la demanda y cita al demandado a audiencia única",
                    documentos=[
                        DocumentoDisponible(
                            tipo="sumarisimo_citacion",
                            label="Decreto de admisión y citación a audiencia",
                            descripcion="Admite la demanda sumarísima, emplaza al demandado y fija fecha de audiencia única",
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
                            tipo="apertura_sucesorio",
                            label="Auto de apertura del sucesorio",
                            descripcion="Declara abierto el sucesorio, ordena edictos y designa perito valuador",
                            norma="Art. 655 CPCC / Art. 2340 CCyCN",
                        ),
                    ],
                ),
                Etapa(
                    id="citacion_herederos",
                    label="Citación de herederos y acreedores",
                    descripcion="Edictos citando a herederos y acreedores a presentarse al juicio",
                    documentos=[
                        DocumentoDisponible(
                            tipo="citacion_herederos_acreedores",
                            label="Decreto de citación de herederos y acreedores",
                            descripcion="Ordena publicar edictos citando a herederos y acreedores a presentarse al sucesorio",
                            norma="Art. 2340 CCyCN / Art. 655 CPCC",
                        ),
                    ],
                ),
                Etapa(
                    id="declaratoria",
                    label="Declaratoria de herederos",
                    descripcion="Auto que reconoce la vocación hereditaria de los presentantes",
                    documentos=[
                        DocumentoDisponible(
                            tipo="declaratoria_herederos",
                            label="Auto de declaratoria de herederos",
                            descripcion="Declara herederos a los presentantes y ordena anotaciones registrales",
                            norma="Arts. 2353 y ss. CCyCN",
                        ),
                    ],
                ),
                Etapa(
                    id="inventario",
                    label="Inventario y avalúo",
                    descripcion="Aprobación del inventario y avalúo de los bienes hereditarios",
                    documentos=[
                        DocumentoDisponible(
                            tipo="aprobacion_inventario_avaluo",
                            label="Decreto de aprobación de inventario y avalúo",
                            descripcion="Aprueba el inventario y avalúo de los bienes hereditarios practicado por el perito tasador",
                            norma="Art. 2341 CCyCN / Art. 655 y ss. CPCC",
                        ),
                    ],
                ),
            ],
        ),
        Proceso(
            id="incidentes",
            label="Incidentes y Resoluciones",
            descripcion="Incidentes procesales civiles: caducidad, peritos, cumplimiento de sentencia, desglose y conciliación",
            etapas=[
                Etapa(
                    id="caducidad",
                    label="Caducidad de instancia",
                    descripcion="Declaración de caducidad de instancia por inactividad procesal",
                    documentos=[
                        DocumentoDisponible(
                            tipo="caducidad_instancia",
                            label="Decreto de caducidad de instancia",
                            descripcion="Declara operada la caducidad de instancia por inactividad durante el plazo legal",
                            norma="Art. 339 CPCC",
                        ),
                    ],
                ),
                Etapa(
                    id="perito",
                    label="Designación de perito",
                    descripcion="Auto que designa al perito y fija plazo para el dictamen",
                    documentos=[
                        DocumentoDisponible(
                            tipo="designacion_perito",
                            label="Auto de designación de perito",
                            descripcion="Designa al perito, le notifica el cargo y le fija plazo para aceptar y dictaminar",
                            norma="Art. 261 CPCC",
                        ),
                    ],
                ),
                Etapa(
                    id="cumplimiento_sentencia",
                    label="Cumplimiento de sentencia",
                    descripcion="Intimación al condenado a cumplir la sentencia firme",
                    documentos=[
                        DocumentoDisponible(
                            tipo="intimacion_cumplimiento_sentencia",
                            label="Intimación de cumplimiento de sentencia",
                            descripcion="Intima al condenado a cumplir la sentencia bajo apercibimiento de ejecución forzada",
                            norma="Art. 559 CPCC",
                        ),
                    ],
                ),
                Etapa(
                    id="desglose",
                    label="Desglose de documentación",
                    descripcion="Decreto de desglose y devolución de documentos originales",
                    documentos=[
                        DocumentoDisponible(
                            tipo="auto_desglose",
                            label="Decreto de desglose",
                            descripcion="Ordena el desglose y devolución de la documentación original acompañada por la parte",
                            norma="Art. 75 CPCC",
                        ),
                    ],
                ),
                Etapa(
                    id="conciliacion_civil",
                    label="Audiencia de conciliación",
                    descripcion="Citación a audiencia de conciliación en proceso civil",
                    documentos=[
                        DocumentoDisponible(
                            tipo="citacion_audiencia_conciliacion",
                            label="Decreto de citación a audiencia de conciliación",
                            descripcion="Cita a las partes a audiencia de conciliación en el proceso civil ordinario",
                            norma="Art. 58 CPCC",
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
                            tipo="admision_laboral",
                            label="Decreto de admisión y citación a audiencia",
                            descripcion="Admite la demanda laboral y fija audiencia de conciliación",
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
                            tipo="auto_apertura_laboral",
                            label="Auto de apertura a prueba",
                            descripcion="Abre el período probatorio laboral conforme CPT",
                            norma="Art. 83 CPT",
                        ),
                    ],
                ),
                Etapa(
                    id="contestacion",
                    label="Traslado de contestación",
                    descripcion="Decreto post-contestación de demanda",
                    documentos=[
                        DocumentoDisponible(
                            tipo="traslado_contestacion_laboral",
                            label="Decreto de traslado de contestación",
                            descripcion="Tiene por contestada la demanda laboral y corre traslado al actor",
                            norma="CPT Ley 7987",
                        ),
                    ],
                ),
                Etapa(
                    id="vista_causa",
                    label="Vista de causa",
                    descripcion="Citación a audiencia de vista de causa",
                    documentos=[
                        DocumentoDisponible(
                            tipo="citacion_vista_causa",
                            label="Citación a audiencia de vista de causa",
                            descripcion="Cita a las partes a la audiencia de vista de causa laboral",
                            norma="Art. 83 CPT",
                        ),
                    ],
                ),
                Etapa(
                    id="homologacion",
                    label="Homologación de acuerdo",
                    descripcion="Auto que homologa el acuerdo conciliatorio",
                    documentos=[
                        DocumentoDisponible(
                            tipo="homologacion_acuerdo_laboral",
                            label="Auto de homologación de acuerdo laboral",
                            descripcion="Homologa el acuerdo conciliatorio y le confiere fuerza de sentencia firme",
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
                    id="aprobacion_liquidacion",
                    label="Aprobación de liquidación",
                    descripcion="Auto que aprueba la liquidación practicada por el perito",
                    documentos=[
                        DocumentoDisponible(
                            tipo="auto_liquidacion_aprobada",
                            label="Auto de aprobación de liquidación",
                            descripcion="Aprueba la liquidación practicada e intima al condenado al pago",
                            norma="Art. 132 CPT",
                        ),
                    ],
                ),
                Etapa(
                    id="intimacion_pago",
                    label="Intimación de pago",
                    descripcion="Intimación al condenado a pagar el importe de la liquidación aprobada",
                    documentos=[
                        DocumentoDisponible(
                            tipo="intimacion_pago_liquidacion",
                            label="Decreto de intimación de pago de liquidación",
                            descripcion="Intima al condenado a abonar la suma liquidada bajo apercibimiento de embargo",
                            norma="Art. 132 CPT",
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
                            tipo="admision_alimentos",
                            label="Decreto de admisión y citación a audiencia",
                            descripcion="Admite la demanda de alimentos y fija audiencia de conciliación",
                            norma="Art. 544 CCyCN / CPF Ley 10305",
                        ),
                    ],
                ),
                Etapa(
                    id="alimentos_provisorios",
                    label="Alimentos provisorios",
                    descripcion="Fijación de cuota alimentaria provisoria",
                    documentos=[
                        DocumentoDisponible(
                            tipo="alimentos_provisorios",
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
                            tipo="intimacion_pago_cuotas_alimentarias",
                            label="Intimación de pago de cuotas alimentarias",
                            descripcion="Intima al alimentante a abonar las cuotas adeudadas bajo apercibimiento del art. 553 CCyCN",
                            norma="Art. 550 / Art. 553 CCyCN",
                        ),
                    ],
                ),
                Etapa(
                    id="homologacion",
                    label="Homologación de acuerdo",
                    descripcion="Auto que homologa el acuerdo alimentario alcanzado por las partes",
                    documentos=[
                        DocumentoDisponible(
                            tipo="homologacion_acuerdo_familia",
                            label="Auto de homologación de acuerdo",
                            descripcion="Homologa el convenio sobre alimentos y le confiere fuerza de sentencia firme",
                            norma="Art. 166 inc. 1 CPCC / CPF Ley 10305",
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
                            tipo="admision_divorcio",
                            label="Decreto de admisión",
                            descripcion="Admite la petición de divorcio y corre traslado o tiene por presentado el convenio regulador",
                            norma="Arts. 437-438 CCyCN",
                        ),
                    ],
                ),
                Etapa(
                    id="homologacion",
                    label="Homologación del convenio regulador",
                    descripcion="Auto que homologa el convenio regulador del divorcio",
                    documentos=[
                        DocumentoDisponible(
                            tipo="homologacion_acuerdo_familia",
                            label="Auto de homologación de convenio regulador",
                            descripcion="Homologa el convenio regulador del divorcio vincular y disuelve el vínculo",
                            norma="Arts. 437-439 CCyCN / Art. 166 inc. 1 CPCC",
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
                            tipo="admision_comunicacion",
                            label="Decreto de admisión y citación",
                            descripcion="Admite la petición y cita a las partes a audiencia de conciliación",
                            norma="Art. 555 CCyCN / CPF Ley 10305",
                        ),
                    ],
                ),
                Etapa(
                    id="provisorio",
                    label="Régimen provisorio",
                    descripcion="Fijación de régimen de comunicación provisorio mientras tramita la causa",
                    documentos=[
                        DocumentoDisponible(
                            tipo="regimen_comunicacion_provisorio",
                            label="Decreto de régimen de comunicación provisorio",
                            descripcion="Fija régimen de comunicación provisorio entre el progenitor no conviviente y el/los hijo/s",
                            norma="Art. 555 CCyCN / CPF Ley 10305",
                        ),
                    ],
                ),
                Etapa(
                    id="homologacion",
                    label="Homologación de acuerdo",
                    descripcion="Auto que homologa el régimen de comunicación acordado por las partes",
                    documentos=[
                        DocumentoDisponible(
                            tipo="homologacion_acuerdo_familia",
                            label="Auto de homologación de régimen de comunicación",
                            descripcion="Homologa el régimen de comunicación acordado conforme al interés superior del niño",
                            norma="Art. 555 CCyCN / Art. 166 inc. 1 CPCC",
                        ),
                    ],
                ),
            ],
        ),
        Proceso(
            id="exclusion_atribucion",
            label="Exclusión del Hogar / Atribución",
            descripcion="Exclusión del hogar del agresor y atribución del uso del hogar conyugal",
            etapas=[
                Etapa(
                    id="exclusion",
                    label="Exclusión del hogar",
                    descripcion="Ordenar la exclusión del hogar del conviviente o cónyuge agresor",
                    documentos=[
                        DocumentoDisponible(
                            tipo="exclusion_hogar",
                            label="Decreto de exclusión del hogar",
                            descripcion="Ordena la exclusión del conviviente o cónyuge que ejerce violencia y fija prohibición de acercamiento",
                            norma="Art. 519 CCyCN / Art. 6 CPF",
                        ),
                    ],
                ),
                Etapa(
                    id="atribucion",
                    label="Atribución del hogar conyugal",
                    descripcion="Auto que atribuye el uso del hogar conyugal a uno de los cónyuges",
                    documentos=[
                        DocumentoDisponible(
                            tipo="atribucion_hogar_conyugal",
                            label="Auto de atribución del hogar conyugal",
                            descripcion="Atribuye provisoria o definitivamente el uso del hogar conyugal a uno de los cónyuges",
                            norma="Art. 443 CCyCN",
                        ),
                    ],
                ),
            ],
        ),
        Proceso(
            id="conciliacion_familia",
            label="Audiencia de Conciliación",
            descripcion="Citación a audiencia de conciliación en proceso de familia",
            etapas=[
                Etapa(
                    id="citacion",
                    label="Citación a audiencia",
                    descripcion="Fija y cita a las partes a audiencia de conciliación",
                    documentos=[
                        DocumentoDisponible(
                            tipo="citacion_conciliacion_familia",
                            label="Decreto de citación a audiencia de conciliación",
                            descripcion="Cita a las partes a audiencia de conciliación en proceso de familia",
                            norma="Art. 58 y conc. CPF Ley 10305",
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
                            tipo="admisibilidad_ca",
                            label="Decreto de admisibilidad",
                            descripcion="Declara admisible la acción, corre traslado y requiere el expediente administrativo",
                            norma="Art. 13 CPCA",
                        ),
                    ],
                ),
                Etapa(
                    id="traslado",
                    label="Traslado de demanda",
                    descripcion="Corre traslado de la demanda al organismo o ente demandado",
                    documentos=[
                        DocumentoDisponible(
                            tipo="traslado_demanda_ca",
                            label="Decreto de traslado de demanda",
                            descripcion="Corre traslado al organismo demandado para que conteste y ordena remisión del expediente administrativo",
                            norma="Art. 13 CPCA",
                        ),
                    ],
                ),
                Etapa(
                    id="intimacion_organismo",
                    label="Intimación al organismo",
                    descripcion="Intimación al organismo demandado a remitir el expediente administrativo",
                    documentos=[
                        DocumentoDisponible(
                            tipo="intimacion_organismo_demandado",
                            label="Decreto de intimación al organismo",
                            descripcion="Intima al organismo a remitir el expediente administrativo bajo apercibimiento",
                            norma="CPCA Ley 7182",
                        ),
                    ],
                ),
                Etapa(
                    id="cautelares_ca",
                    label="Medida cautelar",
                    descripcion="Suspensión cautelar del acto administrativo impugnado",
                    documentos=[
                        DocumentoDisponible(
                            tipo="suspension_acto_administrativo",
                            label="Auto de suspensión del acto administrativo",
                            descripcion="Suspende cautelarmente los efectos del acto impugnado hasta la resolución definitiva",
                            norma="Art. 19 CPCA",
                        ),
                    ],
                ),
                Etapa(
                    id="audiencia_preliminar",
                    label="Audiencia preliminar",
                    descripcion="Audiencia de fijación de hechos controvertidos y ofrecimiento de prueba",
                    documentos=[
                        DocumentoDisponible(
                            tipo="citacion_audiencia_preliminar_ca",
                            label="Citación a audiencia preliminar",
                            descripcion="Cita a las partes a la audiencia de saneamiento procesal y fijación de prueba",
                            norma="Art. 46 CPCA",
                        ),
                    ],
                ),
                Etapa(
                    id="apertura_prueba",
                    label="Apertura a prueba",
                    descripcion="Apertura del período probatorio",
                    documentos=[
                        DocumentoDisponible(
                            tipo="apertura_prueba_ca",
                            label="Auto de apertura a prueba",
                            descripcion="Abre el período probatorio en el proceso contencioso administrativo",
                            norma="Art. 47 CPCA",
                        ),
                    ],
                ),
                Etapa(
                    id="autos_resolver",
                    label="Llamamiento de autos",
                    descripcion="Causa en estado de dictar sentencia",
                    documentos=[
                        DocumentoDisponible(
                            tipo="llamamiento_autos_ca",
                            label="Decreto de llamamiento de autos",
                            descripcion="Llama los autos para dictar sentencia definitiva en el proceso contencioso administrativo",
                            norma="Art. 51 CPCA",
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
                    id="desestimacion",
                    label="Desestimación de denuncia o querella",
                    descripcion="Rechazo in limine de la denuncia o querella por improcedencia manifiesta",
                    documentos=[
                        DocumentoDisponible(
                            tipo="desestimacion_denuncia",
                            label="Auto de desestimación",
                            descripcion="Desestima la denuncia o querella por ser manifiestamente improcedente, atípica, de acción extinguida o no constitutiva de delito",
                            norma="Arts. 250 / 257 CPP",
                        ),
                    ],
                ),
                Etapa(
                    id="imputacion",
                    label="Acto de imputación",
                    descripcion="Citación al imputado para el acto de imputación",
                    documentos=[
                        DocumentoDisponible(
                            tipo="citacion_imputacion",
                            label="Citación a acto de imputación",
                            descripcion="Cita al imputado a comparecer ante el fiscal bajo apercibimiento",
                            norma="Art. 271 CPP",
                        ),
                    ],
                ),
                Etapa(
                    id="sobreseimiento",
                    label="Sobreseimiento",
                    descripcion="Auto de sobreseimiento definitivo que extingue la acción penal",
                    documentos=[
                        DocumentoDisponible(
                            tipo="sobreseimiento",
                            label="Auto de sobreseimiento definitivo",
                            descripcion="Sobresee definitivamente al imputado por extinción de la acción, falta de participación, atipicidad o falta de prueba suficiente",
                            norma="Arts. 350-351 CPP",
                        ),
                    ],
                ),
                Etapa(
                    id="prision_preventiva",
                    label="Prisión preventiva",
                    descripcion="Resolución sobre la prisión preventiva del imputado",
                    documentos=[
                        DocumentoDisponible(
                            tipo="prision_preventiva",
                            label="Auto de prisión preventiva",
                            descripcion="Decreta la prisión preventiva del imputado por peligro de fuga o entorpecimiento",
                            norma="Art. 281 CPP",
                        ),
                        DocumentoDisponible(
                            tipo="cese_prision_preventiva",
                            label="Auto de cese de prisión preventiva",
                            descripcion="Dispone la excarcelación, exención o morigeración de la prisión preventiva",
                            norma="Art. 283 CPP",
                        ),
                    ],
                ),
                Etapa(
                    id="partes_civiles",
                    label="Partes civiles",
                    descripcion="Constitución de actor civil y/o tercero civilmente demandado",
                    documentos=[
                        DocumentoDisponible(
                            tipo="admision_partes_civiles",
                            label="Decreto de admisión de partes civiles",
                            descripcion="Admite la constitución del actor civil o tercero civilmente demandado en la causa",
                            norma="Art. 96 CPP",
                        ),
                    ],
                ),
                Etapa(
                    id="vista_fiscal",
                    label="Vista al Ministerio Fiscal",
                    descripcion="Traslado de actuaciones al fiscal para que dictamine",
                    documentos=[
                        DocumentoDisponible(
                            tipo="traslado_vista_fiscal",
                            label="Decreto de traslado / vista al fiscal",
                            descripcion="Confiere vista o traslado al fiscal de instrucción, cámara o general para que dictamine",
                            norma="Art. 334 CPP",
                        ),
                    ],
                ),
                Etapa(
                    id="extraccion_testimonios",
                    label="Extracción de testimonios",
                    descripcion="Extracción de copias para remitir a otro tribunal o fiscalía",
                    documentos=[
                        DocumentoDisponible(
                            tipo="extraccion_testimonios",
                            label="Decreto de extracción de testimonios",
                            descripcion="Ordena extraer testimonios para remitir a otro tribunal, juzgado o fiscalía",
                            norma="Art. 181 CPP",
                        ),
                    ],
                ),
                Etapa(
                    id="archivo",
                    label="Archivo de actuaciones",
                    descripcion="Auto de archivo con notificación a las partes",
                    documentos=[
                        DocumentoDisponible(
                            tipo="archivo_notificacion",
                            label="Auto de archivo con notificación",
                            descripcion="Dispone el archivo de las actuaciones y ordena notificar a las partes",
                            norma="Art. 334 CPP",
                        ),
                    ],
                ),
                Etapa(
                    id="elevacion_juicio",
                    label="Elevación a juicio",
                    descripcion="Auto que eleva la causa a juicio oral",
                    documentos=[
                        DocumentoDisponible(
                            tipo="auto_elevacion_juicio",
                            label="Auto de elevación a juicio",
                            descripcion="Clausura la investigación y eleva la causa a juicio oral o abreviado",
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
                            tipo="fijacion_debate",
                            label="Decreto de fijación de audiencia de debate",
                            descripcion="Fija fecha, hora y lugar del debate; cita a partes, testigos y peritos",
                            norma="Art. 374 CPP",
                        ),
                    ],
                ),
                Etapa(
                    id="testigos_peritos",
                    label="Citación testigos y peritos",
                    descripcion="Citación de testigos y/o peritos al debate oral",
                    documentos=[
                        DocumentoDisponible(
                            tipo="citacion_testigos_peritos",
                            label="Decreto de citación de testigos y peritos",
                            descripcion="Cita a los testigos y/o peritos a comparecer al debate bajo apercibimiento",
                            norma="Arts. 374 y 221 CPP",
                        ),
                    ],
                ),
                Etapa(
                    id="probation",
                    label="Suspensión del juicio a prueba",
                    descripcion="Homologación del acuerdo de probation",
                    documentos=[
                        DocumentoDisponible(
                            tipo="suspension_juicio_prueba",
                            label="Auto de suspensión del juicio a prueba",
                            descripcion="Homologa el acuerdo de probation y fija las reglas de conducta impuestas al imputado",
                            norma="Art. 76 bis CP / Art. 360 CPP",
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
                    descripcion="Citación a audiencia para escuchar a las partes (art. 27 Ley 9283)",
                    documentos=[
                        DocumentoDisponible(
                            tipo="citacion_audiencia_vf",
                            label="Citación a audiencia",
                            descripcion="Cita a ambas partes a audiencia de conciliación/seguimiento con el equipo técnico",
                            norma="Art. 27 Ley 9283",
                        ),
                    ],
                ),
                Etapa(
                    id="prorroga",
                    label="Prórroga de medidas",
                    descripcion="Prórroga de las medidas de protección por subsistir el riesgo",
                    documentos=[
                        DocumentoDisponible(
                            tipo="prorroga_medidas_vf",
                            label="Auto de prórroga de medidas",
                            descripcion="Prorroga las medidas urgentes de protección por subsistir la situación de riesgo",
                            norma="Art. 26 Ley 9283",
                        ),
                    ],
                ),
                Etapa(
                    id="cese",
                    label="Cese de medidas",
                    descripcion="Levantamiento de las medidas de protección",
                    documentos=[
                        DocumentoDisponible(
                            tipo="cese_medidas_vf",
                            label="Auto de cese de medidas",
                            descripcion="Dispone el levantamiento de las medidas al superarse la situación de riesgo",
                            norma="Art. 26 Ley 9283",
                        ),
                    ],
                ),
                Etapa(
                    id="oficio_policia",
                    label="Oficio a la Policía",
                    descripcion="Libramiento de oficio policial para custodia, verificación o traslado",
                    documentos=[
                        DocumentoDisponible(
                            tipo="oficio_policia_vf",
                            label="Decreto de oficio a la Policía",
                            descripcion="Libra oficio a la Policía de la Provincia para que intervenga en la causa",
                            norma="Ley 9283",
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
                            tipo="control_legalidad_nna",
                            label="Auto de control de legalidad",
                            descripcion="Declara la legalidad de la medida de protección excepcional y ordena informe de seguimiento",
                            norma="Art. 52 Ley 9944",
                        ),
                    ],
                ),
                Etapa(
                    id="abrigo",
                    label="Medida de abrigo",
                    descripcion="Alojamiento transitorio del NNyA en familia alternativa u hogar convivencial",
                    documentos=[
                        DocumentoDisponible(
                            tipo="auto_medida_abrigo",
                            label="Auto de medida de abrigo",
                            descripcion="Ordena el alojamiento transitorio del NNyA en familia alternativa, hogar convivencial o establecimiento",
                            norma="Art. 48 Ley 9944",
                        ),
                    ],
                ),
                Etapa(
                    id="notificacion_senaf",
                    label="Notificación a SENAF",
                    descripcion="Notificación al organismo administrativo de niñez",
                    documentos=[
                        DocumentoDisponible(
                            tipo="notificacion_senaf",
                            label="Decreto de notificación a SENAF",
                            descripcion="Notifica a la SENAF u organismo administrativo de niñez sobre resolución o audiencia",
                            norma="Ley 9944 / Ley 26061",
                        ),
                    ],
                ),
                Etapa(
                    id="internacion",
                    label="Internación en salud mental",
                    descripcion="Internación involuntaria por razones de salud mental",
                    documentos=[
                        DocumentoDisponible(
                            tipo="auto_internacion_salud_mental",
                            label="Auto de internación involuntaria",
                            descripcion="Ordena la internación involuntaria del NNyA en institución de salud mental",
                            norma="Art. 43 Ley 26657",
                        ),
                    ],
                ),
                Etapa(
                    id="visitas",
                    label="Visitas supervisadas",
                    descripcion="Régimen de visitas bajo supervisión del equipo técnico",
                    documentos=[
                        DocumentoDisponible(
                            tipo="decreto_visitas_supervisadas",
                            label="Decreto de visitas supervisadas",
                            descripcion="Fija régimen de visitas supervisadas entre el NNyA y sus progenitores o referentes familiares",
                            norma="Ley 9944 / Art. 555 CCyCN",
                        ),
                    ],
                ),
                Etapa(
                    id="prorroga",
                    label="Prórroga de medida",
                    descripcion="Revisión periódica de la medida excepcional y prórroga si corresponde",
                    documentos=[
                        DocumentoDisponible(
                            tipo="prorroga_medida_nna",
                            label="Auto de prórroga de medida excepcional",
                            descripcion="Prorroga la medida por no haberse superado las circunstancias de riesgo",
                            norma="Art. 55 Ley 9944",
                        ),
                    ],
                ),
                Etapa(
                    id="seguimiento",
                    label="Audiencia de seguimiento",
                    descripcion="Citación a audiencia de seguimiento de la medida excepcional",
                    documentos=[
                        DocumentoDisponible(
                            tipo="citacion_seguimiento_nna",
                            label="Citación a audiencia de seguimiento",
                            descripcion="Convoca a las partes, SENAF y equipo técnico a audiencia de seguimiento de la medida",
                            norma="Art. 52 Ley 9944",
                        ),
                    ],
                ),
                Etapa(
                    id="reintegro",
                    label="Reintegro familiar",
                    descripcion="Reintegro del NNyA a su grupo familiar de origen",
                    documentos=[
                        DocumentoDisponible(
                            tipo="auto_reintegro_familiar",
                            label="Auto de reintegro familiar",
                            descripcion="Ordena el reintegro del NNyA a su grupo familiar por haberse superado la situación de vulneración",
                            norma="Art. 48 y conc. Ley 9944",
                        ),
                    ],
                ),
                Etapa(
                    id="cese",
                    label="Cese de la medida",
                    descripcion="Finalización de la medida de protección excepcional",
                    documentos=[
                        DocumentoDisponible(
                            tipo="cese_medida_nna",
                            label="Auto de cese de medida excepcional",
                            descripcion="Dispone el cese de la medida por haberse superado la situación de riesgo",
                            norma="Arts. 52 y 55 Ley 9944",
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
                            tipo="auto_apertura_concurso",
                            label="Auto de apertura del concurso preventivo",
                            descripcion="Declara abierto el concurso, designa síndico, fija período informativo y audiencia",
                            norma="Art. 14 Ley 24522",
                        ),
                    ],
                ),
                Etapa(
                    id="designacion_sindico",
                    label="Designación de síndico",
                    descripcion="Designación del síndico concursal y notificación del cargo",
                    documentos=[
                        DocumentoDisponible(
                            tipo="designacion_sindico",
                            label="Decreto de designación de síndico",
                            descripcion="Designa al síndico concursal y le fija plazo para aceptar el cargo",
                            norma="Art. 14 Ley 24522",
                        ),
                    ],
                ),
                Etapa(
                    id="citacion_acreedores",
                    label="Citación de acreedores",
                    descripcion="Publicación de edictos citando a los acreedores a verificar créditos",
                    documentos=[
                        DocumentoDisponible(
                            tipo="citacion_acreedores_edicto",
                            label="Decreto de citación de acreedores por edictos",
                            descripcion="Ordena publicar edictos citando a los acreedores a verificar sus créditos ante el síndico",
                            norma="Art. 27 Ley 24522",
                        ),
                    ],
                ),
                Etapa(
                    id="verificacion",
                    label="Verificación de créditos",
                    descripcion="Resolución del juez sobre los créditos verificados e inadmisibles",
                    documentos=[
                        DocumentoDisponible(
                            tipo="verificacion_creditos",
                            label="Auto de verificación de créditos",
                            descripcion="Resuelve sobre los créditos verificados, admitidos e inadmisibles según informe del síndico",
                            norma="Art. 36 Ley 24522",
                        ),
                    ],
                ),
                Etapa(
                    id="exclusividad",
                    label="Período de exclusividad",
                    descripcion="Fijación del período de exclusividad para negociar con los acreedores",
                    documentos=[
                        DocumentoDisponible(
                            tipo="periodo_exclusividad",
                            label="Decreto de período de exclusividad",
                            descripcion="Fija el período de exclusividad para que el concursado obtenga conformidades de sus acreedores",
                            norma="Art. 43 Ley 24522",
                        ),
                    ],
                ),
                Etapa(
                    id="homologacion",
                    label="Homologación del acuerdo",
                    descripcion="Auto que homologa el acuerdo preventivo",
                    documentos=[
                        DocumentoDisponible(
                            tipo="homologacion_acuerdo_concursal",
                            label="Auto de homologación del acuerdo preventivo",
                            descripcion="Homologa el acuerdo obtenido por el concursado con sus acreedores",
                            norma="Art. 52 Ley 24522",
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
                            tipo="declaracion_quiebra",
                            label="Sentencia de quiebra",
                            descripcion="Declara la quiebra, designa síndico, fija período informativo y ordena inhabilitación",
                            norma="Art. 88 Ley 24522",
                        ),
                    ],
                ),
                Etapa(
                    id="realizacion",
                    label="Realización de bienes",
                    descripcion="Liquidación de los bienes del fallido",
                    documentos=[
                        DocumentoDisponible(
                            tipo="realizacion_bienes",
                            label="Decreto de realización de bienes",
                            descripcion="Ordena la realización (liquidación) de los bienes del fallido y fija la modalidad",
                            norma="Art. 203 Ley 24522",
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
