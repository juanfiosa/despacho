import { useState } from 'react'
import PartesEditor from './PartesEditor.jsx'
import { previewDocumento, descargarDocx } from '../api.js'

const TIPOS = [
  { value: 'intimacion_pago',      label: 'Intimación de Pago (art. 529 CPCC)' },
  { value: 'mandamiento_pago',     label: 'Mandamiento de Intimación y Embargo (art. 531 CPCC)' },
  { value: 'auto_apertura_prueba', label: 'Auto de Apertura a Prueba (art. 498 CPCC)' },
  { value: 'decreto_tramite',      label: 'Decreto de Trámite' },
]

const TIPOS_PRUEBA = [
  { value: 'documental',             label: 'Documental' },
  { value: 'testimonial',            label: 'Testimonial' },
  { value: 'pericial',               label: 'Pericial' },
  { value: 'informativa',            label: 'Informativa' },
  { value: 'confesional',            label: 'Confesional / Absolución de posiciones' },
  { value: 'reconocimiento_judicial',label: 'Reconocimiento judicial' },
]

const TIPOS_DECRETO = [
  { value: 'traslado',          label: 'Traslado' },
  { value: 'vista',             label: 'Vista' },
  { value: 'llamamiento_autos', label: 'Llamamiento de autos' },
  { value: 'autos_para_resolver',label: 'Autos para resolver' },
  { value: 'notificacion',      label: 'Notificación' },
  { value: 'otro',              label: 'Otro (especificar)' },
]

const TASAS = [
  { value: 'BNA_ACTIVA',  label: 'Tasa activa BNA' },
  { value: 'BNA_PASIVA',  label: 'Tasa pasiva BNA' },
  { value: 'BCRA_PASIVA', label: 'Tasa pasiva BCRA' },
  { value: 'OTRA',        label: 'Otra (especificar)' },
]

function buildPayload(tipo, form) {
  const base = {
    identificacion: {
      numero:    form.numero,
      caratula:  form.caratula,
      fuero:     'civil_comercial',
      juzgado:   form.juzgado,
      secretaria: form.secretaria || null,
      ciudad:    form.ciudad || 'Córdoba',
    },
    partes: form.partes.filter(p => p.nombre),
    texto_libre: form.texto_libre || null,
  }

  if (tipo === 'intimacion_pago') return {
    ...base,
    datos_economicos: buildEco(form),
    plazo_dias: Number(form.plazo_dias) || 5,
    domicilio_intimacion: form.domicilio_intimacion,
  }

  if (tipo === 'mandamiento_pago') return {
    ...base,
    datos_economicos: buildEco(form),
    plazo_dias: Number(form.plazo_dias) || 5,
    domicilio_diligenciamiento: form.domicilio_diligenciamiento,
    bienes_a_embargar: form.bienes_a_embargar || null,
  }

  if (tipo === 'auto_apertura_prueba') return {
    ...base,
    plazo_dias: Number(form.plazo_dias) || 40,
    fecha_inicio_prueba: form.fecha_inicio_prueba,
    prueba_admitida:  form.prueba_admitida || [],
    prueba_rechazada: form.prueba_rechazada || [],
    fundamento_rechazo: form.fundamento_rechazo || null,
  }

  if (tipo === 'decreto_tramite') return {
    ...base,
    tipo: form.tipo_decreto,
    tipo_descripcion: form.tipo_descripcion || null,
    destinatario_rol: form.destinatario_rol,
    plazo_dias: form.plazo_dias ? Number(form.plazo_dias) : null,
  }
}

function buildEco(form) {
  return {
    capital: Number(form.capital),
    tasa: form.tasa,
    tasa_descripcion: form.tasa === 'OTRA' ? form.tasa_descripcion : null,
    fecha_mora: form.fecha_mora,
    costas: form.costas !== false,
  }
}

