/**
 * Hook para la configuración del juzgado.
 * Persiste en localStorage. En producción esto vendrá del perfil de usuario.
 */
import { useState } from 'react'

const KEY = 'despacho_juzgado'

export function useJuzgado() {
  const [juzgado, setJuzgadoState] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || null }
    catch { return null }
  })

  const setJuzgado = (datos) => {
    localStorage.setItem(KEY, JSON.stringify(datos))
    setJuzgadoState(datos)
  }

  const limpiarJuzgado = () => {
    localStorage.removeItem(KEY)
    setJuzgadoState(null)
  }

  return { juzgado, setJuzgado, limpiarJuzgado }
}
