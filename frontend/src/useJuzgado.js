/**
 * Hook para la configuración del juzgado y favoritos.
 * Persiste en localStorage. En producción esto vendrá del perfil de usuario.
 *
 * Favoritos: lista de `tipo` de documentos marcados como frecuentes.
 * Se guardan en una clave separada para que no se pierdan al cambiar
 * la configuración del juzgado.
 */
import { useState, useCallback } from 'react'

const KEY     = 'despacho_juzgado'
const FAV_KEY = 'despacho_favoritos'

function cargarFavoritos() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || [] }
  catch { return [] }
}

export function useJuzgado() {
  const [juzgado, setJuzgadoState] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || null }
    catch { return null }
  })

  const [favoritos, setFavoritosState] = useState(cargarFavoritos)

  const setJuzgado = (datos) => {
    localStorage.setItem(KEY, JSON.stringify(datos))
    setJuzgadoState(datos)
  }

  const limpiarJuzgado = () => {
    localStorage.removeItem(KEY)
    setJuzgadoState(null)
  }

  const toggleFavorito = useCallback((tipo) => {
    setFavoritosState(prev => {
      const next = prev.includes(tipo)
        ? prev.filter(t => t !== tipo)
        : [...prev, tipo]
      localStorage.setItem(FAV_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const esFavorito = useCallback((tipo) => favoritos.includes(tipo), [favoritos])

  return { juzgado, setJuzgado, limpiarJuzgado, favoritos, toggleFavorito, esFavorito }
}
