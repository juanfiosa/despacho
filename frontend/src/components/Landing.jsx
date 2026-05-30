/**
 * Pantalla de bienvenida de Despacho.
 * Se muestra antes de entrar al sistema.
 */

export default function Landing({ onIngresar }) {
  return (
    <div style={wrapStyle}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header style={heroStyle}>
        <div style={heroCenterStyle}>
          <div style={logoWrapStyle}>
            <span style={logoStyle}>Despacho</span>
            <span style={logoBadgeStyle}>beta</span>
          </div>
          <h1 style={heroTitleStyle}>
            Documentos judiciales en segundos
          </h1>
          <p style={heroSubStyle}>
            Generador de decretos, autos y providencias para el Poder Judicial
            de la Provincia de Córdoba. Texto correcto, fórmula legal exacta,
            sin redactar desde cero.
          </p>
          <button onClick={onIngresar} style={ctaStyle}>
            Ingresar al sistema →
          </button>
          <p style={heroNoteStyle}>
            Sin registro · Datos guardados en tu dispositivo · DOCX editable
          </p>
        </div>
      </header>

      {/* ── Fueros ───────────────────────────────────────────────────────── */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Ocho fueros cubiertos</h2>
        <div style={fueroGridStyle}>
          {FUEROS.map(f => (
            <div key={f.label} style={fueroCardStyle}>
              <span style={fueroIconStyle}>{f.icono}</span>
              <span style={fueroLabelStyle}>{f.label}</span>
              <span style={fueroNormaStyle}>{f.norma}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section style={{ ...sectionStyle, background: '#f7f8fa' }}>
        <h2 style={sectionTitleStyle}>Cómo funciona</h2>
        <div style={featureGridStyle}>
          {FEATURES.map(f => (
            <div key={f.titulo} style={featureCardStyle}>
              <div style={featureIconStyle}>{f.icono}</div>
              <h3 style={featureTitleStyle}>{f.titulo}</h3>
              <p style={featureDescStyle}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section style={statsSectionStyle}>
        {STATS.map(s => (
          <div key={s.label} style={statItemStyle}>
            <div style={statNumStyle}>{s.num}</div>
            <div style={statLabelStyle}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── CTA inferior ─────────────────────────────────────────────────── */}
      <section style={ctaSectionStyle}>
        <h2 style={{ ...sectionTitleStyle, color: '#fff', marginBottom: 12 }}>
          Listo para usar
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, marginBottom: 28, lineHeight: 1.6 }}>
          No requiere instalación ni cuenta. Configurá los datos de tu juzgado
          y empezá a generar documentos en minutos.
        </p>
        <button onClick={onIngresar} style={{ ...ctaStyle, background: '#fff', color: '#0047AB' }}>
          Ingresar al sistema →
        </button>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={footerStyle}>
        <span style={footerLogoStyle}>Despacho</span>
        <span style={footerTextStyle}>
          Herramienta de apoyo para actuarios del Poder Judicial de Córdoba.
          No reemplaza el criterio jurisdiccional del magistrado.
        </span>
        <span style={footerTextStyle}>Córdoba, Argentina · 2026</span>
      </footer>

    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FUEROS = [
  { icono: '📋', label: 'Civil y Comercial',          norma: 'CPCC Ley 8465'  },
  { icono: '⚖️', label: 'Laboral',                    norma: 'CPT Ley 7987'   },
  { icono: '👨‍👩‍👧', label: 'Familia',                   norma: 'CPF Ley 10305'  },
  { icono: '🏛️', label: 'Contencioso Administrativo', norma: 'CPCA Ley 7182'  },
  { icono: '🔒', label: 'Penal',                      norma: 'CPP Ley 8123'   },
  { icono: '🛡️', label: 'Violencia Familiar',         norma: 'Ley 9283'       },
  { icono: '👶', label: 'Niñez y Adolescencia',       norma: 'Ley 9944'       },
  { icono: '🏢', label: 'Concursal',                  norma: 'Ley 24522'      },
]

const FEATURES = [
  {
    icono: '1️⃣',
    titulo: 'Configurá el juzgado',
    desc: 'Ingresá los datos de tu tribunal una sola vez. Quedan guardados para todos los documentos.',
  },
  {
    icono: '2️⃣',
    titulo: 'Seleccioná el documento',
    desc: 'Elegí el fuero, el tipo de proceso, la etapa y el documento que necesitás dictar.',
  },
  {
    icono: '3️⃣',
    titulo: 'Completá los datos del expediente',
    desc: 'Número, carátula, partes, fechas y los campos específicos del documento.',
  },
  {
    icono: '4️⃣',
    titulo: 'Descargá el DOCX',
    desc: 'Vista previa en pantalla y descarga en Word listo para firmar y agregar al expediente.',
  },
]

const STATS = [
  { num: '76+',  label: 'tipos de documento' },
  { num: '8',    label: 'fueros cubiertos'   },
  { num: '< 30s', label: 'para generar un decreto' },
  { num: '100%', label: 'sin redacción manual' },
]

// ─── Estilos ──────────────────────────────────────────────────────────────────

const wrapStyle        = { fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1a1a2e', overflowY: 'auto', height: '100%' }

// Hero
const heroStyle        = { background: 'linear-gradient(135deg, #0a1628 0%, #0047AB 60%, #1565c0 100%)', color: '#fff', padding: '72px 24px 80px', textAlign: 'center' }
const heroCenterStyle  = { maxWidth: 680, margin: '0 auto' }
const logoWrapStyle    = { display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28 }
const logoStyle        = { fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em', color: '#fff' }
const logoBadgeStyle   = { fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.18)', color: '#ffe', borderRadius: 20, padding: '3px 10px', letterSpacing: '0.06em', textTransform: 'uppercase' }
const heroTitleStyle   = { fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, margin: '0 0 18px', lineHeight: 1.2, letterSpacing: '-0.02em' }
const heroSubStyle     = { fontSize: 18, color: 'rgba(255,255,255,0.80)', lineHeight: 1.7, margin: '0 0 36px', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }
const heroNoteStyle    = { fontSize: 13, color: 'rgba(255,255,255,0.50)', marginTop: 14 }
const ctaStyle         = { display: 'inline-block', background: '#fff', color: '#0047AB', border: 'none', borderRadius: 10, padding: '16px 36px', fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.18)', transition: 'transform 0.15s', letterSpacing: '-0.01em' }

// Sections
const sectionStyle     = { padding: '64px 24px', background: '#fff' }
const sectionTitleStyle = { textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 40, letterSpacing: '-0.02em' }

// Fueros grid
const fueroGridStyle   = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, maxWidth: 900, margin: '0 auto' }
const fueroCardStyle   = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: '#f7f8fa', borderRadius: 12, padding: '22px 16px', textAlign: 'center' }
const fueroIconStyle   = { fontSize: 32, lineHeight: 1 }
const fueroLabelStyle  = { fontSize: 13, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3 }
const fueroNormaStyle  = { fontSize: 11, color: '#999' }

// Features
const featureGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }
const featureCardStyle = { background: '#fff', borderRadius: 12, padding: '28px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }
const featureIconStyle = { fontSize: 28, marginBottom: 12 }
const featureTitleStyle = { fontSize: 15, fontWeight: 700, marginBottom: 8, color: '#1a1a2e' }
const featureDescStyle = { fontSize: 13, color: '#666', lineHeight: 1.6, margin: 0 }

// Stats
const statsSectionStyle = { background: '#0047AB', padding: '48px 24px', display: 'flex', justifyContent: 'center', gap: '4px 48px', flexWrap: 'wrap' }
const statItemStyle     = { textAlign: 'center', padding: '12px 24px' }
const statNumStyle      = { fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }
const statLabelStyle    = { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 6, fontWeight: 500 }

// CTA section
const ctaSectionStyle  = { background: '#0a1628', padding: '72px 24px', textAlign: 'center' }

// Footer
const footerStyle      = { background: '#060e1c', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }
const footerLogoStyle  = { fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }
const footerTextStyle  = { fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, maxWidth: 400 }
