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

import { useState, useEffect, useRef } from 'react'
import { getCatalogo, previewDocumento, descargarDocx, buscarDocumentos } from '../api.js'
import PartesEditor from './PartesEditor.jsx'
import CamposDocumento from './CamposDocumento.jsx'

const PASOS = ['Fuero', 'Expediente', 'Proceso', 'Etapa', 'Documento', 'Datos', 'Preview']

// ─── Casos de demo para pre-rellenar el Wizard ────────────────────────────────
const CASOS_DEMO = [
  {
    id: 'laboral', icono: '⚖️', label: 'Laboral', sub: 'González c/ ABC SA',
    fuero: 'laboral',
    numero: '1234567/2026',
    caratula: 'GONZÁLEZ, ROBERTO H. c/ ABC SA — Ordinario Laboral',
    partes: [
      { rol: 'actor',    nombre: 'González, Roberto Hernán', dni_cuit: '25.678.901',   domicilio_real: 'Barrio Urca, Los Pinos 234, Córdoba' },
      { rol: 'demandado',nombre: 'ABC SA',                   dni_cuit: '30-70123456-9', domicilio_real: 'Av. Colón 1234, Córdoba' },
    ],
  },
  {
    id: 'civil', icono: '📋', label: 'Civil', sub: 'Fernández c/ Rodríguez',
    fuero: 'civil_comercial',
    numero: '2345878/2026',
    caratula: 'FERNÁNDEZ, CLAUDIA P. c/ RODRÍGUEZ, MARCOS A. — Daños y Perjuicios',
    partes: [
      { rol: 'actor',    nombre: 'Fernández, Claudia Patricia', dni_cuit: '28.456.789', domicilio_real: 'Bv. Chacabuco 890, Córdoba' },
      { rol: 'demandado',nombre: 'Rodríguez, Marcos Alejandro', dni_cuit: '24.321.098', domicilio_real: 'Av. Vélez Sarsfield 543, Córdoba' },
    ],
  },
  {
    id: 'familia', icono: '👨‍👩‍👧', label: 'Familia', sub: 'Gómez / Torres',
    fuero: 'familia',
    numero: '6789012/2026',
    caratula: 'GÓMEZ, SOFÍA L. c/ TORRES, DIEGO M. — Divorcio Vincular',
    partes: [
      { rol: 'actor',    nombre: 'Gómez, Sofía Laura',  dni_cuit: '30.123.456', domicilio_real: 'Rondeau 234, Córdoba' },
      { rol: 'demandado',nombre: 'Torres, Diego Manuel', dni_cuit: '27.654.321', domicilio_real: 'Dean Funes 789, Córdoba' },
    ],
  },
  {
    id: 'penal', icono: '🔒', label: 'Penal', sub: 'Gómez, Pablo (Robo agravado)',
    fuero: 'penal',
    numero: '1234567/2026',
    caratula: 'GÓMEZ, PABLO ARIEL s/ Robo Agravado (art. 166 inc. 2 CP)',
    partes: [
      { rol: 'imputado', nombre: 'Gómez, Pablo Ariel',    dni_cuit: '35.987.654', domicilio_real: 'Villa El Libertador, Mza. 12, Córdoba' },
      { rol: 'victima',  nombre: 'Ramírez, Carlos Alberto', dni_cuit: '22.111.333', domicilio_real: 'Barrio General Paz, Córdoba' },
    ],
  },
  {
    id: 'ca', icono: '🏛️', label: 'Contencioso Adm.', sub: 'Suárez c/ Provincia',
    fuero: 'contencioso_administrativo',
    numero: '0012345/2026',
    caratula: 'SUÁREZ, ELENA BEATRIZ c/ PROVINCIA DE CÓRDOBA — Plena Jurisdicción',
    partes: [
      { rol: 'actor',    nombre: 'Suárez, Elena Beatriz', dni_cuit: '23.456.789', domicilio_real: 'Obispo Trejo 456, Córdoba' },
      { rol: 'demandado',nombre: 'Provincia de Córdoba',  dni_cuit: '30-99999999-9', domicilio_real: 'Independencia 150, Córdoba' },
    ],
  },
]

const PARTES_DEFAULT = {
  civil_comercial:           [{ rol: 'actor', nombre: '', dni_cuit: '', domicilio_real: '' }, { rol: 'demandado', nombre: '', dni_cuit: '', domicilio_real: '' }],
  laboral:                   [{ rol: 'actor', nombre: '', dni_cuit: '', domicilio_real: '' }, { rol: 'demandado', nombre: '', dni_cuit: '', domicilio_real: '' }],
  familia:                   [{ rol: 'actor', nombre: '', dni_cuit: '', domicilio_real: '' }, { rol: 'demandado', nombre: '', dni_cuit: '', domicilio_real: '' }],
  contencioso_administrativo:[{ rol: 'actor', nombre: '', dni_cuit: '', domicilio_real: '' }, { rol: 'demandado', nombre: '', dni_cuit: '', domicilio_real: '' }],
  violencia_familiar:        [{ rol: 'denunciante', nombre: '', dni_cuit: '', domicilio_real: '' }, { rol: 'denunciado', nombre: '', dni_cuit: '', domicilio_real: '' }],
  penal:                     [{ rol: 'imputado', nombre: '', dni_cuit: '', domicilio_real: '' }, { rol: 'victima', nombre: '', dni_cuit: '', domicilio_real: '' }],
  ninez:                     [{ rol: 'menor', nombre: '', dni_cuit: '', domicilio_real: '' }, { rol: 'progenitor', nombre: '', dni_cuit: '', domicilio_real: '' }],
  concursal:                 [{ rol: 'concursado', nombre: '', dni_cuit: '', domicilio_real: '' }],
}
const partesDefault = (fid) => (PARTES_DEFAULT[fid] || PARTES_DEFAULT.civil_comercial).map(p => ({...p}))

