/**
 * Pestaña de demos — muestra 5 casos judiciales completos, uno por fuero,
 * con línea de tiempo cronológica. Cada paso del caso puede generar el
 * documento correspondiente llamando a la API de preview, y descargarlo
 * en formato DOCX.
 */

import { useState, useEffect } from 'react'
import { previewDocumento, descargarDocx } from '../api.js'

const FUERO_ICONS = {
  laboral:                    '⚖️',
  civil_comercial:            '📋',
  familia:                    '👨‍👩‍👧',
  penal:                      '🔒',
  contencioso_administrativo: '🏛️',
}

const FUERO_COLORS = {
  laboral:                    '#1565c0',
  civil_comercial:            '#2e7d32',
  familia:                    '#6a1b9a',
  penal:                      '#b71c1c',
  contencioso_administrativo: '#e65100',
}

const FUERO_BG = {
  laboral:                    '#e3f2fd',
  civil_comercial:            '#e8f5e9',
  familia:                    '#f3e5f5',
  penal:                      '#ffebee',
  contencioso_administrativo: '#fff3e0',
}

const MESES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']

function formatFecha(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${parseInt(d)} ${MESES[parseInt(m) - 1]} ${y}`
}

export default function Demos({ juzgado }) {
  const [indice,      setIndice]      = useState(null)
  const [casoId,      setCasoId]      = useState(null)
  const [casoData,    setCasoData]    = useState(null)
  const [loadingCaso, setLoadingCaso] = useState(false)
  const [stepStates,  setStepStates]  = useState({})  // { [orden]: { status, texto, error, descargando } }
  const [errorGlobal, setErrorGlobal] = useState(null)

  // Cargar índice de demos
  useEffect(() => {
    fetch('/demos/index.json')
      .then(r => { if (!r.ok) throw new Error('No se encontró /demos/index.json'); return r.json() })
      .then(data => {
        setIndice(data)
        if (data.casos?.length > 0) setCasoId(data.casos[0].id)
      })
      .catch(e => setErrorGlobal(e.message))
  }, [])

  // Cargar caso seleccionado
  useEffect(() => {
    if (!casoId || !indice) return
    const caso = indice.casos.find(c => c.id === casoId)
    if (!caso) return
    setLoadingCaso(true)
    setCasoData(null)
    setStepStates({})
    setErrorGlobal(null)
    fetch(`/demos/${caso.file}`)
      .then(r => { if (!r.ok) throw new Error(`No se pudo cargar ${caso.file}`); return r.json() })
      .then(data => { setCasoData(data); setLoadingCaso(false) })
      .catch(e => { setErrorGlobal(e.message); setLoadingCaso(false) })
  }, [casoId, indice])

  // Generar un paso individual
  const generarPaso = async (paso) => {
    setStepStates(prev => ({ ...prev, [paso.orden]: { status: 'loading' } }))
    try {
      const texto = await previewDocumento(paso.tipo, paso.input, paso.fecha)
      setStepStates(prev => ({ ...prev, [paso.orden]: { status: 'done', texto } }))
    } catch (e) {
      setStepStates(prev => ({ ...prev, [paso.orden]: { status: 'error', error: e.message } }))
    }
  }

  // Generar todos los pasos del caso
  const generarTodos = () => {
    if (!casoData) return
    casoData.pasos.forEach(p => {
      const ss = stepStates[p.orden]
      if (!ss || ss.status === 'idle' || ss.status === 'error') generarPaso(p)
    })
  }

  // Descargar DOCX de un paso
  const descargarPaso = async (paso) => {
    setStepStates(prev => ({ ...prev, [paso.orden]: { ...prev[paso.orden], descargando: true } }))
    try {
      await descargarDocx(paso.tipo, paso.input, paso.fecha)
    } catch (e) {
      setStepStates(prev => ({ ...prev, [paso.orden]: { ...prev[paso.orden], error: `Error DOCX: ${e.message}`, descargando: false } }))
      return
    }
    setStepStates(prev => ({ ...prev, [paso.orden]: { ...prev[paso.orden], descargando: false } }))
  }

  const resetStep = (orden) =>
    setStepStates(prev => ({ ...prev, [orden]: { status: 'idle' } }))

  // ── Renders de estado ───────────────────────────────────────────

  if (errorGlobal && !indice) return <div style={errorPanelStyle}>⚠️ {errorGlobal}</div>
  if (!indice) return <div style={loadingStyle}>Cargando demos…</div>

  const casoActivo = indice.casos.find(c => c.id === casoId)
  const fuero  = casoActivo?.fuero || 'laboral'
  const color  = FUERO_COLORS[fuero] || '#0047AB'
  const bg     = FUERO_BG[fuero]    || '#f0f4ff'

  const hayAlgunoCargando = casoData?.pasos.some(p => stepStates[p.orden]?.status === 'loading')
  const todosGenerados    = casoData?.pasos.every(p => stepStates[p.orden]?.status === 'done')

  return (
    <div style={layoutStyle}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header style={headerStyle}>
        <span style={logoStyle}>Despacho</span>
        {juzgado && (
          <span style={chipStyle}>
            {juzgado.nombre}{juzgado.secretaria ? ` — ${juzgado.secretaria}` : ''}
          </span>
        )}
        <div style={{ flex: 1 }} />
        <span style={demosBadgeStyle}>🎬 DEMOS</span>
        <span style={subheadStyle}>Casos de demostración por fuero</span>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div style={bodyStyle}>

        {/* Sidebar — selección de caso */}
        <aside style={sidebarStyle}>
          <div style={sidebarTitleStyle}>Caso demostrativo</div>
          {indice.casos.map(caso => {
            const activo = caso.id === casoId
            const c = FUERO_COLORS[caso.fuero] || '#555'
            const b = FUERO_BG[caso.fuero]    || '#f0f4ff'
            return (
              <button
                key={caso.id}
                onClick={() => setCasoId(caso.id)}
                style={{
                  ...sidebarItemStyle,
                  background:  activo ? b : 'transparent',
                  borderLeft:  `3px solid ${activo ? c : 'transparent'}`,
                }}
              >
                <span style={{ fontSize: 22, marginRight: 10, lineHeight: 1, flexShrink: 0 }}>
                  {FUERO_ICONS[caso.fuero] || '📄'}
                </span>
                <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: c, letterSpacing: '0.04em', marginBottom: 2, textTransform: 'uppercase' }}>
                    {caso.fuero_label}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: activo ? 700 : 500, color: activo ? '#222' : '#444', lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {caso.titulo}
                  </div>
                  <div style={{ fontSize: 10, color: '#aaa', marginTop: 3, lineHeight: 1.3 }}>
                    {caso.total_pasos} pasos · Expte. {caso.expediente}
                  </div>
                </div>
              </button>
            )
          })}

          {/* Nota de uso */}
          <div style={sidebarNotaStyle}>
            Cada caso simula un expediente real pasando por todas sus etapas procesales. Generá los documentos de cada paso con un clic.
          </div>
        </aside>

        {/* Main */}
        <main style={mainStyle}>
          {loadingCaso ? (
            <div style={loadingStyle}>Cargando caso…</div>
          ) : casoData ? (
            <div style={timelineWrapStyle}>

              {/* Cabecera del caso */}
              <div style={{ ...caseHeaderStyle, borderLeftColor: color }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ ...fueroTagStyle, background: bg, color }}>
                    {FUERO_ICONS[fuero]} {casoData.meta.fuero_label}
                  </span>
                  <span style={{ fontSize: 11, color: '#999' }}>{casoData.meta.tribunal}</span>
                </div>
                <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: '#1a1a2e', lineHeight: 1.3 }}>
                  {casoData.meta.titulo}
                </h2>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>
                  Expte. N.° <strong>{casoData.meta.expediente}</strong> · {casoData.meta.caratula}
                </div>
                <p style={{ margin: '0 0 14px', fontSize: 13, color: '#666', lineHeight: 1.6 }}>
                  {casoData.meta.descripcion}
                </p>
                {errorGlobal && <div style={errorBannerStyle}>⚠️ {errorGlobal}</div>}
                {/* Generar todos */}
                {!todosGenerados && (
                  <button
                    onClick={generarTodos}
                    disabled={hayAlgunoCargando}
                    style={{
                      ...btnGenAllStyle,
                      background: hayAlgunoCargando ? '#aaa' : color,
                      cursor: hayAlgunoCargando ? 'default' : 'pointer',
                    }}
                  >
                    {hayAlgunoCargando ? '⏳ Generando documentos…' : `▶▶ Generar todos los documentos del caso`}
                  </button>
                )}
                {todosGenerados && (
                  <div style={{ fontSize: 13, color: '#388e3c', fontWeight: 700 }}>
                    ✓ Todos los documentos del caso han sido generados.
                  </div>
                )}
              </div>

              {/* ── Línea de tiempo ────────────────────────────────────── */}
              <div style={timelineStyle}>
                {casoData.pasos.map((paso, idx) => {
                  const ss      = stepStates[paso.orden] || { status: 'idle' }
                  const isLast  = idx === casoData.pasos.length - 1
                  const isDone  = ss.status === 'done'
                  const isLoad  = ss.status === 'loading'

                  return (
                    <div key={paso.orden} style={timelineItemStyle}>

                      {/* Izquierda: círculo + línea vertical */}
                      <div style={timelineLeftStyle}>
                        <div style={{
                          ...circleStyle,
                          background:  isDone ? color : isLoad ? '#888' : '#fff',
                          color:       isDone ? '#fff' : isLoad ? '#fff' : color,
                          borderColor: isDone ? color : isLoad ? '#888' : color,
                        }}>
                          {isDone ? '✓' : paso.orden}
                        </div>
                        {!isLast && (
                          <div style={{ ...lineStyle, borderLeftColor: isDone ? color : '#ccc' }} />
                        )}
                      </div>

                      {/* Derecha: contenido */}
                      <div style={{ ...timelineContentStyle, paddingBottom: isLast ? 16 : 32 }}>
                        {/* Título y fecha */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 5 }}>
                          <span style={{ ...fechaBadgeStyle, background: bg, color }}>
                            {formatFecha(paso.fecha)}
                          </span>
                          <h3 style={stepTitleStyle}>{paso.titulo}</h3>
                        </div>

                        {/* Descripción */}
                        <p style={stepDescStyle}>{paso.descripcion}</p>

                        {/* Tipo de documento */}
                        <div style={{ marginBottom: 12 }}>
                          <span style={typeBadgeStyle}>{paso.tipo}</span>
                        </div>

                        {/* Acciones por estado */}
                        {ss.status === 'idle' && (
                          <button
                            onClick={() => generarPaso(paso)}
                            style={{ ...btnGenStyle, background: color }}
                          >
                            ▶ Generar este documento
                          </button>
                        )}

                        {ss.status === 'loading' && (
                          <button disabled style={{ ...btnGenStyle, background: '#9e9e9e', cursor: 'default' }}>
                            ⏳ Generando…
                          </button>
                        )}

                        {ss.status === 'done' && (
                          <div style={previewBoxStyle}>
                            <div style={{ ...previewBoxHeaderStyle, background: bg, borderBottomColor: color + '44' }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color }}>
                                ✓ Documento generado
                              </span>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <button onClick={() => resetStep(paso.orden)} style={btnResetStyle}>
                                  ↺ Regenerar
                                </button>
                                <button
                                  onClick={() => descargarPaso(paso)}
                                  disabled={ss.descargando}
                                  style={{ ...btnDocxStyle, background: color, opacity: ss.descargando ? 0.6 : 1 }}
                                >
                                  {ss.descargando ? '⏳…' : '⬇ DOCX'}
                                </button>
                              </div>
                            </div>
                            <pre style={preStyle}>{ss.texto}</pre>
                          </div>
                        )}

                        {ss.status === 'error' && (
                          <div style={errorStepStyle}>
                            <span>⚠️ {ss.error}</span>
                            <button onClick={() => resetStep(paso.orden)} style={btnResetStyle}>
                              Reintentar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div style={loadingStyle}>Seleccioná un caso de la barra lateral.</div>
          )}
        </main>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const layoutStyle       = { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'system-ui, sans-serif' }
const headerStyle       = { background: '#0047AB', color: '#fff', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }
const logoStyle         = { fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }
const chipStyle         = { fontSize: 12, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '3px 10px' }
const demosBadgeStyle   = { fontSize: 12, background: 'rgba(255,215,0,0.25)', color: '#ffe066', borderRadius: 20, padding: '3px 10px', fontWeight: 700, letterSpacing: '0.05em' }
const subheadStyle      = { fontSize: 12, color: 'rgba(255,255,255,0.65)' }
const bodyStyle         = { flex: 1, overflow: 'hidden', display: 'flex' }

const sidebarStyle      = { width: 248, flexShrink: 0, background: '#fff', borderRight: '1px solid #e0e0e8', overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column' }
const sidebarTitleStyle = { fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 16px 12px' }
const sidebarItemStyle  = { display: 'flex', alignItems: 'flex-start', width: '100%', padding: '12px 16px', border: 'none', cursor: 'pointer', borderRadius: 0, marginBottom: 2 }
const sidebarNotaStyle  = { margin: '12px 16px 0', padding: '10px 12px', background: '#f7f8fa', borderRadius: 8, fontSize: 11, color: '#888', lineHeight: 1.55 }

const mainStyle         = { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#f4f5f7' }
const timelineWrapStyle = { flex: 1, overflowY: 'auto', padding: '28px 32px' }

const caseHeaderStyle   = { background: '#fff', borderRadius: 10, padding: '22px 26px', marginBottom: 32, borderLeft: '4px solid', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }
const fueroTagStyle     = { fontSize: 11, fontWeight: 700, borderRadius: 4, padding: '3px 9px', display: 'inline-flex', alignItems: 'center', gap: 4 }
const errorBannerStyle  = { background: '#fff5f5', border: '1px solid #fcc', borderRadius: 6, padding: '10px 16px', color: '#c00', fontSize: 13, marginBottom: 12 }
const btnGenAllStyle    = { color: '#fff', border: 'none', borderRadius: 8, padding: '11px 24px', fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }

const timelineStyle        = { position: 'relative' }
const timelineItemStyle    = { display: 'flex', gap: 0 }
const timelineLeftStyle    = { display: 'flex', flexDirection: 'column', alignItems: 'center', width: 52, flexShrink: 0 }
const circleStyle          = { width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, border: '2px solid', flexShrink: 0, zIndex: 1, transition: 'all 0.2s' }
const lineStyle            = { flex: 1, borderLeft: '2px dashed', opacity: 0.4, minHeight: 20, marginTop: 0, transition: 'border-color 0.3s' }
const timelineContentStyle = { flex: 1, paddingLeft: 14 }

const fechaBadgeStyle = { fontSize: 11, fontWeight: 700, borderRadius: 4, padding: '3px 9px', display: 'inline-block', flexShrink: 0 }
const stepTitleStyle  = { margin: 0, fontSize: 16, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3 }
const stepDescStyle   = { margin: '5px 0 8px', fontSize: 13, color: '#555', lineHeight: 1.6 }
const typeBadgeStyle  = { fontSize: 10, fontWeight: 700, fontFamily: 'monospace', background: '#f0f0f8', color: '#777', borderRadius: 4, padding: '3px 8px', letterSpacing: '0.02em' }

const btnGenStyle      = { color: '#fff', border: 'none', borderRadius: 7, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }
const btnDocxStyle     = { color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }
const btnResetStyle    = { background: '#f0f0f8', color: '#555', border: 'none', borderRadius: 6, padding: '7px 12px', fontSize: 12, cursor: 'pointer' }

const previewBoxStyle       = { border: '1px solid #e0e0e8', borderRadius: 8, overflow: 'hidden', marginTop: 12 }
const previewBoxHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid' }
const preStyle              = { fontFamily: '"Courier New", monospace', fontSize: 12, lineHeight: 1.7, padding: '20px 24px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, background: '#fff', maxHeight: 420, overflowY: 'auto' }

const errorStepStyle  = { background: '#fff5f5', border: '1px solid #fcc', borderRadius: 6, padding: '10px 16px', color: '#c00', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }

const errorPanelStyle = { padding: 32, color: '#c00', fontFamily: 'system-ui, sans-serif' }
const loadingStyle    = { padding: 32, color: '#888', fontFamily: 'system-ui, sans-serif' }
