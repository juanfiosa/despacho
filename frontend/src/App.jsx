import { useState } from 'react'
import { useJuzgado } from './useJuzgado.js'
import ConfigJuzgado from './components/ConfigJuzgado.jsx'
import Wizard from './components/Wizard.jsx'
import Calculadora from './components/Calculadora.jsx'
import Demos from './components/Demos.jsx'

export default function App() {
  const { juzgado, setJuzgado, limpiarJuzgado } = useJuzgado()
  const [tab, setTab] = useState('generador')

  if (!juzgado) {
    return <ConfigJuzgado onGuardar={setJuzgado} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Tab bar encima del header */}
      <div style={{ display: 'flex', background: '#003a8c', paddingLeft: 16, gap: 2, flexShrink: 0 }}>
        {[['generador', '📄 Generador'], ['calculadora', '🧮 Calculadora'], ['demos', '🎬 Demos']].map(([id, label]) => (
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
        {tab === 'generador' && (
          <Wizard juzgado={juzgado} onCambiarJuzgado={limpiarJuzgado} />
        )}
        {tab === 'calculadora' && (
          <Calculadora juzgado={juzgado} />
        )}
        {tab === 'demos' && (
          <Demos juzgado={juzgado} />
        )}
      </div>
    </div>
  )
}
