/**
 * Pestaña de demos — muestra 5 casos precargados por fuero judicial.
 * Al hacer clic en "▶ Ejecutar demo", carga el JSON y llama a la API
 * de preview para mostrar el documento generado, tal como lo vería
 * un operador real.
 */

import { useState, useEffect } from 'react'
import { previewDocumento, descargarDocx } from '../api.js'

const FUERO_ICONS = {
  laboral:                      '⚖️',
  civil_comercial:              '📋',
  familia:                      '👨‍👩‍👧',
  penal:                        '🔒',
  contencioso_administrativo:   '🏛️',
}

const FUERO_COLORS = {
  laboral:                      '#1565c0',
  civil_comercial:              '#2e7d32',
  familia:                      '#6a1b9a',
  penal:                        '#b71c1c',
  contencioso_administrativo:   '#e65100',
}

const FUERO_BG = {
  laboral:                      '#e3f2fd',
  civil_comercial:              '#e8f5e9',
  familia:                      '#f3e5f5',
  penal:                        '#ffebee',
  contencioso_administrativo:   '#fff3e0',
}

export default function Demos({ juzgado }) {
  const [indice,      setIndice]      = useState(null)
  const [fueroActivo, setFueroActivo] = useState(null)
  const [preview,     setPreview]     = useState(null)   // { titulo, texto, tipo, input }
  const [cargando,    setCargando]    = useState(null)   // id del demo en ejecución
  const [descargando, setDescargando] = useState(false)
  const [error,       setError]       = useState(null)

  useEffect(() => {
    fetch('/demos/index.json')
      .then(r => { if (!r.ok) throw new Error('No se encontró /demos/index.json'); return r.json() })
      .then(data => {
        setIndice(data)
        setFueroActivo(data.fueros[0].fuero)
      })
      .catch(e => setError(e.message))
  }, [])

  if (error && !indice) return <div style={errorPanelStyle}>⚠️ {error}</div>
  if (!indice) return <div style={loadingStyle}>Cargando demos…</div>

  const fueroData   = indice.fueros.find(f => f.fuero === fueroActivo)
  const colorActivo = FUERO_COLORS[fueroActivo] || '#0047AB'
  const bgActivo    = FUERO_BG[fueroActivo]    || '#f0f4ff'

  const ejecutarDemo = async (demoRef) => {
    setCargando(demoRef.id)
    setError(null)
    setPreview(null)
    try {
      const resp = await fetch(`/demos/${demoRef.file}`)
      if (!resp.ok) throw new Error(`No se pudo cargar ${demoRef.file}`)
      const demo = await resp.json()
      const texto = await previewDocumento(demo.meta.tipo, demo.input, null)
      setPreview({
        titulo:    demo.meta.titulo,
        descripcion: demo.meta.descripcion,
        proceso:   demo.meta.proceso,
        etapa:     demo.meta.etapa,
        texto,
        tipo:      demo.meta.tipo,
        input:     demo.input,
        fueroLabel: fueroData?.fuero_label,
      })
    } catch (e) {
      setError(`Error al ejecutar "${demoRef.titulo}": ${e.message}`)
    } finally {
      setCargando(null)
    }
  }

  const descargar = async () => {
    if (!preview) return
    setDescargando(true)
    setError(null)
    try {
      await descargarDocx(preview.tipo, preview.input, null)
    } catch (e) {
      setError(`Error al generar DOCX: ${e.message}`)
    } finally {
      setDescargando(false)
    }
  }

  const cerrarPreview = () => { setPreview(null); setError(null) }

  return (
    <div style={layoutStyle}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header style={headerStyle}>
        <span style={logoStyle}>Despacho</span>
        {juzgado && (
          <span style={chipStyle}>{juzgado.nombre}{juzgado.secretaria ? ` — ${juzgado.secretaria}` : ''}</span>
        )}
        <div style={{ flex: 1 }} />
        <span style={demosBadgeStyle}>🎬 DEMOS</span>
        <span style={subheadStyle}>Casos de demostración por fuero</span>
      </header>

      {/* ── Body ───────────────────────────────────────────────────── */}
      <div style={bodyStyle}>

        {/* Sidebar — selección de fuero */}
        <aside style={sidebarStyle}>
          <div style={sidebarTitleStyle}>Fuero judicial</div>
          {indice.fueros.map(f => {
            const activo = f.fuero === fueroActivo
            return (
              <button
                key={f.fuero}
                onClick={() => { setFueroActivo(f.fuero); setPreview(null); setError(null) }}
                style={{
                  ...sidebarItemStyle,
                  background:  activo ? FUERO_BG[f.fuero] || '#e8f0fe' : 'transparent',
                  color:       activo ? FUERO_COLORS[f.fuero] || '#0047AB' : '#555',
                  fontWeight:  activo ? 700 : 400,
                  borderLeft:  `3px solid ${activo ? (FUERO_COLORS[f.fuero] || '#0047AB') : 'transparent'}`,
                }}
              >
                <span style={{ fontSize: 18, marginRight: 8, lineHeight: 1 }}>
                  {FUERO_ICONS[f.fuero] || '📄'}
                </span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, lineHeight: 1.3 }}>{f.fuero_label}</div>
                  <div style={{ fontSize: 11, color: '#999', fontWeight: 400, lineHeight: 1.3 }}>{f.descripcion}</div>
                </div>
              </button>
            )
          })}
        </aside>

        {/* Main content */}
        <main style={mainStyle}>

          {/* ── Vista previa del documento ─────────────────────────── */}
          {preview ? (
            <div style={previewWrapStyle}>
              <div style={{ ...previewHeaderBarStyle, borderTopColor: colorActivo }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ ...fueroTagStyle, background: bgActivo, color: colorActivo }}>
                      {FUERO_ICONS[fueroActivo]} {preview.fueroLabel}
                    </span>
                    <span style={{ fontSize: 11, color: '#999' }}>{preview.proceso} › {preview.etapa}</span>
                  </div>
                  <h2 style={previewTituloStyle}>{preview.titulo}</h2>
                  <p style={previewDescStyle}>{preview.descripcion}</p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <button onClick={cerrarPreview} style={btnSecStyle}>← Volver a demos</button>
                  <button onClick={descargar} disabled={descargando} style={{ ...btnPrimStyle, background: colorActivo }}>
                    {descargando ? '⏳ Generando…' : '⬇ Descargar DOCX'}
                  </button>
                </div>
              </div>
              {error && <div style={errorBannerStyle}>⚠️ {error}</div>}
              <pre style={preStyle}>{preview.texto}</pre>
            </div>
          ) : (
            /* ── Lista de demos del fuero ──────────────────────────── */
            <div style={listWrapStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 32 }}>{FUERO_ICONS[fueroActivo]}</span>
                <div>
                  <h2 style={fueroTitleStyle}>{fueroData?.fuero_label}</h2>
                  <p style={fueroDescTextStyle}>{fueroData?.descripcion}</p>
                </div>
              </div>

              {error && <div style={errorBannerStyle}>⚠️ {error}</div>}

              <div style={cardsGridStyle}>
                {fueroData?.demos.map((demo, idx) => {
                  const esActivo = cargando === demo.id
                  return (
                    <div key={demo.id} style={cardStyle}>
                      <div style={cardIndexStyle}>{idx + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ ...procesoTagStyle, background: bgActivo, color: colorActivo }}>
                          {demo.proceso}
                        </div>
                        <h3 style={cardTitleStyle}>{demo.titulo}</h3>
                        <p style={cardEtapaStyle}>{demo.etapa}</p>
                      </div>
                      <button
                        onClick={() => ejecutarDemo(demo)}
                        disabled={esActivo || cargando !== null}
                        style={{
                          ...btnDemoStyle,
                          background: esActivo ? '#ccc' : colorActivo,
                          cursor: (esActivo || cargando !== null) ? 'default' : 'pointer',
                        }}
                      >
                        {esActivo ? '⏳ Generando…' : '▶ Ejecutar demo'}
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Nota de uso */}
              <div style={notaStyle}>
                <strong>¿Qué hace este demo?</strong> Carga un expediente judicial de ejemplo con datos reales
                y llama a la API del sistema para generar el documento tal como lo vería un operador del juzgado.
                Podés descargar el resultado en formato DOCX listo para usar.
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const layoutStyle        = { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'system-ui, sans-serif' }
const headerStyle        = { background: '#0047AB', color: '#fff', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }
const logoStyle          = { fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }
const chipStyle          = { fontSize: 12, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '3px 10px' }
const demosBadgeStyle    = { fontSize: 12, background: 'rgba(255,215,0,0.25)', color: '#ffe066', borderRadius: 20, padding: '3px 10px', fontWeight: 700, letterSpacing: '0.05em' }
const subheadStyle       = { fontSize: 12, color: 'rgba(255,255,255,0.65)' }
const bodyStyle          = { flex: 1, overflow: 'hidden', display: 'flex' }

const sidebarStyle       = { width: 220, flexShrink: 0, background: '#fff', borderRight: '1px solid #e0e0e8', overflowY: 'auto', padding: '16px 0' }
const sidebarTitleStyle  = { fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 16px 10px' }
const sidebarItemStyle   = { display: 'flex', alignItems: 'center', width: '100%', padding: '10px 16px', border: 'none', cursor: 'pointer', borderRadius: 0, transition: 'all 0.12s', marginBottom: 2 }

const mainStyle          = { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#f4f5f7' }

const listWrapStyle      = { flex: 1, overflowY: 'auto', padding: 28 }
const fueroTitleStyle    = { margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a2e' }
const fueroDescTextStyle = { margin: '4px 0 0', fontSize: 13, color: '#888' }

const cardsGridStyle     = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }
const cardStyle          = { background: '#fff', borderRadius: 10, padding: '18px 18px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: '1px solid #e8e8f0', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }
const cardIndexStyle     = { position: 'absolute', top: 14, right: 14, width: 22, height: 22, borderRadius: '50%', background: '#f0f0f8', color: '#aaa', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }
const procesoTagStyle    = { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', borderRadius: 4, padding: '2px 7px', display: 'inline-block', marginBottom: 4 }
const cardTitleStyle     = { margin: 0, fontSize: 14, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.35 }
const cardEtapaStyle     = { margin: 0, fontSize: 12, color: '#888', lineHeight: 1.4 }
const btnDemoStyle       = { color: '#fff', border: 'none', borderRadius: 7, padding: '9px 0', fontSize: 13, fontWeight: 700, marginTop: 8, width: '100%', transition: 'opacity 0.15s' }

const notaStyle          = { background: '#fff', border: '1px solid #e0e0e8', borderRadius: 8, padding: '14px 18px', fontSize: 12, color: '#666', lineHeight: 1.6 }

const previewWrapStyle       = { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }
const previewHeaderBarStyle  = { background: '#fff', borderTop: '3px solid', padding: '16px 24px', display: 'flex', gap: 16, alignItems: 'flex-start', borderBottom: '1px solid #e0e0e8', flexShrink: 0, flexWrap: 'wrap' }
const fueroTagStyle          = { fontSize: 11, fontWeight: 700, borderRadius: 4, padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }
const previewTituloStyle     = { margin: '6px 0 4px', fontSize: 18, fontWeight: 700, color: '#1a1a2e' }
const previewDescStyle       = { margin: 0, fontSize: 12, color: '#888', lineHeight: 1.5 }

const preStyle               = { fontFamily: '"Courier New", monospace', fontSize: 13, lineHeight: 1.8, padding: '28px 32px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: '0', background: '#fff', flex: 1, overflowY: 'auto' }

const btnPrimStyle       = { color: '#fff', border: 'none', borderRadius: 7, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }
const btnSecStyle        = { background: '#fff', color: '#0047AB', border: '1.5px solid #0047AB', borderRadius: 7, padding: '9px 20px', fontSize: 13, cursor: 'pointer' }

const errorPanelStyle    = { padding: 32, color: '#c00', fontFamily: 'system-ui, sans-serif' }
const errorBannerStyle   = { background: '#fff5f5', border: '1px solid #fcc', borderRadius: 6, padding: '10px 16px', color: '#c00', fontSize: 13, margin: '0 0 16px' }
const loadingStyle       = { padding: 32, color: '#888', fontFamily: 'system-ui, sans-serif' }
