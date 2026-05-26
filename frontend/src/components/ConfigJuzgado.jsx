/**
 * Pantalla de configuración del juzgado.
 * Se muestra la primera vez (o al hacer "Cambiar juzgado").
 * En producción será reemplazada por login + perfil de usuario.
 */

import { useState } from 'react'

const FUEROS = [
  { id: 'civil_comercial',           label: 'Civil y Comercial' },
  { id: 'laboral',                   label: 'Laboral' },
  { id: 'familia',                   label: 'Familia' },
  { id: 'contencioso_administrativo',label: 'Contencioso Administrativo' },
  { id: 'penal',                     label: 'Penal' },
  { id: 'violencia_familiar',        label: 'Violencia Familiar' },
  { id: 'ninez',                     label: 'Niñez y Adolescencia' },
  { id: 'concursal',                 label: 'Concursal' },
]

export default function ConfigJuzgado({ onGuardar }) {
  const [fuero,      setFuero]      = useState('civil_comercial')
  const [nombre,     setNombre]     = useState('')
  const [secretaria, setSecretaria] = useState('')
  const [ciudad,     setCiudad]     = useState('Córdoba')
  const [error,      setError]      = useState('')

  const guardar = () => {
    if (!nombre.trim()) { setError('El nombre del juzgado es obligatorio'); return }
    onGuardar({ fuero, nombre: nombre.trim(), secretaria: secretaria.trim(), ciudad: ciudad.trim() || 'Córdoba' })
  }

  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        <div style={logoStyle}>Despacho</div>
        <p style={subStyle}>Poder Judicial de la Provincia de Córdoba</p>

        <h2 style={tituloStyle}>Configurar juzgado</h2>
        <p style={ayudaStyle}>
          Esta configuración identifica el órgano desde el que se generan los documentos.
          Quedará guardada en este dispositivo.
        </p>

        <div style={campoStyle}>
          <label style={labelStyle}>Fuero</label>
          <select value={fuero} onChange={e => setFuero(e.target.value)} style={inputStyle}>
            {FUEROS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </div>

        <div style={campoStyle}>
          <label style={labelStyle}>Nombre del juzgado / tribunal</label>
          <input
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="ej: Juzgado Civil y Comercial N° 5"
            style={inputStyle}
            onKeyDown={e => e.key === 'Enter' && guardar()}
          />
        </div>

        <div style={campoStyle}>
          <label style={labelStyle}>Secretaría (opcional)</label>
          <input
            value={secretaria}
            onChange={e => setSecretaria(e.target.value)}
            placeholder="ej: Secretaría N° 1"
            style={inputStyle}
          />
        </div>

        <div style={campoStyle}>
          <label style={labelStyle}>Ciudad sede</label>
          <input
            value={ciudad}
            onChange={e => setCiudad(e.target.value)}
            style={inputStyle}
          />
        </div>

        {error && <p style={errorStyle}>{error}</p>}

        <button onClick={guardar} style={btnStyle}>Guardar y comenzar →</button>
      </div>
    </div>
  )
}

const wrapStyle  = { minHeight: '100vh', background: '#f0f2f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }
const cardStyle  = { background: '#fff', borderRadius: 12, padding: '40px 48px', width: '100%', maxWidth: 480, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }
const logoStyle  = { fontSize: 28, fontWeight: 800, color: '#0047AB', letterSpacing: '-0.03em', marginBottom: 4 }
const subStyle   = { fontSize: 13, color: '#888', marginBottom: 32 }
const tituloStyle= { fontSize: 20, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }
const ayudaStyle = { fontSize: 13, color: '#666', marginBottom: 24, lineHeight: 1.5 }
const campoStyle = { marginBottom: 16 }
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }
const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 7, border: '1.5px solid #ddd', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }
const errorStyle = { color: '#c00', fontSize: 13, marginBottom: 12 }
const btnStyle   = { width: '100%', background: '#0047AB', color: '#fff', border: 'none', borderRadius: 7, padding: '12px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 }