export default function Wizard({ juzgado, onCambiarJuzgado, favoritos, toggleFavorito, esFavorito }) {
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
    partes: partesDefault(juzgado.fuero),
  })

  // Campos específicos del documento
  const [camposDoc, setCamposDoc] = useState({})
  const [fechaRes,  setFechaRes]  = useState('')
  const [preview,   setPreview]   = useState(null)
  const [cargando,  setCargando]  = useState(false)

  // Búsqueda rápida
  const [busqueda,      setBusqueda]      = useState('')
  const [resultados,    setResultados]    = useState([])
  const [buscando,      setBuscando]      = useState(false)
  const busquedaTimer = useRef(null)

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
    setBusqueda(''); setResultados([])
    setExpediente({ numero: '', caratula: '', partes: partesDefault(fueroId) })
    setPaso(0)
  }

  // Búsqueda con debounce de 300 ms
  const handleBusqueda = (texto) => {
    setBusqueda(texto)
    clearTimeout(busquedaTimer.current)
    if (texto.trim().length < 2) { setResultados([]); return }
    busquedaTimer.current = setTimeout(async () => {
      setBuscando(true)
      try {
        const res = await buscarDocumentos(texto.trim())
        setResultados(res)
      } catch { setResultados([]) }
      finally { setBuscando(false) }
    }, 300)
  }

  // Seleccionar un documento desde la búsqueda
  const seleccionarDesdeSearch = (resultado) => {
    setFueroId(resultado.fuero_id)
    setProcesoId(resultado.proceso_id)
    setEtapaId(resultado.etapa_id)
    setTipoDoc(resultado.tipo)
    setExpediente(e => ({ ...e, partes: partesDefault(resultado.fuero_id) }))
    setBusqueda(''); setResultados([])
    setPaso(5) // saltar directo a campos
  }

  return (
    <div style={layoutStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <span style={logoStyle}>Despacho</span>
          <span style={{ ...juzgadoChipStyle, flexShrink: 0 }}>{juzgado.nombre}{juzgado.secretaria ? ` — ${juzgado.secretaria}` : ''}</span>
          {/* Búsqueda rápida */}
          <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
            <input
              type="text"
              placeholder="Buscar documento… (ej: alimentos, sobreseimiento, perito)"
              value={busqueda}
              onChange={e => handleBusqueda(e.target.value)}
              style={searchInputStyle}
            />
            {buscando && <span style={searchSpinnerStyle}>…</span>}
            {resultados.length > 0 && (
              <div style={searchDropdownStyle}>
                {resultados.slice(0, 10).map(r => (
                  <button
                    key={`${r.tipo}-${r.fuero_id}`}
                    onClick={() => seleccionarDesdeSearch(r)}
                    style={searchItemStyle}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a2e' }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{r.fuero_label} › {r.proceso_label} › {r.etapa_label}</div>
                  </button>
                ))}
                {resultados.length > 10 && (
                  <div style={{ padding: '6px 12px', fontSize: 11, color: '#aaa', textAlign: 'center' }}>
                    +{resultados.length - 10} resultados más — refiná la búsqueda
                  </div>
                )}
              </div>
            )}
            {busqueda.length >= 2 && !buscando && resultados.length === 0 && (
              <div style={searchDropdownStyle}>
                <div style={{ padding: '10px 12px', fontSize: 12, color: '#aaa', textAlign: 'center' }}>Sin resultados para "{busqueda}"</div>
              </div>
            )}
          </div>
        </div>
        <button onClick={onCambiarJuzgado} style={{ ...btnCambiarStyle, flexShrink: 0 }}>Cambiar juzgado</button>
      </header>

      {/* Barra de progreso */}
      <BarraProgreso paso={paso} pasos={PASOS} />

      {/* Contenido del paso */}
      <div style={contenidoStyle}>

        {/* PASO 0: Fuero */}
        {paso === 0 && (
          <Paso titulo="Fuero" subtitulo="Confirmá o cambiá el fuero para esta causa">
            {/* Panel de documentos frecuentes */}
            {favoritos?.length > 0 && (
              <PanelFrecuentes
                favoritos={favoritos}
                catalogo={catalogo}
                onSeleccionar={seleccionarDesdeSearch}
                onToggleFav={toggleFavorito}
                esFavorito={esFavorito}
              />
            )}
            <div style={gridFueroStyle}>
              {catalogo.map(f => (
                <TarjetaSeleccion
                  key={f.id}
                  label={f.label}
                  sub={f.norma}
                  seleccionada={f.id === fueroId}
                  onClick={() => { setFueroId(f.id); setProcesoId(null); setEtapaId(null); setTipoDoc(null); setExpediente(e => ({...e, partes: partesDefault(f.id)})) }}
                />
              ))}
            </div>
            <BotonesNav onSiguiente={avanzar} />
          </Paso>
        )}

        {/* PASO 1: Expediente */}
        {paso === 1 && (
          <Paso titulo="Expediente" subtitulo="Datos de la causa">

            {/* ── Panel de carga rápida de demo ─────────────────────────── */}
            <div style={demoPanelStyle}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                ▶ Cargar datos de un caso demo
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {CASOS_DEMO.map(caso => (
                  <button
                    key={caso.id}
                    onClick={() => {
                      setFueroId(caso.fuero)
                      setExpediente({ numero: caso.numero, caratula: caso.caratula, partes: caso.partes })
                    }}
                    style={{
                      ...demoCasoBtn,
                      borderColor: expediente.numero === caso.numero ? '#0047AB' : '#d0d0dc',
                      background:  expediente.numero === caso.numero ? '#e8f0fe' : '#fafafa',
                      fontWeight:  expediente.numero === caso.numero ? 700 : 500,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{caso.icono}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#555' }}>{caso.label}</div>
                      <div style={{ fontSize: 10, color: '#999', marginTop: 1 }}>{caso.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

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
              {(etapa?.documentos ?? [])
                .slice()
                .sort((a, b) => (esFavorito?.(b.tipo) ? 1 : 0) - (esFavorito?.(a.tipo) ? 1 : 0))
                .map(d => (
                  <TarjetaConEstrella
                    key={d.tipo}
                    label={d.label}
                    sub={`${d.descripcion} — ${d.norma}`}
                    seleccionada={d.tipo === tipoDoc}
                    favorita={esFavorito?.(d.tipo) ?? false}
                    onClick={() => seleccionarDocumento(d.tipo)}
                    onToggleFav={() => toggleFavorito?.(d.tipo)}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <strong>{etapa?.documentos.find(d => d.tipo === tipoDoc)?.label}</strong>
                {toggleFavorito && (
                  <button
                    onClick={() => toggleFavorito(tipoDoc)}
                    title={esFavorito?.(tipoDoc) ? 'Quitar de frecuentes' : 'Marcar como frecuente'}
                    style={btnEstrellaPreviewStyle}
                  >
                    {esFavorito?.(tipoDoc) ? '⭐' : '☆'}
                  </button>
                )}
                <span style={{ color: '#888', fontSize: 13 }}>{expediente.caratula}</span>
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
            display: 'none',
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
// Helper: buscar metadatos de un documento por tipo en el catálogo
// ---------------------------------------------------------------------------

function encontrarDocumento(catalogo, tipo) {
  for (const fuero of catalogo) {
    for (const proceso of fuero.procesos) {
      for (const etapa of proceso.etapas) {
        const doc = etapa.documentos.find(d => d.tipo === tipo)
        if (doc) return {
          ...doc,
          fuero_id:     fuero.id,
          fuero_label:  fuero.label,
          proceso_id:   proceso.id,
          proceso_label: proceso.label,
          etapa_id:     etapa.id,
          etapa_label:  etapa.label,
        }
      }
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// PanelFrecuentes — acceso directo a documentos marcados como frecuentes
// ---------------------------------------------------------------------------

function PanelFrecuentes({ favoritos, catalogo, onSeleccionar, onToggleFav, esFavorito }) {
  const docs = favoritos
    .map(tipo => encontrarDocumento(catalogo, tipo))
    .filter(Boolean)

  if (!docs.length) return null

  return (
    <div style={panelFrecuentesStyle}>
      <div style={frecuentesTituloStyle}>⭐ Mis documentos frecuentes</div>
      <div style={frecuentesGridStyle}>
        {docs.map(doc => (
          <div key={doc.tipo} style={frecuentesCardStyle}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: '#999', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {doc.fuero_label} › {doc.proceso_label}
              </div>
              <button
                onClick={() => onSeleccionar({ fuero_id: doc.fuero_id, proceso_id: doc.proceso_id, etapa_id: doc.etapa_id, tipo: doc.tipo })}
                style={frecuentesDocBtnStyle}
                title="Ir directo a este documento"
              >
                {doc.label}
              </button>
            </div>
            <button
              onClick={() => onToggleFav(doc.tipo)}
              title="Quitar de frecuentes"
              style={btnQuitarFavStyle}
            >⭐</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TarjetaConEstrella — tarjeta de documento con botón de favorito
// ---------------------------------------------------------------------------

function TarjetaConEstrella({ label, sub, seleccionada, favorita, onClick, onToggleFav }) {
  return (
    <div style={{
      ...tarjetaStyle,
      borderColor: seleccionada ? '#0047AB' : '#e0e0e8',
      background:  seleccionada ? '#f0f4ff' : '#fff',
      paddingRight: 8,
    }}>
      <button onClick={onClick} style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px 0 0' }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e', marginBottom: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: '#777', lineHeight: 1.4 }}>{sub}</div>}
      </button>
      <button
        onClick={e => { e.stopPropagation(); onToggleFav() }}
        title={favorita ? 'Quitar de frecuentes' : 'Marcar como frecuente'}
        style={{ ...btnEstrellaStyle, color: favorita ? '#f5a623' : '#ccc' }}
      >
        {favorita ? '⭐' : '☆'}
      </button>
      <span style={{ color: '#0047AB', fontSize: 18, paddingLeft: 4 }}>›</span>
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
  if (tipoDoc === 'declaracion_quiebra') return {
    ...base,
    sindico_nombre:              camposDoc.sindico_nombre || '',
    sindico_matricula:           camposDoc.sindico_matricula || null,
    tipo_quiebra:                camposDoc.tipo_quiebra || 'voluntaria',
    fecha_limite_verificacion:   camposDoc.fecha_limite_verificacion || '',
    fecha_informe_individual:    camposDoc.fecha_informe_individual || '',
    fecha_informe_general:       camposDoc.fecha_informe_general || '',
    clausura_establecimiento:    camposDoc.clausura_establecimiento === true,
    inhabilitacion_fallido:      camposDoc.inhabilitacion_fallido !== false,
  }
  if (tipoDoc === 'fijacion_debate') return {
    ...base,
    fiscal_nombre:           camposDoc.fiscal_nombre || '',
    calificacion_legal:      camposDoc.calificacion_legal || '',
    fecha_debate:            camposDoc.fecha_debate || new Date().toISOString().split('T')[0],
    hora_debate:             camposDoc.hora_debate || '09:00',
    sala:                    camposDoc.sala || null,
    dias_duracion_estimada:  camposDoc.dias_duracion_estimada ? Number(camposDoc.dias_duracion_estimada) : null,
  }
  if (tipoDoc === 'control_legalidad_nna') return {
    ...base,
    nombre_nnya:                  camposDoc.nombre_nnya || '',
    edad_nnya:                    camposDoc.edad_nnya ? Number(camposDoc.edad_nnya) : null,
    organismo_administrativo:     camposDoc.organismo_administrativo || 'la Secretaría de Niñez, Adolescencia y Familia',
    medida_adoptada:              camposDoc.medida_adoptada || '',
    fecha_medida_administrativa:  camposDoc.fecha_medida_administrativa || new Date().toISOString().split('T')[0],
    plazo_revision_dias:          Number(camposDoc.plazo_revision_dias) || 30,
  }
  if (tipoDoc === 'auto_apertura_laboral') return {
    ...base,
    plazo_dias: Number(camposDoc.plazo_dias) || 40,
    fecha_inicio_prueba: camposDoc.fecha_inicio_prueba || new Date().toISOString().split('T')[0],
    prueba_admitida:  camposDoc.prueba_admitida  || [],
    prueba_rechazada: camposDoc.prueba_rechazada || [],
    fundamento_rechazo: camposDoc.fundamento_rechazo || null,
  }
  if (tipoDoc === 'auto_apertura_concurso') return {
    ...base,
    sindico_nombre:              camposDoc.sindico_nombre || '',
    sindico_matricula:           camposDoc.sindico_matricula || null,
    fecha_limite_verificacion:   camposDoc.fecha_limite_verificacion || '',
    fecha_informe_individual:    camposDoc.fecha_informe_individual || '',
    fecha_informe_general:       camposDoc.fecha_informe_general || '',
    fecha_audiencia_informativa: camposDoc.fecha_audiencia_informativa || '',
    inhibicion_provisional:      camposDoc.inhibicion_provisional !== false,
  }
  if (tipoDoc === 'citacion_imputacion') return {
    ...base,
    fiscal_nombre:      camposDoc.fiscal_nombre || '',
    fiscal_unidad:      camposDoc.fiscal_unidad || null,
    objeto_imputacion:  camposDoc.objeto_imputacion || '',
    fecha_citacion:     camposDoc.fecha_citacion || new Date().toISOString().split('T')[0],
    hora_citacion:      camposDoc.hora_citacion || '09:00',
  }
  if (tipoDoc === 'auto_elevacion_juicio') return {
    ...base,
    fiscal_nombre:       camposDoc.fiscal_nombre || '',
    calificacion_legal:  camposDoc.calificacion_legal || '',
    tipo_juicio:         camposDoc.tipo_juicio || 'oral',
  }
  if (tipoDoc === 'alimentos_provisorios') return {
    ...base,
    cuota:            Number(camposDoc.cuota) || 0,
    periodicidad:     camposDoc.periodicidad || 'mensual',
    dia_vencimiento:  Number(camposDoc.dia_vencimiento) || 1,
    forma_pago:       camposDoc.forma_pago || 'deposito_judicial',
    cbu_alias:        camposDoc.cbu_alias || null,
  }
  if (tipoDoc === 'admision_laboral') return {
    ...base,
    objeto:           camposDoc.objeto || '',
    fecha_audiencia:  camposDoc.fecha_audiencia || new Date().toISOString().split('T')[0],
    hora_audiencia:   camposDoc.hora_audiencia || '10:00',
    sala:             camposDoc.sala || null,
  }
  if (tipoDoc === 'embargo_preventivo') return {
    ...base,
    monto: Number(camposDoc.monto) || 0,
    domicilio_diligenciamiento: camposDoc.domicilio_diligenciamiento || '',
    bienes: camposDoc.bienes || null,
  }
  if (tipoDoc === 'inhibicion_general') return {
    ...base,
    monto: Number(camposDoc.monto) || 0,
  }
  if (tipoDoc === 'medidas_urgentes_vf') return {
    ...base,
    exclusion_hogar:          camposDoc.exclusion_hogar !== false,
    domicilio_hogar:          camposDoc.domicilio_hogar || null,
    restriccion_acercamiento: camposDoc.restriccion_acercamiento !== false,
    metros_restriccion:       Number(camposDoc.metros_restriccion) || 300,
    prohibicion_contacto:     camposDoc.prohibicion_contacto !== false,
    plazo_dias:               Number(camposDoc.plazo_dias) || 90,
  }
  if (tipoDoc === 'apertura_sucesorio') return {
    ...base,
    fallecido_nombre:       camposDoc.fallecido_nombre || '',
    fallecido_fecha_muerte: camposDoc.fallecido_fecha_muerte || new Date().toISOString().split('T')[0],
    fallecido_domicilio:    camposDoc.fallecido_domicilio || '',
    perito_valuador_nombre: camposDoc.perito_valuador_nombre || null,
    dias_edictos:           Number(camposDoc.dias_edictos) || 5,
    inventario_judicial:    camposDoc.inventario_judicial === true,
  }
  if (tipoDoc === 'sumarisimo_citacion') return {
    ...base,
    objeto:                    camposDoc.objeto || '',
    fecha_audiencia:           camposDoc.fecha_audiencia || new Date().toISOString().split('T')[0],
    hora_audiencia:            camposDoc.hora_audiencia || '09:00',
    sala:                      camposDoc.sala || null,
    plazo_contestacion_dias:   Number(camposDoc.plazo_contestacion_dias) || 3,
  }
  if (tipoDoc === 'admisibilidad_ca') return {
    ...base,
    objeto_accion:                        camposDoc.objeto_accion || '',
    organismo_demandado:                  camposDoc.organismo_demandado || 'la Provincia de Córdoba',
    plazo_contestacion_dias:              Number(camposDoc.plazo_contestacion_dias) || 30,
    requiere_expediente_administrativo:   camposDoc.requiere_expediente_administrativo !== false,
  }
  if (tipoDoc === 'admision_alimentos') return {
    ...base,
    objeto:           camposDoc.objeto || 'fijación de cuota alimentaria',
    fecha_audiencia:  camposDoc.fecha_audiencia || new Date().toISOString().split('T')[0],
    hora_audiencia:   camposDoc.hora_audiencia || '09:00',
    sala:             camposDoc.sala || null,
  }
  if (tipoDoc === 'admision_divorcio') return {
    ...base,
    tipo_divorcio:                   camposDoc.tipo_divorcio || 'unilateral',
    plazo_retiro_documentos_dias:    Number(camposDoc.plazo_retiro_documentos_dias) || 10,
  }
  if (tipoDoc === 'admision_comunicacion') return {
    ...base,
    objeto:           camposDoc.objeto || 'fijación de régimen de comunicación y contacto',
    fecha_audiencia:  camposDoc.fecha_audiencia || new Date().toISOString().split('T')[0],
    hora_audiencia:   camposDoc.hora_audiencia || '09:00',
    sala:             camposDoc.sala || null,
  }
  if (tipoDoc === 'citacion_audiencia_vf') return {
    ...base,
    tipo_audiencia:  camposDoc.tipo_audiencia || 'conciliacion',
    fecha_audiencia: camposDoc.fecha_audiencia || new Date().toISOString().split('T')[0],
    hora_audiencia:  camposDoc.hora_audiencia || '09:00',
    sala:            camposDoc.sala || null,
  }
  if (tipoDoc === 'declaratoria_herederos') return {
    ...base,
    causante_nombre:   camposDoc.causante_nombre || '',
    vinculos:          camposDoc.vinculos || null,
    bienes_inmuebles:  camposDoc.bienes_inmuebles !== false,
    bienes_muebles:    camposDoc.bienes_muebles !== false,
  }
  if (tipoDoc === 'admision_ejecutivo') return {
    ...base,
    titulo_ejecutivo:    camposDoc.titulo_ejecutivo || '',
    objeto:              camposDoc.objeto || 'cobro de pesos',
    librar_mandamiento:  camposDoc.librar_mandamiento !== false,
  }
  if (tipoDoc === 'prorroga_medida_nna') return {
    ...base,
    nombre_nnya:              camposDoc.nombre_nnya || '',
    edad_nnya:                camposDoc.edad_nnya ? Number(camposDoc.edad_nnya) : null,
    organismo_administrativo: camposDoc.organismo_administrativo || 'la Secretaría de Niñez, Adolescencia y Familia',
    medida_adoptada:          camposDoc.medida_adoptada || '',
    motivo_prorroga:          camposDoc.motivo_prorroga || 'no han variado sustancialmente las circunstancias que motivaron la medida',
    plazo_prorroga_dias:      Number(camposDoc.plazo_prorroga_dias) || 30,
  }
  if (tipoDoc === 'cese_medida_nna') return {
    ...base,
    nombre_nnya:              camposDoc.nombre_nnya || '',
    edad_nnya:                camposDoc.edad_nnya ? Number(camposDoc.edad_nnya) : null,
    organismo_administrativo: camposDoc.organismo_administrativo || 'la Secretaría de Niñez, Adolescencia y Familia',
    medida_adoptada:          camposDoc.medida_adoptada || '',
    motivo_cese:              camposDoc.motivo_cese || 'han cesado las circunstancias que motivaron la medida',
  }
  if (tipoDoc === 'sobreseimiento') return {
    ...base,
    fiscal_nombre:             camposDoc.fiscal_nombre || null,
    causal:                    camposDoc.causal || 'falta_prueba',
    calificacion_provisional:  camposDoc.calificacion_provisional || null,
    descripcion_hecho:         camposDoc.descripcion_hecho || null,
  }
  if (tipoDoc === 'desestimacion_denuncia') return {
    ...base,
    tipo_acto:    camposDoc.tipo_acto || 'denuncia',
    fiscal_nombre: camposDoc.fiscal_nombre || null,
    causal:        camposDoc.causal || 'manifiestamente_improcedente',
    descripcion:   camposDoc.descripcion || '',
  }
  if (tipoDoc === 'homologacion_acuerdo_familia') return {
    ...base,
    tipo_acuerdo:               camposDoc.tipo_acuerdo || 'alimentos',
    descripcion_acuerdo:        camposDoc.descripcion_acuerdo || '',
    tipo_acuerdo_descripcion:   camposDoc.tipo_acuerdo_descripcion || null,
  }
  // ---------------------------------------------------------------------------
  // Contencioso Administrativo — adicionales
  // ---------------------------------------------------------------------------
  if (tipoDoc === 'traslado_demanda_ca') return {
    ...base,
    organismo_demandado:         camposDoc.organismo_demandado || 'la Provincia de Córdoba',
    plazo_contestacion_dias:     Number(camposDoc.plazo_contestacion_dias) || 30,
    domicilio_notificacion:      camposDoc.domicilio_notificacion || null,
    con_remision_expediente:     camposDoc.con_remision_expediente !== false,
  }
  if (tipoDoc === 'apertura_prueba_ca') return {
    ...base,
    plazo_dias:           Number(camposDoc.plazo_dias) || 40,
    fecha_inicio_prueba:  camposDoc.fecha_inicio_prueba || new Date().toISOString().split('T')[0],
    prueba_admitida:      camposDoc.prueba_admitida || [],
  }
  if (tipoDoc === 'citacion_audiencia_preliminar_ca') return {
    ...base,
    fecha_audiencia:    camposDoc.fecha_audiencia || new Date().toISOString().split('T')[0],
    hora_audiencia:     camposDoc.hora_audiencia || '09:00',
    sala:               camposDoc.sala || null,
    objeto_audiencia:   camposDoc.objeto_audiencia || 'fijación de hechos controvertidos, saneamiento y ofrecimiento de prueba',
  }
  if (tipoDoc === 'suspension_acto_administrativo') return {
    ...base,
    acto_impugnado:       camposDoc.acto_impugnado || '',
    organismo_emisor:     camposDoc.organismo_emisor || '',
    causal_suspension:    camposDoc.causal_suspension || 'verosimilitud_derecho_peligro_demora',
    contracautela:        camposDoc.contracautela || null,
  }
  if (tipoDoc === 'llamamiento_autos_ca') return {
    ...base,
    etapa:                  camposDoc.etapa_llamamiento || 'sentencia_definitiva',
    vencio_prueba:          camposDoc.vencio_prueba !== false,
    presentaron_alegatos:   camposDoc.presentaron_alegatos === true,
  }
  if (tipoDoc === 'intimacion_organismo_demandado') return {
    ...base,
    organismo_demandado:                   camposDoc.organismo_demandado || 'la Provincia de Córdoba',
    plazo_dias:                            Number(camposDoc.plazo_dias) || 10,
    numero_expediente_administrativo:      camposDoc.numero_expediente_administrativo || null,
    apercibimiento:                        camposDoc.apercibimiento || 'tener por ciertos los hechos invocados por el actor (art. 355 CPCC, aplicación supletoria)',
  }
  // ---------------------------------------------------------------------------
  // Violencia Familiar — adicionales
  // ---------------------------------------------------------------------------
  if (tipoDoc === 'prorroga_medidas_vf') return {
    ...base,
    plazo_prorroga_dias:  Number(camposDoc.plazo_prorroga_dias) || 90,
    medidas_vigentes:     camposDoc.medidas_vigentes || [],
    motivo_prorroga:      camposDoc.motivo_prorroga || 'subsisten las circunstancias de riesgo que motivaron las medidas originales',
  }
  if (tipoDoc === 'cese_medidas_vf') return {
    ...base,
    medidas_que_cesan:    camposDoc.medidas_que_cesan || [],
    motivo_cese:          camposDoc.motivo_cese_vf || 'superacion_riesgo',
    motivo_descripcion:   camposDoc.motivo_descripcion || null,
  }
  if (tipoDoc === 'oficio_policia_vf') return {
    ...base,
    tipo_oficio:                  camposDoc.tipo_oficio || 'custodia',
    domicilio_intervencion:       camposDoc.domicilio_intervencion || '',
    descripcion_instrucciones:    camposDoc.descripcion_instrucciones || '',
    unidad_policial:              camposDoc.unidad_policial || null,
  }
  // ---------------------------------------------------------------------------
  // Familia — adicionales
  // ---------------------------------------------------------------------------
  if (tipoDoc === 'exclusion_hogar') return {
    ...base,
    plazo_cumplimiento_horas:     Number(camposDoc.plazo_cumplimiento_horas) || 24,
    con_auxilio_policial:         camposDoc.con_auxilio_policial !== false,
    con_prohibicion_acercamiento: camposDoc.con_prohibicion_acercamiento !== false,
    distancia_metros:             camposDoc.distancia_metros ? Number(camposDoc.distancia_metros) : null,
    domicilio_exclusion:          camposDoc.domicilio_exclusion || '',
  }
  if (tipoDoc === 'regimen_comunicacion_provisorio') return {
    ...base,
    descripcion_regimen:  camposDoc.descripcion_regimen || '',
    lugar_entrega:        camposDoc.lugar_entrega || null,
    con_supervision:      camposDoc.con_supervision === true,
    vigencia:             camposDoc.vigencia_regimen || 'hasta_sentencia',
  }
  if (tipoDoc === 'intimacion_pago_cuotas_alimentarias') return {
    ...base,
    cuotas_adeudadas:         Number(camposDoc.cuotas_adeudadas) || 1,
    monto_total_adeudado:     Number(camposDoc.monto_total_adeudado) || 0,
    plazo_dias:               Number(camposDoc.plazo_dias) || 5,
    apercibimiento_art553:    camposDoc.apercibimiento_art553 !== false,
    con_embargo:              camposDoc.con_embargo === true,
  }
  if (tipoDoc === 'atribucion_hogar_conyugal') return {
    ...base,
    domicilio_hogar:              camposDoc.domicilio_hogar || '',
    caracter:                     camposDoc.caracter_atribucion || 'provisorio',
    con_exclusion_otro_conyuge:   camposDoc.con_exclusion_otro_conyuge !== false,
    plazo_exclusion_horas:        Number(camposDoc.plazo_exclusion_horas) || 24,
    fundamento:                   camposDoc.fundamento_atribucion || 'hijos_menores',
  }
  if (tipoDoc === 'citacion_conciliacion_familia') return {
    ...base,
    tipo_proceso:         camposDoc.tipo_proceso_familia || 'alimentos',
    fecha_audiencia:      camposDoc.fecha_audiencia || new Date().toISOString().split('T')[0],
    hora_audiencia:       camposDoc.hora_audiencia || '09:00',
    sala:                 camposDoc.sala || null,
    con_equipo_tecnico:   camposDoc.con_equipo_tecnico === true,
  }
  // ---------------------------------------------------------------------------
  // Laboral — adicionales
  // ---------------------------------------------------------------------------
  if (tipoDoc === 'traslado_contestacion_laboral') return {
    ...base,
    plazo_dias:               Number(camposDoc.plazo_dias) || 5,
    con_reconvencion:         camposDoc.con_reconvencion === true,
    plazo_reconvencion_dias:  camposDoc.plazo_reconvencion_dias ? Number(camposDoc.plazo_reconvencion_dias) : null,
  }
  if (tipoDoc === 'citacion_vista_causa') return {
    ...base,
    fecha_audiencia:  camposDoc.fecha_audiencia || new Date().toISOString().split('T')[0],
    hora_audiencia:   camposDoc.hora_audiencia || '09:00',
    sala:             camposDoc.sala || null,
    con_peritos:      camposDoc.con_peritos === true,
    con_testigos:     camposDoc.con_testigos === true,
  }
  if (tipoDoc === 'intimacion_pago_liquidacion') return {
    ...base,
    datos_economicos:               buildEco(camposDoc),
    plazo_dias:                     Number(camposDoc.plazo_dias) || 5,
    incluye_intereses_moratorios:   camposDoc.incluye_intereses_moratorios !== false,
  }
  if (tipoDoc === 'homologacion_acuerdo_laboral') return {
    ...base,
    descripcion_acuerdo:  camposDoc.descripcion_acuerdo || '',
    monto_total:          camposDoc.monto_total ? Number(camposDoc.monto_total) : null,
    tipo_acuerdo:         camposDoc.tipo_acuerdo_laboral || 'total',
  }
  if (tipoDoc === 'auto_liquidacion_aprobada') return {
    ...base,
    monto_liquidado:              Number(camposDoc.monto_liquidado) || 0,
    fecha_liquidacion:            camposDoc.fecha_liquidacion || new Date().toISOString().split('T')[0],
    aprobada_por:                 camposDoc.aprobada_por || 'perito_contador',
    observaciones_liquidacion:    camposDoc.observaciones_liquidacion || null,
  }
  // ---------------------------------------------------------------------------
  // Concursal — adicionales
  // ---------------------------------------------------------------------------
  if (tipoDoc === 'periodo_exclusividad') return {
    ...base,
    fecha_inicio_exclusividad:  camposDoc.fecha_inicio_exclusividad || new Date().toISOString().split('T')[0],
    plazo_dias_habiles:         Number(camposDoc.plazo_dias_habiles) || 90,
    porcentaje_conformidades:   Number(camposDoc.porcentaje_conformidades) || 66,
  }
  if (tipoDoc === 'homologacion_acuerdo_concursal') return {
    ...base,
    tipo_acuerdo:             camposDoc.tipo_acuerdo_concursal || 'unificado',
    descripcion_acuerdo:      camposDoc.descripcion_acuerdo || '',
    plazo_cumplimiento_anos:  camposDoc.plazo_cumplimiento_anos ? Number(camposDoc.plazo_cumplimiento_anos) : null,
  }
  if (tipoDoc === 'citacion_acreedores_edicto') return {
    ...base,
    sindico_nombre:               camposDoc.sindico_nombre || '',
    sindico_domicilio:            camposDoc.sindico_domicilio || '',
    fecha_limite_verificacion:    camposDoc.fecha_limite_verificacion || new Date().toISOString().split('T')[0],
    dias_publicacion:             Number(camposDoc.dias_publicacion) || 5,
    tipo_proceso:                 camposDoc.tipo_proceso_concursal || 'concurso_preventivo',
  }
  if (tipoDoc === 'designacion_sindico') return {
    ...base,
    sindico_nombre:           camposDoc.sindico_nombre || '',
    sindico_matricula:        camposDoc.sindico_matricula || null,
    tipo_proceso:             camposDoc.tipo_proceso_concursal || 'concurso_preventivo',
    plazo_aceptacion_dias:    Number(camposDoc.plazo_aceptacion_dias) || 5,
  }
  if (tipoDoc === 'verificacion_creditos') return {
    ...base,
    sindico_nombre:           camposDoc.sindico_nombre || '',
    creditos_verificados:     Number(camposDoc.creditos_verificados) || 0,
    creditos_inadmisibles:    Number(camposDoc.creditos_inadmisibles) || 0,
    monto_total_verificado:   camposDoc.monto_total_verificado ? Number(camposDoc.monto_total_verificado) : null,
    con_privilegio_especial:  Number(camposDoc.con_privilegio_especial) || 0,
    con_privilegio_general:   Number(camposDoc.con_privilegio_general) || 0,
  }
  if (tipoDoc === 'realizacion_bienes') return {
    ...base,
    modalidad_realizacion:  camposDoc.modalidad_realizacion || 'subasta_judicial',
    descripcion_bienes:     camposDoc.descripcion_bienes || '',
    martillero_nombre:      camposDoc.martillero_nombre || null,
    base_subasta:           camposDoc.base_subasta ? Number(camposDoc.base_subasta) : null,
    fecha_subasta:          camposDoc.fecha_subasta || null,
  }
  // ---------------------------------------------------------------------------
  // Penal — adicionales
  // ---------------------------------------------------------------------------
  if (tipoDoc === 'prision_preventiva') return {
    ...base,
    fiscal_nombre:        camposDoc.fiscal_nombre || null,
    defensor_nombre:      camposDoc.defensor_nombre || null,
    calificacion_legal:   camposDoc.calificacion_legal || '',
    causal:               camposDoc.causal_prision || 'peligro_fuga',
    descripcion_hecho:    camposDoc.descripcion_hecho || null,
    escala_minima_pena:   camposDoc.escala_minima_pena || null,
  }
  if (tipoDoc === 'cese_prision_preventiva') return {
    ...base,
    fiscal_nombre:        camposDoc.fiscal_nombre || null,
    defensor_nombre:      camposDoc.defensor_nombre || null,
    calificacion_legal:   camposDoc.calificacion_legal || null,
    modalidad:            camposDoc.modalidad_libertad || 'excarcelacion',
    causal_cese:          camposDoc.causal_cese || 'variacion_circunstancias',
    causal_descripcion:   camposDoc.causal_descripcion || null,
    condiciones:          camposDoc.condiciones || [],
  }
  if (tipoDoc === 'admision_partes_civiles') return {
    ...base,
    tipo_parte_civil:           camposDoc.tipo_parte_civil || 'actor_civil',
    nombre_parte_civil:         camposDoc.nombre_parte_civil || '',
    calificacion_provisional:   camposDoc.calificacion_provisional || null,
    plazo_contestacion_dias:    camposDoc.plazo_contestacion_dias ? Number(camposDoc.plazo_contestacion_dias) : null,
  }
  if (tipoDoc === 'traslado_vista_fiscal') return {
    ...base,
    tipo_vista:   camposDoc.tipo_vista || 'fiscal_instruccion',
    objeto_vista: camposDoc.objeto_vista || '',
    plazo_dias:   Number(camposDoc.plazo_dias) || 5,
  }
  if (tipoDoc === 'citacion_testigos_peritos') return {
    ...base,
    fecha_debate:       camposDoc.fecha_debate || new Date().toISOString().split('T')[0],
    hora_debate:        camposDoc.hora_debate || '09:00',
    tipo_convocados:    camposDoc.tipo_convocados || 'testigos',
    lista_convocados:   camposDoc.lista_convocados || [],
    apercibimiento:     camposDoc.apercibimiento || 'conducción por la fuerza pública en caso de inasistencia injustificada (art. 221 CPP)',
  }
  if (tipoDoc === 'suspension_juicio_prueba') return {
    ...base,
    fiscal_nombre:          camposDoc.fiscal_nombre || null,
    defensor_nombre:        camposDoc.defensor_nombre || null,
    calificacion_legal:     camposDoc.calificacion_legal || '',
    plazo_suspension_meses: Number(camposDoc.plazo_suspension_meses) || 12,
    reglas_conducta:        camposDoc.reglas_conducta || [],
    reparacion_danio:       camposDoc.reparacion_danio || null,
  }
  if (tipoDoc === 'extraccion_testimonios') return {
    ...base,
    objeto_testimonios: camposDoc.objeto_testimonios || '',
    destino:            camposDoc.destino || '',
    motivo:             camposDoc.motivo || '',
  }
  if (tipoDoc === 'archivo_notificacion') return {
    ...base,
    causal_archivo:         camposDoc.causal_archivo || 'desestimacion_fiscal',
    causal_descripcion:     camposDoc.causal_descripcion || null,
    notificar_querellante:  camposDoc.notificar_querellante === true,
  }
  // ---------------------------------------------------------------------------
  // Niñez — adicionales
  // ---------------------------------------------------------------------------
  if (tipoDoc === 'auto_medida_abrigo') return {
    ...base,
    nombre_nnya:        camposDoc.nombre_nnya || '',
    edad_nnya:          camposDoc.edad_nnya ? Number(camposDoc.edad_nnya) : null,
    modalidad_abrigo:   camposDoc.modalidad_abrigo || 'hogar_convivencial',
    establecimiento:    camposDoc.establecimiento || null,
    motivo_abrigo:      camposDoc.motivo_abrigo || '',
    plazo_dias:         Number(camposDoc.plazo_dias) || 30,
  }
  if (tipoDoc === 'notificacion_senaf') return {
    ...base,
    nombre_nnya:            camposDoc.nombre_nnya || '',
    organismo_notificar:    camposDoc.organismo_notificar || 'la Secretaría de Niñez, Adolescencia y Familia (SENAF)',
    objeto_notificacion:    camposDoc.objeto_notificacion || '',
    plazo_respuesta_dias:   camposDoc.plazo_respuesta_dias ? Number(camposDoc.plazo_respuesta_dias) : null,
  }
  if (tipoDoc === 'auto_internacion_salud_mental') return {
    ...base,
    nombre_nnya:                camposDoc.nombre_nnya || '',
    edad_nnya:                  camposDoc.edad_nnya ? Number(camposDoc.edad_nnya) : null,
    establecimiento_salud:      camposDoc.establecimiento_salud || '',
    diagnostico_provisional:    camposDoc.diagnostico_provisional || null,
    medico_interviniente:       camposDoc.medico_interviniente || null,
    plazo_revision_dias:        Number(camposDoc.plazo_revision_dias) || 30,
  }
  if (tipoDoc === 'decreto_visitas_supervisadas') return {
    ...base,
    nombre_nnya:          camposDoc.nombre_nnya || '',
    descripcion_regimen:  camposDoc.descripcion_regimen || '',
    lugar_visitas:        camposDoc.lugar_visitas || 'sede_juzgado',
    supervisor:           camposDoc.supervisor || null,
    vigencia:             camposDoc.vigencia_visitas || 'hasta_nueva_resolucion',
  }
  if (tipoDoc === 'auto_reintegro_familiar') return {
    ...base,
    nombre_nnya:              camposDoc.nombre_nnya || '',
    grupo_familiar_reintegro: camposDoc.grupo_familiar_reintegro || '',
    condiciones_reintegro:    camposDoc.condiciones_reintegro || [],
    motivo_reintegro:         camposDoc.motivo_reintegro || 'han cesado las circunstancias que motivaron la medida excepcional',
  }
  if (tipoDoc === 'citacion_seguimiento_nna') return {
    ...base,
    nombre_nnya:          camposDoc.nombre_nnya || '',
    tipo_audiencia:       camposDoc.tipo_audiencia_nna || 'seguimiento',
    fecha_audiencia:      camposDoc.fecha_audiencia || new Date().toISOString().split('T')[0],
    hora_audiencia:       camposDoc.hora_audiencia || '09:00',
    citar_senaf:          camposDoc.citar_senaf !== false,
    citar_equipo_tecnico: camposDoc.citar_equipo_tecnico !== false,
  }
  // ---------------------------------------------------------------------------
  // Sucesorio — adicionales
  // ---------------------------------------------------------------------------
  if (tipoDoc === 'citacion_herederos_acreedores') return {
    ...base,
    causante_nombre:            camposDoc.causante_nombre || '',
    dias_edictos:               Number(camposDoc.dias_edictos) || 5,
    publicar_boletin_oficial:   camposDoc.publicar_boletin_oficial !== false,
    publicar_diario_local:      camposDoc.publicar_diario_local !== false,
    plazo_presentacion_dias:    Number(camposDoc.plazo_presentacion_dias) || 30,
  }
  if (tipoDoc === 'aprobacion_inventario_avaluo') return {
    ...base,
    causante_nombre:          camposDoc.causante_nombre || '',
    perito_nombre:            camposDoc.perito_nombre || '',
    monto_total_avaluo:       camposDoc.monto_total_avaluo ? Number(camposDoc.monto_total_avaluo) : null,
    bienes_descripcion:       camposDoc.bienes_descripcion || null,
    con_impugnacion:          camposDoc.con_impugnacion === true,
    resolucion_impugnacion:   camposDoc.resolucion_impugnacion || null,
  }
  // ---------------------------------------------------------------------------
  // Incidentes civiles
  // ---------------------------------------------------------------------------
  if (tipoDoc === 'caducidad_instancia') return {
    ...base,
    instancia:          camposDoc.instancia || 'primera',
    plazo_meses:        Number(camposDoc.plazo_meses) || 6,
    ultima_actuacion:   camposDoc.ultima_actuacion || null,
    parte_peticionante: camposDoc.parte_peticionante || 'demandado',
    costas_al_actor:    camposDoc.costas_al_actor !== false,
  }
  if (tipoDoc === 'designacion_perito') return {
    ...base,
    especialidad:           camposDoc.especialidad || '',
    perito_nombre:          camposDoc.perito_nombre || null,
    plazo_aceptacion_dias:  Number(camposDoc.plazo_aceptacion_dias) || 5,
    plazo_dictamen_dias:    Number(camposDoc.plazo_dictamen_dias) || 30,
    puntos_periciales:      camposDoc.puntos_periciales || [],
  }
  if (tipoDoc === 'intimacion_cumplimiento_sentencia') return {
    ...base,
    plazo_dias:               Number(camposDoc.plazo_dias) || 10,
    tipo_obligacion:          camposDoc.tipo_obligacion || 'dar_dinero',
    descripcion_obligacion:   camposDoc.descripcion_obligacion || null,
    apercibimiento:           camposDoc.apercibimiento || 'ejecución forzada con costas',
  }
  if (tipoDoc === 'auto_desglose') return {
    ...base,
    descripcion_documentos:   camposDoc.descripcion_documentos || '',
    parte_solicitante:        camposDoc.parte_solicitante || 'actor',
    motivo:                   camposDoc.motivo || null,
    dejar_testimonio:         camposDoc.dejar_testimonio !== false,
  }
  if (tipoDoc === 'citacion_audiencia_conciliacion') return {
    ...base,
    fecha_audiencia:        camposDoc.fecha_audiencia || new Date().toISOString().split('T')[0],
    hora_audiencia:         camposDoc.hora_audiencia || '09:00',
    sala:                   camposDoc.sala || null,
    con_asistencia_letrada: camposDoc.con_asistencia_letrada !== false,
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

const layoutStyle       = { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'system-ui, sans-serif' }
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
const demoPanelStyle    = { background: '#f7f8fa', border: '1px solid #e0e0e8', borderRadius: 8, padding: '12px 14px', marginBottom: 18 }
const demoCasoBtn       = { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: '1px solid', borderRadius: 7, cursor: 'pointer', background: '#fafafa', transition: 'all 0.12s' }
const previewWrapStyle  = { display: 'flex', flexDirection: 'column', height: '100%' }
const previewHeaderStyle= { padding: '12px 24px', borderBottom: '1px solid #eee', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap', gap: 8 }
const preStyle          = { fontFamily: '"Courier New", monospace', fontSize: 13, lineHeight: 1.8, padding: 32, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 16, background: '#fff', borderRadius: 8, border: '1px solid #e0e0e8' }
const searchInputStyle  = { width: '100%', padding: '6px 12px', borderRadius: 20, border: 'none', fontSize: 13, background: 'rgba(255,255,255,0.15)', color: '#fff', outline: 'none', boxSizing: 'border-box' }
const searchDropdownStyle = { position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 1000, marginTop: 4, maxHeight: 320, overflowY: 'auto', border: '1px solid #e0e0e8' }
const searchItemStyle   = { display: 'block', width: '100%', padding: '8px 12px', background: '#fff', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid #f0f0f8', transition: 'background 0.1s' }
const searchSpinnerStyle = { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.7)', fontSize: 13 }

// Favoritos
const panelFrecuentesStyle   = { background: '#fffbea', border: '1.5px solid #f5e03a', borderRadius: 10, padding: '14px 16px', marginBottom: 22 }
const frecuentesTituloStyle  = { fontSize: 11, fontWeight: 700, color: '#b8860b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }
const frecuentesGridStyle    = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }
const frecuentesCardStyle    = { display: 'flex', alignItems: 'center', gap: 6, background: '#fff', borderRadius: 7, padding: '8px 10px', border: '1px solid #f0e68c' }
const frecuentesDocBtnStyle  = { display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#0047AB', padding: 0 }
const btnQuitarFavStyle      = { background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: '0 2px', flexShrink: 0, opacity: 0.7 }
const btnEstrellaStyle       = { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: '0 4px', flexShrink: 0, transition: 'color 0.15s' }
const btnEstrellaPreviewStyle = { background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: '0 2px', lineHeight: 1 }
