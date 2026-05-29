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

/**
 * Construye el bloque identificacion desde el caso.
 * El fuero se incluye desde cd.fuero (seteado en NuevoCasoForm al crear el caso).
 * Nombres de campo exactos que espera IdentificacionExpediente en Pydantic.
 */
const ident = (cd) => ({
  numero:     cd.expediente,
  caratula:   cd.caratula,
  fuero:      cd.fuero || 'civil_comercial',
  juzgado:    cd.juzgado?.nombre    || 'Juzgado',
  secretaria: cd.juzgado?.secretaria || null,
  ciudad:     cd.juzgado?.ciudad    || 'Córdoba',
})

/**
 * Convierte el objeto de partes {rol: {nombre, cuit, domicilio, letrado}}
 * a la lista [{rol, nombre, dni_cuit, domicilio_constituido, letrado}]
 * que espera list[Parte] en Pydantic.
 */
const partes = (cd) => {
  const obj = cd.partes || {}
  return Object.entries(obj).map(([rol, p]) => ({
    rol,
    nombre: p.nombre || '',
    ...(p.cuit     ? { dni_cuit: p.cuit }                         : {}),
    ...(p.domicilio ? { domicilio_constituido: p.domicilio }       : {}),
    ...(p.letrado  ? { letrado: { nombre: p.letrado } }           : {}),
  }))
}

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

  // ─── EJECUTIVO CIVIL ──────────────────────────────────────────────────────
  {
    id:     'ejecutivo_civil',
    nombre: 'Civil — Ejecutivo',
    fuero:  'civil_comercial',
    icono:  '💰',
    color:  '#1b5e20',
    bg:     '#f1f8e9',
    roles_partes: ['actor', 'demandado'],
    campos_caso: [
      { key: 'titulo_ejecutivo', label: 'Título ejecutivo', type: 'text',
        placeholder: 'Ej: pagaré, cheque, sentencia firme, escritura hipotecaria…' },
    ],
    etapas: [
      {
        id: 'admision_ejecutiva', nombre: 'Admisión y mandamiento', orden: 1,
        descripcion: 'Apertura del proceso ejecutivo e intimación de pago.',
        documentos: [
          {
            tipo: 'admision_ejecutivo', nombre: 'Auto de apertura del proceso ejecutivo',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'monto_reclamado',    label: 'Monto reclamado ($)', type: 'number', required: true },
              { key: 'titulo_ejecutivo',   label: 'Título ejecutivo', type: 'text', required: true,
                placeholder: 'Ej: pagaré de fecha…' },
              { key: 'plazo_pago_dias',    label: 'Plazo para pagar (días hábiles)', type: 'number', required: false, default: 3 },
            ],
          },
          {
            tipo: 'intimacion_pago', nombre: 'Intimación de pago',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'monto_intimado',   label: 'Monto intimado ($)', type: 'number', required: true },
              { key: 'plazo_pago_dias',  label: 'Plazo (días hábiles)', type: 'number', required: false, default: 3 },
            ],
          },
        ],
      },
      {
        id: 'cautelar_ejecutiva', nombre: 'Embargo', orden: 2,
        descripcion: 'Traba del embargo y mandamiento de pago.',
        documentos: [
          {
            tipo: 'embargo_preventivo', nombre: 'Embargo (bienes del deudor)',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'monto_embargo',      label: 'Monto del embargo ($)', type: 'number', required: true },
              { key: 'bienes_embargados',  label: 'Bienes embargados', type: 'textarea', required: true,
                placeholder: 'Ej: cuentas bancarias del demandado en todas las entidades financieras del país' },
              { key: 'contracautela',      label: 'Contracautela (opcional)', type: 'text', required: false },
            ],
          },
          {
            tipo: 'mandamiento_pago', nombre: 'Mandamiento de pago y embargo',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'monto_mandamiento', label: 'Monto ($)', type: 'number', required: true },
              { key: 'bienes_afectados',  label: 'Bienes afectados (opcional)', type: 'textarea', required: false },
            ],
          },
        ],
      },
      {
        id: 'prueba_ejecutiva', nombre: 'Prueba (si hay excepciones)', orden: 3,
        descripcion: 'Apertura a prueba si el ejecutado opuso excepciones.',
        documentos: [
          {
            tipo: 'auto_apertura_prueba', nombre: 'Auto de apertura a prueba (ejecutivo)',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'plazo_dias',          label: 'Plazo (días hábiles)', type: 'number', required: false, default: 20 },
              { key: 'fecha_inicio_prueba', label: 'Fecha de inicio', type: 'date', required: true },
              { key: 'prueba_admitida',     label: 'Prueba admitida', type: 'multi_prueba', required: false },
            ],
          },
        ],
      },
      {
        id: 'ejecucion_sentencia', nombre: 'Ejecución de sentencia', orden: 4,
        descripcion: 'Intimación de pago de la condena y ejecución forzada.',
        documentos: [
          {
            tipo: 'intimacion_cumplimiento_sentencia', nombre: 'Intimación de pago de sentencia',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'plazo_dias',            label: 'Plazo (días hábiles)', type: 'number', required: false, default: 5 },
              { key: 'tipo_obligacion',        label: 'Tipo de obligación', type: 'select', required: false,
                default: 'dar_dinero',
                options: [
                  { value: 'dar_dinero', label: 'Pagar suma de dinero' },
                  { value: 'dar_cosa',   label: 'Entregar bien' },
                  { value: 'hacer',      label: 'Ejecutar conducta' },
                  { value: 'no_hacer',   label: 'Abstenerse' },
                ]},
              { key: 'descripcion_obligacion', label: 'Descripción (opcional)', type: 'text', required: false },
            ],
          },
        ],
      },
    ],
  },

  // ─── SUCESORIO ────────────────────────────────────────────────────────────
  {
    id:     'sucesorio',
    nombre: 'Civil — Sucesorio',
    fuero:  'civil_comercial',
    icono:  '🏠',
    color:  '#4527a0',
    bg:     '#ede7f6',
    roles_partes: ['actor'],
    campos_caso: [
      { key: 'causante', label: 'Nombre del causante', type: 'text',
        placeholder: 'Ej: Juan Carlos Pérez' },
    ],
    etapas: [
      {
        id: 'apertura', nombre: 'Apertura del sucesorio', orden: 1,
        descripcion: 'Auto de apertura del proceso sucesorio y citación.',
        documentos: [
          {
            tipo: 'apertura_sucesorio', nombre: 'Auto de apertura del proceso sucesorio',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'nombre_causante',   label: 'Nombre completo del causante', type: 'text', required: true },
              { key: 'fecha_fallecimiento', label: 'Fecha de fallecimiento', type: 'date', required: true },
              { key: 'tipo_sucesion',     label: 'Tipo de sucesión', type: 'select', required: false,
                default: 'intestada',
                options: [
                  { value: 'intestada',  label: 'Intestada (ab intestato)' },
                  { value: 'testamentaria', label: 'Testamentaria' },
                ]},
            ],
          },
          {
            tipo: 'citacion_herederos_acreedores', nombre: 'Citación de herederos y acreedores (edictos)',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'nombre_causante',   label: 'Nombre del causante', type: 'text', required: true },
              { key: 'plazo_edictos_dias', label: 'Plazo de publicación de edictos (días)', type: 'number', required: false, default: 5 },
            ],
          },
        ],
      },
      {
        id: 'declaratoria', nombre: 'Declaratoria de herederos', orden: 2,
        descripcion: 'Auto de declaratoria de herederos.',
        documentos: [
          {
            tipo: 'declaratoria_herederos', nombre: 'Auto de declaratoria de herederos',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'nombre_causante', label: 'Nombre del causante', type: 'text', required: true },
              { key: 'herederos',       label: 'Herederos declarados (uno por línea)', type: 'textarea_list', required: true,
                placeholder: 'Pérez, María Elena\nPérez, Luis Carlos' },
            ],
          },
        ],
      },
      {
        id: 'inventario', nombre: 'Inventario y avalúo', orden: 3,
        descripcion: 'Aprobación del inventario y avalúo del acervo hereditario.',
        documentos: [
          {
            tipo: 'aprobacion_inventario_avaluo', nombre: 'Decreto de aprobación de inventario y avalúo',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'valor_total_acervo', label: 'Valor total del acervo ($)', type: 'number', required: true },
              { key: 'descripcion_bienes', label: 'Descripción de los bienes (opcional)', type: 'textarea', required: false },
            ],
          },
        ],
      },
    ],
  },

  // ─── CONCURSAL ────────────────────────────────────────────────────────────
  {
    id:     'concursal',
    nombre: 'Concursal — Concurso preventivo',
    fuero:  'concursal',
    icono:  '🏢',
    color:  '#bf360c',
    bg:     '#fbe9e7',
    roles_partes: ['concursado'],
    campos_caso: [
      { key: 'actividad_concursado', label: 'Actividad / rubro del concursado', type: 'text',
        placeholder: 'Ej: comercio minorista, industria textil, prestación de servicios…' },
    ],
    etapas: [
      {
        id: 'apertura_concurso', nombre: 'Apertura del concurso', orden: 1,
        descripcion: 'Auto de apertura del concurso preventivo (art. 14 LCQ).',
        documentos: [
          {
            tipo: 'auto_apertura_concurso', nombre: 'Auto de apertura del concurso preventivo',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'monto_pasivo_denunciado', label: 'Pasivo denunciado ($)', type: 'number', required: false },
              { key: 'plazo_verificacion_dias', label: 'Plazo para verificar créditos (días hábiles)', type: 'number', required: false, default: 60 },
            ],
          },
          {
            tipo: 'designacion_sindico', nombre: 'Designación del síndico',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'nombre_sindico',     label: 'Nombre del síndico designado', type: 'text', required: true },
              { key: 'tipo_sindico',       label: 'Tipo', type: 'select', required: false,
                default: 'contador',
                options: [
                  { value: 'contador',   label: 'Contador público' },
                  { value: 'abogado',    label: 'Abogado' },
                  { value: 'estudio',    label: 'Estudio profesional' },
                ]},
            ],
          },
        ],
      },
      {
        id: 'verificacion', nombre: 'Verificación de créditos', orden: 2,
        descripcion: 'Citación de acreedores para verificar créditos.',
        documentos: [
          {
            tipo: 'citacion_acreedores_edicto', nombre: 'Citación de acreedores por edictos',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'fecha_limite_verificacion', label: 'Fecha límite para verificar', type: 'date', required: true },
              { key: 'domicilio_sindico',          label: 'Domicilio del síndico', type: 'text', required: false },
            ],
          },
          {
            tipo: 'verificacion_creditos', nombre: 'Auto de verificación de créditos',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'total_verificado',    label: 'Total verificado ($)', type: 'number', required: false },
              { key: 'cantidad_acreedores', label: 'Cantidad de acreedores verificados', type: 'number', required: false },
            ],
          },
        ],
      },
      {
        id: 'exclusividad', nombre: 'Período de exclusividad', orden: 3,
        descripcion: 'Fijación del período de exclusividad para negociar el acuerdo.',
        documentos: [
          {
            tipo: 'periodo_exclusividad', nombre: 'Decreto de período de exclusividad',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'fecha_inicio_exclusividad', label: 'Fecha de inicio', type: 'date', required: true },
              { key: 'plazo_dias',                label: 'Plazo (días hábiles)', type: 'number', required: false, default: 90 },
            ],
          },
        ],
      },
      {
        id: 'homologacion_concursal', nombre: 'Homologación del acuerdo', orden: 4,
        descripcion: 'Auto de homologación del acuerdo preventivo.',
        documentos: [
          {
            tipo: 'homologacion_acuerdo_concursal', nombre: 'Auto de homologación del acuerdo preventivo',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'descripcion_acuerdo', label: 'Descripción del acuerdo homologado', type: 'textarea', required: true,
                placeholder: 'Ej: quita del 40%, espera de 5 años en 10 cuotas semestrales…' },
              { key: 'mayoria_obtenida',    label: 'Mayoría obtenida', type: 'text', required: false,
                placeholder: 'Ej: 75% del capital quirografario' },
            ],
          },
        ],
      },
    ],
  },

  // ─── VIOLENCIA FAMILIAR ───────────────────────────────────────────────────
  {
    id:     'violencia_familiar',
    nombre: 'Violencia Familiar (Ley 9283)',
    fuero:  'violencia_familiar',
    icono:  '🛡️',
    color:  '#880e4f',
    bg:     '#fce4ec',
    roles_partes: ['requirente', 'requerido'],
    campos_caso: [
      { key: 'descripcion_hechos', label: 'Hechos denunciados (breve resumen)', type: 'textarea',
        placeholder: 'Ej: violencia física y psicológica reiterada en el ámbito doméstico…' },
    ],
    etapas: [
      {
        id: 'medidas_urgentes', nombre: 'Medidas urgentes de protección', orden: 1,
        descripcion: 'Auto de medidas urgentes de protección (art. 26 Ley 9283).',
        documentos: [
          {
            tipo: 'medidas_urgentes_vf', nombre: 'Auto de medidas urgentes de protección',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'medidas_dispuestas', label: 'Medidas dispuestas (una por línea)', type: 'textarea_list', required: true,
                placeholder: 'Exclusión del hogar del requerido\nProhibición de acercamiento a menos de 300 metros' },
              { key: 'plazo_medidas_dias', label: 'Plazo de las medidas (días)', type: 'number', required: false, default: 90 },
            ],
          },
          {
            tipo: 'oficio_policia_vf', nombre: 'Oficio a la policía (custodia / control)',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'domicilio_victima',   label: 'Domicilio de la víctima', type: 'text', required: true },
              { key: 'instrucciones',       label: 'Instrucciones al personal policial', type: 'textarea', required: false,
                placeholder: 'Ej: hacer efectiva la exclusión del hogar; brindar custodia policial…' },
            ],
          },
        ],
      },
      {
        id: 'audiencia_vf', nombre: 'Audiencia de seguimiento', orden: 2,
        descripcion: 'Citación a audiencia de seguimiento de medidas.',
        documentos: [
          {
            tipo: 'citacion_audiencia_vf', nombre: 'Citación a audiencia (art. 26 Ley 9283)',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'fecha_audiencia', label: 'Fecha de la audiencia', type: 'date', required: true },
              { key: 'hora_audiencia',  label: 'Hora (HH:MM)', type: 'time', required: false, default: '09:00' },
            ],
          },
        ],
      },
      {
        id: 'seguimiento_vf', nombre: 'Prórroga o cese de medidas', orden: 3,
        descripcion: 'Prórroga de las medidas de protección o cese.',
        documentos: [
          {
            tipo: 'prorroga_medidas_vf', nombre: 'Auto de prórroga de medidas de protección',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'plazo_prorroga_dias', label: 'Plazo de la prórroga (días)', type: 'number', required: false, default: 90 },
              { key: 'motivo_prorroga',     label: 'Fundamento de la prórroga', type: 'textarea', required: false,
                placeholder: 'Ej: subsiste el riesgo para la víctima según informe…' },
            ],
          },
          {
            tipo: 'cese_medidas_vf', nombre: 'Auto de cese de medidas',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'motivo_cese', label: 'Motivo del cese', type: 'textarea', required: true,
                placeholder: 'Ej: desaparición del riesgo, acuerdo de partes, vencimiento del plazo…' },
            ],
          },
        ],
      },
    ],
  },

  // ─── NIÑEZ Y ADOLESCENCIA ─────────────────────────────────────────────────
  {
    id:     'ninez_adolescencia',
    nombre: 'Niñez y Adolescencia (Ley 9944)',
    fuero:  'ninez',
    icono:  '👶',
    color:  '#0277bd',
    bg:     '#e1f5fe',
    roles_partes: ['progenitor', 'menor'],
    campos_caso: [
      { key: 'descripcion_situacion', label: 'Descripción de la situación', type: 'textarea',
        placeholder: 'Ej: niño en situación de vulnerabilidad, sin cuidados parentales adecuados…' },
    ],
    etapas: [
      {
        id: 'medida_excepcional', nombre: 'Medida excepcional', orden: 1,
        descripcion: 'Adopción de medida de abrigo o excepcional (art. 52 Ley 9944).',
        documentos: [
          {
            tipo: 'auto_medida_abrigo', nombre: 'Auto de medida de abrigo',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'nombre_nna',         label: 'Nombre del NNA', type: 'text', required: true },
              { key: 'edad_nna',           label: 'Edad', type: 'text', required: false },
              { key: 'lugar_alojamiento',  label: 'Lugar de alojamiento dispuesto', type: 'text', required: true,
                placeholder: 'Ej: hogar convivencial del SENAF, familia ampliada…' },
              { key: 'plazo_medida_dias',  label: 'Plazo de la medida (días)', type: 'number', required: false, default: 90 },
            ],
          },
          {
            tipo: 'notificacion_senaf', nombre: 'Notificación al SENAF',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'nombre_nna',    label: 'Nombre del NNA', type: 'text', required: true },
              { key: 'motivo',        label: 'Motivo de la notificación', type: 'textarea', required: true,
                placeholder: 'Ej: adopción de medida de abrigo; solicitud de informe…' },
            ],
          },
        ],
      },
      {
        id: 'control_legalidad', nombre: 'Control de legalidad', orden: 2,
        descripcion: 'Auto de control de legalidad de la medida excepcional.',
        documentos: [
          {
            tipo: 'control_legalidad_nna', nombre: 'Auto de control de legalidad',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'nombre_nna',         label: 'Nombre del NNA', type: 'text', required: true },
              { key: 'tipo_medida',        label: 'Tipo de medida controlada', type: 'text', required: true,
                placeholder: 'Ej: medida de abrigo, internación en salud mental…' },
              { key: 'resultado_control',  label: 'Resultado del control', type: 'select', required: false,
                default: 'confirma',
                options: [
                  { value: 'confirma',  label: 'Confirma la medida' },
                  { value: 'revoca',    label: 'Revoca la medida' },
                  { value: 'modifica',  label: 'Modifica la medida' },
                ]},
            ],
          },
        ],
      },
      {
        id: 'seguimiento_nna', nombre: 'Seguimiento', orden: 3,
        descripcion: 'Prórroga, citación de seguimiento o reintegro familiar.',
        documentos: [
          {
            tipo: 'prorroga_medida_nna', nombre: 'Prórroga de medida excepcional',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'nombre_nna',         label: 'Nombre del NNA', type: 'text', required: true },
              { key: 'plazo_prorroga_dias', label: 'Plazo de prórroga (días)', type: 'number', required: false, default: 90 },
              { key: 'motivo_prorroga',     label: 'Motivo', type: 'textarea', required: false },
            ],
          },
          {
            tipo: 'citacion_seguimiento_nna', nombre: 'Citación a audiencia de seguimiento',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'fecha_audiencia', label: 'Fecha', type: 'date', required: true },
              { key: 'hora_audiencia',  label: 'Hora (HH:MM)', type: 'time', required: false, default: '09:00' },
              { key: 'nombre_nna',      label: 'Nombre del NNA', type: 'text', required: false },
            ],
          },
          {
            tipo: 'auto_reintegro_familiar', nombre: 'Auto de reintegro familiar',
            fixed: (cd) => ({ identificacion: ident(cd), partes: partes(cd) }),
            campos_extra: [
              { key: 'nombre_nna',     label: 'Nombre del NNA', type: 'text', required: true },
              { key: 'motivo_reintegro', label: 'Fundamento del reintegro', type: 'textarea', required: true,
                placeholder: 'Ej: superación de la situación de vulnerabilidad, informe positivo del SENAF…' },
            ],
          },
        ],
      },
    ],
  },

]
