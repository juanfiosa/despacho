/**
 * Campos específicos según el tipo de documento seleccionado.
 * Recibe `tipo` y `valores`, emite cambios con `onChange`.
 */

const TASAS = [
  { value: 'BNA_ACTIVA',  label: 'Tasa activa BNA' },
  { value: 'BNA_PASIVA',  label: 'Tasa pasiva BNA' },
  { value: 'BCRA_PASIVA', label: 'Tasa pasiva BCRA' },
  { value: 'OTRA',        label: 'Otra (especificar)' },
]

const TIPOS_PRUEBA = [
  { value: 'documental',              label: 'Documental' },
  { value: 'testimonial',             label: 'Testimonial' },
  { value: 'pericial',                label: 'Pericial' },
  { value: 'informativa',             label: 'Informativa' },
  { value: 'confesional',             label: 'Confesional / Absolución de posiciones' },
  { value: 'reconocimiento_judicial', label: 'Reconocimiento judicial' },
]

const TIPOS_DECRETO = [
  { value: 'traslado',           label: 'Traslado' },
  { value: 'vista',              label: 'Vista' },
  { value: 'llamamiento_autos',  label: 'Llamamiento de autos' },
  { value: 'autos_para_resolver',label: 'Autos para resolver' },
  { value: 'notificacion',       label: 'Notificación' },
  { value: 'otro',               label: 'Otro (especificar)' },
]

const TIPOS_TRASLADO = [
  { value: 'demanda',      label: 'Traslado de demanda (art. 176 CPCC)' },
  { value: 'contestacion', label: 'Por contestada la demanda (art. 192 CPCC)' },
  { value: 'reconvencion', label: 'Traslado de reconvención (art. 192 CPCC)' },
]

