/**
 * Pantalla de configuración del juzgado.
 * Se muestra la primera vez o al hacer "Cambiar juzgado".
 */

import { useState } from 'react'

const FUEROS = [
  { id: 'civil_comercial',            label: 'Civil y Comercial',          icono: '📋', ejemplo: 'Juzgado Civil y Comercial de 5ª Nominación' },
  { id: 'laboral',                    label: 'Laboral',                    icono: '⚖️', ejemplo: 'Juzgado de Conciliación de 3ª Nominación' },
  { id: 'familia',                    label: 'Familia',                    icono: '👨‍👩‍👧', ejemplo: 'Juzgado de Familia de 2ª Nominación' },
  { id: 'contencioso_administrativo', label: 'Contencioso Administrativo', icono: '🏛️', ejemplo: 'Cámara Contencioso Administrativa de 1ª Nominación' },
  { id: 'penal',                      label: 'Penal',                      icono: '🔒', ejemplo: 'Juzgado de Control N° 3' },
  { id: 'violencia_familiar',         label: 'Violencia Familiar',         icono: '🛡️', ejemplo: 'Juzgado de Violencia Familiar N° 1' },
  { id: 'ninez',                      label: 'Niñez y Adolescencia',       icono: '👶', ejemplo: 'Juzgado de Niñez, Adolescencia y Violencia Familiar' },
  { id: 'concursal',                  label: 'Concursal',                  icono: '🏢', ejemplo: 'Juzgado Civil y Comercial de 8ª Nominación' },
]

export default function ConfigJuzgado({ onGuardar }) {
  const [fuero,      setFuero]      = useState('civil_comercial')
  const [nombre,     setNombre]     = useState('')
  const [secretaria, setSecretaria] = useState('')
  const [ciudad,     setCiudad]     = useState('Córdoba')
  const [error,      setError]      = useState('')

  const fueroActivo = FUEROS.find(f => f.id === fuero)

  const handleFuero = (id) => {
    setFuero(id)
    setNombre('')   // resetear para que aparezca el nuevo placeholder
    setError('')
  }

  const guardar = () => {
    if (!nombre.trim()) {
      setError('Ingresá el nombre del juzgado para continuar')
      return
    }
    onGuardar({
      fuero,
      nombre:     nombre.trim(),
      secretaria: secretaria.trim(),
      ciudad:     ciudad.trim() || 'Córdoba',
    })
  }

  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>

        {/* Encabezado */}
        <div style={headStyle}>
          <div style={logoStyle}>Despacho</div>
          <p style={subStyle}>Poder Judicial de la Provincia de Córdoba</p>
        </div>

        <h2 style={tituloStyle}>Configurá tu juzgado</h2>
        <p style={ayudaStyle}>
          Estos datos aparecerán en el encabezado de todos los documentos que generes.
          Se guardan solo en este dispositivo y podés cambiarlos cuando quieras.
        </p>

        {/* Selección de fuero — grilla de botones */}
        <div style={campoStyle}>
          <label style={labelStyle}>Fuero</label>
          <div style={fueroGridStyle}>
            {FUEROS.map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFuero(f.id)}
                style={{
                  ...fueroBtnStyle,
                  background:  f.id === fuero ? '#e8f0fe' : '#fafafa',
                  borderColor: f.id === fuero ? '#0047AB' : '#e0e0e8',
                  color:       f.id === fuero ? '#0047AB' : '#555',
                  fontWeight:  f.id === fuero ? 700 : 500,
                }}
              >
                <span style={{ fontSize: 16 }}>{f.icono}</span>
                <span style={{ fontSize: 11, lineHeight: 1.3, textAlign: 'center' }}>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Nombre del juzgado */}
        <div style={campoStyle}>
          <label style={labelStyle}>Nombre del juzgado / tribunal</label>
          <input
            value={nombre}
            onChange={e => { setNombre(e.target.value); setError('') }}
            placeholder={fueroActivo?.ejemplo || 'Ej: Juzgado Civil N° 1'}
            style={{ ...inputStyle, borderColor: error ? '#e53935' : '#ddd' }}
            onKeyDown={e => e.key === 'Enter' && guardar()}
            autoFocus
          />
          {error && <p style={errorStyle}>⚠ {error}</p>}
        </div>

        {/* Secretaría */}
        <div style={campoStyle}>
          <label style={labelStyle}>Secretaría <span style={{ fontWeight: 400, color: '#aaa' }}>(opcional)</span></label>
          <input
            value={secretaria}
            onChange={e => setSecretaria(e.target.value)}
            placeholder="Ej: Secretaría N° 2 — Dr. García"
            style={inputStyle}
            onKeyDown={e => e.key === 'Enter' && guardar()}
          />
        </div>

        {/* Ciudad */}
        <div style={campoStyle}>
          <label style={labelStyle}>Ciudad sede</label>
          <input
            value={ciudad}
            onChange={e => setCiudad(e.target.value)}
            style={inputStyle}
            onKeyDown={e => e.key === 'Enter' && guardar()}
          />
        </div>

        <button onClick={guardar} style={btnStyle}>
          Comenzar a generar documentos →
        </button>

        <p style={notaStyle}>
          🔒 Los datos se guardan localmente en tu navegador. Nunca salen de tu dispositivo.
        </p>

      </div>
    </div>
  )
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const wrapStyle      = { flex: 1, overflow: 'auto', background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, minHeight: 0 }
const cardStyle      = { background: '#fff', borderRadius: 16, padding: '40px 40px 32px', width: '100%', maxWidth: 520, boxShadow: '0 8px 32px rgba(0,71,171,0.10)' }

const headStyle      = { marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #f0f0f8' }
const logoStyle      = { fontSize: 24, fontWeight: 900, color: '#0047AB', letterSpacing: '-0.03em', marginBottom: 4 }
const subStyle       = { fontSize: 12, color: '#999', margin: 0 }

const tituloStyle    = { fontSize: 20, fontWeight: 800, color: '#1a1a2e', margin: '0 0 8px' }
const ayudaStyle     = { fontSize: 13, color: '#777', marginBottom: 24, lineHeight: 1.6 }

const campoStyle     = { marginBottom: 18 }
const labelStyle     = { display: 'block', fontSize: 11, fontWeight: 700, color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }

const fueroGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }
const fueroBtnStyle  = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 6px', border: '2px solid', borderRadius: 8, cursor: 'pointer', transition: 'all 0.12s' }

const inputStyle     = { width: '100%', padding: '10px 13px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' }
const errorStyle     = { color: '#e53935', fontSize: 12, marginTop: 6, marginBottom: 0 }

const btnStyle       = { width: '100%', background: '#0047AB', color: '#fff', border: 'none', borderRadius: 9, padding: '13px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4, letterSpacing: '-0.01em' }
const notaStyle      = { fontSize: 12, color: '#aaa', textAlign: 'center', marginTop: 16, marginBottom: 0, lineHeight: 1.5 }
