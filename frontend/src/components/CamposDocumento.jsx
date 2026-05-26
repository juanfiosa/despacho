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

      {/* ── Sobreseimiento ── */}
      {tipo === 'sobreseimiento' && <>
        <Seccion titulo="Ministerio Fiscal">
          <Campo label="Nombre del/la fiscal (opcional)"
            placeholder="Dr./Dra. Nombre Apellido"
            value={valores.fiscal_nombre || ''} onChange={v => set('fiscal_nombre', v)} />
        </Seccion>
        <Seccion titulo="Causal de sobreseimiento">
          <SelectField label="Causal" opciones={[
            { value: 'extincion_accion',         label: 'Extinción de la acción penal (prescripción, muerte, etc.)' },
            { value: 'falta_participacion',       label: 'El imputado no participó en el hecho' },
            { value: 'atipicidad_justificacion',  label: 'El hecho es atípico o está justificado' },
            { value: 'falta_prueba',              label: 'Falta de prueba suficiente (insuficiencia probatoria)' },
          ]} value={valores.causal || 'falta_prueba'} onChange={v => set('causal', v)} />
        </Seccion>
        <Seccion titulo="Hecho (opcional)">
          <Campo label="Calificación provisional" placeholder="estafa, art. 172 CP"
            value={valores.calificacion_provisional || ''} onChange={v => set('calificacion_provisional', v)} />
          <Campo label="Descripción breve del hecho"
            placeholder="el hecho por el que fue imputado"
            value={valores.descripcion_hecho || ''} onChange={v => set('descripcion_hecho', v)} />
        </Seccion>
      </>}

      {/* ── Desestimación de denuncia ── */}
      {tipo === 'desestimacion_denuncia' && <>
        <Seccion titulo="Tipo de acto">
          <SelectField label="Tipo de acto" opciones={[
            { value: 'denuncia',   label: 'Denuncia' },
            { value: 'querella',   label: 'Querella' },
          ]} value={valores.tipo_acto || 'denuncia'} onChange={v => set('tipo_acto', v)} />
          <Campo label="Descripción breve del hecho denunciado"
            placeholder="lesiones ocurridas el día..."
            value={valores.descripcion || ''} onChange={v => set('descripcion', v)} />
          <Campo label="Nombre del/la fiscal (opcional)"
            placeholder="Dr./Dra. Nombre Apellido"
            value={valores.fiscal_nombre || ''} onChange={v => set('fiscal_nombre', v)} />
        </Seccion>
        <Seccion titulo="Causal de desestimación">
          <SelectField label="Causal" opciones={[
            { value: 'manifiestamente_improcedente', label: 'Manifiestamente improcedente (art. 250 CPP)' },
            { value: 'extincion_accion',             label: 'Acción penal extinguida' },
            { value: 'atipicidad',                   label: 'Hecho manifiestamente atípico' },
            { value: 'no_conforma_delito',           label: 'Los hechos no conforman delito alguno' },
          ]} value={valores.causal || 'manifiestamente_improcedente'} onChange={v => set('causal', v)} />
        </Seccion>
      </>}

      {/* ── Homologación de acuerdo (familia) ── */}
      {tipo === 'homologacion_acuerdo_familia' && <>
        <Seccion titulo="Tipo de acuerdo">
          <SelectField label="Tipo de acuerdo" opciones={[
            { value: 'alimentos',     label: 'Alimentos' },
            { value: 'comunicacion',  label: 'Régimen de comunicación' },
            { value: 'divorcio',      label: 'Divorcio vincular y convenio regulador' },
            { value: 'guarda',        label: 'Guarda' },
            { value: 'otro',          label: 'Otro (especificar)' },
          ]} value={valores.tipo_acuerdo || 'alimentos'} onChange={v => set('tipo_acuerdo', v)} />
          {valores.tipo_acuerdo === 'otro' &&
            <Campo label="Descripción del tipo de acuerdo"
              placeholder="ej: liquidación de sociedad conyugal"
              value={valores.tipo_acuerdo_descripcion || ''} onChange={v => set('tipo_acuerdo_descripcion', v)} />
          }
        </Seccion>
        <Seccion titulo="Contenido del acuerdo">
          <Campo label="Descripción del acuerdo (transcribir los puntos principales)"
            placeholder="Las partes acuerdan fijar una cuota alimentaria de $... mensual, pagadera el día..."
            value={valores.descripcion_acuerdo || ''} onChange={v => set('descripcion_acuerdo', v)} />
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

      {/* ══ CONTENCIOSO ADMINISTRATIVO — adicionales ══ */}

      {/* ── Traslado de demanda CA ── */}
      {tipo === 'traslado_demanda_ca' && <>
        <Seccion titulo="Organismo demandado">
          <Campo label="Organismo / Ente demandado" placeholder="la Provincia de Córdoba"
            value={valores.organismo_demandado || ''} onChange={v => set('organismo_demandado', v)} />
          <Grilla>
            <Campo label="Plazo de contestación (días hábiles)" type="number" placeholder="30"
              value={valores.plazo_contestacion_dias || ''} onChange={v => set('plazo_contestacion_dias', v)} />
            <Campo label="Domicilio de notificación (opcional)"
              value={valores.domicilio_notificacion || ''} onChange={v => set('domicilio_notificacion', v)} />
          </Grilla>
          <CheckField label="Requerir remisión del expediente administrativo"
            checked={valores.con_remision_expediente !== false} onChange={v => set('con_remision_expediente', v)} />
        </Seccion>
      </>}

      {/* ── Apertura prueba CA ── */}
      {tipo === 'apertura_prueba_ca' && <>
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
              onChange={() => {
                const arr = valores.prueba_admitida || []
                set('prueba_admitida', arr.includes(p.value) ? arr.filter(x => x !== p.value) : [...arr, p.value])
              }} />
          ))}
        </Seccion>
      </>}

      {/* ── Citación audiencia preliminar CA ── */}
      {tipo === 'citacion_audiencia_preliminar_ca' && <>
        <Seccion titulo="Audiencia preliminar">
          <Grilla>
            <Campo label="Fecha de la audiencia" type="date"
              value={valores.fecha_audiencia || ''} onChange={v => set('fecha_audiencia', v)} />
            <Campo label="Hora (HH:MM)" placeholder="09:00"
              value={valores.hora_audiencia || ''} onChange={v => set('hora_audiencia', v)} />
          </Grilla>
          <Grilla>
            <Campo label="Sala (opcional)" placeholder="Sala 3"
              value={valores.sala || ''} onChange={v => set('sala', v)} />
            <Campo label="Objeto de la audiencia"
              placeholder="fijación de hechos controvertidos, saneamiento y ofrecimiento de prueba"
              value={valores.objeto_audiencia || ''} onChange={v => set('objeto_audiencia', v)} />
          </Grilla>
        </Seccion>
      </>}

      {/* ── Suspensión de acto administrativo ── */}
      {tipo === 'suspension_acto_administrativo' && <>
        <Seccion titulo="Acto impugnado">
          <Campo label="Descripción del acto administrativo cuya ejecución se suspende"
            placeholder="Decreto Municipal N.° 456/2025 que dispone la demolición del inmueble"
            value={valores.acto_impugnado || ''} onChange={v => set('acto_impugnado', v)} />
          <Campo label="Organismo emisor del acto"
            placeholder="la Municipalidad de Córdoba"
            value={valores.organismo_emisor || ''} onChange={v => set('organismo_emisor', v)} />
        </Seccion>
        <Seccion titulo="Causal y contracautela">
          <SelectField label="Causal de la medida" opciones={[
            { value: 'verosimilitud_derecho_peligro_demora', label: 'Verosimilitud del derecho y peligro en la demora (fumus + periculum)' },
            { value: 'irreparabilidad_perjuicio',           label: 'Irreparabilidad del perjuicio' },
            { value: 'no_afectacion_interes_publico',       label: 'No afectación del interés público' },
          ]} value={valores.causal_suspension || 'verosimilitud_derecho_peligro_demora'} onChange={v => set('causal_suspension', v)} />
          <Campo label="Contracautela (opcional)" placeholder="caución juratoria / garantía real"
            value={valores.contracautela || ''} onChange={v => set('contracautela', v)} />
        </Seccion>
      </>}

      {/* ── Llamamiento de autos CA ── */}
      {tipo === 'llamamiento_autos_ca' && <>
        <Seccion titulo="Llamamiento de autos">
          <SelectField label="Etapa" opciones={[
            { value: 'sentencia_definitiva',    label: 'Para dictar sentencia definitiva' },
            { value: 'resolucion_incidente',    label: 'Para resolver incidente' },
            { value: 'otro',                    label: 'Otro' },
          ]} value={valores.etapa_llamamiento || 'sentencia_definitiva'} onChange={v => set('etapa_llamamiento', v)} />
          <CheckField label="Dejar constancia del vencimiento del período de prueba"
            checked={valores.vencio_prueba !== false} onChange={v => set('vencio_prueba', v)} />
          <CheckField label="Las partes presentaron alegatos antes del llamamiento"
            checked={valores.presentaron_alegatos === true} onChange={v => set('presentaron_alegatos', v)} />
        </Seccion>
      </>}

      {/* ── Intimación organismo demandado ── */}
      {tipo === 'intimacion_organismo_demandado' && <>
        <Seccion titulo="Organismo demandado">
          <Campo label="Organismo a intimar" placeholder="la Provincia de Córdoba"
            value={valores.organismo_demandado || ''} onChange={v => set('organismo_demandado', v)} />
          <Grilla>
            <Campo label="Plazo de remisión (días hábiles)" type="number" placeholder="10"
              value={valores.plazo_dias || ''} onChange={v => set('plazo_dias', v)} />
            <Campo label="N.° de expediente administrativo (opcional)"
              value={valores.numero_expediente_administrativo || ''} onChange={v => set('numero_expediente_administrativo', v)} />
          </Grilla>
          <Campo label="Apercibimiento"
            placeholder="tener por ciertos los hechos invocados por el actor (art. 355 CPCC)"
            value={valores.apercibimiento || ''} onChange={v => set('apercibimiento', v)} />
        </Seccion>
      </>}

      {/* ══ VIOLENCIA FAMILIAR — adicionales ══ */}

      {/* ── Prórroga medidas VF ── */}
      {tipo === 'prorroga_medidas_vf' && <>
        <Seccion titulo="Medidas en vigencia">
          <p style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>Marque las medidas que se prorrogan:</p>
          {['exclusión del hogar', 'restricción de acercamiento', 'prohibición de contacto'].map(m => (
            <CheckItem key={m} label={m}
              checked={(valores.medidas_vigentes || []).includes(m)}
              onChange={() => {
                const arr = valores.medidas_vigentes || []
                set('medidas_vigentes', arr.includes(m) ? arr.filter(x => x !== m) : [...arr, m])
              }} />
          ))}
        </Seccion>
        <Seccion titulo="Prórroga">
          <Campo label="Días de prórroga" type="number" placeholder="90"
            value={valores.plazo_prorroga_dias || ''} onChange={v => set('plazo_prorroga_dias', v)} />
          <Campo label="Fundamento de la prórroga"
            placeholder="subsisten las circunstancias de riesgo que motivaron las medidas originales"
            value={valores.motivo_prorroga || ''} onChange={v => set('motivo_prorroga', v)} />
        </Seccion>
      </>}

      {/* ── Cese medidas VF ── */}
      {tipo === 'cese_medidas_vf' && <>
        <Seccion titulo="Medidas que cesan">
          {['exclusión del hogar', 'restricción de acercamiento', 'prohibición de contacto'].map(m => (
            <CheckItem key={m} label={m}
              checked={(valores.medidas_que_cesan || []).includes(m)}
              onChange={() => {
                const arr = valores.medidas_que_cesan || []
                set('medidas_que_cesan', arr.includes(m) ? arr.filter(x => x !== m) : [...arr, m])
              }} />
          ))}
        </Seccion>
        <Seccion titulo="Causal del cese">
          <SelectField label="Causal" opciones={[
            { value: 'superacion_riesgo', label: 'Superación de la situación de riesgo' },
            { value: 'pedido_victima',    label: 'Pedido expreso de la víctima' },
            { value: 'acuerdo_partes',    label: 'Acuerdo de partes' },
            { value: 'vencimiento_plazo', label: 'Vencimiento del plazo' },
            { value: 'archivo_causa',     label: 'Archivo de la causa' },
            { value: 'otro',              label: 'Otro (especificar)' },
          ]} value={valores.motivo_cese_vf || 'superacion_riesgo'} onChange={v => set('motivo_cese_vf', v)} />
          {valores.motivo_cese_vf === 'otro' &&
            <Campo label="Descripción de la causal"
              value={valores.motivo_descripcion || ''} onChange={v => set('motivo_descripcion', v)} />
          }
        </Seccion>
      </>}

      {/* ── Oficio a policía VF ── */}
      {tipo === 'oficio_policia_vf' && <>
        <Seccion titulo="Tipo de intervención policial">
          <SelectField label="Tipo de oficio" opciones={[
            { value: 'custodia',                  label: 'Custodia del domicilio de la víctima' },
            { value: 'verificacion_cumplimiento', label: 'Verificación del cumplimiento de medidas' },
            { value: 'traslado',                  label: 'Acompañamiento para retiro de pertenencias' },
            { value: 'otro',                      label: 'Otro' },
          ]} value={valores.tipo_oficio || 'custodia'} onChange={v => set('tipo_oficio', v)} />
        </Seccion>
        <Seccion titulo="Instrucciones">
          <Campo label="Domicilio donde debe actuar la policía"
            placeholder="Bv. San Juan 456, Córdoba"
            value={valores.domicilio_intervencion || ''} onChange={v => set('domicilio_intervencion', v)} />
          <Campo label="Instrucciones específicas para la fuerza policial"
            placeholder="Proceder a la exclusión del Sr. X del domicilio..."
            value={valores.descripcion_instrucciones || ''} onChange={v => set('descripcion_instrucciones', v)} />
          <Campo label="Destacamento / Comisaría (opcional)"
            placeholder="Comisaría 4.ª de Córdoba"
            value={valores.unidad_policial || ''} onChange={v => set('unidad_policial', v)} />
        </Seccion>
      </>}

      {/* ══ FAMILIA — adicionales ══ */}

      {/* ── Exclusión del hogar ── */}
      {tipo === 'exclusion_hogar' && <>
        <Seccion titulo="Domicilio">
          <Campo label="Domicilio del que se ordena la exclusión"
            placeholder="Av. Colón 123, Córdoba"
            value={valores.domicilio_exclusion || ''} onChange={v => set('domicilio_exclusion', v)} />
          <Campo label="Plazo de cumplimiento (horas)" type="number" placeholder="24"
            value={valores.plazo_cumplimiento_horas || ''} onChange={v => set('plazo_cumplimiento_horas', v)} />
        </Seccion>
        <Seccion titulo="Medidas complementarias">
          <CheckField label="Autorizar auxilio de la fuerza pública"
            checked={valores.con_auxilio_policial !== false} onChange={v => set('con_auxilio_policial', v)} />
          <CheckField label="Fijar prohibición de acercamiento"
            checked={valores.con_prohibicion_acercamiento !== false} onChange={v => set('con_prohibicion_acercamiento', v)} />
          {valores.con_prohibicion_acercamiento !== false &&
            <Campo label="Distancia de acercamiento (metros, opcional)" type="number"
              value={valores.distancia_metros || ''} onChange={v => set('distancia_metros', v)} />
          }
        </Seccion>
      </>}

      {/* ── Régimen de comunicación provisorio ── */}
      {tipo === 'regimen_comunicacion_provisorio' && <>
        <Seccion titulo="Régimen provisorio">
          <Campo label="Descripción del régimen de comunicación provisorio"
            placeholder="fines de semana alternos de sábado 10 hs. a domingo 18 hs., más los miércoles de 17 a 20 hs."
            value={valores.descripcion_regimen || ''} onChange={v => set('descripcion_regimen', v)} />
          <Campo label="Lugar de entrega/reintegro (opcional)"
            placeholder="domicilio del progenitor conviviente / sede del juzgado"
            value={valores.lugar_entrega || ''} onChange={v => set('lugar_entrega', v)} />
        </Seccion>
        <Seccion titulo="Modalidad y vigencia">
          <CheckField label="Régimen bajo supervisión del equipo técnico del juzgado"
            checked={valores.con_supervision === true} onChange={v => set('con_supervision', v)} />
          <SelectField label="Vigencia" opciones={[
            { value: 'hasta_sentencia',          label: 'Hasta la sentencia definitiva' },
            { value: 'hasta_nueva_resolucion',   label: 'Hasta nueva resolución' },
            { value: 'plazo_determinado',        label: 'Por plazo determinado' },
          ]} value={valores.vigencia_regimen || 'hasta_sentencia'} onChange={v => set('vigencia_regimen', v)} />
        </Seccion>
      </>}

      {/* ── Intimación pago cuotas alimentarias ── */}
      {tipo === 'intimacion_pago_cuotas_alimentarias' && <>
        <Seccion titulo="Cuotas adeudadas">
          <Grilla>
            <Campo label="Cantidad de cuotas adeudadas" type="number" placeholder="3"
              value={valores.cuotas_adeudadas || ''} onChange={v => set('cuotas_adeudadas', v)} />
            <Campo label="Monto total adeudado ($)" type="number" placeholder="150000"
              value={valores.monto_total_adeudado || ''} onChange={v => set('monto_total_adeudado', v)} />
          </Grilla>
          <Campo label="Plazo de pago (días hábiles)" type="number" placeholder="5"
            value={valores.plazo_dias || ''} onChange={v => set('plazo_dias', v)} />
        </Seccion>
        <Seccion titulo="Apercibimientos">
          <CheckField label="Apercibir con consecuencias del art. 553 CCyCN"
            checked={valores.apercibimiento_art553 !== false} onChange={v => set('apercibimiento_art553', v)} />
          <CheckField label="Trabar embargo preventivo en el mismo acto"
            checked={valores.con_embargo === true} onChange={v => set('con_embargo', v)} />
        </Seccion>
      </>}

      {/* ── Atribución del hogar conyugal ── */}
      {tipo === 'atribucion_hogar_conyugal' && <>
        <Seccion titulo="Hogar conyugal">
          <Campo label="Domicilio del hogar cuyo uso se atribuye"
            placeholder="Av. Colón 123, Córdoba"
            value={valores.domicilio_hogar || ''} onChange={v => set('domicilio_hogar', v)} />
          <Grilla>
            <SelectField label="Carácter de la atribución" opciones={[
              { value: 'provisorio',  label: 'Provisorio (durante el proceso)' },
              { value: 'definitivo',  label: 'Definitivo (en sentencia o acuerdo)' },
            ]} value={valores.caracter_atribucion || 'provisorio'} onChange={v => set('caracter_atribucion', v)} />
            <SelectField label="Fundamento (art. 443 CCyCN)" opciones={[
              { value: 'hijos_menores',    label: 'Presencia de hijos menores' },
              { value: 'enfermedad',       label: 'Enfermedad o discapacidad' },
              { value: 'situacion_economica', label: 'Situación económica' },
              { value: 'violencia',        label: 'Situación de violencia' },
              { value: 'otro',             label: 'Otro' },
            ]} value={valores.fundamento_atribucion || 'hijos_menores'} onChange={v => set('fundamento_atribucion', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Exclusión del otro cónyuge">
          <CheckField label="Incluir exclusión del otro cónyuge del inmueble"
            checked={valores.con_exclusion_otro_conyuge !== false} onChange={v => set('con_exclusion_otro_conyuge', v)} />
          {valores.con_exclusion_otro_conyuge !== false &&
            <Campo label="Plazo para desalojar (horas)" type="number" placeholder="24"
              value={valores.plazo_exclusion_horas || ''} onChange={v => set('plazo_exclusion_horas', v)} />
          }
        </Seccion>
      </>}

      {/* ── Citación a conciliación familia ── */}
      {tipo === 'citacion_conciliacion_familia' && <>
        <Seccion titulo="Tipo de proceso">
          <SelectField label="Tipo de proceso" opciones={[
            { value: 'alimentos',         label: 'Alimentos' },
            { value: 'comunicacion',      label: 'Régimen de comunicación' },
            { value: 'guarda',            label: 'Guarda y cuidado' },
            { value: 'divorcio',          label: 'Divorcio y/o convenio regulador' },
            { value: 'liquidacion_bienes',label: 'Liquidación de bienes' },
            { value: 'otro',              label: 'Otro' },
          ]} value={valores.tipo_proceso_familia || 'alimentos'} onChange={v => set('tipo_proceso_familia', v)} />
        </Seccion>
        <Seccion titulo="Audiencia">
          <Grilla>
            <Campo label="Fecha de la audiencia" type="date"
              value={valores.fecha_audiencia || ''} onChange={v => set('fecha_audiencia', v)} />
            <Campo label="Hora (HH:MM)" placeholder="09:00"
              value={valores.hora_audiencia || ''} onChange={v => set('hora_audiencia', v)} />
          </Grilla>
          <Grilla>
            <Campo label="Sala (opcional)" placeholder="Sala 3"
              value={valores.sala || ''} onChange={v => set('sala', v)} />
            <CheckField label="Convocar también al equipo técnico interdisciplinario"
              checked={valores.con_equipo_tecnico === true} onChange={v => set('con_equipo_tecnico', v)} />
          </Grilla>
        </Seccion>
      </>}

      {/* ══ LABORAL — adicionales ══ */}

      {/* ── Traslado contestación laboral ── */}
      {tipo === 'traslado_contestacion_laboral' && <>
        <Seccion titulo="Traslado de contestación">
          <Campo label="Plazo para tomar conocimiento (días hábiles)" type="number" placeholder="5"
            value={valores.plazo_dias || ''} onChange={v => set('plazo_dias', v)} />
          <CheckField label="La contestación incluye reconvención"
            checked={valores.con_reconvencion === true} onChange={v => set('con_reconvencion', v)} />
          {valores.con_reconvencion &&
            <Campo label="Plazo para contestar la reconvención (días hábiles)" type="number" placeholder="5"
              value={valores.plazo_reconvencion_dias || ''} onChange={v => set('plazo_reconvencion_dias', v)} />
          }
        </Seccion>
      </>}

      {/* ── Citación vista de causa laboral ── */}
      {tipo === 'citacion_vista_causa' && <>
        <Seccion titulo="Audiencia de vista de causa">
          <Grilla>
            <Campo label="Fecha de la audiencia" type="date"
              value={valores.fecha_audiencia || ''} onChange={v => set('fecha_audiencia', v)} />
            <Campo label="Hora (HH:MM)" placeholder="09:00"
              value={valores.hora_audiencia || ''} onChange={v => set('hora_audiencia', v)} />
          </Grilla>
          <Campo label="Sala (opcional)" placeholder="Sala de Audiencias 1"
            value={valores.sala || ''} onChange={v => set('sala', v)} />
        </Seccion>
        <Seccion titulo="Convocados adicionales">
          <CheckField label="Citar también a los peritos designados"
            checked={valores.con_peritos === true} onChange={v => set('con_peritos', v)} />
          <CheckField label="Citar también a los testigos ofrecidos"
            checked={valores.con_testigos === true} onChange={v => set('con_testigos', v)} />
        </Seccion>
      </>}

      {/* ── Intimación pago liquidación laboral ── */}
      {tipo === 'intimacion_pago_liquidacion' && <>
        <Seccion titulo="Liquidación">
          <Grilla>
            <Campo label="Capital ($)" type="number" placeholder="500000"
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
            <CheckField label="Incluir intereses moratorios calculados"
              checked={valores.incluye_intereses_moratorios !== false} onChange={v => set('incluye_intereses_moratorios', v)} />
          </Grilla>
          <CheckField label="Imponer costas" checked={valores.costas !== false} onChange={v => set('costas', v)} />
        </Seccion>
      </>}

      {/* ── Homologación acuerdo laboral ── */}
      {tipo === 'homologacion_acuerdo_laboral' && <>
        <Seccion titulo="Acuerdo conciliatorio">
          <SelectField label="Tipo de acuerdo" opciones={[
            { value: 'total',   label: 'Total — extingue el proceso' },
            { value: 'parcial', label: 'Parcial — continúa por rubros no acordados' },
          ]} value={valores.tipo_acuerdo_laboral || 'total'} onChange={v => set('tipo_acuerdo_laboral', v)} />
          <Campo label="Descripción detallada del acuerdo"
            placeholder="El demandado abonará la suma de $X en concepto de indemnización..."
            value={valores.descripcion_acuerdo || ''} onChange={v => set('descripcion_acuerdo', v)} />
          <Campo label="Monto total del acuerdo en pesos (opcional)" type="number"
            value={valores.monto_total || ''} onChange={v => set('monto_total', v)} />
        </Seccion>
      </>}

      {/* ── Auto de liquidación aprobada laboral ── */}
      {tipo === 'auto_liquidacion_aprobada' && <>
        <Seccion titulo="Liquidación aprobada">
          <Grilla>
            <Campo label="Monto total liquidado ($)" type="number" placeholder="350000"
              value={valores.monto_liquidado || ''} onChange={v => set('monto_liquidado', v)} />
            <Campo label="Fecha hasta la que se practica" type="date"
              value={valores.fecha_liquidacion || ''} onChange={v => set('fecha_liquidacion', v)} />
          </Grilla>
          <SelectField label="Practicada por" opciones={[
            { value: 'perito_contador', label: 'Perito contador designado' },
            { value: 'actuario',        label: 'Actuario del juzgado' },
            { value: 'secretaria',      label: 'Secretaría del juzgado' },
          ]} value={valores.aprobada_por || 'perito_contador'} onChange={v => set('aprobada_por', v)} />
          <Campo label="Observaciones del tribunal sobre la liquidación (opcional)"
            value={valores.observaciones_liquidacion || ''} onChange={v => set('observaciones_liquidacion', v)} />
        </Seccion>
      </>}

      {/* ══ CONCURSAL — adicionales ══ */}

      {/* ── Período de exclusividad ── */}
      {tipo === 'periodo_exclusividad' && <>
        <Seccion titulo="Período de exclusividad (art. 43 LCQ)">
          <Grilla>
            <Campo label="Fecha de inicio del período" type="date"
              value={valores.fecha_inicio_exclusividad || ''} onChange={v => set('fecha_inicio_exclusividad', v)} />
            <Campo label="Plazo en días hábiles" type="number" placeholder="90"
              value={valores.plazo_dias_habiles || ''} onChange={v => set('plazo_dias_habiles', v)} />
          </Grilla>
          <Campo label="Porcentaje mínimo de conformidades requerido (%)" type="number" placeholder="66"
            value={valores.porcentaje_conformidades || ''} onChange={v => set('porcentaje_conformidades', v)} />
        </Seccion>
      </>}

      {/* ── Homologación acuerdo concursal ── */}
      {tipo === 'homologacion_acuerdo_concursal' && <>
        <Seccion titulo="Acuerdo preventivo (art. 52 LCQ)">
          <SelectField label="Tipo de acuerdo" opciones={[
            { value: 'unificado',      label: 'Unificado para todos los acreedores' },
            { value: 'por_categorias', label: 'Por categorías de acreedores' },
          ]} value={valores.tipo_acuerdo_concursal || 'unificado'} onChange={v => set('tipo_acuerdo_concursal', v)} />
          <Campo label="Descripción de las cláusulas principales (quita, espera, modalidad)"
            placeholder="Quita del 40% sobre capital y espera de 3 años en cuotas anuales..."
            value={valores.descripcion_acuerdo || ''} onChange={v => set('descripcion_acuerdo', v)} />
          <Campo label="Plazo máximo de cumplimiento del acuerdo (años, opcional)" type="number"
            value={valores.plazo_cumplimiento_anos || ''} onChange={v => set('plazo_cumplimiento_anos', v)} />
        </Seccion>
      </>}

      {/* ── Citación de acreedores por edictos ── */}
      {tipo === 'citacion_acreedores_edicto' && <>
        <Seccion titulo="Síndico">
          <Grilla>
            <Campo label="Nombre del síndico" placeholder="Contador/a Juan García"
              value={valores.sindico_nombre || ''} onChange={v => set('sindico_nombre', v)} />
            <Campo label="Domicilio del síndico (para presentar créditos)"
              placeholder="25 de Mayo 123, Córdoba"
              value={valores.sindico_domicilio || ''} onChange={v => set('sindico_domicilio', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Edictos y plazo">
          <Grilla>
            <Campo label="Fecha límite de verificación (art. 32 LCQ)" type="date"
              value={valores.fecha_limite_verificacion || ''} onChange={v => set('fecha_limite_verificacion', v)} />
            <Campo label="Días de publicación de edictos" type="number" placeholder="5"
              value={valores.dias_publicacion || ''} onChange={v => set('dias_publicacion', v)} />
          </Grilla>
          <SelectField label="Tipo de proceso" opciones={[
            { value: 'concurso_preventivo', label: 'Concurso preventivo' },
            { value: 'quiebra',             label: 'Quiebra' },
          ]} value={valores.tipo_proceso_concursal || 'concurso_preventivo'} onChange={v => set('tipo_proceso_concursal', v)} />
        </Seccion>
      </>}

      {/* ── Designación síndico ── */}
      {tipo === 'designacion_sindico' && <>
        <Seccion titulo="Síndico designado">
          <Grilla>
            <Campo label="Nombre del síndico" placeholder="Contador/a Ana Torres"
              value={valores.sindico_nombre || ''} onChange={v => set('sindico_nombre', v)} />
            <Campo label="Matrícula CPCE (opcional)"
              value={valores.sindico_matricula || ''} onChange={v => set('sindico_matricula', v)} />
          </Grilla>
          <Grilla>
            <SelectField label="Tipo de proceso" opciones={[
              { value: 'concurso_preventivo', label: 'Concurso preventivo' },
              { value: 'quiebra',             label: 'Quiebra' },
            ]} value={valores.tipo_proceso_concursal || 'concurso_preventivo'} onChange={v => set('tipo_proceso_concursal', v)} />
            <Campo label="Plazo de aceptación del cargo (días hábiles)" type="number" placeholder="5"
              value={valores.plazo_aceptacion_dias || ''} onChange={v => set('plazo_aceptacion_dias', v)} />
          </Grilla>
        </Seccion>
      </>}

      {/* ── Auto de verificación de créditos ── */}
      {tipo === 'verificacion_creditos' && <>
        <Seccion titulo="Síndico">
          <Campo label="Nombre del síndico que practicó la verificación"
            value={valores.sindico_nombre || ''} onChange={v => set('sindico_nombre', v)} />
        </Seccion>
        <Seccion titulo="Créditos">
          <Grilla>
            <Campo label="Créditos verificados (admisibles)" type="number" placeholder="12"
              value={valores.creditos_verificados || ''} onChange={v => set('creditos_verificados', v)} />
            <Campo label="Créditos inadmisibles" type="number" placeholder="2"
              value={valores.creditos_inadmisibles || ''} onChange={v => set('creditos_inadmisibles', v)} />
          </Grilla>
          <Grilla>
            <Campo label="Monto total verificado ($, opcional)" type="number"
              value={valores.monto_total_verificado || ''} onChange={v => set('monto_total_verificado', v)} />
            <Campo label="Con privilegio especial (cant.)" type="number" placeholder="0"
              value={valores.con_privilegio_especial || ''} onChange={v => set('con_privilegio_especial', v)} />
          </Grilla>
          <Campo label="Con privilegio general (cant.)" type="number" placeholder="0"
            value={valores.con_privilegio_general || ''} onChange={v => set('con_privilegio_general', v)} />
        </Seccion>
      </>}

      {/* ── Decreto de realización de bienes ── */}
      {tipo === 'realizacion_bienes' && <>
        <Seccion titulo="Bienes a realizar">
          <Campo label="Descripción de los bienes"
            placeholder="inmueble de calle X N.° Y / rodados / fondo de comercio"
            value={valores.descripcion_bienes || ''} onChange={v => set('descripcion_bienes', v)} />
          <SelectField label="Modalidad de realización" opciones={[
            { value: 'subasta_judicial',  label: 'Subasta judicial (martillero)' },
            { value: 'venta_directa',     label: 'Venta directa (arts. 205/213 LCQ)' },
            { value: 'licitacion',        label: 'Licitación' },
            { value: 'fondo_comercio',    label: 'Como fondo de comercio (art. 204 LCQ)' },
            { value: 'concurso_de_precios', label: 'Concurso de precios' },
          ]} value={valores.modalidad_realizacion || 'subasta_judicial'} onChange={v => set('modalidad_realizacion', v)} />
        </Seccion>
        {(valores.modalidad_realizacion === 'subasta_judicial' || !valores.modalidad_realizacion) && <>
          <Seccion titulo="Subasta">
            <Grilla>
              <Campo label="Nombre del martillero (opcional)"
                value={valores.martillero_nombre || ''} onChange={v => set('martillero_nombre', v)} />
              <Campo label="Base de la subasta ($, opcional)" type="number"
                value={valores.base_subasta || ''} onChange={v => set('base_subasta', v)} />
            </Grilla>
            <Campo label="Fecha de la subasta (opcional)" type="date"
              value={valores.fecha_subasta || ''} onChange={v => set('fecha_subasta', v)} />
          </Seccion>
        </>}
      </>}

      {/* ══ PENAL — adicionales ══ */}

      {/* ── Prisión preventiva ── */}
      {tipo === 'prision_preventiva' && <>
        <Seccion titulo="Intervenciones">
          <Grilla>
            <Campo label="Nombre del/la fiscal (opcional)"
              placeholder="Dr./Dra. Nombre Apellido"
              value={valores.fiscal_nombre || ''} onChange={v => set('fiscal_nombre', v)} />
            <Campo label="Nombre del/la defensor/a (opcional)"
              placeholder="Dr./Dra. Nombre Apellido"
              value={valores.defensor_nombre || ''} onChange={v => set('defensor_nombre', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Hecho y causal">
          <Campo label="Calificación legal provisional"
            placeholder="robo agravado, arts. 164 y 166 inc. 2 CP"
            value={valores.calificacion_legal || ''} onChange={v => set('calificacion_legal', v)} />
          <SelectField label="Causal de la prisión preventiva" opciones={[
            { value: 'peligro_fuga',       label: 'Peligro de fuga (art. 281 inc. 1 CPP)' },
            { value: 'entorpecimiento',    label: 'Entorpecimiento de la investigación (art. 281 inc. 2 CPP)' },
            { value: 'ambas',             label: 'Ambas causales concurrentes' },
          ]} value={valores.causal_prision || 'peligro_fuga'} onChange={v => set('causal_prision', v)} />
          <Grilla>
            <Campo label="Escala penal mínima (opcional)" placeholder="3 años"
              value={valores.escala_minima_pena || ''} onChange={v => set('escala_minima_pena', v)} />
            <Campo label="Descripción breve del hecho (opcional)"
              value={valores.descripcion_hecho || ''} onChange={v => set('descripcion_hecho', v)} />
          </Grilla>
        </Seccion>
      </>}

      {/* ── Cese de prisión preventiva ── */}
      {tipo === 'cese_prision_preventiva' && <>
        <Seccion titulo="Intervenciones">
          <Grilla>
            <Campo label="Nombre del/la fiscal (opcional)"
              value={valores.fiscal_nombre || ''} onChange={v => set('fiscal_nombre', v)} />
            <Campo label="Nombre del/la defensor/a (opcional)"
              value={valores.defensor_nombre || ''} onChange={v => set('defensor_nombre', v)} />
          </Grilla>
          <Campo label="Calificación legal (opcional)"
            value={valores.calificacion_legal || ''} onChange={v => set('calificacion_legal', v)} />
        </Seccion>
        <Seccion titulo="Modalidad y causal del cese">
          <Grilla>
            <SelectField label="Modalidad de libertad" opciones={[
              { value: 'excarcelacion',    label: 'Excarcelación (liberación del detenido)' },
              { value: 'exencion_prision', label: 'Exención de prisión' },
              { value: 'morigeracion',     label: 'Morigeración (arresto domiciliario)' },
              { value: 'cese_automatico',  label: 'Cese automático por vencimiento de plazo' },
            ]} value={valores.modalidad_libertad || 'excarcelacion'} onChange={v => set('modalidad_libertad', v)} />
            <SelectField label="Causal del cese" opciones={[
              { value: 'variacion_circunstancias', label: 'Variación de las circunstancias' },
              { value: 'vencimiento_plazo',        label: 'Vencimiento del plazo legal (art. 283 CPP)' },
              { value: 'sobreseimiento',           label: 'Sobreseimiento dictado' },
              { value: 'absolución',               label: 'Absolución' },
              { value: 'monto_pena',               label: 'Monto de la pena impuesta' },
              { value: 'otra',                     label: 'Otra' },
            ]} value={valores.causal_cese || 'variacion_circunstancias'} onChange={v => set('causal_cese', v)} />
          </Grilla>
          {valores.causal_cese === 'otra' &&
            <Campo label="Descripción de la causal"
              value={valores.causal_descripcion || ''} onChange={v => set('causal_descripcion', v)} />
          }
        </Seccion>
      </>}

      {/* ── Admisión partes civiles ── */}
      {tipo === 'admision_partes_civiles' && <>
        <Seccion titulo="Parte civil admitida">
          <SelectField label="Tipo de parte civil" opciones={[
            { value: 'actor_civil',                   label: 'Actor civil (art. 96 CPP)' },
            { value: 'tercero_civilmente_demandado',  label: 'Tercero civilmente demandado (art. 99 CPP)' },
            { value: 'ambos',                         label: 'Actor civil y tercero civilmente demandado' },
          ]} value={valores.tipo_parte_civil || 'actor_civil'} onChange={v => set('tipo_parte_civil', v)} />
          <Campo label="Nombre de quien se constituye parte civil"
            placeholder="Juan García"
            value={valores.nombre_parte_civil || ''} onChange={v => set('nombre_parte_civil', v)} />
          <Grilla>
            <Campo label="Calificación legal del hecho generador (opcional)"
              placeholder="art. 172 CP — estafa"
              value={valores.calificacion_provisional || ''} onChange={v => set('calificacion_provisional', v)} />
            <Campo label="Plazo para contestar (días hábiles, opcional)" type="number"
              value={valores.plazo_contestacion_dias || ''} onChange={v => set('plazo_contestacion_dias', v)} />
          </Grilla>
        </Seccion>
      </>}

      {/* ── Traslado para vista fiscal ── */}
      {tipo === 'traslado_vista_fiscal' && <>
        <Seccion titulo="Vista al Ministerio Público Fiscal">
          <SelectField label="Jerarquía del fiscal" opciones={[
            { value: 'fiscal_instruccion', label: 'Fiscal de Instrucción' },
            { value: 'fiscal_camara',      label: 'Fiscal de Cámara' },
            { value: 'fiscal_general',     label: 'Fiscal General' },
          ]} value={valores.tipo_vista || 'fiscal_instruccion'} onChange={v => set('tipo_vista', v)} />
          <Campo label="Objeto de la vista"
            placeholder="petición de sobreseimiento del imputado / recurso de la defensa / calificación del hecho"
            value={valores.objeto_vista || ''} onChange={v => set('objeto_vista', v)} />
          <Campo label="Plazo para dictaminar (días hábiles)" type="number" placeholder="5"
            value={valores.plazo_dias || ''} onChange={v => set('plazo_dias', v)} />
        </Seccion>
      </>}

      {/* ── Citación testigos y/o peritos al debate ── */}
      {tipo === 'citacion_testigos_peritos' && <>
        <Seccion titulo="Debate oral">
          <Grilla>
            <Campo label="Fecha del debate" type="date"
              value={valores.fecha_debate || ''} onChange={v => set('fecha_debate', v)} />
            <Campo label="Hora (HH:MM)" placeholder="09:00"
              value={valores.hora_debate || ''} onChange={v => set('hora_debate', v)} />
          </Grilla>
          <SelectField label="Tipo de convocados" opciones={[
            { value: 'testigos',            label: 'Testigos' },
            { value: 'peritos',             label: 'Peritos' },
            { value: 'testigos_y_peritos',  label: 'Testigos y peritos' },
          ]} value={valores.tipo_convocados || 'testigos'} onChange={v => set('tipo_convocados', v)} />
        </Seccion>
        <Seccion titulo="Lista de convocados (uno por línea)">
          <textarea rows={4}
            placeholder="Juan García — Av. Colón 123, Córdoba&#10;María López — perita contadora — 25 de Mayo 456"
            value={(valores.lista_convocados || []).join('\n')}
            onChange={e => set('lista_convocados', e.target.value.split('\n').filter(l => l.trim()))}
            style={textareaStyle} />
        </Seccion>
      </>}

      {/* ── Suspensión del juicio a prueba (probation) ── */}
      {tipo === 'suspension_juicio_prueba' && <>
        <Seccion titulo="Acuerdo de suspensión">
          <Grilla>
            <Campo label="Nombre del/la fiscal (opcional)"
              value={valores.fiscal_nombre || ''} onChange={v => set('fiscal_nombre', v)} />
            <Campo label="Nombre del/la defensor/a (opcional)"
              value={valores.defensor_nombre || ''} onChange={v => set('defensor_nombre', v)} />
          </Grilla>
          <Campo label="Calificación legal del hecho"
            placeholder="lesiones leves, art. 89 CP"
            value={valores.calificacion_legal || ''} onChange={v => set('calificacion_legal', v)} />
          <Grilla>
            <Campo label="Plazo de suspensión (meses)" type="number" placeholder="12"
              value={valores.plazo_suspension_meses || ''} onChange={v => set('plazo_suspension_meses', v)} />
            <Campo label="Compromiso de reparación del daño (opcional)"
              placeholder="pago de $X en X cuotas"
              value={valores.reparacion_danio || ''} onChange={v => set('reparacion_danio', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Reglas de conducta (una por línea)">
          <textarea rows={4}
            placeholder="residir en domicilio declarado&#10;abstenerse de bebidas alcohólicas&#10;concurrir a talleres de conducta vial"
            value={(valores.reglas_conducta || []).join('\n')}
            onChange={e => set('reglas_conducta', e.target.value.split('\n').filter(l => l.trim()))}
            style={textareaStyle} />
        </Seccion>
      </>}

      {/* ── Extracción de testimonios ── */}
      {tipo === 'extraccion_testimonios' && <>
        <Seccion titulo="Testimonios a extraer">
          <Campo label="Descripción de lo que se testimoniará"
            placeholder="copias certificadas de fs. 1/20 del presente expediente"
            value={valores.objeto_testimonios || ''} onChange={v => set('objeto_testimonios', v)} />
          <Campo label="Destino (tribunal / fiscalía / juzgado)"
            placeholder="Fiscalía de Instrucción N.° 4 / Juzgado Civil N.° 3"
            value={valores.destino || ''} onChange={v => set('destino', v)} />
          <Campo label="Motivo de la extracción"
            placeholder="denuncia de nuevo hecho / conexidad con causa N.° X"
            value={valores.motivo || ''} onChange={v => set('motivo', v)} />
        </Seccion>
      </>}

      {/* ── Auto de archivo con notificación ── */}
      {tipo === 'archivo_notificacion' && <>
        <Seccion titulo="Causal del archivo">
          <SelectField label="Causal" opciones={[
            { value: 'desestimacion_fiscal', label: 'Desestimación del fiscal (no ejercita la acción)' },
            { value: 'extincion_accion',     label: 'Extinción de la acción penal' },
            { value: 'sobreseimiento_previo',label: 'Sobreseimiento ya dictado' },
            { value: 'falta_merito',         label: 'Falta de mérito para elevar' },
            { value: 'otra',                 label: 'Otra (especificar)' },
          ]} value={valores.causal_archivo || 'desestimacion_fiscal'} onChange={v => set('causal_archivo', v)} />
          {valores.causal_archivo === 'otra' &&
            <Campo label="Descripción de la causal"
              value={valores.causal_descripcion || ''} onChange={v => set('causal_descripcion', v)} />
          }
          <CheckField label="Notificar también al querellante particular"
            checked={valores.notificar_querellante === true} onChange={v => set('notificar_querellante', v)} />
        </Seccion>
      </>}

      {/* ══ NIÑEZ — adicionales ══ */}

      {/* ── Medida de abrigo ── */}
      {tipo === 'auto_medida_abrigo' && <>
        <Seccion titulo="NNyA involucrado/a">
          <Grilla>
            <Campo label="Nombre completo del/la NNyA"
              value={valores.nombre_nnya || ''} onChange={v => set('nombre_nnya', v)} />
            <Campo label="Edad (años, opcional)" type="number"
              value={valores.edad_nnya || ''} onChange={v => set('edad_nnya', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Medida de abrigo">
          <SelectField label="Modalidad" opciones={[
            { value: 'familia_alternativa',       label: 'Familia alternativa / acogedora' },
            { value: 'hogar_convivencial',        label: 'Hogar convivencial' },
            { value: 'establecimiento_proteccion',label: 'Establecimiento de protección especializado' },
            { value: 'otra',                      label: 'Otra' },
          ]} value={valores.modalidad_abrigo || 'hogar_convivencial'} onChange={v => set('modalidad_abrigo', v)} />
          <Campo label="Establecimiento (nombre del hogar o familia, si se conoce — opcional)"
            value={valores.establecimiento || ''} onChange={v => set('establecimiento', v)} />
          <Campo label="Situación de vulneración que justifica la medida"
            placeholder="ausencia de adulto responsable / situación de riesgo grave"
            value={valores.motivo_abrigo || ''} onChange={v => set('motivo_abrigo', v)} />
          <Campo label="Plazo de la medida (días)" type="number" placeholder="30"
            value={valores.plazo_dias || ''} onChange={v => set('plazo_dias', v)} />
        </Seccion>
      </>}

      {/* ── Notificación SENAF ── */}
      {tipo === 'notificacion_senaf' && <>
        <Seccion titulo="NNyA y organismo">
          <Campo label="Nombre completo del/la NNyA"
            value={valores.nombre_nnya || ''} onChange={v => set('nombre_nnya', v)} />
          <Campo label="Organismo a notificar"
            placeholder="la Secretaría de Niñez, Adolescencia y Familia (SENAF)"
            value={valores.organismo_notificar || ''} onChange={v => set('organismo_notificar', v)} />
        </Seccion>
        <Seccion titulo="Objeto de la notificación">
          <Campo label="Motivo de la notificación"
            placeholder="resolución de control de legalidad / dictado de medida de abrigo / audiencia del DD/MM/AAAA"
            value={valores.objeto_notificacion || ''} onChange={v => set('objeto_notificacion', v)} />
          <Campo label="Plazo para informar (días hábiles, opcional)" type="number"
            value={valores.plazo_respuesta_dias || ''} onChange={v => set('plazo_respuesta_dias', v)} />
        </Seccion>
      </>}

      {/* ── Internación salud mental ── */}
      {tipo === 'auto_internacion_salud_mental' && <>
        <Seccion titulo="NNyA involucrado/a">
          <Grilla>
            <Campo label="Nombre completo del/la NNyA"
              value={valores.nombre_nnya || ''} onChange={v => set('nombre_nnya', v)} />
            <Campo label="Edad (años, opcional)" type="number"
              value={valores.edad_nnya || ''} onChange={v => set('edad_nnya', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Internación">
          <Campo label="Hospital / Institución de salud mental"
            placeholder="Hospital de Niños — Córdoba"
            value={valores.establecimiento_salud || ''} onChange={v => set('establecimiento_salud', v)} />
          <Grilla>
            <Campo label="Diagnóstico provisional (opcional)"
              value={valores.diagnostico_provisional || ''} onChange={v => set('diagnostico_provisional', v)} />
            <Campo label="Médico/equipo interviniente (opcional)"
              value={valores.medico_interviniente || ''} onChange={v => set('medico_interviniente', v)} />
          </Grilla>
          <Campo label="Plazo de revisión judicial (días corridos)" type="number" placeholder="30"
            value={valores.plazo_revision_dias || ''} onChange={v => set('plazo_revision_dias', v)} />
        </Seccion>
      </>}

      {/* ── Visitas supervisadas ── */}
      {tipo === 'decreto_visitas_supervisadas' && <>
        <Seccion titulo="NNyA y régimen">
          <Campo label="Nombre completo del/la NNyA"
            value={valores.nombre_nnya || ''} onChange={v => set('nombre_nnya', v)} />
          <Campo label="Descripción del régimen de visitas"
            placeholder="una vez por semana, los sábados de 10 a 12 hs., en la sede del juzgado"
            value={valores.descripcion_regimen || ''} onChange={v => set('descripcion_regimen', v)} />
        </Seccion>
        <Seccion titulo="Modalidad">
          <SelectField label="Lugar de las visitas" opciones={[
            { value: 'sede_juzgado',          label: 'Sede del juzgado' },
            { value: 'hogar_alternativo',     label: 'Hogar alternativo donde reside el NNyA' },
            { value: 'externo_supervisado',   label: 'Lugar externo con supervisión' },
            { value: 'otro',                  label: 'Otro' },
          ]} value={valores.lugar_visitas || 'sede_juzgado'} onChange={v => set('lugar_visitas', v)} />
          <Grilla>
            <Campo label="Supervisor/institución (opcional)"
              value={valores.supervisor || ''} onChange={v => set('supervisor', v)} />
            <SelectField label="Vigencia" opciones={[
              { value: 'hasta_nueva_resolucion', label: 'Hasta nueva resolución' },
              { value: 'plazo_determinado',      label: 'Por plazo determinado' },
            ]} value={valores.vigencia_visitas || 'hasta_nueva_resolucion'} onChange={v => set('vigencia_visitas', v)} />
          </Grilla>
        </Seccion>
      </>}

      {/* ── Reintegro familiar ── */}
      {tipo === 'auto_reintegro_familiar' && <>
        <Seccion titulo="NNyA y grupo familiar">
          <Campo label="Nombre completo del/la NNyA"
            value={valores.nombre_nnya || ''} onChange={v => set('nombre_nnya', v)} />
          <Campo label="Grupo familiar al que se reintegra"
            placeholder="su madre, Sra. María Pérez, en el domicilio de calle X N.° Y"
            value={valores.grupo_familiar_reintegro || ''} onChange={v => set('grupo_familiar_reintegro', v)} />
          <Campo label="Fundamento del reintegro"
            placeholder="han cesado las circunstancias que motivaron la medida excepcional"
            value={valores.motivo_reintegro || ''} onChange={v => set('motivo_reintegro', v)} />
        </Seccion>
        <Seccion titulo="Condiciones del reintegro (una por línea)">
          <textarea rows={3}
            placeholder="seguimiento mensual por SENAF&#10;vinculación con centro de salud&#10;escolarización"
            value={(valores.condiciones_reintegro || []).join('\n')}
            onChange={e => set('condiciones_reintegro', e.target.value.split('\n').filter(l => l.trim()))}
            style={textareaStyle} />
        </Seccion>
      </>}

      {/* ── Citación audiencia de seguimiento NNA ── */}
      {tipo === 'citacion_seguimiento_nna' && <>
        <Seccion titulo="NNyA y audiencia">
          <Campo label="Nombre completo del/la NNyA"
            value={valores.nombre_nnya || ''} onChange={v => set('nombre_nnya', v)} />
          <SelectField label="Tipo de audiencia" opciones={[
            { value: 'seguimiento',       label: 'Seguimiento de la medida' },
            { value: 'revision_medida',   label: 'Revisión de la medida' },
            { value: 'reintegracion',     label: 'Evaluación de reintegración familiar' },
            { value: 'otro',              label: 'Otro' },
          ]} value={valores.tipo_audiencia_nna || 'seguimiento'} onChange={v => set('tipo_audiencia_nna', v)} />
          <Grilla>
            <Campo label="Fecha de la audiencia" type="date"
              value={valores.fecha_audiencia || ''} onChange={v => set('fecha_audiencia', v)} />
            <Campo label="Hora (HH:MM)" placeholder="09:00"
              value={valores.hora_audiencia || ''} onChange={v => set('hora_audiencia', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Convocados">
          <CheckField label="Citar al representante de SENAF"
            checked={valores.citar_senaf !== false} onChange={v => set('citar_senaf', v)} />
          <CheckField label="Convocar al equipo técnico interdisciplinario del juzgado"
            checked={valores.citar_equipo_tecnico !== false} onChange={v => set('citar_equipo_tecnico', v)} />
        </Seccion>
      </>}

      {/* ══ SUCESORIO — adicionales ══ */}

      {/* ── Citación de herederos y acreedores ── */}
      {tipo === 'citacion_herederos_acreedores' && <>
        <Seccion titulo="Causante">
          <Campo label="Nombre del causante"
            placeholder="Juan Carlos García"
            value={valores.causante_nombre || ''} onChange={v => set('causante_nombre', v)} />
        </Seccion>
        <Seccion titulo="Publicación de edictos">
          <Grilla>
            <Campo label="Días de publicación (mín. 5, art. 2340 CCyCN)" type="number" placeholder="5"
              value={valores.dias_edictos || ''} onChange={v => set('dias_edictos', v)} />
            <Campo label="Plazo de presentación de interesados (días)" type="number" placeholder="30"
              value={valores.plazo_presentacion_dias || ''} onChange={v => set('plazo_presentacion_dias', v)} />
          </Grilla>
          <CheckField label="Publicar en el Boletín Oficial de la Provincia"
            checked={valores.publicar_boletin_oficial !== false} onChange={v => set('publicar_boletin_oficial', v)} />
          <CheckField label="Publicar en diario local de amplia circulación"
            checked={valores.publicar_diario_local !== false} onChange={v => set('publicar_diario_local', v)} />
        </Seccion>
      </>}

      {/* ── Aprobación de inventario y avalúo ── */}
      {tipo === 'aprobacion_inventario_avaluo' && <>
        <Seccion titulo="Causante y perito">
          <Grilla>
            <Campo label="Nombre del causante"
              value={valores.causante_nombre || ''} onChange={v => set('causante_nombre', v)} />
            <Campo label="Nombre del perito tasador"
              value={valores.perito_nombre || ''} onChange={v => set('perito_nombre', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Inventario">
          <Grilla>
            <Campo label="Monto total del avalúo ($, opcional)" type="number"
              value={valores.monto_total_avaluo || ''} onChange={v => set('monto_total_avaluo', v)} />
          </Grilla>
          <Campo label="Descripción sintética de los bienes inventariados (opcional)"
            placeholder="inmueble calle X N.° Y / vehículo dominio ABC123 / depósitos bancarios"
            value={valores.bienes_descripcion || ''} onChange={v => set('bienes_descripcion', v)} />
          <CheckField label="Alguna parte impugnó el inventario / avalúo"
            checked={valores.con_impugnacion === true} onChange={v => set('con_impugnacion', v)} />
          {valores.con_impugnacion &&
            <Campo label="Resolución de la impugnación"
              placeholder="se rechaza la impugnación / se ordena nueva tasación"
              value={valores.resolucion_impugnacion || ''} onChange={v => set('resolucion_impugnacion', v)} />
          }
        </Seccion>
      </>}

      {/* ══ INCIDENTES CIVILES ══ */}

      {/* ── Caducidad de instancia ── */}
      {tipo === 'caducidad_instancia' && <>
        <Seccion titulo="Caducidad de instancia (art. 339 CPCC)">
          <Grilla>
            <SelectField label="Instancia" opciones={[
              { value: 'primera',  label: 'Primera instancia (plazo: 6 meses)' },
              { value: 'segunda',  label: 'Segunda instancia (plazo: 3 meses)' },
              { value: 'unica',    label: 'Instancia única' },
            ]} value={valores.instancia || 'primera'} onChange={v => set('instancia', v)} />
            <Campo label="Plazo de inactividad (meses)" type="number" placeholder="6"
              value={valores.plazo_meses || ''} onChange={v => set('plazo_meses', v)} />
          </Grilla>
          <Campo label="Última actuación procesalmente útil (descripción, opcional)"
            placeholder="Fecha y tipo de la última diligencia procesal"
            value={valores.ultima_actuacion || ''} onChange={v => set('ultima_actuacion', v)} />
          <Grilla>
            <SelectField label="Peticionante" opciones={[
              { value: 'demandado',  label: 'A pedido del demandado' },
              { value: 'de_oficio',  label: 'De oficio' },
              { value: 'actor',      label: 'A pedido del actor (reconvención)' },
            ]} value={valores.parte_peticionante || 'demandado'} onChange={v => set('parte_peticionante', v)} />
            <CheckField label="Imponer costas al actor"
              checked={valores.costas_al_actor !== false} onChange={v => set('costas_al_actor', v)} />
          </Grilla>
        </Seccion>
      </>}

      {/* ── Designación de perito ── */}
      {tipo === 'designacion_perito' && <>
        <Seccion titulo="Pericia">
          <Campo label="Especialidad del perito"
            placeholder="contador público / ingeniero mecánico / médico traumatólogo / arquitecto"
            value={valores.especialidad || ''} onChange={v => set('especialidad', v)} />
          <Campo label="Nombre del perito designado (opcional — vacío = sorteo de lista oficial)"
            value={valores.perito_nombre || ''} onChange={v => set('perito_nombre', v)} />
          <Grilla>
            <Campo label="Plazo de aceptación del cargo (días hábiles)" type="number" placeholder="5"
              value={valores.plazo_aceptacion_dias || ''} onChange={v => set('plazo_aceptacion_dias', v)} />
            <Campo label="Plazo para presentar dictamen (días hábiles)" type="number" placeholder="30"
              value={valores.plazo_dictamen_dias || ''} onChange={v => set('plazo_dictamen_dias', v)} />
          </Grilla>
        </Seccion>
        <Seccion titulo="Puntos de pericia (uno por línea)">
          <textarea rows={4}
            placeholder="1. Valor de mercado del inmueble al DD/MM/AAAA&#10;2. Estado de conservación de la estructura"
            value={(valores.puntos_periciales || []).join('\n')}
            onChange={e => set('puntos_periciales', e.target.value.split('\n').filter(l => l.trim()))}
            style={textareaStyle} />
        </Seccion>
      </>}

      {/* ── Intimación a cumplir sentencia ── */}
      {tipo === 'intimacion_cumplimiento_sentencia' && <>
        <Seccion titulo="Sentencia a cumplir (art. 559 CPCC)">
          <Grilla>
            <SelectField label="Tipo de obligación impuesta" opciones={[
              { value: 'dar_dinero', label: 'Dar dinero (suma de pesos)' },
              { value: 'dar_cosa',   label: 'Dar cosa determinada' },
              { value: 'hacer',      label: 'Hacer (ejecutar una conducta)' },
              { value: 'no_hacer',   label: 'No hacer (abstenerse)' },
            ]} value={valores.tipo_obligacion || 'dar_dinero'} onChange={v => set('tipo_obligacion', v)} />
            <Campo label="Plazo para cumplir (días hábiles)" type="number" placeholder="10"
              value={valores.plazo_dias || ''} onChange={v => set('plazo_dias', v)} />
          </Grilla>
          <Campo label="Descripción de la obligación (opcional)"
            placeholder="Abonar la suma de $... / entregar el inmueble sito en..."
            value={valores.descripcion_obligacion || ''} onChange={v => set('descripcion_obligacion', v)} />
          <Campo label="Apercibimiento en caso de incumplimiento"
            placeholder="ejecución forzada con costas"
            value={valores.apercibimiento || ''} onChange={v => set('apercibimiento', v)} />
        </Seccion>
      </>}

      {/* ── Auto de desglose ── */}
      {tipo === 'auto_desglose' && <>
        <Seccion titulo="Documentos a desglosar (art. 75 CPCC)">
          <Campo label="Descripción de los documentos"
            placeholder="escritura pública N.° 123 del Esc. Pérez, fojas 45/50 del expediente"
            value={valores.descripcion_documentos || ''} onChange={v => set('descripcion_documentos', v)} />
          <Grilla>
            <SelectField label="Parte solicitante" opciones={[
              { value: 'actor',      label: 'Actor' },
              { value: 'demandado',  label: 'Demandado' },
              { value: 'tercero',    label: 'Tercero' },
              { value: 'de_oficio',  label: 'De oficio' },
            ]} value={valores.parte_solicitante || 'actor'} onChange={v => set('parte_solicitante', v)} />
            <CheckField label="Sacar testimonio / fotocopia antes de desglosar"
              checked={valores.dejar_testimonio !== false} onChange={v => set('dejar_testimonio', v)} />
          </Grilla>
          <Campo label="Motivo del desglose (opcional)"
            placeholder="presentación en otro expediente / original único"
            value={valores.motivo || ''} onChange={v => set('motivo', v)} />
        </Seccion>
      </>}

      {/* ── Citación audiencia de conciliación civil ── */}
      {tipo === 'citacion_audiencia_conciliacion' && <>
        <Seccion titulo="Audiencia de conciliación (art. 58 CPCC)">
          <Grilla>
            <Campo label="Fecha de la audiencia" type="date"
              value={valores.fecha_audiencia || ''} onChange={v => set('fecha_audiencia', v)} />
            <Campo label="Hora (HH:MM)" placeholder="09:00"
              value={valores.hora_audiencia || ''} onChange={v => set('hora_audiencia', v)} />
          </Grilla>
          <Grilla>
            <Campo label="Sala (opcional)" placeholder="Sala 3"
              value={valores.sala || ''} onChange={v => set('sala', v)} />
            <CheckField label="Intimar a concurrir con patrocinio letrado"
              checked={valores.con_asistencia_letrada !== false} onChange={v => set('con_asistencia_letrada', v)} />
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
