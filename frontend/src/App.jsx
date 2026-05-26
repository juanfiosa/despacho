import { useJuzgado } from './useJuzgado.js'
import ConfigJuzgado from './components/ConfigJuzgado.jsx'
import Wizard from './components/Wizard.jsx'

export default function App() {
  const { juzgado, setJuzgado, limpiarJuzgado } = useJuzgado()

  if (!juzgado) {
    return <ConfigJuzgado onGuardar={setJuzgado} />
  }

  return (
    <Wizard
      juzgado={juzgado}
      onCambiarJuzgado={limpiarJuzgado}
    />
  )
}
