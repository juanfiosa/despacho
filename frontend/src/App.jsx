import { useState } from 'react'
import { useJuzgado } from './useJuzgado.js'
import ConfigJuzgado from './components/ConfigJuzgado.jsx'
import Wizard from './components/Wizard.jsx'
import Calculadora from './components/Calculadora.jsx'
import Landing from './components/Landing.jsx'

export default function App() {
  const { juzgado, setJuzgado, limpiarJuzgado, favoritos, toggleFavorito, esFavorito } = useJuzgado()

  // La landing se muestra siempre al entrar si no hay juzgado configurado,
  // o si el usuario vuelve al inicio. Si ya hay juzgado guardado, arranca
  // directo en el Generador.
  const [pantalla, setPantalla] = useState(juzgado ? 'app' : 'landing')
  const [tab,      setTab]      = useState('generador')

  const TABS = [
    ['generador',   '📄 Generador'],
    ['calculadora', '🧮 Calculadora'],
  ]

  // ── Landing ──────────────────────────────────────────────────────────────
  if (pantalla === 'landing') {
    return <Landing onIngresar={() => setPantalla('app')} />
  }

  // ── App ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* Tab bar */}
      <div style={{ display: 'flex', background: '#003a8c', paddingLeft: 16, gap: 2, flexShrink: 0, alignItems: 'flex-end' }}>
        {/* Logo */}
        <button
          onClick={() => setPantalla('landing')}
          style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 900, fontSize: 16, letterSpacing: '-0.02em', cursor: 'pointer', padding: '10px 16px 10px 4px', opacity: 0.9 }}
          title="Inicio"
        >
          Despacho
        </button>

        {TABS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              background:   tab === id ? '#fff' : 'transparent',
              color:        tab === id ? '#0047AB' : 'rgba(255,255,255,0.8)',
              border:       'none',
              padding:      '7px 18px',
              fontWeight:   tab === id ? 700 : 400,
              fontSize:     12,
              cursor:       'pointer',
              borderRadius: '6px 6px 0 0',
              marginTop:    4,
              transition:   'all 0.15s',
            }}
          >{label}</button>
        ))}
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {tab === 'generador' && !juzgado && (
          <ConfigJuzgado onGuardar={(j) => { setJuzgado(j) }} />
        )}
        {tab === 'generador' && juzgado && (
          <Wizard
            juzgado={juzgado}
            onCambiarJuzgado={limpiarJuzgado}
            favoritos={favoritos}
            toggleFavorito={toggleFavorito}
            esFavorito={esFavorito}
          />
        )}

        {tab === 'calculadora' && !juzgado && (
          <ConfigJuzgado onGuardar={(j) => { setJuzgado(j) }} />
        )}
        {tab === 'calculadora' && juzgado && (
          <Calculadora juzgado={juzgado} />
        )}

      </div>
    </div>
  )
}
