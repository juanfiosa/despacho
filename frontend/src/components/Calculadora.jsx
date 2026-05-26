/**
 * Calculadora.jsx — Intereses y plazos procesales
 *
 * Tabs:
 *   1. Intereses — calcula intereses devengados (BNA activa/pasiva, CER, manual)
 *   2. Plazos    — vencimiento en días hábiles judiciales + verificador de día hábil
 */

import { useState } from 'react'
import { calcularIntereses, calcularVencimiento, verificarDiaHabil } from '../api.js'

export default function Calculadora({ juzgado }) {
  const [tab, setTab] = useState('intereses')

  return (
    <div style={layoutStyle}>
      {/* Header — mismo estilo que Wizard */}
      <header style={headerStyle}>
        <span style={logoStyle}>Despacho</span>
        <span style={chipStyle}>{juzgado?.nombre || ''}{juzgado?.secretaria ? ` — ${juzgado.secretaria}` : ''}</span>
      </header>

      {/* Inner tabs */}
      <div style={tabBarStyle}>
        {[['intereses', 'Intereses'], ['plazos', 'Plazos procesales']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              ...tabBtnBase,
              color:         tab === id ? '#0047AB' : '#888',
              fontWeight:    tab === id ? 700 : 400,
              borderBottom:  tab === id ? '2px solid #0047AB' : '2px solid transparent',
            }}
          >{label}</button>
        ))}
      </div>

      {/* Contenido */}
      <div style={scrollStyle}>
        <div style={contentStyle}>
          {tab === 'intereses' ? <CalcIntereses /> : <CalcPlazos />}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Pestaña 1: Calculadora de intereses
// ---------------------------------------------------------------------------

const TASAS = [
  { value: 'BNA_ACTIVA',   label: 'BNA tasa activa (mora / alimentos)' },
  { value: 'BNA_PASIVA',   label: 'BNA tasa pasiva (depósitos)' },
  { value: 'BCRA_CER',     label: 'CER (Coeficiente de Estabilización de Referencia)' },
  { value: 'TASA_CERO',    label: 'Tasa cero (capital puro, sin intereses)' },
  { value: 'MANUAL_ANUAL', label: 'Tasa anual manual (%)' },
]

