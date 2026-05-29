/**
 * Plantillas de procesos judiciales para la funcionalidad "Nuevo caso".
 * Cada proceso define etapas procesales con los documentos disponibles
 * en cada etapa. Los documentos usan los mismos tipos que api.js.
 *
 * fixed(caseData) → campos que se calculan automáticamente a partir del caso
 * campos_extra    → campos adicionales que el usuario completa por documento
 */

export const TIPOS_PRUEBA = [
  { value: 'documental',             label: 'Documental' },
  { value: 'testimonial',            label: 'Testimonial' },
  { value: 'pericial',               label: 'Pericial' },
  { value: 'informativa',            label: 'Informativa' },
  { value: 'confesional',            label: 'Confesional / Absolución de posiciones' },
  { value: 'reconocimiento_judicial', label: 'Reconocimiento judicial' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Construye el bloque identificacion desde el caso */
const ident = (cd) => ({
  numero_expediente: cd.expediente,
  caratula:          cd.caratula,
  ...(cd.juzgado ? {
    tribunal:   cd.juzgado.nombre   || '',
    secretaria: cd.juzgado.secretaria || '',
    ciudad:     cd.juzgado.ciudad   || 'Córdoba',
  } : {}),
})

/** Construye el bloque partes desde el caso */
const partes = (cd) => cd.partes || {}

// ─────────────────────────────────────────────────────────────────────────────
// Procesos
// ─────────────────────────────────────────────────────────────────────────────

export const PROCESOS = [

  // ─── LABORAL ORDINARIO ─────────────────────────────────────────────────────
  {
    id:     'laboral_ordinario',
    nombre: 'Laboral — Ordinario',
    fuero:  'laboral',
    icono:  '⚖️',
    color:  '#1565c0',
    bg:     '#e3f2fd',
    roles_partes: ['actor', 'demandado'],
    campos_caso: [
      { key: 'objeto_laboral', label: 'Objeto de la demanda', type: 'textarea',
        placeholder: 'Ej: cobro de haberes, indemnización por despido sin causa…' },
    ],
    etapas: [
      {
        id:     'admision',
        nombre: 'Admisión y traslado',
        orden:  1,
        descripcion: 'Decreto de admisión de la demanda y traslado al demandado.',
        documentos: [
          {
            tipo:   'admision_laboral',
            nombre: 'Decreto de admisión de demanda laboral',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'objeto_accion', label: 'Objeto de la acción', type: 'textarea', required: true,
                placeholder: 'Ej: cobro de diferencias salariales e indemnización por despido sin causa' },
              { key: 'plazo_contestacion_dias', label: 'Plazo de contestación (días hábiles)', type: 'number',
                required: false, default: 10 },
            ],
          },
          {
            tipo:   'traslado_contestacion_laboral',
            nombre: 'Traslado para contestación de demanda',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'plazo_contestacion_dias', label: 'Plazo de contestación (días hábiles)', type: 'number',
                required: false, default: 10 },
            ],
          },
        ],
      },
      {
        id:     'apertura_prueba',
        nombre: 'Apertura a prueba',
        orden:  2,
        descripcion: 'Período probatorio: ofrecimiento y admisión de medios probatorios.',
        documentos: [
          {
            tipo:   'auto_apertura_laboral',
            nombre: 'Auto de apertura a prueba',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'plazo_dias',           label: 'Plazo de prueba (días hábiles)', type: 'number', required: false, default: 40 },
              { key: 'fecha_inicio_prueba',  label: 'Fecha de inicio del período de prueba', type: 'date', required: true },
              { key: 'prueba_admitida',      label: 'Prueba admitida', type: 'multi_prueba', required: false },
              { key: 'prueba_rechazada',     label: 'Prueba rechazada', type: 'multi_prueba', required: false },
            ],
          },
        ],
      },
      {
        id:     'vista_causa',
        nombre: 'Vista de causa',
        orden:  3,
        descripcion: 'Citación a las partes para la audiencia de vista de causa (debate oral).',
        documentos: [
          {
            tipo:   'citacion_vista_causa',
            nombre: 'Citación a audiencia de vista de causa',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'fecha_audiencia', label: 'Fecha de la audiencia', type: 'date', required: true },
              { key: 'hora_audiencia',  label: 'Hora (HH:MM)', type: 'time', required: false, default: '09:00' },
              { key: 'sala',            label: 'Sala / despacho (opcional)', type: 'text', required: false },
            ],
          },
        ],
      },
      {
        id:     'acuerdo_homologacion',
        nombre: 'Acuerdo y homologación',
        orden:  4,
        descripcion: 'Homologación del acuerdo conciliatorio entre las partes.',
        documentos: [
          {
            tipo:   'homologacion_acuerdo_laboral',
            nombre: 'Auto de homologación de acuerdo laboral',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'monto_acuerdo',   label: 'Monto del acuerdo ($)', type: 'number', required: true },
              { key: 'descripcion_acuerdo', label: 'Descripción del acuerdo', type: 'textarea', required: true,
                placeholder: 'Ej: las partes acuerdan el pago de $ … en concepto de indemnización…' },
            ],
          },
        ],
      },
      {
        id:     'liquidacion',
        nombre: 'Liquidación y pago',
        orden:  5,
        descripcion: 'Aprobación de liquidación e intimación al pago.',
        documentos: [
          {
            tipo:   'auto_liquidacion_aprobada',
            nombre: 'Auto de aprobación de liquidación',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'monto_liquidacion', label: 'Monto liquidado ($)', type: 'number', required: true },
              { key: 'capital',           label: 'Capital ($)', type: 'number', required: false },
              { key: 'intereses',         label: 'Intereses ($)', type: 'number', required: false },
            ],
          },
          {
            tipo:   'intimacion_pago_liquidacion',
            nombre: 'Intimación de pago de liquidación',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'monto_intimado', label: 'Monto intimado ($)', type: 'number', required: true },
              { key: 'plazo_dias',     label: 'Plazo para pagar (días hábiles)', type: 'number', required: false, default: 5 },
            ],
          },
        ],
      },
    ],
  },

  // ─── CIVIL ORDINARIO ──────────────────────────────────────────────────────
  {
    id:     'civil_ordinario',
    nombre: 'Civil — Ordinario',
    fuero:  'civil_comercial',
    icono:  '📋',
    color:  '#2e7d32',
    bg:     '#e8f5e9',
    roles_partes: ['actor', 'demandado'],
    campos_caso: [
      { key: 'objeto_demanda', label: 'Objeto de la demanda', type: 'textarea',
        placeholder: 'Ej: cobro de pesos, daños y perjuicios, cumplimiento de contrato…' },
    ],
    etapas: [
      {
        id:     'inicio',
        nombre: 'Inicio e instrucción',
        orden:  1,
        descripcion: 'Traslado de demanda al demandado.',
        documentos: [
          {
            tipo:   'traslado_demanda',
            nombre: 'Traslado de demanda ordinaria',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'plazo_contestacion_dias', label: 'Plazo de contestación (días hábiles)', type: 'number',
                required: false, default: 20 },
              { key: 'tipo_proceso', label: 'Tipo de proceso', type: 'select', required: false,
                default: 'ordinario',
                options: [
                  { value: 'ordinario',    label: 'Ordinario' },
                  { value: 'abreviado',    label: 'Abreviado' },
                  { value: 'sumarisimo',   label: 'Sumarísimo' },
                ]},
            ],
          },
        ],
      },
      {
        id:     'cautelares',
        nombre: 'Medidas cautelares',
        orden:  2,
        descripcion: 'Trabado de medidas precautorias sobre bienes del demandado.',
        documentos: [
          {
            tipo:   'embargo_preventivo',
            nombre: 'Embargo preventivo',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'monto_embargo',    label: 'Monto del embargo ($)', type: 'number', required: true },
              { key: 'bienes_embargados', label: 'Bienes sobre los que recae', type: 'textarea', required: true,
                placeholder: 'Ej: cuentas bancarias del demandado en todas las entidades del país' },
              { key: 'contracautela',    label: 'Contracautela', type: 'text', required: false,
                placeholder: 'Ej: caución juratoria' },
            ],
          },
          {
            tipo:   'inhibicion_general',
            nombre: 'Inhibición general de bienes',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'monto_inhibicion', label: 'Monto ($)', type: 'number', required: true },
              { key: 'contracautela',    label: 'Contracautela', type: 'text', required: false,
                placeholder: 'Ej: caución juratoria' },
            ],
          },
        ],
      },
      {
        id:     'apertura_prueba',
        nombre: 'Apertura a prueba',
        orden:  3,
        descripcion: 'Admisión y ofrecimiento de prueba, apertura del período probatorio.',
        documentos: [
          {
            tipo:   'auto_apertura_ordinario',
            nombre: 'Auto de apertura a prueba (ordinario)',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'plazo_dias',           label: 'Plazo de prueba (días hábiles)', type: 'number', required: false, default: 40 },
              { key: 'fecha_inicio_prueba',  label: 'Fecha de inicio del período de prueba', type: 'date', required: true },
              { key: 'prueba_admitida',      label: 'Prueba admitida', type: 'multi_prueba', required: false },
              { key: 'prueba_rechazada',     label: 'Prueba rechazada', type: 'multi_prueba', required: false },
            ],
          },
          {
            tipo:   'designacion_perito',
            nombre: 'Designación de perito',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'especialidad_pericial', label: 'Especialidad', type: 'text', required: true,
                placeholder: 'Ej: Contador Público, Ingeniero, Médico…' },
              { key: 'nombre_perito',         label: 'Nombre del perito designado (opcional)', type: 'text', required: false },
              { key: 'puntos_periciales',     label: 'Puntos periciales', type: 'textarea_list', required: false,
                placeholder: 'Un punto por línea' },
            ],
          },
        ],
      },
      {
        id:     'conciliacion',
        nombre: 'Audiencia de conciliación',
        orden:  4,
        descripcion: 'Citación a audiencia de conciliación.',
        documentos: [
          {
            tipo:   'citacion_audiencia_conciliacion',
            nombre: 'Citación a audiencia de conciliación',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'fecha_audiencia', label: 'Fecha de la audiencia', type: 'date', required: true },
              { key: 'hora_audiencia',  label: 'Hora (HH:MM)', type: 'time', required: false, default: '09:00' },
              { key: 'sala',            label: 'Sala / despacho (opcional)', type: 'text', required: false },
            ],
          },
        ],
      },
      {
        id:     'ejecucion',
        nombre: 'Ejecución de sentencia',
        orden:  5,
        descripcion: 'Intimación de cumplimiento de sentencia y ejecución.',
        documentos: [
          {
            tipo:   'intimacion_cumplimiento_sentencia',
            nombre: 'Intimación de cumplimiento de sentencia',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'monto_sentencia',       label: 'Monto de condena ($)', type: 'number', required: true },
              { key: 'plazo_cumplimiento_dias', label: 'Plazo para cumplir (días hábiles)', type: 'number', required: false, default: 10 },
            ],
          },
          {
            tipo:   'mandamiento_pago',
            nombre: 'Mandamiento de pago',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'monto_mandamiento', label: 'Monto del mandamiento ($)', type: 'number', required: true },
              { key: 'bienes_afectados',  label: 'Bienes sobre los que recae (opcional)', type: 'textarea', required: false },
            ],
          },
        ],
      },
    ],
  },

  // ─── FAMILIA — DIVORCIO ────────────────────────────────────────────────────
  {
    id:     'familia_divorcio',
    nombre: 'Familia — Divorcio vincular',
    fuero:  'familia',
    icono:  '👨‍👩‍👧',
    color:  '#6a1b9a',
    bg:     '#f3e5f5',
    roles_partes: ['conyuge_1', 'conyuge_2'],
    campos_caso: [
      { key: 'tipo_divorcio', label: 'Modalidad', type: 'select', required: false,
        default: 'unilateral',
        options: [
          { value: 'unilateral',   label: 'Unilateral (art. 437 CCyCN)' },
          { value: 'por_acuerdo',  label: 'Por presentación conjunta (art. 438 CCyCN)' },
        ]},
    ],
    etapas: [
      {
        id:     'admision',
        nombre: 'Admisión de la demanda',
        orden:  1,
        descripcion: 'Decreto de admisión y citación al otro cónyuge.',
        documentos: [
          {
            tipo:   'admision_divorcio',
            nombre: 'Decreto de admisión de divorcio',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'tipo_divorcio', label: 'Modalidad del divorcio', type: 'select', required: false,
                default: 'unilateral',
                options: [
                  { value: 'unilateral',  label: 'Unilateral' },
                  { value: 'por_acuerdo', label: 'Por presentación conjunta' },
                ]},
              { key: 'tiene_hijos_menores', label: '¿Hay hijos menores de edad?', type: 'select', required: false,
                default: false,
                options: [
                  { value: false, label: 'No' },
                  { value: true,  label: 'Sí' },
                ]},
            ],
          },
        ],
      },
      {
        id:     'medidas_urgentes',
        nombre: 'Medidas urgentes / provisorias',
        orden:  2,
        descripcion: 'Alimentos provisorios, atribución del hogar conyugal, régimen de comunicación.',
        documentos: [
          {
            tipo:   'alimentos_provisorios',
            nombre: 'Alimentos provisorios',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'monto_cuota',    label: 'Monto de la cuota ($)', type: 'number', required: true },
              { key: 'periodicidad',   label: 'Periodicidad', type: 'select', required: false,
                default: 'mensual',
                options: [
                  { value: 'mensual',   label: 'Mensual' },
                  { value: 'quincenal', label: 'Quincenal' },
                ]},
              { key: 'beneficiarios', label: 'Beneficiarios', type: 'textarea', required: false,
                placeholder: 'Ej: la progenitora para sí y para los hijos del matrimonio' },
            ],
          },
          {
            tipo:   'atribucion_hogar_conyugal',
            nombre: 'Atribución del hogar conyugal',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'domicilio_hogar', label: 'Domicilio del hogar conyugal', type: 'text', required: true },
              { key: 'conyuge_atribuido', label: 'Cónyuge a quien se atribuye', type: 'text', required: false },
            ],
          },
          {
            tipo:   'regimen_comunicacion_provisorio',
            nombre: 'Régimen de comunicación provisorio',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'descripcion_regimen', label: 'Descripción del régimen', type: 'textarea', required: true,
                placeholder: 'Ej: fines de semana alternos de viernes a domingo…' },
            ],
          },
        ],
      },
      {
        id:     'homologacion',
        nombre: 'Convenio y homologación',
        orden:  3,
        descripcion: 'Homologación del convenio regulador y sentencia de divorcio.',
        documentos: [
          {
            tipo:   'homologacion_acuerdo_familia',
            nombre: 'Sentencia / auto de homologación del convenio regulador',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'descripcion_acuerdo', label: 'Contenido del convenio regulador', type: 'textarea', required: true,
                placeholder: 'Ej: las partes acuerdan: 1) guarda de los hijos… 2) uso del hogar conyugal… 3) alimentos…' },
              { key: 'nombre_firmante_1',   label: 'Nombre cónyuge 1', type: 'text', required: false },
              { key: 'nombre_firmante_2',   label: 'Nombre cónyuge 2', type: 'text', required: false },
            ],
          },
        ],
      },
    ],
  },

  // ─── PENAL — IPP ──────────────────────────────────────────────────────────
  {
    id:     'penal_ipp',
    nombre: 'Penal — Investigación Penal Preparatoria',
    fuero:  'penal',
    icono:  '🔒',
    color:  '#b71c1c',
    bg:     '#ffebee',
    roles_partes: ['imputado', 'fiscal', 'querellante'],
    campos_caso: [
      { key: 'hecho_investigado', label: 'Hecho investigado', type: 'textarea',
        placeholder: 'Ej: robo simple, art. 164 CP; presunta fecha del hecho: …' },
    ],
    etapas: [
      {
        id:     'imputacion',
        nombre: 'Citación a imputación',
        orden:  1,
        descripcion: 'Auto que ordena citar al imputado para ejercer su defensa material.',
        documentos: [
          {
            tipo:   'citacion_imputacion',
            nombre: 'Citación a declaración indagatoria / imputación',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'hecho_atribuido',   label: 'Hecho atribuido', type: 'textarea', required: true,
                placeholder: 'Descripción del hecho y calificación legal provisional' },
              { key: 'fecha_citacion',    label: 'Fecha de citación', type: 'date', required: true },
              { key: 'hora_citacion',     label: 'Hora (HH:MM)', type: 'time', required: false, default: '09:00' },
            ],
          },
        ],
      },
      {
        id:     'cautelar_penal',
        nombre: 'Medida cautelar',
        orden:  2,
        descripcion: 'Prisión preventiva o medidas alternativas de coerción personal.',
        documentos: [
          {
            tipo:   'prision_preventiva',
            nombre: 'Auto de prisión preventiva',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'hecho_atribuido',  label: 'Hecho atribuido y calificación', type: 'textarea', required: true },
              { key: 'fundamento',       label: 'Fundamento (peligro de fuga / entorpecimiento)', type: 'textarea', required: true,
                placeholder: 'Ej: peligro de fuga dado el monto de la pena en expectativa…' },
            ],
          },
          {
            tipo:   'cese_prision_preventiva',
            nombre: 'Cese de prisión preventiva',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'motivo_cese', label: 'Motivo del cese', type: 'textarea', required: true,
                placeholder: 'Ej: vencimiento del plazo razonable, desaparición del peligro procesal…' },
            ],
          },
        ],
      },
      {
        id:     'investigacion',
        nombre: 'Investigación y prueba',
        orden:  3,
        descripcion: 'Medidas de investigación, peritos y testimonios.',
        documentos: [
          {
            tipo:   'citacion_testigos_peritos',
            nombre: 'Citación de testigos y peritos',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'fecha_declaracion', label: 'Fecha de citación', type: 'date', required: true },
              { key: 'hora_declaracion',  label: 'Hora (HH:MM)', type: 'time', required: false, default: '09:00' },
              { key: 'nombres_citados',   label: 'Nombres de los citados (uno por línea)', type: 'textarea_list', required: false },
            ],
          },
          {
            tipo:   'traslado_vista_fiscal',
            nombre: 'Vista al fiscal (traslado)',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'motivo_vista',  label: 'Motivo de la vista', type: 'textarea', required: true,
                placeholder: 'Ej: para que dictamine sobre la situación procesal del imputado…' },
              { key: 'plazo_dias',    label: 'Plazo (días hábiles)', type: 'number', required: false, default: 3 },
            ],
          },
        ],
      },
      {
        id:     'resolucion',
        nombre: 'Resolución de la IPP',
        orden:  4,
        descripcion: 'Sobreseimiento, desestimación o elevación a juicio.',
        documentos: [
          {
            tipo:   'sobreseimiento',
            nombre: 'Auto de sobreseimiento',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'tipo_sobreseimiento', label: 'Tipo', type: 'select', required: false,
                default: 'total',
                options: [
                  { value: 'total',    label: 'Total' },
                  { value: 'parcial',  label: 'Parcial' },
                ]},
              { key: 'causal', label: 'Causal (art. CPP)', type: 'textarea', required: true,
                placeholder: 'Ej: art. 350 inc. 2 CPP Córdoba — el hecho no constituye delito' },
            ],
          },
          {
            tipo:   'desestimacion_denuncia',
            nombre: 'Desestimación de denuncia',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'motivo_desestimacion', label: 'Motivo', type: 'textarea', required: true,
                placeholder: 'Ej: el hecho denunciado no constituye delito (art. 180 CPPC)' },
            ],
          },
          {
            tipo:   'auto_elevacion_juicio',
            nombre: 'Auto de elevación a juicio',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'calificacion_legal',  label: 'Calificación legal', type: 'text', required: true,
                placeholder: 'Ej: robo simple, art. 164 CP' },
              { key: 'tribunal_receptivo',  label: 'Tribunal receptor', type: 'text', required: false },
            ],
          },
        ],
      },
      {
        id:     'debate',
        nombre: 'Fijación de debate',
        orden:  5,
        descripcion: 'Auto de fijación de fecha para el debate oral.',
        documentos: [
          {
            tipo:   'fijacion_debate',
            nombre: 'Auto de fijación de fecha de debate',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'fecha_debate',    label: 'Fecha del debate', type: 'date', required: true },
              { key: 'hora_debate',     label: 'Hora (HH:MM)', type: 'time', required: false, default: '09:00' },
              { key: 'sala',            label: 'Sala (opcional)', type: 'text', required: false },
            ],
          },
        ],
      },
    ],
  },

  // ─── CONTENCIOSO ADMINISTRATIVO ───────────────────────────────────────────
  {
    id:     'contencioso_administrativo',
    nombre: 'Contencioso Administrativo',
    fuero:  'contencioso_administrativo',
    icono:  '🏛️',
    color:  '#e65100',
    bg:     '#fff3e0',
    roles_partes: ['actor', 'demandado'],
    campos_caso: [
      { key: 'objeto_accion', label: 'Objeto de la acción', type: 'textarea',
        placeholder: 'Ej: impugnación del Decreto N.° 123/2025 que dispuso la cesantía del actor' },
    ],
    etapas: [
      {
        id:     'admisibilidad',
        nombre: 'Admisibilidad formal',
        orden:  1,
        descripcion: 'Decreto de admisibilidad formal de la acción (art. 13 CPCA Ley 7182).',
        documentos: [
          {
            tipo:   'admisibilidad_ca',
            nombre: 'Decreto de admisibilidad formal (art. 13 CPCA)',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'objeto_accion',                      label: 'Objeto de la acción', type: 'textarea', required: true,
                placeholder: 'Ej: impugnación del acto administrativo que…' },
              { key: 'organismo_demandado',                label: 'Organismo demandado', type: 'text', required: false,
                default: 'la Provincia de Córdoba' },
              { key: 'plazo_contestacion_dias',            label: 'Plazo de contestación (días hábiles)', type: 'number', required: false, default: 30 },
              { key: 'requiere_expediente_administrativo', label: 'Ordenar remisión del expediente administrativo', type: 'select', required: false,
                default: true,
                options: [{ value: true, label: 'Sí' }, { value: false, label: 'No' }] },
            ],
          },
        ],
      },
      {
        id:     'cautelar_ca',
        nombre: 'Medida cautelar',
        orden:  2,
        descripcion: 'Suspensión cautelar de los efectos del acto impugnado (art. 19 CPCA).',
        documentos: [
          {
            tipo:   'suspension_acto_administrativo',
            nombre: 'Auto de suspensión del acto administrativo (art. 19 CPCA)',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'acto_impugnado',    label: 'Acto administrativo impugnado', type: 'textarea', required: true,
                placeholder: 'Ej: Decreto Municipal N.° 456/2025 que dispone la demolición del inmueble' },
              { key: 'organismo_emisor',  label: 'Organismo que dictó el acto', type: 'text', required: true,
                placeholder: 'Ej: la Municipalidad de Córdoba' },
              { key: 'causal_suspension', label: 'Causal de la medida cautelar', type: 'select', required: false,
                default: 'verosimilitud_derecho_peligro_demora',
                options: [
                  { value: 'verosimilitud_derecho_peligro_demora', label: 'Verosimilitud del derecho + peligro en la demora' },
                  { value: 'irreparabilidad_perjuicio',            label: 'Irreparabilidad del perjuicio' },
                  { value: 'no_afectacion_interes_publico',        label: 'No afectación del interés público' },
                ]},
              { key: 'contracautela', label: 'Contracautela (opcional)', type: 'text', required: false,
                placeholder: 'Ej: caución juratoria' },
            ],
          },
          {
            tipo:   'intimacion_organismo_demandado',
            nombre: 'Intimación al organismo a remitir el expediente',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'organismo_demandado',              label: 'Organismo demandado', type: 'text', required: false, default: 'la Provincia de Córdoba' },
              { key: 'plazo_dias',                       label: 'Plazo (días hábiles)', type: 'number', required: false, default: 10 },
              { key: 'numero_expediente_administrativo', label: 'N.° expediente administrativo (opcional)', type: 'text', required: false },
            ],
          },
        ],
      },
      {
        id:     'traslado_ca',
        nombre: 'Traslado de demanda',
        orden:  3,
        descripcion: 'Traslado de la demanda al organismo demandado (art. 13 CPCA).',
        documentos: [
          {
            tipo:   'traslado_demanda_ca',
            nombre: 'Traslado de demanda contencioso-administrativa',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'organismo_demandado',       label: 'Organismo demandado', type: 'text', required: false, default: 'la Provincia de Córdoba' },
              { key: 'plazo_contestacion_dias',   label: 'Plazo (días hábiles)', type: 'number', required: false, default: 30 },
              { key: 'domicilio_notificacion',    label: 'Domicilio de notificación (opcional)', type: 'text', required: false },
              { key: 'con_remision_expediente',   label: 'Ordenar remisión del expediente', type: 'select', required: false,
                default: true,
                options: [{ value: true, label: 'Sí' }, { value: false, label: 'No' }] },
            ],
          },
        ],
      },
      {
        id:     'audiencia_preliminar',
        nombre: 'Audiencia preliminar',
        orden:  4,
        descripcion: 'Fijación de hechos controvertidos y apertura a prueba (arts. 46-47 CPCA).',
        documentos: [
          {
            tipo:   'citacion_audiencia_preliminar_ca',
            nombre: 'Citación a audiencia preliminar (art. 46 CPCA)',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'fecha_audiencia', label: 'Fecha de la audiencia', type: 'date', required: true },
              { key: 'hora_audiencia',  label: 'Hora (HH:MM)', type: 'time', required: false, default: '09:00' },
              { key: 'sala',            label: 'Sala / despacho (opcional)', type: 'text', required: false },
              { key: 'objeto_audiencia', label: 'Objeto de la audiencia', type: 'textarea', required: false,
                default: 'fijación de hechos controvertidos, saneamiento y ofrecimiento de prueba' },
            ],
          },
          {
            tipo:   'apertura_prueba_ca',
            nombre: 'Decreto de apertura a prueba (art. 47 CPCA)',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'plazo_dias',          label: 'Plazo de prueba (días hábiles)', type: 'number', required: false, default: 40 },
              { key: 'fecha_inicio_prueba', label: 'Fecha de inicio', type: 'date', required: true },
              { key: 'prueba_admitida',     label: 'Prueba admitida', type: 'multi_prueba', required: false },
            ],
          },
        ],
      },
      {
        id:     'sentencia',
        nombre: 'Llamamiento de autos',
        orden:  5,
        descripcion: 'Decreto de llamamiento de autos para sentencia (art. 51 CPCA).',
        documentos: [
          {
            tipo:   'llamamiento_autos_ca',
            nombre: 'Decreto de llamamiento de autos para sentencia',
            fixed:  (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'etapa', label: 'Etapa', type: 'select', required: false,
                default: 'sentencia_definitiva',
                options: [
                  { value: 'sentencia_definitiva',   label: 'Sentencia definitiva' },
                  { value: 'resolucion_incidente',   label: 'Resolución de incidente' },
                  { value: 'otro',                   label: 'Otro' },
                ]},
              { key: 'vencio_prueba',        label: '¿Venció el período de prueba?', type: 'select', required: false,
                default: true,
                options: [{ value: true, label: 'Sí' }, { value: false, label: 'No' }] },
              { key: 'presentaron_alegatos', label: '¿Las partes presentaron alegatos?', type: 'select', required: false,
                default: false,
                options: [{ value: true, label: 'Sí' }, { value: false, label: 'No' }] },
            ],
          },
        ],
      },
    ],
  },
]
