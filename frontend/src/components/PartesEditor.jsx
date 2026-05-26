import CampoRol from './CampoRol.jsx'

const parteBlanck = () => ({ rol: 'actor', nombre: '', dni_cuit: '', domicilio_real: '' })

export default function PartesEditor({ fuero, partes, onChange }) {
  const agregar = () => onChange([...partes, parteBlanck()])
  const quitar  = i => onChange(partes.filter((_, j) => j !== i))
  const actualizar = (i, campo, val) =>
    onChange(partes.map((p, j) => j === i ? { ...p, [campo]: val } : p))

  return (
    <div>
      {partes.map((parte, i) => (
        <div key={i} style={cardStyle}>
          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Rol</label>
              <CampoRol
                fuero={fuero}
                value={parte.rol}
                onChange={v => actualizar(i, 'rol', v)}
              />
            </div>
            <button onClick={() => quitar(i)} style={btnQuitarStyle} title="Quitar parte">✕</button>
          </div>
          <div style={rowStyle}>
            <Campo label="Nombre completo" style={{ flex: 2 }}
              value={parte.nombre} onChange={v => actualizar(i, 'nombre', v)} />
            <Campo label="DNI / CUIT" style={{ flex: 1 }}
              value={parte.dni_cuit} onChange={v => actualizar(i, 'dni_cuit', v)} />
          </div>
          <Campo label="Domicilio real"
            value={parte.domicilio_real} onChange={v => actualizar(i, 'domicilio_real', v)} />
        </div>
      ))}
      <button onClick={agregar} style={btnAgregarStyle}>+ Agregar parte</button>
    </div>
  )
}

function Campo({ label, value, onChange, style = {} }) {
  return (
    <div style={{ marginBottom: 8, ...style }}>
      <label style={labelStyle}>{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  )
}

const cardStyle = {
  background: '#f9f9fb', border: '1px solid #e0e0e8', borderRadius: 8,
  padding: 12, marginBottom: 10,
}
const rowStyle = { display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 8 }
const labelStyle = { display: 'block', fontSize: 12, color: '#555', marginBottom: 3 }
const inputStyle = {
  width: '100%', padding: '6px 10px', borderRadius: 6,
  border: '1px solid #ccc', fontSize: 14,
}
const btnQuitarStyle = {
  background: 'none', border: 'none', color: '#c00', cursor: 'pointer',
  fontSize: 16, padding: '4px 8px', marginTop: 18,
}
const btnAgregarStyle = {
  background: '#0047AB', color: '#fff', border: 'none', borderRadius: 6,
  padding: '7px 16px', fontSize: 13, cursor: 'pointer',
}
