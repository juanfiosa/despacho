/**
 * Formulario para cargar los datos de un nuevo caso personalizado.
 * Permite seleccionar el tipo de proceso y completar: expediente, carátula,
 * objeto y las partes requeridas por el proceso.
 *
 * Props:
 *   juzgado     – objeto del juzgado (de useJuzgado)
 *   onCrear(caso) – callback con el objeto caso creado
 *   onCancelar  – callback para volver al listado de demos
 */

import { useState } from 'react'
import { PROCESOS } from '../data/procesosTemplates.js'

const ROL_LABELS = {
  actor:       'Actor / Parte actora',
  demandado:   'Demandado / Parte demandada',
  conyuge_1:   'Cónyuge 1',
  conyuge_2:   'Cónyuge 2',
  imputado:    'Imputado / Encausado',
  fiscal:      'Fiscal / Ministerio Público',
  querellante: 'Querellante (opcional)',
}

export default function NuevoCasoForm({ juzgado, onCrear, onCancelar }) {
  const [procesoId, setProcesoId] = useState(PROCESOS[0].id)
  const [expediente, setExpediente] = useState('')
  const [caratula,   setCaratula]   = useState('')
  const [partes,     setPartes]     = useState({})
  const [camposCaso, setCamposCaso] = useState({})
  const [errores,    setErrores]    = useState({})

  const proceso = PROCESOS.find(p => p.id === procesoId)

  // Actualizar partes cuando cambia el proceso
  const handleProcesoChange = (id) => {
    setProcesoId(id)
    setPartes({})
    setCamposCaso({})
    setErrores({})
  }

  const setParte = (rol, campo, valor) => {
    setPartes(prev => ({
      ...prev,
      [rol]: { ...(prev[rol] || {}), [campo]: valor },
    }))
  }

  const setCampoCaso = (key, valor) => {
    setCamposCaso(prev => ({ ...prev, [key]: valor }))
  }

  const validar = () => {
    const errs = {}
    if (!expediente.trim()) errs.expediente = 'Requerido'
    if (!caratula.trim())   errs.caratula   = 'Requerido'
    proceso.roles_partes.forEach(rol => {
      const p = partes[rol] || {}
      if (!p.nombre?.trim()) errs[`${rol}_nombre`] = 'Requerido'
    })
    setErrores(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validar()) return

    // Construir objeto partes normalizado (ignora roles opcionales vacíos)
    const partesObj = {}
    proceso.roles_partes.forEach(rol => {
      if (partes[rol]?.nombre?.trim()) {
        partesObj[rol] = partes[rol]
      }
    })

    onCrear({
      procesoId,
      expediente: expediente.trim(),
      caratula:   caratula.trim(),
      partes:     partesObj,
      camposCaso,
      juzgado,
    })
  }

  return (
    <div style={wrapStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>

        {/* Encabezado */}
        <div style={headStyle}>
          <button type="button" onClick={onCancelar} style={backBtnStyle}>
            ← Volver
          </button>
          <h2 style={titleStyle}>Nuevo caso</h2>
          <p style={subtitleStyle}>
            Cargá los datos del expediente para generar documentos en cada etapa del proceso.
          </p>
        </div>

        {/* ── Tipo de proceso ── */}
        <section style={sectionStyle}>
          <div style={sectionTitleStyle}>Tipo de proceso</div>
          <div style={procesoGridStyle}>
            {PROCESOS.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProcesoChange(p.id)}
                style={{
                  ...procesoCardStyle,
                  borderColor:    p.id === procesoId ? p.color : '#e0e0e8',
                  background:     p.id === procesoId ? p.bg    : '#fafafa',
                  boxShadow:      p.id === procesoId ? `0 0 0 2px ${p.color}44` : 'none',
                }}
              >
                <span style={{ fontSize: 26, lineHeight: 1 }}>{p.icono}</span>
                <span style={{ fontSize: 12, fontWeight: p.id === procesoId ? 700 : 500, color: p.id === procesoId ? p.color : '#555', textAlign: 'center', lineHeight: 1.35 }}>
                  {p.nombre}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Datos del expediente ── */}
        <section style={sectionStyle}>
          <div style={sectionTitleStyle}>Datos del expediente</div>

          <div style={fieldRowStyle}>
            <label style={labelStyle}>
              N.° de expediente <span style={reqStyle}>*</span>
            </label>
            <input
              type="text"
              value={expediente}
              onChange={e => setExpediente(e.target.value)}
              placeholder="Ej: 2345678/2026"
              style={{ ...inputStyle, borderColor: errores.expediente ? '#e53935' : '#d0d0dc' }}
            />
            {errores.expediente && <span style={errStyle}>{errores.expediente}</span>}
          </div>

          <div style={fieldRowStyle}>
            <label style={labelStyle}>
              Carátula <span style={reqStyle}>*</span>
            </label>
            <input
              type="text"
              value={caratula}
              onChange={e => setCaratula(e.target.value)}
              placeholder="Ej: PÉREZ, JUAN c/ XYZ SA — Ordinario Laboral"
              style={{ ...inputStyle, borderColor: errores.caratula ? '#e53935' : '#d0d0dc' }}
            />
            {errores.caratula && <span style={errStyle}>{errores.caratula}</span>}
          </div>

          {/* Campos específicos del proceso */}
          {proceso.campos_caso?.map(campo => (
            <div key={campo.key} style={fieldRowStyle}>
              <label style={labelStyle}>
                {campo.label}
                {campo.required && <span style={reqStyle}> *</span>}
              </label>
              {campo.type === 'textarea' ? (
                <textarea
                  value={camposCaso[campo.key] ?? ''}
                  onChange={e => setCampoCaso(campo.key, e.target.value)}
                  placeholder={campo.placeholder || ''}
                  rows={3}
                  style={textareaStyle}
                />
              ) : campo.type === 'select' ? (
                <select
                  value={camposCaso[campo.key] ?? campo.default ?? ''}
                  onChange={e => setCampoCaso(campo.key, e.target.value)}
                  style={selectStyle}
                >
                  {campo.options.map(o => (
                    <option key={String(o.value)} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={camposCaso[campo.key] ?? ''}
                  onChange={e => setCampoCaso(campo.key, e.target.value)}
                  placeholder={campo.placeholder || ''}
                  style={inputStyle}
                />
              )}
            </div>
          ))}
        </section>

        {/* ── Partes ── */}
        <section style={sectionStyle}>
          <div style={sectionTitleStyle}>Partes del proceso</div>
          {proceso.roles_partes.map(rol => {
            const isOpcional = rol === 'querellante'
            const p = partes[rol] || {}
            return (
              <div key={rol} style={parteBlockStyle}>
                <div style={{ fontSize: 12, fontWeight: 700, color: proceso.color, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {ROL_LABELS[rol] || rol}{isOpcional && <span style={{ fontWeight: 400, color: '#aaa' }}> — opcional</span>}
                </div>

                <div style={fieldRowStyle}>
                  <label style={labelStyle}>
                    Nombre / Razón social{!isOpcional && <span style={reqStyle}> *</span>}
                  </label>
                  <input
                    type="text"
                    value={p.nombre || ''}
                    onChange={e => setParte(rol, 'nombre', e.target.value)}
                    placeholder="Nombre completo o denominación"
                    style={{ ...inputStyle, borderColor: errores[`${rol}_nombre`] ? '#e53935' : '#d0d0dc' }}
                  />
                  {errores[`${rol}_nombre`] && <span style={errStyle}>{errores[`${rol}_nombre`]}</span>}
                </div>

                <div style={fieldRowStyle}>
                  <label style={labelStyle}>CUIT / CUIL (opcional)</label>
                  <input
                    type="text"
                    value={p.cuit || ''}
                    onChange={e => setParte(rol, 'cuit', e.target.value)}
                    placeholder="XX-XXXXXXXX-X"
                    style={{ ...inputStyle, maxWidth: 200 }}
                  />
                </div>

                <div style={fieldRowStyle}>
                  <label style={labelStyle}>Domicilio procesal (opcional)</label>
                  <input
                    type="text"
                    value={p.domicilio || ''}
                    onChange={e => setParte(rol, 'domicilio', e.target.value)}
                    placeholder="Calle N.° …, Ciudad"
                    style={inputStyle}
                  />
                </div>

                {(rol === 'actor' || rol === 'conyuge_1' || rol === 'imputado') && (
                  <div style={fieldRowStyle}>
                    <label style={labelStyle}>Letrado patrocinante / defensor (opcional)</label>
                    <input
                      type="text"
                      value={p.letrado || ''}
                      onChange={e => setParte(rol, 'letrado', e.target.value)}
                      placeholder="Dr./Dra. …"
                      style={inputStyle}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </section>

        {/* Info del juzgado */}
        {juzgado && (
          <div style={juzgadoInfoStyle}>
            <span style={{ fontSize: 12 }}>🏛️</span>
            <span>
              Los documentos se generarán con la configuración de:{' '}
              <strong>{juzgado.nombre}{juzgado.secretaria ? ` — ${juzgado.secretaria}` : ''}</strong>
            </span>
          </div>
        )}
        {!juzgado && (
          <div style={{ ...juzgadoInfoStyle, background: '#fff8e1', borderColor: '#ffe082' }}>
            <span style={{ fontSize: 12 }}>⚠️</span>
            <span style={{ color: '#795548' }}>
              No hay juzgado configurado. Los documentos se generarán sin datos del tribunal.
              Podés configurarlo en la pestaña <strong>Generador</strong>.
            </span>
          </div>
        )}

        {/* Botón submit */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
          <button type="button" onClick={onCancelar} style={cancelBtnStyle}>
            Cancelar
          </button>
          <button
            type="submit"
            style={{ ...submitBtnStyle, background: proceso.color }}
          >
            {proceso.icono} Iniciar caso — {proceso.nombre}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Estilos ────────────────────────────────────────────────────────────────

const wrapStyle        = { flex: 1, overflowY: 'auto', background: '#f4f5f7', padding: '28px 32px' }
const formStyle        = { maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }

const headStyle        = { background: '#fff', borderRadius: 10, padding: '20px 24px', borderLeft: '4px solid #0047AB', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }
const titleStyle       = { margin: '8px 0 6px', fontSize: 22, fontWeight: 800, color: '#1a1a2e' }
const subtitleStyle    = { margin: 0, fontSize: 14, color: '#666', lineHeight: 1.6 }
const backBtnStyle     = { background: 'none', border: 'none', cursor: 'pointer', color: '#0047AB', fontSize: 13, fontWeight: 600, padding: '0 0 4px', display: 'inline-flex', alignItems: 'center', gap: 4 }

const sectionStyle     = { background: '#fff', borderRadius: 10, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }
const sectionTitleStyle = { fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }

const procesoGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }
const procesoCardStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 10px', borderRadius: 8, border: '2px solid', cursor: 'pointer', transition: 'all 0.15s' }

const fieldRowStyle    = { marginBottom: 14 }
const labelStyle       = { display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5 }
const reqStyle         = { color: '#e53935' }
const errStyle         = { display: 'block', fontSize: 11, color: '#e53935', marginTop: 3 }

const inputStyle       = { width: '100%', padding: '9px 12px', border: '1px solid #d0d0dc', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }
const textareaStyle    = { ...inputStyle, resize: 'vertical', lineHeight: 1.5 }
const selectStyle      = { ...inputStyle, cursor: 'pointer' }

const parteBlockStyle  = { background: '#f7f8fa', borderRadius: 8, padding: '14px 16px', marginBottom: 14 }

const juzgadoInfoStyle = { display: 'flex', alignItems: 'flex-start', gap: 8, background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#2e7d32', lineHeight: 1.55 }

const cancelBtnStyle   = { background: '#f0f0f8', color: '#555', border: 'none', borderRadius: 8, padding: '11px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const submitBtnStyle   = { color: '#fff', border: 'none', borderRadius: 8, padding: '11px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }
