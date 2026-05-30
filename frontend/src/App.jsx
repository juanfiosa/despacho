import { useState } from 'react'
import { useJuzgado } from './useJuzgado.js'
import ConfigJuzgado from './components/ConfigJuzgado.jsx'
import Wizard from './components/Wizard.jsx'
import Calculadora from './components/Calculadora.jsx'

export default function App() {
  const { juzgado, setJuzgado, limpiarJuzgado, favoritos, toggleFavorito, esFavorito } = useJuzgado()
  const [tab, setTab] = useState('generador')

  const TABS = [
    ['generador',   '📄 Generador'],
    ['calculadora', '🧮 Calculadora'],
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
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