export default function FormularioEjecutivo({ onPreview }) {
  const [tipo,    setTipo]    = useState('intimacion_pago')
  const [form,    setForm]    = useState({
    numero: '', caratula: '', juzgado: '', secretaria: '', ciudad: 'Córdoba',
    partes: [{ rol: 'actor', nombre: '', dni_cuit: '', domicilio_real: '' },
             { rol: 'demandado', nombre: '', dni_cuit: '', domicilio_real: '' }],
    capital: '', tasa: 'BNA_ACTIVA', tasa_descripcion: '', fecha_mora: '',
    costas: true, plazo_dias: '',
    domicilio_intimacion: '', domicilio_diligenciamiento: '', bienes_a_embargar: '',
    fecha_inicio_prueba: '', prueba_admitida: [], prueba_rechazada: [], fundamento_rechazo: '',
    tipo_decreto: 'traslado', tipo_descripcion: '', destinatario_rol: 'demandado',
    texto_libre: '', fecha_resolucion: '',
  })
  const [cargando, setCargando] = useState(false)
  const [error,    setError]    = useState(null)

  const set = (campo, val) => setForm(f => ({ ...f, [campo]: val }))
  const togglePrueba = (lista, val) => {
    const arr = form[lista]
    set(lista, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  const handlePreview = async () => {
    setError(null); setCargando(true)
    try {
      const payload = buildPayload(tipo, form)
      const texto = await previewDocumento(tipo, payload, form.fecha_resolucion || null)
      onPreview(texto)
    } catch (e) { setError(e.message) }
    finally { setCargando(false) }
  }

  const handleDocx = async () => {
    setError(null); setCargando(true)
    try {
      const payload = buildPayload(tipo, form)
      await descargarDocx(tipo, payload, form.fecha_resolucion || null)
    } catch (e) { setError(e.message) }
    finally { setCargando(false) }
  }

  return (
    <div style={panelStyle}>
      <h2 style={tituloStyle}>Nuevo documento</h2>

      {/* Tipo de documento */}
      <Seccion titulo="Tipo de documento">
        <select value={tipo} onChange={e => setTipo(e.target.value)} style={selectStyle}>
          {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </Seccion>

      {/* Identificación */}
      <Seccion titulo="Expediente">
        <div style={gridStyle}>
          <Campo label="Número (NNNNNNN/YYYY)" value={form.numero} onChange={v => set('numero', v)} placeholder="0012345/2026" />
          <Campo label="Ciudad" value={form.ciudad} onChange={v => set('ciudad', v)} />
        </div>
        <Campo label="Carátula" value={form.caratula} onChange={v => set('caratula', v)} placeholder="García, Juan c/ López, Pedro - Ejecutivo" />
        <div style={gridStyle}>
          <Campo label="Juzgado" value={form.juzgado} onChange={v => set('juzgado', v)} placeholder="Juzgado Civil y Comercial N° 5" />
          <Campo label="Secretaría (opcional)" value={form.secretaria} onChange={v => set('secretaria', v)} placeholder="Secretaría N° 1" />
        </div>
        <Campo label="Fecha de resolución (opcional — por defecto hoy)" type="date" value={form.fecha_resolucion} onChange={v => set('fecha_resolucion', v)} />
      </Seccion>

      {/* Partes */}
      <Seccion titulo="Partes">
        <PartesEditor
          fuero="civil_comercial"
          partes={form.partes}
          onChange={p => set('partes', p)}
        />
      </Seccion>

      {/* Campos económicos (intimación y mandamiento) */}
      {(tipo === 'intimacion_pago' || tipo === 'mandamiento_pago') && (
        <Seccion titulo="Datos económicos">
          <div style={gridStyle}>
            <Campo label="Capital ($)" type="number" value={form.capital} onChange={v => set('capital', v)} placeholder="150000" />
            <Campo label="Fecha de mora" type="date" value={form.fecha_mora} onChange={v => set('fecha_mora', v)} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>Tasa de interés</label>
            <select value={form.tasa} onChange={e => set('tasa', e.target.value)} style={selectStyle}>
              {TASAS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          {form.tasa === 'OTRA' && (
            <Campo label="Descripción de la tasa" value={form.tasa_descripcion} onChange={v => set('tasa_descripcion', v)} placeholder="Ej: tasa activa del Banco de Córdoba" />
          )}
          <div style={gridStyle}>
            <Campo label="Plazo de pago (días hábiles)" type="number" value={form.plazo_dias} onChange={v => set('plazo_dias', v)} placeholder="5" />
            <div>
              <label style={labelStyle}>Costas</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <input type="checkbox" checked={form.costas} onChange={e => set('costas', e.target.checked)} />
                <span style={{ fontSize: 14 }}>Imponer costas al demandado</span>
              </label>
            </div>
          </div>
          {tipo === 'intimacion_pago' && (
            <Campo label="Domicilio de intimación" value={form.domicilio_intimacion} onChange={v => set('domicilio_intimacion', v)} placeholder="Av. Colón 123, Córdoba" />
          )}
          {tipo === 'mandamiento_pago' && (
            <>
              <Campo label="Domicilio de diligenciamiento" value={form.domicilio_diligenciamiento} onChange={v => set('domicilio_diligenciamiento', v)} />
              <Campo label="Bienes a embargar (opcional — si vacío: genérico)" value={form.bienes_a_embargar} onChange={v => set('bienes_a_embargar', v)} />
            </>
          )}
        </Seccion>
      )}

      {/* Apertura a prueba */}
      {tipo === 'auto_apertura_prueba' && (
        <Seccion titulo="Datos del período probatorio">
          <div style={gridStyle}>
            <Campo label="Plazo (días hábiles)" type="number" value={form.plazo_dias} onChange={v => set('plazo_dias', v)} placeholder="40" />
            <Campo label="Fecha inicio del período" type="date" value={form.fecha_inicio_prueba} onChange={v => set('fecha_inicio_prueba', v)} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>Prueba admitida</label>
            {TIPOS_PRUEBA.map(p => (
              <label key={p.value} style={checkStyle}>
                <input type="checkbox" checked={form.prueba_admitida.includes(p.value)}
                  onChange={() => togglePrueba('prueba_admitida', p.value)} />
                {p.label}
              </label>
            ))}
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>Prueba rechazada (opcional)</label>
            {TIPOS_PRUEBA.map(p => (
              <label key={p.value} style={checkStyle}>
                <input type="checkbox" checked={form.prueba_rechazada.includes(p.value)}
                  onChange={() => togglePrueba('prueba_rechazada', p.value)} />
                {p.label}
              </label>
            ))}
          </div>
          {form.prueba_rechazada.length > 0 && (
            <Campo label="Fundamento del rechazo" value={form.fundamento_rechazo} onChange={v => set('fundamento_rechazo', v)} />
          )}
        </Seccion>
      )}

      {/* Decreto de trámite */}
      {tipo === 'decreto_tramite' && (
        <Seccion titulo="Datos del decreto">
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>Tipo de decreto</label>
            <select value={form.tipo_decreto} onChange={e => set('tipo_decreto', e.target.value)} style={selectStyle}>
              {TIPOS_DECRETO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          {form.tipo_decreto === 'otro' && (
            <Campo label="Descripción del decreto" value={form.tipo_descripcion} onChange={v => set('tipo_descripcion', v)} />
          )}
          <div style={gridStyle}>
            <Campo label="Destinatario (rol)" value={form.destinatario_rol} onChange={v => set('destinatario_rol', v)} placeholder="demandado" />
            <Campo label="Plazo (días hábiles, opcional)" type="number" value={form.plazo_dias} onChange={v => set('plazo_dias', v)} placeholder="5" />
          </div>
        </Seccion>
      )}

      {/* Observaciones */}
      <Seccion titulo="Observaciones del actuario (opcional)">
        <textarea
          value={form.texto_libre}
          onChange={e => set('texto_libre', e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder="Texto adicional a incluir en el documento..."
        />
      </Seccion>

      {error && <div style={errorStyle}>{error}</div>}

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button onClick={handlePreview} disabled={cargando} style={btnPrimarioStyle}>
          {cargando ? 'Generando…' : 'Vista previa'}
        </button>
        <button onClick={handleDocx} disabled={cargando} style={btnSecundarioStyle}>
          Descargar DOCX
        </button>
      </div>
    </div>
  )
}

function Seccion({ titulo, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: '#0047AB', textTransform: 'uppercase',
                   letterSpacing: '0.05em', marginBottom: 10, borderBottom: '1px solid #dde',
                   paddingBottom: 4 }}>{titulo}</h3>
      {children}
    </div>
  )
}

function Campo({ label, value, onChange, placeholder = '', type = 'text', style = {} }) {
  return (
    <div style={{ marginBottom: 10, ...style }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} style={inputStyle} />
    </div>
  )
}

const panelStyle = { padding: 24, overflowY: 'auto', height: '100%' }
const tituloStyle = { fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#1a1a2e' }
const labelStyle  = { display: 'block', fontSize: 12, color: '#555', marginBottom: 3, fontWeight: 500 }
const inputStyle  = { width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14 }
const selectStyle = { width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14, background: '#fff' }
const gridStyle   = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }
const checkStyle  = { display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, marginBottom: 4, cursor: 'pointer' }
const errorStyle  = { background: '#fff0f0', border: '1px solid #fcc', borderRadius: 6, padding: '10px 14px', color: '#c00', fontSize: 14, marginBottom: 12 }
const btnPrimarioStyle   = { background: '#0047AB', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontSize: 14, cursor: 'pointer', fontWeight: 600 }
const btnSecundarioStyle = { background: '#fff', color: '#0047AB', border: '1px solid #0047AB', borderRadius: 6, padding: '10px 24px', fontSize: 14, cursor: 'pointer', fontWeight: 600 }
