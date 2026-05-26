/**
 * Wizard principal: fuero → expediente → proceso → etapa → documento → preview
 *
 * Pasos:
 *   0  FUERO       — confirmar el fuero del juzgado (o cambiarlo para demo)
 *   1  EXPEDIENTE  — número, carátula, partes
 *   2  PROCESO     — tipo de proceso dentro del fuero
 *   3  ETAPA       — etapa actual del proceso
 *   4  DOCUMENTO   — documento a generar (puede ser único → auto-avanza)
 *   5  CAMPOS      — campos específicos del documento
 *   6  PREVIEW     — vista previa + descarga DOCX
 */

import { useState, useEffect } from 'react'
import { getCatalogo, previewDocumento, descargarDocx } from '../api.js'
import PartesEditor from './PartesEditor.jsx'
import CamposDocumento from './CamposDocumento.jsx'

const PASOS = ['Fuero', 'Expediente', 'Proceso', 'Etapa', 'Documento', 'Datos', 'Preview']

export default function Wizard({ juzgado, onCambiarJuzgado }) {
  const [paso,     setPaso]     = useState(0)
  const [catalogo, setCatalogo] = useState(null)
  const [error,    setError]    = useState(null)

  // Selecciones del usuario
  const [fueroId,   setFueroId]   = useState(juzgado.fuero)
  const [procesoId, setProcesoId] = useState(null)
  const [etapaId,   setEtapaId]   = useState(null)
  const [tipoDoc,   setTipoDoc]   = useState(null)

  // Datos del expediente
  const [expediente, setExpediente] = useState({
    numero: '', caratula: '',
    partes: [
      { rol: 'actor',     nombre: '', dni_cuit: '', domicilio_real: '' },
      { rol: 'demandado', nombre: '', dni_cuit: '', domicilio_real: '' },
    ],
  })

  // Campos específicos del documento
  const [camposDoc, setCamposDoc] = useState({})
  const [fechaRes,  setFechaRes]  = useState('')
  const [preview,   setPreview]   = useState(null)
  const [cargando,  setCargando]  = useState(false)

  // Cargar catálogo al montar
  useEffect(() => {
    getCatalogo().then(setCatalogo).catch(e => setError(e.message))
  }, [])

  if (error)    return <div style={errorPanelStyle}>Error cargando catálogo: {error}</div>
  if (!catalogo) return <div style={loadingStyle}>Cargando catálogo…</div>

  // Helpers de navegación
  const avanzar  = () => { setError(null); setPaso(p => p + 1) }
  const retroceder = () => { setError(null); setPaso(p => p - 1) }

  // Datos derivados
  const fuero   = catalogo.find(f => f.id === fueroId)
  const proceso = fuero?.procesos.find(p => p.id === procesoId)
  const etapa   = proceso?.etapas.find(e => e.id === etapaId)

  // Handlers de selección con auto-avance cuando hay una sola opción
  const seleccionarProceso = (id) => {
    setProcesoId(id); setEtapaId(null); setTipoDoc(null)
    avanzar()
  }
  const seleccionarEtapa = (id) => {
    setEtapaId(id); setTipoDoc(null)
    const eta = proceso?.etapas.find(e => e.id === id)
    if (eta?.documentos.length === 1) {
      setTipoDoc(eta.documentos[0].tipo)
      setPaso(5) // saltar selección de documento
    } else {
      setPaso(4)
    }
  }
  const seleccionarDocumento = (tipo) => {
    setTipoDoc(tipo); avanzar()
  }

  const handlePreview = async () => {
    setCargando(true); setError(null)
    try {
      const payload = buildPayload(fueroId, tipoDoc, expediente, camposDoc, juzgado)
      const texto = await previewDocumento(tipoDoc, payload, fechaRes || null)
      setPreview(texto)
      setPaso(6)
    } catch (e) { setError(e.message) }
    finally { setCargando(false) }
  }

  const handleDocx = async () => {
    setCargando(true); setError(null)
    try {
      const payload = buildPayload(fueroId, tipoDoc, expediente, camposDoc, juzgado)
      await descargarDocx(tipoDoc, payload, fechaRes || null)
    } catch (e) { setError(e.message) }
    finally { setCargando(false) }
  }

  const reiniciar = () => {
    setProcesoId(null); setEtapaId(null); setTipoDoc(null)
    setCamposDoc({}); setPreview(null); setFechaRes('')
    setExpediente({ numero: '', caratula: '', partes: [
      { rol: 'actor', nombre: '', dni_cuit: '', domicilio_real: '' },
      { rol: 'demandado', nombre: '', dni_cuit: '', domicilio_real: '' },
    ]})
    setPaso(0)
  }

  return (
    <div style={layoutStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div>
          <span style={logoStyle}>Despacho</span>
          <span style={juzgadoChipStyle}>{juzgado.nombre}{juzgado.secretaria ? ` — ${juzgado.secretaria}` : ''}</span>
        </div>
        <button onClick={onCambiarJuzgado} style={btnCambiarStyle}>Cambiar juzgado</button>
      </header>

      {/* Barra de progreso */}
      <BarraProgreso paso={paso} pasos={PASOS} />

      {/* Contenido del paso */}
      <div style={contenidoStyle}>

        {/* PASO 0: Fuero */}
        {paso === 0 && (
          <Paso titulo="Fuero" subtitulo="Confirmá o cambiá el fuero para esta causa">
            <div style={gridFueroStyle}>
              {catalogo.map(f => (
                <TarjetaSeleccion
                  key={f.id}
                  label={f.label}
                  sub={f.norma}
                  seleccionada={f.id === fueroId}
                  onClick={() => { setFueroId(f.id); setProcesoId(null); setEtapaId(null); setTipoDoc(null) }}
                />
              ))}
            </div>
            <BotonesNav onSiguiente={avanzar} />
          </Paso>
        )}

        {/* PASO 1: Expediente */}
        {paso === 1 && (
          <Paso titulo="Expediente" subtitulo="Datos de la causa">
            <div style={gridStyle}>
              <Campo label="Número de expediente" placeholder="0012345/2026"
                value={expediente.numero} onChange={v => setExpediente(e => ({...e, numero: v}))} />
              <Campo label="Ciudad sede" placeholder="Córdoba"
                value={juzgado.ciudad} disabled />
            </div>
            <Campo label="Carátula" placeholder="García, Juan c/ López, Pedro — Ejecutivo"
              value={expediente.caratula} onChange={v => setExpediente(e => ({...e, caratula: v}))} />
            <Campo label="Fecha de resolución (opcional — por defecto hoy)" type="date"
              value={fechaRes} onChange={setFechaRes} />
            <h3 style={subtituloSeccionStyle}>Partes</h3>
            <PartesEditor
              fuero={fueroId}
              partes={expediente.partes}
              onChange={p => setExpediente(e => ({...e, partes: p}))}
            />
            <BotonesNav onAnterior={retroceder} onSiguiente={() => {
              if (!expediente.numero.trim()) { setError('Ingresá el número de expediente'); return }
              if (!expediente.caratula.trim()) { setError('Ingresá la carátula'); return }
              avanzar()
            }} errorMsg={error} />
          </Paso>
        )}

        {/* PASO 2: Proceso */}
        {paso === 2 && (
          <Paso titulo="Tipo de proceso" subtitulo={`Fuero: ${fuero?.label}`}>
            <div style={listaStyle}>
              {fuero?.procesos.map(p => (
                <TarjetaSeleccion
                  key={p.id}
                  label={p.label}
                  sub={p.descripcion}
                  seleccionada={p.id === procesoId}
                  onClick={() => seleccionarProceso(p.id)}
                  flecha
                />
              ))}
            </div>
            <BotonesNav onAnterior={retroceder} />
          </Paso>
        )}

        {/* PASO 3: Etapa */}
        {paso === 3 && (
          <Paso titulo="Etapa del proceso" subtitulo={`${fuero?.label} › ${proceso?.label}`}>
            <div style={listaStyle}>
              {proceso?.etapas.map(e => (
                <TarjetaSeleccion
                  key={e.id}
                  label={e.label}
                  sub={e.descripcion}
                  seleccionada={e.id === etapaId}
                  onClick={() => seleccionarEtapa(e.id)}
                  flecha
                />
              ))}
            </div>
            <BotonesNav onAnterior={retroceder} />
          </Paso>
        )}

        {/* PASO 4: Documento (solo si hay más de uno en la etapa) */}
        {paso === 4 && (
          <Paso titulo="Documento a generar" subtitulo={`${proceso?.label} › ${etapa?.label}`}>
            <div style={listaStyle}>
              {etapa?.documentos.map(d => (
                <TarjetaSeleccion
                  key={d.tipo}
                  label={d.label}
                  sub={`${d.descripcion} — ${d.norma}`}
                  seleccionada={d.tipo === tipoDoc}
                  onClick={() => seleccionarDocumento(d.tipo)}
                  flecha
                />
              ))}
            </div>
            <BotonesNav onAnterior={retroceder} />
          </Paso>
        )}

        {/* PASO 5: Campos específicos */}
        {paso === 5 && (
          <Paso
            titulo={etapa?.documentos.find(d => d.tipo === tipoDoc)?.label || 'Datos del documento'}
            subtitulo={etapa?.documentos.find(d => d.tipo === tipoDoc)?.norma}
          >
            <CamposDocumento
              tipo={tipoDoc}
              fuero={fueroId}
              valores={camposDoc}
              onChange={setCamposDoc}
            />
            {error && <p style={errorInlineStyle}>{error}</p>}
            <BotonesNav
              onAnterior={retroceder}
              onSiguiente={handlePreview}
              labelSiguiente={cargando ? 'Generando…' : 'Vista previa'}
              disabled={cargando}
            />
          </Paso>
        )}

        {/* PASO 6: Preview */}
        {paso === 6 && (
          <div style={previewWrapStyle}>
            <div style={previewHeaderStyle}>
              <div>
                <strong>{etapa?.documentos.find(d => d.tipo === tipoDoc)?.label}</strong>
                <span style={{ color: '#888', marginLeft: 12, fontSize: 13 }}>
                  {expediente.caratula}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={retroceder} style={btnSecStyle}>← Volver</button>
                <button onClick={handleDocx} disabled={cargando} style={btnPrimStyle}>
                  {cargando ? 'Generando…' : '⬇ Descargar DOCX'}
                </button>
                <button onClick={reiniciar} style={btnSecStyle}>Nuevo documento</button>
              </div>
            </div>
            {error && <p style={{ ...errorInlineStyle, margin: '8px 24px' }}>{error}</p>}
            <pre style={preStyle}>{preview}</pre>
          </div>
        )}

      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

function Paso({ titulo, subtitulo, children }) {
  return (
    <div style={pasoStyle}>
      <h2 style={pasoTituloStyle}>{titulo}</h2>
      {subtitulo && <p style={pasoSubStyle}>{subtitulo}</p>}
      {children}
    </div>
  )
}

function BarraProgreso({ paso, pasos }) {
  return (
    <div style={barraStyle}>
      {pasos.map((label, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            ...pasoCirculoStyle,
            background: i < paso ? '#0047AB' : i === paso ? '#0047AB' : '#e0e0e8',
            color: i <= paso ? '#fff' : '#999',
            fontWeight: i === paso ? 700 : 400,
          }}>
            {i < paso ? '✓' : i + 1}
          </div>
          <span style={{
            fontSize: 11, color: i === paso ? '#0047AB' : '#999',
            fontWeight: i === paso ? 600 : 400,
            display: 'none', // mostrar solo en desktop
          }}>{label}</span>
          {i < pasos.length - 1 && (
            <div style={{ width: 24, height: 2, background: i < paso ? '#0047AB' : '#e0e0e8', margin: '0 4px' }} />
          )}
        </div>
      ))}
    </div>
  )
}

function TarjetaSeleccion({ label, sub, seleccionada, onClick, flecha }) {
  return (
    <button onClick={onClick} style={{
      ...tarjetaStyle,
      borderColor: seleccionada ? '#0047AB' : '#e0e0e8',
      background:  seleccionada ? '#f0f4ff' : '#fff',
    }}>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e', marginBottom: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: '#777', lineHeight: 1.4 }}>{sub}</div>}
      </div>
      {flecha && <span style={{ color: '#0047AB', fontSize: 18 }}>›</span>}
    </button>
  )
}

function BotonesNav({ onAnterior, onSiguiente, labelSiguiente = 'Siguiente →', disabled = false, errorMsg }) {
  return (
    <div style={{ marginTop: 28 }}>
      {errorMsg && <p style={errorInlineStyle}>{errorMsg}</p>}
      <div style={{ display: 'flex', gap: 12 }}>
        {onAnterior && <button onClick={onAnterior} style={btnSecStyle}>← Anterior</button>}
        {onSiguiente && <button onClick={onSiguiente} disabled={disabled} style={btnPrimStyle}>{labelSiguiente}</button>}
      </div>
    </div>
  )
}

function Campo({ label, value, onChange, placeholder = '', type = 'text', disabled = false }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        style={{ ...inputStyle, background: disabled ? '#f5f5f5' : '#fff' }} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Builder de payload
// ---------------------------------------------------------------------------

function buildPayload(fueroId, tipoDoc, expediente, camposDoc, juzgado) {
  const base = {
    identificacion: {
      numero:     expediente.numero,
      caratula:   expediente.caratula,
      fuero:      fueroId,
      juzgado:    juzgado.nombre,
      secretaria: juzgado.secretaria || null,
      ciudad:     juzgado.ciudad || 'Córdoba',
    },
    partes: expediente.partes.filter(p => p.nombre.trim()),
    texto_libre: camposDoc.texto_libre || null,
  }

  if (tipoDoc === 'intimacion_pago') return {
    ...base,
    datos_economicos: buildEco(camposDoc),
    plazo_dias: Number(camposDoc.plazo_dias) || 5,
    domicilio_intimacion: camposDoc.domicilio_intimacion || '',
  }
  if (tipoDoc === 'mandamiento_pago') return {
    ...base,
    datos_economicos: buildEco(camposDoc),
    plazo_dias: Number(camposDoc.plazo_dias) || 5,
    domicilio_diligenciamiento: camposDoc.domicilio_diligenciamiento || '',
    bienes_a_embargar: camposDoc.bienes_a_embargar || null,
  }
  if (tipoDoc === 'auto_apertura_prueba') return {
    ...base,
    plazo_dias: Number(camposDoc.plazo_dias) || 40,
    fecha_inicio_prueba: camposDoc.fecha_inicio_prueba || new Date().toISOString().split('T')[0],
    prueba_admitida:  camposDoc.prueba_admitida  || [],
    prueba_rechazada: camposDoc.prueba_rechazada || [],
    fundamento_rechazo: camposDoc.fundamento_rechazo || null,
  }
  if (tipoDoc === 'decreto_tramite') return {
    ...base,
    tipo: camposDoc.tipo_decreto || 'traslado',
    tipo_descripcion: camposDoc.tipo_descripcion || null,
    destinatario_rol: camposDoc.destinatario_rol || 'demandado',
    plazo_dias: camposDoc.plazo_dias ? Number(camposDoc.plazo_dias) : null,
  }
  if (tipoDoc === 'traslado_demanda') return {
    ...base,
    tipo: camposDoc.tipo_traslado || 'demanda',
    objeto: camposDoc.objeto || null,
    plazo_dias: Number(camposDoc.plazo_dias) || 30,
  }
  if (tipoDoc === 'auto_apertura_ordinario') return {
    ...base,
    plazo_dias: Number(camposDoc.plazo_dias) || 40,
    fecha_inicio_prueba: camposDoc.fecha_inicio_prueba || new Date().toISOString().split('T')[0],
    prueba_admitida:  camposDoc.prueba_admitida  || [],
    prueba_rechazada: camposDoc.prueba_rechazada || [],
    fundamento_rechazo: camposDoc.fundamento_rechazo || null,
  }
  return base
}

function buildEco(c) {
  return {
    capital:          Number(c.capital),
    tasa:             c.tasa || 'BNA_ACTIVA',
    tasa_descripcion: c.tasa === 'OTRA' ? c.tasa_descripcion : null,
    fecha_mora:       c.fecha_mora,
    costas:           c.costas !== false,
  }
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const layoutStyle       = { display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', fontFamily: 'system-ui, sans-serif' }
const headerStyle       = { background: '#0047AB', color: '#fff', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }
const logoStyle         = { fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', marginRight: 16 }
const juzgadoChipStyle  = { fontSize: 13, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '3px 10px' }
const btnCambiarStyle   = { background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: '#fff', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 12 }
const barraStyle        = { display: 'flex', alignItems: 'center', padding: '10px 24px', background: '#fff', borderBottom: '1px solid #eee', flexShrink: 0 }
const pasoCirculoStyle  = { width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }
const contenidoStyle    = { flex: 1, overflowY: 'auto', background: '#f4f5f7' }
const pasoStyle         = { maxWidth: 680, margin: '0 auto', padding: '32px 24px' }
const pasoTituloStyle   = { fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }
const pasoSubStyle      = { fontSize: 14, color: '#777', marginBottom: 24 }
const gridFueroStyle    = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 8 }
const gridStyle         = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }
const listaStyle        = { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }
const tarjetaStyle      = { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: '1.5px solid', borderRadius: 8, cursor: 'pointer', width: '100%', transition: 'all 0.15s' }
const subtituloSeccionStyle = { fontSize: 13, fontWeight: 600, color: '#0047AB', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '20px 0 10px' }
const labelStyle        = { display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }
const inputStyle        = { width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #ddd', fontSize: 14, boxSizing: 'border-box' }
const btnPrimStyle      = { background: '#0047AB', color: '#fff', border: 'none', borderRadius: 7, padding: '10px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }
const btnSecStyle       = { background: '#fff', color: '#0047AB', border: '1.5px solid #0047AB', borderRadius: 7, padding: '10px 22px', fontSize: 14, cursor: 'pointer' }
const errorInlineStyle  = { color: '#c00', fontSize: 13, marginBottom: 8 }
const errorPanelStyle   = { padding: 32, color: '#c00' }
const loadingStyle      = { padding: 32, color: '#888' }
const previewWrapStyle  = { display: 'flex', flexDirection: 'column', height: '100%' }
const previewHeaderStyle= { padding: '12px 24px', borderBottom: '1px solid #eee', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap', gap: 8 }
const preStyle          = { fontFamily: '"Courier New", monospace', fontSize: 13, lineHeight: 1.8, padding: 32, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 16, background: '#fff', borderRadius: 8, border: '1px solid #e0e0e8' }
