const ROLES = {
  civil_comercial: ['actor', 'demandado', 'tercero', 'garante', 'otro'],
  laboral:         ['actor', 'demandado', 'otro'],
  familia:         ['actor', 'demandado', 'alimentante', 'alimentado', 'requirente', 'requerido', 'otro'],
  penal:           ['imputado', 'victima', 'fiscal', 'querellante', 'defensor', 'otro'],
  violencia_familiar: ['requirente', 'requerido', 'victima', 'otro'],
  ninez:           ['progenitor', 'menor', 'representante_legal', 'defensor_publico', 'otro'],
  contencioso_administrativo: ['actor', 'demandado', 'codemandado', 'otro'],
  concursal:       ['concursado', 'acreedor', 'sindico', 'otro'],
}

export default function CampoRol({ fuero, value, onChange, ...props }) {
  const opciones = ROLES[fuero] || ['actor', 'demandado', 'otro']
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <select
        value={value === 'otro' || !opciones.includes(value) ? 'otro' : value}
        onChange={e => onChange(e.target.value)}
        style={selectStyle}
        {...props}
      >
        {opciones.map(r => (
          <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
        ))}
      </select>
      {(value === 'otro' || !opciones.includes(value)) && (
        <input
          placeholder="Especificar rol"
          value={opciones.includes(value) ? '' : value}
          onChange={e => onChange(e.target.value)}
          style={{ ...inputStyle, flex: 1 }}
        />
      )}
    </div>
  )
}

const selectStyle = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc',
  background: '#fff', fontSize: 14, minWidth: 160,
}
const inputStyle = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc',
  background: '#fff', fontSize: 14,
}
