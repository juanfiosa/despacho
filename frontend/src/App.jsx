import { useState } from 'react'
import { useJuzgado } from './useJuzgado.js'
import ConfigJuzgado from './components/ConfigJuzgado.jsx'
import Wizard from './components/Wizard.jsx'
import Calculadora from './components/Calculadora.jsx'
import Demos from './components/Demos.jsx'

export default function App() {
  const { juzgado, setJuzgado, limpiarJuzgado, favoritos, toggleFavorito, esFavorito } = useJuzgado()

  const [tab,     setTab]     = useState('generador')
  // Dentro del Generador: 'demos' muestra la línea de tiempo / casos,
  // 'wizard' muestra el formulario paso a paso para generar un documento puntual.
  const [genMode, setGenMode] = useState('demos')

  const TABS = [
    ['generador',   '📄 Generador'],
    ['calculadora', '🧮 Calculadora'],
  ]

  // Cuando el usuario cambia de pestaña, vuelve al modo demos dentro del generador
  const cambiarTab = (id) => {
    setTab(id)
    if (id === 'generador') setGenMode('demos')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', background: '#003a8c', paddingLeft: 16, gap: 2, flexShrink: 0 }}>
        {TABS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => cambiarTab(id)}
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

        {/* ── GENERADOR ─────────────────────────────────────────────────── */}
        {tab === 'generador' && genMode === 'demos' && (
          <Demos
            juzgado={juzgado}
            onNuevoDocumento={() => setGenMode('wizard')}
          />
        )}

        {tab === 'generador' && genMode === 'wizard' && !juzgado && (
          <ConfigJuzgado onGuardar={(j) => { setJuzgado(j) }} />
        )}

        {tab === 'generador' && genMode === 'wizard' && juzgado && (
          <Wizard
            juzgado={juzgado}
            onCambiarJuzgado={limpiarJuzgado}
            onVolverADemos={() => setGenMode('demos')}
            favoritos={favoritos}
            toggleFavorito={toggleFavorito}
            esFavorito={esFavorito}
          />
        )}

        {/* ── CALCULADORA ───────────────────────────────────────────────── */}
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