export default function CamposDocumento({ tipo, valores, onChange }) {
  const set = (campo, val) => onChange(v => ({ ...v, [campo]: val }))
  const togglePrueba = (lista, val) => {
    const arr = valores[lista] || []
    set(lista, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  return (
    <div>

      {/* ── Admisión ejecutivo ── */}
      {tipo === 'admision_ejecutivo' && <>
        <Seccion titulo="Título ejecutivo">
          <Campo label="Tipo de título ejecutivo"
            placeholder="pagaré / cheque / hipoteca / sentencia firme"
            value={valores.titulo_ejecutivo || ''} onChange={v => set('titulo_ejecutivo', v)} />
          <Campo label="Objeto del proceso" placeholder="cobro de pesos"
            value={valores.objeto || ''} onChange={v => set('objeto', v)} />
        </Seccion>
        <Seccion titulo="Decreto">
          <CheckField label="Librar mandamiento de intimación y embargo en el mismo acto"
            checked={valores.librar_mandamiento !== false} onChange={v => set('librar_mandamiento', v)} />
        </Seccion>
      </>}

      {/* ── Prórroga medida NNA ── */}
      {tipo === 'prorroga_medida_nna' && <>
        <Seccion titulo="NNyA involucrado/a">
          <Grilla>
            <Campo label="Nombre completo del/la NNyA"
              value={valores.nombre_nnya || ''} onChange={v => set('nombre_nnya', v)} />
            <Campo label="Edad (años, opcional)" type="number"
              value={valores.edad_nnya || ''} onChange={v => set('edad_nnya', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Medida a prorrogar">
          <Campo label="Organismo administrativo"
            placeholder="la Secretaría de Niñez, Adolescencia y Familia"
            value={valores.organismo_administrativo || ''} onChange={v => set('organismo_administrativo', v)} />
          <Campo label="Descripción de la medida"
            placeholder="inclusión transitoria en familia alternativa / hogar convivencial"
            value={valores.medida_adoptada || ''} onChange={v => set('medida_adoptada', v)} />
          <Campo label="Fundamento de la prórroga"
            placeholder="no han variado sustancialmente las circunstancias que motivaron la medida"
            value={valores.motivo_prorroga || ''} onChange={v => set('motivo_prorroga', v)} />
          <Campo label="Días de prórroga" type="number" placeholder="30"
            value={valores.plazo_prorroga_dias || ''} onChange={v => set('plazo_prorroga_dias', v)} />
        </Seccion>
      </>}

      {/* ── Cese medida NNA ── */}
      {tipo === 'cese_medida_nna' && <>
        <Seccion titulo="NNyA involucrado/a">
          <Grilla>
            <Campo label="Nombre completo del/la NNyA"
              value={valores.nombre_nnya || ''} onChange={v => set('nombre_nnya', v)} />
            <Campo label="Edad (años, opcional)" type="number"
              value={valores.edad_nnya || ''} onChange={v => set('edad_nnya', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Medida que cesa">
          <Campo label="Organismo administrativo"
            placeholder="la Secretaría de Niñez, Adolescencia y Familia"
            value={valores.organismo_administrativo || ''} onChange={v => set('organismo_administrativo', v)} />
          <Campo label="Descripción de la medida"
            placeholder="inclusión transitoria en familia alternativa / hogar convivencial"
            value={valores.medida_adoptada || ''} onChange={v => set('medida_adoptada', v)} />
          <Campo label="Motivo del cese"
            placeholder="han cesado las circunstancias que motivaron la medida / reintegro al grupo familiar"
            value={valores.motivo_cese || ''} onChange={v => set('motivo_cese', v)} />
        </Seccion>
      </>}

      {/* ── Intimación de pago ── */}
      {tipo === 'intimacion_pago' && <>
        <Seccion titulo="Datos económicos">
          <Grilla>
            <Campo label="Capital ($)" type="number" placeholder="150000"
              value={valores.capital || ''} onChange={v => set('capital', v)} />
            <Campo label="Fecha de mora" type="date"
              value={valores.fecha_mora || ''} onChange={v => set('fecha_mora', v)} />
          </Grilla>
          <SelectField label="Tasa de interés" opciones={TASAS}
            value={valores.tasa || 'BNA_ACTIVA'} onChange={v => set('tasa', v)} />
          {valores.tasa === 'OTRA' &&
            <Campo label="Descripción de la tasa" placeholder="ej: tasa activa Banco de Córdoba"
              value={valores.tasa_descripcion || ''} onChange={v => set('tasa_descripcion', v)} />
          }
          <Grilla>
            <Campo label="Plazo de pago (días hábiles)" type="number" placeholder="5"
              value={valores.plazo_dias || ''} onChange={v => set('plazo_dias', v)} />
            <CheckField label="Imponer costas al demandado"
              checked={valores.costas !== false} onChange={v => set('costas', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Lugar">
          <Campo label="Domicilio de intimación" placeholder="Av. Colón 123, Córdoba"
            value={valores.domicilio_intimacion || ''} onChange={v => set('domicilio_intimacion', v)} />
        </Seccion>
      </>}

      {/* ── Mandamiento de pago ── */}
      {tipo === 'mandamiento_pago' && <>
        <Seccion titulo="Datos económicos">
          <Grilla>
            <Campo label="Capital ($)" type="number" placeholder="150000"
              value={valores.capital || ''} onChange={v => set('capital', v)} />
            <Campo label="Fecha de mora" type="date"
              value={valores.fecha_mora || ''} onChange={v => set('fecha_mora', v)} />
          </Grilla>
          <SelectField label="Tasa de interés" opciones={TASAS}
            value={valores.tasa || 'BNA_ACTIVA'} onChange={v => set('tasa', v)} />
          {valores.tasa === 'OTRA' &&
            <Campo label="Descripción de la tasa"
              value={valores.tasa_descripcion || ''} onChange={v => set('tasa_descripcion', v)} />
          }
          <Grilla>
            <Campo label="Plazo de pago (días hábiles)" type="number" placeholder="5"
              value={valores.plazo_dias || ''} onChange={v => set('plazo_dias', v)} />
            <CheckField label="Imponer costas"
              checked={valores.costas !== false} onChange={v => set('costas', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Diligenciamiento">
          <Campo label="Domicilio de diligenciamiento"
            value={valores.domicilio_diligenciamiento || ''} onChange={v => set('domicilio_diligenciamiento', v)} />
          <Campo label="Bienes a embargar (opcional — vacío = embargo genérico)"
            value={valores.bienes_a_embargar || ''} onChange={v => set('bienes_a_embargar', v)} />
        </Seccion>
      </>}

      {/* ── Auto de apertura a prueba ── */}
      {tipo === 'auto_apertura_prueba' && <>
        <Seccion titulo="Período probatorio">
          <Grilla>
            <Campo label="Plazo (días hábiles)" type="number" placeholder="40"
              value={valores.plazo_dias || ''} onChange={v => set('plazo_dias', v)} />
            <Campo label="Fecha de inicio del período" type="date"
              value={valores.fecha_inicio_prueba || ''} onChange={v => set('fecha_inicio_prueba', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Prueba admitida">
          {TIPOS_PRUEBA.map(p => (
            <CheckItem key={p.value} label={p.label}
              checked={(valores.prueba_admitida || []).includes(p.value)}
              onChange={() => togglePrueba('prueba_admitida', p.value)} />
          ))}
        </Seccion>
        <Seccion titulo="Prueba rechazada (opcional)">
          {TIPOS_PRUEBA.map(p => (
            <CheckItem key={p.value} label={p.label}
              checked={(valores.prueba_rechazada || []).includes(p.value)}
              onChange={() => togglePrueba('prueba_rechazada', p.value)} />
          ))}
          {(valores.prueba_rechazada || []).length > 0 &&
            <Campo label="Fundamento del rechazo"
              value={valores.fundamento_rechazo || ''} onChange={v => set('fundamento_rechazo', v)} />
          }
        </Seccion>
      </>}

      {/* ── Traslado de demanda (ordinario) ── */}
      {tipo === 'traslado_demanda' && <>
        <Seccion titulo="Tipo de proveído">
          <SelectField label="Tipo" opciones={TIPOS_TRASLADO}
            value={valores.tipo_traslado || 'demanda'} onChange={v => set('tipo_traslado', v)} />
          {(valores.tipo_traslado || 'demanda') === 'demanda' &&
            <Campo label="Objeto del proceso"
              placeholder="daños y perjuicios derivados de accidente de tránsito"
              value={valores.objeto || ''} onChange={v => set('objeto', v)} />
          }
          {(valores.tipo_traslado || 'demanda') !== 'contestacion' &&
            <Campo label="Plazo (días hábiles)" type="number" placeholder="30"
              value={valores.plazo_dias || ''} onChange={v => set('plazo_dias', v)} />
          }
        </Seccion>
      </>}

      {/* ── Auto apertura prueba ordinario ── */}
      {tipo === 'auto_apertura_ordinario' && <>
        <Seccion titulo="Período probatorio">
          <Grilla>
            <Campo label="Plazo (días hábiles)" type="number" placeholder="40"
              value={valores.plazo_dias || ''} onChange={v => set('plazo_dias', v)} />
            <Campo label="Fecha de inicio del período" type="date"
              value={valores.fecha_inicio_prueba || ''} onChange={v => set('fecha_inicio_prueba', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Prueba admitida">
          {TIPOS_PRUEBA.map(p => (
            <CheckItem key={p.value} label={p.label}
              checked={(valores.prueba_admitida || []).includes(p.value)}
              onChange={() => togglePrueba('prueba_admitida', p.value)} />
          ))}
        </Seccion>
        <Seccion titulo="Prueba rechazada (opcional)">
          {TIPOS_PRUEBA.map(p => (
            <CheckItem key={p.value} label={p.label}
              checked={(valores.prueba_rechazada || []).includes(p.value)}
              onChange={() => togglePrueba('prueba_rechazada', p.value)} />
          ))}
          {(valores.prueba_rechazada || []).length > 0 &&
            <Campo label="Fundamento del rechazo"
              value={valores.fundamento_rechazo || ''} onChange={v => set('fundamento_rechazo', v)} />
          }
        </Seccion>
      </>}

      {/* ── Alimentos provisorios ── */}
      {tipo === 'alimentos_provisorios' && <>
        <Seccion titulo="Cuota alimentaria">
          <Campo label="Monto de la cuota ($)" type="number" placeholder="80000"
            value={valores.cuota || ''} onChange={v => set('cuota', v)} />
          <Grilla>
            <SelectField label="Periodicidad" opciones={[
              { value: 'mensual',    label: 'Mensual' },
              { value: 'quincenal', label: 'Quincenal' },
              { value: 'semanal',   label: 'Semanal' },
            ]} value={valores.periodicidad || 'mensual'} onChange={v => set('periodicidad', v)} />
            {(valores.periodicidad || 'mensual') === 'mensual' &&
              <Campo label="Día de vencimiento" type="number" placeholder="1"
                value={valores.dia_vencimiento || ''} onChange={v => set('dia_vencimiento', v)} />
            }
          </Grilla>
        </Seccion>
        <Seccion titulo="Forma de pago">
          <SelectField label="Modalidad" opciones={[
            { value: 'deposito_judicial',    label: 'Depósito judicial' },
            { value: 'transferencia_bancaria', label: 'Transferencia bancaria' },
            { value: 'efectivo',             label: 'Efectivo con recibo' },
          ]} value={valores.forma_pago || 'deposito_judicial'} onChange={v => set('forma_pago', v)} />
          {valores.forma_pago === 'transferencia_bancaria' &&
            <Campo label="CBU / Alias bancario"
              placeholder="alias.del.alimentado o 0720XXX..."
              value={valores.cbu_alias || ''} onChange={v => set('cbu_alias', v)} />
          }
        </Seccion>
      </>}

      {/* ── Admisión laboral ── */}
      {tipo === 'admision_laboral' && <>
        <Seccion titulo="Objeto del reclamo">
          <Campo label="Objeto"
            placeholder="indemnización por despido injustificado, diferencias salariales y demás rubros"
            value={valores.objeto || ''} onChange={v => set('objeto', v)} />
        </Seccion>
        <Seccion titulo="Audiencia de conciliación">
          <Grilla>
            <Campo label="Fecha de la audiencia" type="date"
              value={valores.fecha_audiencia || ''} onChange={v => set('fecha_audiencia', v)} />
            <Campo label="Hora (HH:MM)" placeholder="10:00"
              value={valores.hora_audiencia || ''} onChange={v => set('hora_audiencia', v)} />
          </Grilla>
          <Campo label="Sala (opcional)" placeholder="Sala 3"
            value={valores.sala || ''} onChange={v => set('sala', v)} />
        </Seccion>
      </>}

      {/* ── Declaración de quiebra ── */}
      {tipo === 'declaracion_quiebra' && <>
        <Seccion titulo="Síndico designado">
          <Grilla>
            <Campo label="Nombre del síndico" placeholder="Contador/a Ana Torres"
              value={valores.sindico_nombre || ''} onChange={v => set('sindico_nombre', v)} />
            <Campo label="Matrícula (opcional)" placeholder="CPCE 4521"
              value={valores.sindico_matricula || ''} onChange={v => set('sindico_matricula', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Tipo de quiebra">
          <SelectField label="Tipo" opciones={[
            { value: 'voluntaria', label: 'Voluntaria (pedida por el deudor)' },
            { value: 'necesaria',  label: 'Necesaria (pedida por acreedor)' },
          ]} value={valores.tipo_quiebra || 'voluntaria'} onChange={v => set('tipo_quiebra', v)} />
        </Seccion>
        <Seccion titulo="Período informativo">
          <Grilla>
            <Campo label="Límite de verificación (art. 32)" type="date"
              value={valores.fecha_limite_verificacion || ''} onChange={v => set('fecha_limite_verificacion', v)} />
            <Campo label="Informe individual (art. 35)" type="date"
              value={valores.fecha_informe_individual || ''} onChange={v => set('fecha_informe_individual', v)} />
          </Grilla>
          <Campo label="Informe general del síndico (art. 39)" type="date"
            value={valores.fecha_informe_general || ''} onChange={v => set('fecha_informe_general', v)} />
        </Seccion>
        <Seccion titulo="Medidas adicionales">
          <CheckField label="Clausura del establecimiento (art. 88 inc. 5)"
            checked={valores.clausura_establecimiento === true} onChange={v => set('clausura_establecimiento', v)} />
          <CheckField label="Inhabilitación del fallido (art. 238 LCQ)"
            checked={valores.inhabilitacion_fallido !== false} onChange={v => set('inhabilitacion_fallido', v)} />
        </Seccion>
      </>}

      {/* ── Fijación audiencia debate penal ── */}
      {tipo === 'fijacion_debate' && <>
        <Seccion titulo="Requerimiento">
          <Campo label="Nombre del/la fiscal"
            placeholder="Dr./Dra. Nombre Apellido"
            value={valores.fiscal_nombre || ''} onChange={v => set('fiscal_nombre', v)} />
          <Campo label="Calificación legal"
            placeholder="estafa reiterada, art. 172 CP"
            value={valores.calificacion_legal || ''} onChange={v => set('calificacion_legal', v)} />
        </Seccion>
        <Seccion titulo="Audiencia de debate">
          <Grilla>
            <Campo label="Fecha del debate" type="date"
              value={valores.fecha_debate || ''} onChange={v => set('fecha_debate', v)} />
            <Campo label="Hora (HH:MM)" placeholder="09:00"
              value={valores.hora_debate || ''} onChange={v => set('hora_debate', v)} />
          </Grilla>
          <Grilla>
            <Campo label="Sala / sede (opcional)" placeholder="Sala 3"
              value={valores.sala || ''} onChange={v => set('sala', v)} />
            <Campo label="Duración estimada (días, opcional)" type="number"
              value={valores.dias_duracion_estimada || ''} onChange={v => set('dias_duracion_estimada', v)} />
          </Grilla>
        </Seccion>
      </>}

      {/* ── Control legalidad niñez ── */}
      {tipo === 'control_legalidad_nna' && <>
        <Seccion titulo="NNyA involucrado/a">
          <Grilla>
            <Campo label="Nombre completo del/la NNyA"
              placeholder="Nombre y Apellido"
              value={valores.nombre_nnya || ''} onChange={v => set('nombre_nnya', v)} />
            <Campo label="Edad (años, opcional)" type="number"
              value={valores.edad_nnya || ''} onChange={v => set('edad_nnya', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Medida adoptada">
          <Campo label="Organismo administrativo"
            placeholder="la Secretaría de Niñez, Adolescencia y Familia"
            value={valores.organismo_administrativo || ''} onChange={v => set('organismo_administrativo', v)} />
          <Campo label="Descripción de la medida"
            placeholder="inclusión transitoria en familia alternativa / hogar convivencial"
            value={valores.medida_adoptada || ''} onChange={v => set('medida_adoptada', v)} />
          <Grilla>
            <Campo label="Fecha de la medida administrativa" type="date"
              value={valores.fecha_medida_administrativa || ''} onChange={v => set('fecha_medida_administrativa', v)} />
            <Campo label="Plazo de revisión (días corridos)" type="number" placeholder="30"
              value={valores.plazo_revision_dias || ''} onChange={v => set('plazo_revision_dias', v)} />
          </Grilla>
        </Seccion>
      </>}

      {/* ── Auto apertura prueba laboral ── */}
      {tipo === 'auto_apertura_laboral' && <>
        <Seccion titulo="Período probatorio">
          <Grilla>
            <Campo label="Plazo (días hábiles)" type="number" placeholder="40"
              value={valores.plazo_dias || ''} onChange={v => set('plazo_dias', v)} />
            <Campo label="Fecha de inicio del período" type="date"
              value={valores.fecha_inicio_prueba || ''} onChange={v => set('fecha_inicio_prueba', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Prueba admitida">
          {TIPOS_PRUEBA.map(p => (
            <CheckItem key={p.value} label={p.label}
              checked={(valores.prueba_admitida || []).includes(p.value)}
              onChange={() => togglePrueba('prueba_admitida', p.value)} />
          ))}
        </Seccion>
        <Seccion titulo="Prueba rechazada (opcional)">
          {TIPOS_PRUEBA.map(p => (
            <CheckItem key={p.value} label={p.label}
              checked={(valores.prueba_rechazada || []).includes(p.value)}
              onChange={() => togglePrueba('prueba_rechazada', p.value)} />
          ))}
          {(valores.prueba_rechazada || []).length > 0 &&
            <Campo label="Fundamento del rechazo"
              value={valores.fundamento_rechazo || ''} onChange={v => set('fundamento_rechazo', v)} />
          }
        </Seccion>
      </>}

      {/* ── Auto apertura concurso preventivo ── */}
      {tipo === 'auto_apertura_concurso' && <>
        <Seccion titulo="Síndico designado">
          <Grilla>
            <Campo label="Nombre del síndico" placeholder="Contador/a Juan García"
              value={valores.sindico_nombre || ''} onChange={v => set('sindico_nombre', v)} />
            <Campo label="Matrícula (opcional)" placeholder="CPCE 12345"
              value={valores.sindico_matricula || ''} onChange={v => set('sindico_matricula', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Fechas del período informativo">
          <Grilla>
            <Campo label="Límite de verificación (art. 32)" type="date"
              value={valores.fecha_limite_verificacion || ''} onChange={v => set('fecha_limite_verificacion', v)} />
            <Campo label="Informe individual del síndico (art. 35)" type="date"
              value={valores.fecha_informe_individual || ''} onChange={v => set('fecha_informe_individual', v)} />
          </Grilla>
          <Grilla>
            <Campo label="Informe general del síndico (art. 39)" type="date"
              value={valores.fecha_informe_general || ''} onChange={v => set('fecha_informe_general', v)} />
            <Campo label="Audiencia informativa (art. 45)" type="date"
              value={valores.fecha_audiencia_informativa || ''} onChange={v => set('fecha_audiencia_informativa', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Medidas cautelares">
          <CheckField label="Inhibición general de bienes provisional"
            checked={valores.inhibicion_provisional !== false} onChange={v => set('inhibicion_provisional', v)} />
        </Seccion>
      </>}

      {/* ── Citación imputación penal ── */}
      {tipo === 'citacion_imputacion' && <>
        <Seccion titulo="Fiscalía requirente">
          <Campo label="Nombre del/la fiscal" placeholder="Dr./Dra. Nombre Apellido"
            value={valores.fiscal_nombre || ''} onChange={v => set('fiscal_nombre', v)} />
          <Campo label="Unidad Fiscal (opcional)" placeholder="Fiscalía de Instrucción N.° 4"
            value={valores.fiscal_unidad || ''} onChange={v => set('fiscal_unidad', v)} />
        </Seccion>
        <Seccion titulo="Hecho imputado">
          <Campo label="Descripción del hecho / calificación"
            placeholder="homicidio culposo en accidente de tránsito, art. 84 CP"
            value={valores.objeto_imputacion || ''} onChange={v => set('objeto_imputacion', v)} />
        </Seccion>
        <Seccion titulo="Fecha de comparecencia">
          <Grilla>
            <Campo label="Fecha" type="date"
              value={valores.fecha_citacion || ''} onChange={v => set('fecha_citacion', v)} />
            <Campo label="Hora (HH:MM)" placeholder="09:00"
              value={valores.hora_citacion || ''} onChange={v => set('hora_citacion', v)} />
          </Grilla>
        </Seccion>
      </>}

      {/* ── Auto elevación a juicio ── */}
      {tipo === 'auto_elevacion_juicio' && <>
        <Seccion titulo="Requerimiento fiscal">
          <Campo label="Nombre del/la fiscal"
            placeholder="Dr./Dra. Nombre Apellido"
            value={valores.fiscal_nombre || ''} onChange={v => set('fiscal_nombre', v)} />
          <Campo label="Calificación legal"
            placeholder="robo calificado, arts. 164 y 166 inc. 2 CP"
            value={valores.calificacion_legal || ''} onChange={v => set('calificacion_legal', v)} />
          <SelectField label="Tipo de juicio" opciones={[
            { value: 'oral',      label: 'Juicio oral y público' },
            { value: 'abreviado', label: 'Juicio abreviado' },
          ]} value={valores.tipo_juicio || 'oral'} onChange={v => set('tipo_juicio', v)} />
        </Seccion>
      </>}

      {/* ── Embargo preventivo ── */}
      {tipo === 'embargo_preventivo' && <>
        <Seccion titulo="Datos de la medida cautelar">
          <Campo label="Monto a cautelar ($)" type="number" placeholder="500000"
            value={valores.monto || ''} onChange={v => set('monto', v)} />
          <Campo label="Domicilio de diligenciamiento"
            placeholder="Av. Colón 123, Córdoba"
            value={valores.domicilio_diligenciamiento || ''} onChange={v => set('domicilio_diligenciamiento', v)} />
          <Campo label="Bienes a embargar (opcional — vacío = bienes en general)"
            placeholder="vehículo Renault Sandero, dominio ABC123"
            value={valores.bienes || ''} onChange={v => set('bienes', v)} />
        </Seccion>
      </>}

      {/* ── Inhibición general de bienes ── */}
      {tipo === 'inhibicion_general' && <>
        <Seccion titulo="Datos de la medida cautelar">
          <Campo label="Monto a cautelar ($)" type="number" placeholder="500000"
            value={valores.monto || ''} onChange={v => set('monto', v)} />
        </Seccion>
      </>}

      {/* ── Medidas urgentes VF ── */}
      {tipo === 'medidas_urgentes_vf' && <>
        <Seccion titulo="Medidas a dictar">
          <CheckField label="Exclusión del hogar familiar"
            checked={valores.exclusion_hogar !== false} onChange={v => set('exclusion_hogar', v)} />
          {valores.exclusion_hogar !== false &&
            <Campo label="Domicilio del hogar familiar"
              placeholder="Bv. San Juan 456, Córdoba"
              value={valores.domicilio_hogar || ''} onChange={v => set('domicilio_hogar', v)} />
          }
          <CheckField label="Restricción de acercamiento (perímetro)"
            checked={valores.restriccion_acercamiento !== false} onChange={v => set('restriccion_acercamiento', v)} />
          {valores.restriccion_acercamiento !== false &&
            <Campo label="Distancia mínima (metros)" type="number" placeholder="300"
              value={valores.metros_restriccion || ''} onChange={v => set('metros_restriccion', v)} />
          }
          <CheckField label="Prohibición de contacto (llamadas, mensajes, redes)"
            checked={valores.prohibicion_contacto !== false} onChange={v => set('prohibicion_contacto', v)} />
        </Seccion>
        <Seccion titulo="Vigencia">
          <Campo label="Duración de las medidas (días corridos)" type="number" placeholder="90"
            value={valores.plazo_dias || ''} onChange={v => set('plazo_dias', v)} />
        </Seccion>
      </>}

      {/* ── Auto apertura sucesorio ── */}
      {tipo === 'apertura_sucesorio' && <>
        <Seccion titulo="Datos del causante">
          <Campo label="Nombre del causante"
            placeholder="Juan Carlos García"
            value={valores.fallecido_nombre || ''} onChange={v => set('fallecido_nombre', v)} />
          <Grilla>
            <Campo label="Fecha de fallecimiento" type="date"
              value={valores.fallecido_fecha_muerte || ''} onChange={v => set('fallecido_fecha_muerte', v)} />
            <Campo label="Último domicilio"
              placeholder="Av. Colón 123, Córdoba"
              value={valores.fallecido_domicilio || ''} onChange={v => set('fallecido_domicilio', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Perito valuador">
          <Campo label="Nombre del perito valuador (opcional — vacío = a designar)"
            placeholder="Contador/a María López"
            value={valores.perito_valuador_nombre || ''} onChange={v => set('perito_valuador_nombre', v)} />
        </Seccion>
        <Seccion titulo="Publicación de edictos">
          <Campo label="Días de publicación de edictos (art. 2340 CCyCN)" type="number" placeholder="5"
            value={valores.dias_edictos || ''} onChange={v => set('dias_edictos', v)} />
          <CheckField label="Inventario judicial (art. 2341 CCyCN)"
            checked={valores.inventario_judicial === true} onChange={v => set('inventario_judicial', v)} />
        </Seccion>
      </>}

      {/* ── Sumarísimo — Citación a audiencia ── */}
      {tipo === 'sumarisimo_citacion' && <>
        <Seccion titulo="Objeto del proceso">
          <Campo label="Objeto"
            placeholder="desalojo por falta de pago / daños y perjuicios"
            value={valores.objeto || ''} onChange={v => set('objeto', v)} />
          <Campo label="Plazo para contestar (días hábiles)" type="number" placeholder="3"
            value={valores.plazo_contestacion_dias || ''} onChange={v => set('plazo_contestacion_dias', v)} />
        </Seccion>
        <Seccion titulo="Audiencia">
          <Grilla>
            <Campo label="Fecha de la audiencia" type="date"
              value={valores.fecha_audiencia || ''} onChange={v => set('fecha_audiencia', v)} />
            <Campo label="Hora (HH:MM)" placeholder="09:00"
              value={valores.hora_audiencia || ''} onChange={v => set('hora_audiencia', v)} />
          </Grilla>
          <Campo label="Sala (opcional)" placeholder="Sala 3"
            value={valores.sala || ''} onChange={v => set('sala', v)} />
        </Seccion>
      </>}

      {/* ── Admisión alimentos ── */}
      {tipo === 'admision_alimentos' && <>
        <Seccion titulo="Objeto del proceso">
          <Campo label="Objeto" placeholder="fijación de cuota alimentaria"
            value={valores.objeto || ''} onChange={v => set('objeto', v)} />
        </Seccion>
        <Seccion titulo="Audiencia de conciliación">
          <Grilla>
            <Campo label="Fecha de la audiencia" type="date"
              value={valores.fecha_audiencia || ''} onChange={v => set('fecha_audiencia', v)} />
            <Campo label="Hora (HH:MM)" placeholder="09:00"
              value={valores.hora_audiencia || ''} onChange={v => set('hora_audiencia', v)} />
          </Grilla>
          <Campo label="Sala (opcional)" placeholder="Sala 3"
            value={valores.sala || ''} onChange={v => set('sala', v)} />
        </Seccion>
      </>}

      {/* ── Admisión divorcio ── */}
      {tipo === 'admision_divorcio' && <>
        <Seccion titulo="Tipo de petición">
          <SelectField label="Tipo de divorcio" opciones={[
            { value: 'unilateral', label: 'Unilateral (pedido por uno de los cónyuges)' },
            { value: 'bilateral',  label: 'Bilateral / Conjunto (ambos cónyuges de común acuerdo)' },
          ]} value={valores.tipo_divorcio || 'unilateral'} onChange={v => set('tipo_divorcio', v)} />
          <Campo label="Plazo para retiro de documentación (días hábiles)" type="number" placeholder="10"
            value={valores.plazo_retiro_documentos_dias || ''} onChange={v => set('plazo_retiro_documentos_dias', v)} />
        </Seccion>
      </>}

      {/* ── Admisión régimen de comunicación ── */}
      {tipo === 'admision_comunicacion' && <>
        <Seccion titulo="Objeto del proceso">
          <Campo label="Objeto" placeholder="fijación de régimen de comunicación y contacto"
            value={valores.objeto || ''} onChange={v => set('objeto', v)} />
        </Seccion>
        <Seccion titulo="Audiencia de conciliación">
          <Grilla>
            <Campo label="Fecha de la audiencia" type="date"
              value={valores.fecha_audiencia || ''} onChange={v => set('fecha_audiencia', v)} />
            <Campo label="Hora (HH:MM)" placeholder="09:00"
              value={valores.hora_audiencia || ''} onChange={v => set('hora_audiencia', v)} />
          </Grilla>
          <Campo label="Sala (opcional)" placeholder="Sala 3"
            value={valores.sala || ''} onChange={v => set('sala', v)} />
        </Seccion>
      </>}

      {/* ── Citación a audiencia VF ── */}
      {tipo === 'citacion_audiencia_vf' && <>
        <Seccion titulo="Tipo de audiencia">
          <SelectField label="Tipo" opciones={[
            { value: 'conciliacion', label: 'Audiencia de conciliación (art. 27 Ley 9283)' },
            { value: 'seguimiento',  label: 'Audiencia de seguimiento de medidas' },
            { value: 'revision',     label: 'Audiencia de revisión periódica' },
          ]} value={valores.tipo_audiencia || 'conciliacion'} onChange={v => set('tipo_audiencia', v)} />
        </Seccion>
        <Seccion titulo="Fecha y lugar">
          <Grilla>
            <Campo label="Fecha de la audiencia" type="date"
              value={valores.fecha_audiencia || ''} onChange={v => set('fecha_audiencia', v)} />
            <Campo label="Hora (HH:MM)" placeholder="09:00"
              value={valores.hora_audiencia || ''} onChange={v => set('hora_audiencia', v)} />
          </Grilla>
          <Campo label="Sala (opcional)" placeholder="Sala 3"
            value={valores.sala || ''} onChange={v => set('sala', v)} />
        </Seccion>
      </>}

      {/* ── Declaratoria de herederos ── */}
      {tipo === 'declaratoria_herederos' && <>
        <Seccion titulo="Causante">
          <Campo label="Nombre del causante"
            placeholder="Juan Carlos García"
            value={valores.causante_nombre || ''} onChange={v => set('causante_nombre', v)} />
          <Campo label="Vínculo invocado (opcional)"
            placeholder="en calidad de hijos y cónyuge supérstite"
            value={valores.vinculos || ''} onChange={v => set('vinculos', v)} />
        </Seccion>
        <Seccion titulo="Alcance de la declaratoria">
          <CheckField label="Incluye bienes inmuebles (se ordena anotación registral)"
            checked={valores.bienes_inmuebles !== false} onChange={v => set('bienes_inmuebles', v)} />
          <CheckField label="Incluye bienes muebles registrables"
            checked={valores.bienes_muebles !== false} onChange={v => set('bienes_muebles', v)} />
        </Seccion>
      </>}

      {/* ── Admisibilidad Contencioso Administrativo ── */}
      {tipo === 'admisibilidad_ca' && <>
        <Seccion titulo="Objeto de la acción">
          <Campo label="Objeto de la acción contencioso-administrativa"
            placeholder="nulidad del Decreto N.° 1234/2025 del Poder Ejecutivo Provincial"
            value={valores.objeto_accion || ''} onChange={v => set('objeto_accion', v)} />
          <Campo label="Organismo / Estado demandado"
            placeholder="la Provincia de Córdoba"
            value={valores.organismo_demandado || ''} onChange={v => set('organismo_demandado', v)} />
        </Seccion>
        <Seccion titulo="Traslado y expediente administrativo">
          <Campo label="Plazo de contestación (días hábiles)" type="number" placeholder="30"
            value={valores.plazo_contestacion_dias || ''} onChange={v => set('plazo_contestacion_dias', v)} />
          <CheckField label="Requerir remisión del expediente administrativo (art. 13 CPCA)"
            checked={valores.requiere_expediente_administrativo !== false} onChange={v => set('requiere_expediente_administrativo', v)} />
        </Seccion>
      </>}

      {/* ── Decreto de trámite ── */}
      {tipo === 'decreto_tramite' && <>
        <Seccion titulo="Tipo de decreto">
          <SelectField label="Tipo" opciones={TIPOS_DECRETO}
            value={valores.tipo_decreto || 'traslado'} onChange={v => set('tipo_decreto', v)} />
          {valores.tipo_decreto === 'otro' &&
            <Campo label="Descripción del decreto"
              value={valores.tipo_descripcion || ''} onChange={v => set('tipo_descripcion', v)} />
          }
          <Grilla>
            <Campo label="Destinatario (rol)" placeholder="demandado"
              value={valores.destinatario_rol || ''} onChange={v => set('destinatario_rol', v)} />
            <Campo label="Plazo en días hábiles (opcional)" type="number"
              value={valores.plazo_dias || ''} onChange={v => set('plazo_dias', v)} />
          </Grilla>
        </Seccion>
      </>}

      {/* ── Observaciones (todos los tipos) ── */}
      <Seccion titulo="Observaciones del actuario (opcional)">
        <textarea
          rows={3}
          placeholder="Texto adicional a incluir al final del documento…"
          value={valores.texto_libre || ''}
          onChange={e => set('texto_libre', e.target.value)}
          style={textareaStyle}
        />
      </Seccion>

    </div>
  )
}

// Sub-componentes internos
function Seccion({ titulo, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h3 style={seccionStyle}>{titulo}</h3>
      {children}
    </div>
  )
}

function Grilla({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{children}</div>
}

function Campo({ label, value, onChange, placeholder = '', type = 'text' }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} style={inputStyle} />
    </div>
  )
}

function SelectField({ label, opciones, value, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
        {opciones.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function CheckField({ label, checked, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>&nbsp;</label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        {label}
      </label>
    </div>
  )
}

function CheckItem({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', marginBottom: 6 }}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  )
}

const seccionStyle  = { fontSize: 12, fontWeight: 700, color: '#0047AB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, borderBottom: '1px solid #e8e8f0', paddingBottom: 4 }
const labelStyle    = { display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }
const inputStyle    = { width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #ddd', fontSize: 14, boxSizing: 'border-box', background: '#fff' }
const textareaStyle = { width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #ddd', fontSize: 14, boxSizing: 'border-box', resize: 'vertical', fontFamily: 'system-ui, sans-serif' }