function CalcIntereses() {
  const [capital,   setCapital]   = useState('')
  const [tasa,      setTasa]      = useState('BNA_ACTIVA')
  const [tasaPct,   setTasaPct]   = useState('')
  const [desde,     setDesde]     = useState('')
  const [hasta,     setHasta]     = useState('')
  const [resultado, setResultado] = useState(null)
  const [error,     setError]     = useState(null)
  const [cargando,  setCargando]  = useState(false)

  const calcular = async () => {
    setError(null); setResultado(null)
    if (!capital || isNaN(parseFloat(capital)) || parseFloat(capital) <= 0) {
      setError('Ingresá un capital válido'); return
    }
    if (!desde) { setError('Ingresá la fecha de mora (inicio del período)'); return }
    if (tasa === 'MANUAL_ANUAL' && (!tasaPct || isNaN(parseFloat(tasaPct)) || parseFloat(tasaPct) <= 0)) {
      setError('Ingresá la tasa anual (%)'); return
    }
    setCargando(true)
    try {
      const r = await calcularIntereses({
        capital:               parseFloat(capital),
        tasa,
        desde,
        hasta:                 hasta || null,
        tasa_anual_pct_manual: tasa === 'MANUAL_ANUAL' ? parseFloat(tasaPct) : null,
      })
      setResultado(r)
    } catch (e) { setError(e.message) }
    finally { setCargando(false) }
  }

  const fmt = (n) => n?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div>
      <h2 style={h2Style}>Calculadora de intereses</h2>
      <p style={subStyle}>Devengamiento de intereses según tasas de referencia judicial en Córdoba</p>

      <div style={cardStyle}>
        <Campo label="Capital ($ pesos)" type="number" value={capital} onChange={setCapital} placeholder="ej: 100000" />

        <div style={{ marginBottom: 14 }}>
          <label style={lblStyle}>Tasa</label>
          <select value={tasa} onChange={e => { setTasa(e.target.value); setResultado(null) }} style={selStyle}>
            {TASAS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {tasa === 'MANUAL_ANUAL' && (
          <Campo label="Tasa anual (%)" type="number" value={tasaPct} onChange={setTasaPct} placeholder="ej: 36" />
        )}

        <div style={grid2Style}>
          <Campo label="Desde (fecha de mora)" type="date" value={desde} onChange={setDesde} />
          <Campo label="Hasta (por defecto: hoy)" type="date" value={hasta} onChange={setHasta} />
        </div>

        {error && <p style={errStyle}>{error}</p>}
        <button onClick={calcular} disabled={cargando} style={btnPrimStyle}>
          {cargando ? 'Calculando…' : 'Calcular intereses'}
        </button>
      </div>

      {resultado && (
        <div style={{ ...cardStyle, marginTop: 16 }}>
          {resultado.advertencia && (
            <p style={warningStyle}>⚠ {resultado.advertencia}</p>
          )}
          <div style={grid2Style}>
            <Cifra label="Capital" value={`$ ${fmt(resultado.capital)}`} />
            <Cifra label="Intereses devengados" value={`$ ${fmt(resultado.intereses)}`} accent />
          </div>
          <div style={{ ...grid2Style, marginTop: 10 }}>
            <Cifra label="Total (capital + intereses)" value={`$ ${fmt(resultado.total)}`} big />
            <Cifra label="Período" value={`${resultado.dias} días`} />
          </div>
          <p style={{ fontSize: 12, color: '#888', marginTop: 14 }}>
            Tasa aplicada: <strong>{resultado.tasa_descripcion}</strong> ·
            Período: {resultado.desde} → {resultado.hasta}
          </p>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Pestaña 2: Calculadora de plazos
// ---------------------------------------------------------------------------

function CalcPlazos() {
  const [desde,       setDesde]       = useState('')
  const [diasHabiles, setDiasHabiles] = useState('5')
  const [resultado,   setResultado]   = useState(null)
  const [errorV,      setErrorV]      = useState(null)
  const [cargandoV,   setCargandoV]   = useState(false)

  const [fechaVerif,  setFechaVerif]  = useState('')
  const [resVerif,    setResVerif]    = useState(null)
  const [errorH,      setErrorH]      = useState(null)
  const [cargandoH,   setCargandoH]   = useState(false)

  const calcVenc = async () => {
    setErrorV(null); setResultado(null)
    if (!desde) { setErrorV('Ingresá la fecha de inicio del plazo'); return }
    const dias = parseInt(diasHabiles)
    if (!diasHabiles || isNaN(dias) || dias <= 0) { setErrorV('Ingresá un plazo válido (días hábiles > 0)'); return }
    setCargandoV(true)
    try {
      const r = await calcularVencimiento({ desde, dias_habiles: dias })
      setResultado(r)
    } catch (e) { setErrorV(e.message) }
    finally { setCargandoV(false) }
  }

  const verificar = async () => {
    setErrorH(null); setResVerif(null)
    if (!fechaVerif) { setErrorH('Ingresá una fecha'); return }
    setCargandoH(true)
    try {
      const r = await verificarDiaHabil(fechaVerif)
      setResVerif(r)
    } catch (e) { setErrorH(e.message) }
    finally { setCargandoH(false) }
  }

  return (
    <div>
      <h2 style={h2Style}>Calculadora de plazos procesales</h2>
      <p style={subStyle}>
        Vencimientos en días hábiles judiciales — excluye fines de semana y feriados de Córdoba
      </p>

      <div style={cardStyle}>
        <div style={grid2Style}>
          <Campo label="Desde (inicio del plazo)" type="date" value={desde} onChange={setDesde} />
          <Campo label="Días hábiles del plazo" type="number" value={diasHabiles} onChange={setDiasHabiles} placeholder="ej: 30" />
        </div>
        {errorV && <p style={errStyle}>{errorV}</p>}
        <button onClick={calcVenc} disabled={cargandoV} style={btnPrimStyle}>
          {cargandoV ? 'Calculando…' : 'Calcular vencimiento'}
        </button>
      </div>

      {resultado && (
        <div style={{ ...cardStyle, marginTop: 12, background: '#f0f4ff', border: '1.5px solid #b3c7f0' }}>
          <p style={{ margin: '0 0 6px', fontSize: 13, color: '#555' }}>
            Plazo de <strong>{resultado.dias_habiles} días hábiles</strong> desde {resultado.desde}:
          </p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0047AB' }}>
            {resultado.vencimiento}
            <span style={{ fontSize: 15, fontWeight: 400, color: '#555', marginLeft: 10 }}>
              ({resultado.dia_semana})
            </span>
          </p>
        </div>
      )}

      {/* Divisor */}
      <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e0e0e8' }} />

      {/* Verificador de día hábil */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginTop: 0, marginBottom: 14 }}>
          ¿Es día hábil judicial?
        </h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={lblStyle}>Fecha a verificar</label>
            <input
              type="date"
              value={fechaVerif}
              onChange={e => { setFechaVerif(e.target.value); setResVerif(null) }}
              style={inpStyle}
            />
          </div>
          <button onClick={verificar} disabled={cargandoH} style={{ ...btnPrimStyle, marginBottom: 0 }}>
            {cargandoH ? '…' : 'Verificar'}
          </button>
        </div>
        {errorH && <p style={errStyle}>{errorH}</p>}
        {resVerif && (
          <div style={{
            marginTop: 12, padding: '10px 14px', borderRadius: 7,
            background: resVerif.es_habil ? '#e6f4ea' : '#fce8e6',
            border: `1.5px solid ${resVerif.es_habil ? '#4caf50' : '#e53935'}`,
          }}>
            <strong style={{ color: resVerif.es_habil ? '#256029' : '#b71c1c', fontSize: 14 }}>
              {resVerif.fecha} ({resVerif.dia_semana}) —{' '}
              {resVerif.es_habil ? '✓ Es día hábil judicial' : '✗ No es día hábil judicial'}
            </strong>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

function Campo({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={lblStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={inpStyle}
      />
    </div>
  )
}

function Cifra({ label, value, accent, big }) {
  return (
    <div style={{ background: '#f8f9ff', borderRadius: 8, padding: '12px 14px' }}>
      <div style={{ fontSize: 11, color: '#777', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: big ? 20 : 16, fontWeight: 700, color: accent ? '#0047AB' : '#1a1a2e' }}>
        {value}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const layoutStyle  = { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'system-ui, sans-serif' }
const headerStyle  = { background: '#0047AB', color: '#fff', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }
const logoStyle    = { fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }
const chipStyle    = { fontSize: 13, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '3px 10px' }
const tabBarStyle  = { display: 'flex', background: '#fff', borderBottom: '1px solid #e0e0e8', padding: '0 24px', flexShrink: 0 }
const tabBtnBase   = { background: 'transparent', border: 'none', padding: '12px 18px', fontSize: 14, cursor: 'pointer', marginBottom: -1 }
const scrollStyle  = { flex: 1, overflowY: 'auto', background: '#f4f5f7' }
const contentStyle = { maxWidth: 620, margin: '0 auto', padding: '32px 24px' }
const h2Style      = { fontSize: 20, fontWeight: 700, color: '#1a1a2e', marginTop: 0, marginBottom: 4 }
const subStyle     = { fontSize: 13, color: '#777', marginTop: 0, marginBottom: 20 }
const cardStyle    = { background: '#fff', borderRadius: 10, padding: 20, border: '1px solid #e0e0e8' }
const grid2Style   = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }
const lblStyle     = { display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }
const selStyle     = { width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #ddd', fontSize: 14, boxSizing: 'border-box', background: '#fff' }
const inpStyle     = { width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #ddd', fontSize: 14, boxSizing: 'border-box' }
const btnPrimStyle = { background: '#0047AB', color: '#fff', border: 'none', borderRadius: 7, padding: '10px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 4 }
const errStyle     = { color: '#c00', fontSize: 13, marginTop: 6, marginBottom: 0 }
const warningStyle = { fontSize: 12, color: '#7a4200', background: '#fff8e6', borderRadius: 6, padding: '8px 12px', marginBottom: 14 }
