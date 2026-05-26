const BASE = '/api/v1'

async function get(path) {
  const res = await fetch(BASE + path)
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || res.statusText)
  return res.json()
}

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || JSON.stringify(err))
  }
  return res
}

// Catálogo
export const getCatalogo     = ()                          => get('/catalogo')
export const getFuero        = (fid)                       => get(`/catalogo/${fid}`)
export const getProceso      = (fid, pid)                  => get(`/catalogo/${fid}/${pid}`)
export const getEtapa        = (fid, pid, eid)             => get(`/catalogo/${fid}/${pid}/${eid}`)

// Generación
const PATHS_PREVIEW = {
  // Ejecutivo
  intimacion_pago:         '/civil-comercial/ejecutivo/intimacion-pago/preview',
  mandamiento_pago:        '/civil-comercial/ejecutivo/mandamiento-pago/preview',
  auto_apertura_prueba:    '/civil-comercial/ejecutivo/apertura-prueba/preview',
  decreto_tramite:         '/civil-comercial/decreto-tramite/preview',
  // Ordinario
  traslado_demanda:        '/civil-comercial/ordinario/traslado-demanda/preview',
  auto_apertura_ordinario: '/civil-comercial/ordinario/apertura-prueba/preview',
  // Cautelares
  embargo_preventivo:      '/civil-comercial/cautelares/embargo-preventivo/preview',
  inhibicion_general:      '/civil-comercial/cautelares/inhibicion-general/preview',
  // Violencia Familiar
  medidas_urgentes_vf:     '/violencia-familiar/medidas-urgentes/preview',
  // Familia
  alimentos_provisorios:   '/familia/alimentos-provisorios/preview',
  // Laboral
  admision_laboral:        '/laboral/admision-demanda/preview',
  auto_apertura_laboral:   '/laboral/apertura-prueba/preview',
  // Concursal
  auto_apertura_concurso:  '/concursal/apertura-concurso/preview',
  declaracion_quiebra:     '/concursal/declaracion-quiebra/preview',
  // Penal
  citacion_imputacion:     '/penal/citacion-imputacion/preview',
  auto_elevacion_juicio:   '/penal/elevacion-juicio/preview',
  fijacion_debate:         '/penal/fijacion-debate/preview',
  // Niñez
  control_legalidad_nna:   '/ninez/control-legalidad/preview',
  // Sucesorio
  apertura_sucesorio:      '/civil-comercial/sucesorio/apertura/preview',
  // Sumarísimo
  sumarisimo_citacion:     '/civil-comercial/sumarisimo/citacion-audiencia/preview',
  // Contencioso Administrativo
  admisibilidad_ca:        '/contencioso-administrativo/admisibilidad/preview',
}
const PATHS_DOCX = {
  // Ejecutivo
  intimacion_pago:         '/civil-comercial/ejecutivo/intimacion-pago/docx',
  mandamiento_pago:        '/civil-comercial/ejecutivo/mandamiento-pago/docx',
  auto_apertura_prueba:    '/civil-comercial/ejecutivo/apertura-prueba/docx',
  decreto_tramite:         '/civil-comercial/decreto-tramite/docx',
  // Ordinario
  traslado_demanda:        '/civil-comercial/ordinario/traslado-demanda/docx',
  auto_apertura_ordinario: '/civil-comercial/ordinario/apertura-prueba/docx',
  // Cautelares
  embargo_preventivo:      '/civil-comercial/cautelares/embargo-preventivo/docx',
  inhibicion_general:      '/civil-comercial/cautelares/inhibicion-general/docx',
  // Violencia Familiar
  medidas_urgentes_vf:     '/violencia-familiar/medidas-urgentes/docx',
  // Familia
  alimentos_provisorios:   '/familia/alimentos-provisorios/docx',
  // Laboral
  admision_laboral:        '/laboral/admision-demanda/docx',
  auto_apertura_laboral:   '/laboral/apertura-prueba/docx',
  // Concursal
  auto_apertura_concurso:  '/concursal/apertura-concurso/docx',
  declaracion_quiebra:     '/concursal/declaracion-quiebra/docx',
  // Penal
  citacion_imputacion:     '/penal/citacion-imputacion/docx',
  auto_elevacion_juicio:   '/penal/elevacion-juicio/docx',
  fijacion_debate:         '/penal/fijacion-debate/docx',
  // Niñez
  control_legalidad_nna:   '/ninez/control-legalidad/docx',
  // Sucesorio
  apertura_sucesorio:      '/civil-comercial/sucesorio/apertura/docx',
  // Sumarísimo
  sumarisimo_citacion:     '/civil-comercial/sumarisimo/citacion-audiencia/docx',
  // Contencioso Administrativo
  admisibilidad_ca:        '/contencioso-administrativo/admisibilidad/docx',
}

export async function previewDocumento(tipo, payload, fechaResolucion) {
  const qs = fechaResolucion ? `?fecha_resolucion=${fechaResolucion}` : ''
  const res = await post(PATHS_PREVIEW[tipo] + qs, payload)
  return (await res.json()).documento
}

export async function descargarDocx(tipo, payload, fechaResolucion) {
  const qs = fechaResolucion ? `?fecha_resolucion=${fechaResolucion}` : ''
  const res = await post(PATHS_DOCX[tipo] + qs, payload)
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${tipo}.docx`; a.click()
  URL.revokeObjectURL(url)
}

// Calculadora
export async function calcularIntereses(body) {
  return (await post('/calculadora/intereses', body)).json()
}
