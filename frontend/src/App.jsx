import { useState } from 'react'
import { useJuzgado } from './useJuzgado.js'
import ConfigJuzgado from './components/ConfigJuzgado.jsx'
import Wizard from './components/Wizard.jsx'
import Calculadora from './components/Calculadora.jsx'
import Demos from './components/Demos.jsx'

export default function App() {
  const { juzgado, setJuzgado, limpiarJuzgado } = useJuzgado()
  // Demos is the default tab so visitors see it immediately, no setup required
  const [tab, setTab] = useState('demos')

  const TABS = [
    ['demos',       '🎬 Demos'],
    ['generador',   '📄 Generador'],
    ['calculadora', '🧮 Calculadora'],
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Tab bar — always visible */}
      <div style={{ display: 'flex', background: '#003a8c', paddingLeft: 16, gap: 2, flexShrink: 0 }}>
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

      {/* Contenido de la pestaña activa */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Demos: no juzgado needed */}
        {tab === 'demos' && (
          <Demos juzgado={juzgado} />
        )}

        {/* Generador y Calculadora: piden configuración si no hay juzgado */}
        {tab === 'generador' && !juzgado && (
          <ConfigJuzgado onGuardar={(j) => { setJuzgado(j); }} />
        )}
        {tab === 'generador' && juzgado && (
          <Wizard juzgado={juzgado} onCambiarJuzgado={limpiarJuzgado} />
        )}

        {tab === 'calculadora' && !juzgado && (
          <ConfigJuzgado onGuardar={(j) => { setJuzgado(j); }} />
        )}
        {tab === 'calculadora' && juzgado && (
          <Calculadora juzgado={juzgado} />
        )}

      </div>
    </div>
  )
}
