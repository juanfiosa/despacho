/**
 * Vista de línea de tiempo para un caso personalizado.
 * Muestra las etapas del proceso elegido y, dentro de cada etapa,
 * las tarjetas de documentos disponibles con sus campos_extra para completar.
 *
 * Props:
 *   caso        – objeto caso creado por NuevoCasoForm
 *   juzgado     – objeto juzgado (de useJuzgado)
 *   onVolver    – callback para volver al listado
 */

import { useState, useCallback } from 'react'
import { previewDocumento, descargarDocx } from '../api.js'
import { PROCESOS, TIPOS_PRUEBA } from '../data/procesosTemplates.js'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MESES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
function fmtFecha(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${parseInt(d)} ${MESES[parseInt(m)-1]} ${y}`
}

/** Convierte los valores raw de campos_extra al tipo correcto para la API */
function coerceCampo(campo, raw) {
  if (raw === undefined || raw === null || raw === '') {
    return campo.default !== undefined ? campo.default : undefined
  }
  if (campo.type === 'number') {
    const n = Number(raw)
    return isNaN(n) ? undefined : n
  }
  if (campo.type === 'select') {
    if (raw === 'true')  return true
    if (raw === 'false') return false
    const n = Number(raw)
    if (!isNaN(n) && raw !== '') return n
    return raw
  }
  if (campo.type === 'multi_prueba') {
    return Array.isArray(raw) ? raw : []
  }
  if (campo.type === 'textarea_list') {
    if (!raw?.trim()) return []
    return raw.split('\n').map(s => s.trim()).filter(Boolean)
  }
  return raw
}

/** Construye el payload final para la API */
function buildPayload(doc, caso) {
  const fixedFields = doc.fixed(caso)
  const extraValues = {}
  ;(doc.campos_extra || []).forEach(c => {
    const raw = caso._extraValues?.[doc.tipo]?.[c.key]
    const v = coerceCampo(c, raw)
    if (v !== undefined) extraValues[c.key] = v
  })
  return { ...fixedFields, ...extraValues }
}

// ─── Campo renderer ───────────────────────────────────────────────────────────

function CampoExtra({ campo, value, onChange }) {
  const common = { style: campoInputStyle }

  if (campo.type === 'textarea') {
    return (
      <textarea
        {...common}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={campo.placeholder || ''}
        rows={3}
        style={{ ...campoInputStyle, resize: 'vertical', lineHeight: 1.5 }}
      />
    )
  }
  if (campo.type === 'textarea_list') {
    return (
      <textarea
        {...common}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={campo.placeholder || 'Un ítem por línea'}
        rows={3}
        style={{ ...campoInputStyle, resize: 'vertical', lineHeight: 1.5 }}
      />
    )
  }
  if (campo.type === 'select') {
    const opts = campo.options || []
    return (
      <select
        {...common}
        style={{ ...campoInputStyle, cursor: 'pointer' }}
        value={value !== undefined ? String(value) : String(campo.default ?? '')}
        onChange={e => onChange(e.target.value)}
      >
        {opts.map(o => (
          <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
        ))}
      </select>
    )
  }
  if (campo.type === 'multi_prueba') {
    const selected = Array.isArray(value) ? value : []
    return (
      <div style={checkGroupStyle}>
        {TIPOS_PRUEBA.map(tp => (
          <label key={tp.value} style={checkLabelStyle}>
            <input
              type="checkbox"
              checked={selected.includes(tp.value)}
              onChange={e => {
                const next = e.target.checked
                  ? [...selected, tp.value]
                  : selected.filter(v => v !== tp.value)
                onChange(next)
              }}
              style={{ marginRight: 5 }}
            />
            {tp.label}
          </label>
        ))}
      </div>
    )
  }
  // date / time / number / text
  return (
    <input
      {...common}
      type={campo.type === 'number' ? 'number' : campo.type === 'date' ? 'date' : campo.type === 'time' ? 'time' : 'text'}
      value={value ?? (campo.default !== undefined ? campo.default : '')}
      onChange={e => onChange(e.target.value)}
      placeholder={campo.placeholder || ''}
    />
  )
}

// ─── Tarjeta de documento ─────────────────────────────────────────────────────

function DocumentoCard({ doc, caso, color, bg }) {
  const [extraValues, setExtraValues] = useState(() => {
    // Inicializar con defaults
    const init = {}
    ;(doc.campos_extra || []).forEach(c => {
      if (c.default !== undefined) init[c.key] = c.default
    })
    return init
  })
  const [status,      setStatus]      = useState('idle')  // idle | loading | done | error
  const [texto,       setTexto]       = useState(null)
  const [errorMsg,    setErrorMsg]    = useState(null)
  const [descargando, setDescargando] = useState(false)

  const setValor = (key, val) => setExtraValues(prev => ({ ...prev, [key]: val }))

  const casoConExtra = { ...caso, _extraValues: { [doc.tipo]: extraValues } }

  const generar = async () => {
    setStatus('loading')
    setErrorMsg(null)
    try {
      const payload = buildPayload(doc, casoConExtra)
      const t = await previewDocumento(doc.tipo, payload)
      setTexto(t)
      setStatus('done')
    } catch (e) {
      setErrorMsg(e.message)
      setStatus('error')
    }
  }

  const descargar = async () => {
    setDescargando(true)
    try {
      const payload = buildPayload(doc, casoConExtra)
      await descargarDocx(doc.tipo, payload)
    } catch (e) {
      setErrorMsg(`Error DOCX: ${e.message}`)
    }
    setDescargando(false)
  }

  const reset = () => { setStatus('idle'); setTexto(null); setErrorMsg(null) }

  const hasCampos = doc.campos_extra?.length > 0

  return (
    <div style={docCardStyle}>
      {/* Cabecera */}
      <div style={{ ...docCardHeadStyle, borderBottomColor: color + '33' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.35 }}>
            {doc.nombre}
          </div>
          <div style={{ fontSize: 10, color: '#aaa', fontFamily: 'monospace', marginTop: 2 }}>
            {doc.tipo}
          </div>
        </div>
        {status === 'done' && (
          <span style={{ fontSize: 12, color: '#388e3c', fontWeight: 700 }}>✓ Generado</span>
        )}
      </div>

      {/* Campos extra */}
      {hasCampos && status !== 'done' && (
        <div style={docCardBodyStyle}>
          {doc.campos_extra.map(c => (
            <div key={c.key} style={{ marginBottom: 12 }}>
              <label style={campoLabelStyle}>
                {c.label}
                {c.required && <span style={{ color: '#e53935' }}> *</span>}
              </label>
              <CampoExtra
                campo={c}
                value={extraValues[c.key]}
                onChange={v => setValor(c.key, v)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Acciones */}
      <div style={docCardFootStyle}>
        {status === 'idle' && (
          <button onClick={generar} style={{ ...btnStyle, background: color }}>
            ▶ Generar
          </button>
        )}
        {status === 'loading' && (
          <button disabled style={{ ...btnStyle, background: '#9e9e9e', cursor: 'default' }}>
            ⏳ Generando…
          </button>
        )}
        {(status === 'done' || status === 'error') && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={reset} style={btnResetStyle}>↺ Reintentar</button>
            {status === 'done' && (
              <button onClick={descargar} disabled={descargando}
                style={{ ...btnDocxStyle, background: color, opacity: descargando ? 0.6 : 1 }}>
                {descargando ? '⏳…' : '⬇ DOCX'}
              </button>
            )}
          </div>
        )}
        {errorMsg && (
          <div style={{ fontSize: 12, color: '#c00', marginTop: 6, lineHeight: 1.4 }}>
            ⚠️ {errorMsg}
          </div>
        )}
      </div>

      {/* Preview */}
      {status === 'done' && texto && (
        <div style={previewBoxStyle}>
          <pre style={preStyle}>{texto}</pre>
        </div>
      )}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function CasoCustomTimeline({ caso, onVolver }) {
  const proceso = PROCESOS.find(p => p.id === caso.procesoId)
  if (!proceso) return <div style={{ padding: 32 }}>Proceso no encontrado.</div>

  const { color, bg } = proceso

  return (
    <div style={wrapStyle}>

      {/* Cabecera del caso */}
      <div style={{ ...caseHeaderStyle, borderLeftColor: color }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
          <button onClick={onVolver} style={backBtnStyle}>← Volver</button>
          <span style={{ ...fueroTagStyle, background: bg, color }}>
            {proceso.icono} {proceso.nombre}
          </span>
        </div>
        <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: '#1a1a2e' }}>
          {caso.caratula}
        </h2>
        <div style={{ fontSize: 12, color: '#888' }}>
          Expte. N.° <strong>{caso.expediente}</strong>
          {caso.juzgado && (
            <> · {caso.juzgado.nombre}{caso.juzgado.secretaria ? ` — ${caso.juzgado.secretaria}` : ''}</>
          )}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#aaa' }}>
          {proceso.etapas.length} etapas · {proceso.etapas.reduce((n, e) => n + e.documentos.length, 0)} tipos de documento disponibles
        </div>
      </div>

      {/* Línea de tiempo de etapas */}
      <div style={timelineStyle}>
        {proceso.etapas.map((etapa, idx) => {
          const isLast = idx === proceso.etapas.length - 1
          return (
            <div key={etapa.id} style={timelineItemStyle}>

              {/* Columna izquierda: círculo + línea */}
              <div style={timelineLeftStyle}>
                <div style={{ ...circleStyle, background: color, color: '#fff', borderColor: color }}>
                  {etapa.orden}
                </div>
                {!isLast && <div style={{ ...lineStyle, borderLeftColor: color + '55' }} />}
              </div>

              {/* Contenido */}
              <div style={{ flex: 1, paddingLeft: 14, paddingBottom: isLast ? 16 : 36 }}>
                {/* Etiqueta de etapa */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 5 }}>
                  <span style={{ ...etapaTagStyle, background: bg, color }}>
                    Etapa {etapa.orden}
                  </span>
                  <h3 style={etapaTitleStyle}>{etapa.nombre}</h3>
                </div>
                <p style={etapaDescStyle}>{etapa.descripcion}</p>

                {/* Tarjetas de documentos */}
                <div style={docsGridStyle}>
                  {etapa.documentos.map(doc => (
                    <DocumentoCard
                      key={doc.tipo}
                      doc={doc}
                      caso={caso}
                      color={color}
                      bg={bg}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const wrapStyle        = { flex: 1, overflowY: 'auto', padding: '28px 32px', background: '#f4f5f7' }

const caseHeaderStyle  = { background: '#fff', borderRadius: 10, padding: '20px 26px', marginBottom: 32, borderLeft: '4px solid', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }
const fueroTagStyle    = { fontSize: 11, fontWeight: 700, borderRadius: 4, padding: '3px 9px', display: 'inline-flex', alignItems: 'center', gap: 4 }
const backBtnStyle     = { background: 'none', border: 'none', cursor: 'pointer', color: '#0047AB', fontSize: 13, fontWeight: 600, padding: '4px 0', display: 'inline-flex', alignItems: 'center', gap: 4 }

const timelineStyle    = { position: 'relative' }
const timelineItemStyle = { display: 'flex', gap: 0 }
const timelineLeftStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', width: 52, flexShrink: 0 }
const circleStyle      = { width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, border: '2px solid', flexShrink: 0, zIndex: 1 }
const lineStyle        = { flex: 1, borderLeft: '2px dashed', opacity: 0.5, minHeight: 20, marginTop: 0 }

const etapaTagStyle    = { fontSize: 11, fontWeight: 700, borderRadius: 4, padding: '3px 9px', display: 'inline-block', flexShrink: 0 }
const etapaTitleStyle  = { margin: 0, fontSize: 17, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3 }
const etapaDescStyle   = { margin: '4px 0 14px', fontSize: 13, color: '#666', lineHeight: 1.6 }

const docsGridStyle    = { display: 'flex', flexDirection: 'column', gap: 14 }

// Tarjeta de documento
const docCardStyle     = { background: '#fff', borderRadius: 8, border: '1px solid #e0e0e8', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }
const docCardHeadStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 16px 12px', borderBottom: '1px solid' }
const docCardBodyStyle = { padding: '14px 16px 0' }
const docCardFootStyle = { padding: '12px 16px 14px' }

const campoLabelStyle  = { display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5 }
const campoInputStyle  = { width: '100%', padding: '8px 10px', border: '1px solid #d0d0dc', borderRadius: 6, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }

const checkGroupStyle  = { display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }
const checkLabelStyle  = { display: 'flex', alignItems: 'center', fontSize: 12, color: '#444', cursor: 'pointer' }

const btnStyle         = { color: '#fff', border: 'none', borderRadius: 7, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }
const btnDocxStyle     = { color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }
const btnResetStyle    = { background: '#f0f0f8', color: '#555', border: 'none', borderRadius: 6, padding: '7px 12px', fontSize: 12, cursor: 'pointer' }

const previewBoxStyle  = { borderTop: '1px solid #e8e8f0', maxHeight: 380, overflowY: 'auto' }
const preStyle         = { fontFamily: '"Courier New", monospace', fontSize: 12, lineHeight: 1.7, padding: '18px 20px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, background: '#fff' }
