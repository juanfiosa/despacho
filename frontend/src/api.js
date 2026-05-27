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
    // Pydantic validation errors come as an array of { loc, msg, type }
    const detail = Array.isArray(err.detail)
      ? err.detail.map(d => {
          const loc = Array.isArray(d.loc)
            ? d.loc.filter(l => l !== 'body').join('.')
            : String(d.loc ?? '')
          return loc ? `${loc}: ${d.msg}` : d.msg
        }).join(' | ')
      : err.detail
    throw new Error(detail || JSON.stringify(err))
  }
  return res
}

// Catálogo
export const getCatalogo     = ()                          => get('/catalogo')
export const getFuero        = (fid)                       => get(`/catalogo/${fid}`)
export const getProceso      = (fid, pid)                  => get(`/catalogo/${fid}/${pid}`)
export const getEtapa        = (fid, pid, eid)             => get(`/catalogo/${fid}/${pid}/${eid}`)
export const buscarDocumentos = (q)                        => get(`/catalogo/buscar?q=${encodeURIComponent(q)}`)

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
  // Familia
  admision_alimentos:      '/familia/alimentos/admision/preview',
  admision_divorcio:       '/familia/divorcio/admision/preview',
  admision_comunicacion:   '/familia/comunicacion/admision/preview',
  // Violencia Familiar — audiencia
  citacion_audiencia_vf:   '/violencia-familiar/citacion-audiencia/preview',
  // Sucesorio — declaratoria
  declaratoria_herederos:  '/civil-comercial/sucesorio/declaratoria/preview',
  // Ejecutivo — admisión
  admision_ejecutivo:      '/civil-comercial/ejecutivo/admision/preview',
  // Niñez — seguimiento
  prorroga_medida_nna:     '/ninez/prorroga-medida/preview',
  cese_medida_nna:         '/ninez/cese-medida/preview',
  // Penal — resoluciones definitivas
  sobreseimiento:                '/penal/sobreseimiento/preview',
  desestimacion_denuncia:        '/penal/desestimacion-denuncia/preview',
  // Familia — homologación
  homologacion_acuerdo_familia:  '/familia/homologacion-acuerdo/preview',
  // Contencioso Administrativo — adicionales
  traslado_demanda_ca:                  '/contencioso-administrativo/traslado-demanda/preview',
  apertura_prueba_ca:                   '/contencioso-administrativo/apertura-prueba/preview',
  citacion_audiencia_preliminar_ca:     '/contencioso-administrativo/citacion-audiencia-preliminar/preview',
  suspension_acto_administrativo:       '/contencioso-administrativo/suspension-acto-administrativo/preview',
  llamamiento_autos_ca:                 '/contencioso-administrativo/llamamiento-autos/preview',
  intimacion_organismo_demandado:       '/contencioso-administrativo/intimacion-organismo/preview',
  // Violencia Familiar — adicionales
  prorroga_medidas_vf:                  '/violencia-familiar/prorroga-medidas/preview',
  cese_medidas_vf:                      '/violencia-familiar/cese-medidas/preview',
  oficio_policia_vf:                    '/violencia-familiar/oficio-policia/preview',
  // Familia — adicionales
  exclusion_hogar:                      '/familia/exclusion-hogar/preview',
  regimen_comunicacion_provisorio:      '/familia/comunicacion/regimen-provisorio/preview',
  intimacion_pago_cuotas_alimentarias:  '/familia/alimentos/intimacion-pago-cuotas/preview',
  atribucion_hogar_conyugal:            '/familia/atribucion-hogar-conyugal/preview',
  citacion_conciliacion_familia:        '/familia/citacion-conciliacion/preview',
  // Laboral — adicionales
  traslado_contestacion_laboral:        '/laboral/traslado-contestacion/preview',
  citacion_vista_causa:                 '/laboral/citacion-vista-causa/preview',
  intimacion_pago_liquidacion:          '/laboral/intimacion-pago-liquidacion/preview',
  homologacion_acuerdo_laboral:         '/laboral/homologacion-acuerdo/preview',
  auto_liquidacion_aprobada:            '/laboral/liquidacion-aprobada/preview',
  // Concursal — adicionales
  periodo_exclusividad:                 '/concursal/periodo-exclusividad/preview',
  homologacion_acuerdo_concursal:       '/concursal/homologacion-acuerdo/preview',
  citacion_acreedores_edicto:           '/concursal/citacion-acreedores/preview',
  designacion_sindico:                  '/concursal/designacion-sindico/preview',
  verificacion_creditos:                '/concursal/verificacion-creditos/preview',
  realizacion_bienes:                   '/concursal/realizacion-bienes/preview',
  // Penal — adicionales
  prision_preventiva:                   '/penal/prision-preventiva/preview',
  cese_prision_preventiva:              '/penal/cese-prision-preventiva/preview',
  admision_partes_civiles:              '/penal/admision-partes-civiles/preview',
  traslado_vista_fiscal:                '/penal/traslado-vista-fiscal/preview',
  citacion_testigos_peritos:            '/penal/citacion-testigos-peritos/preview',
  suspension_juicio_prueba:             '/penal/suspension-juicio-prueba/preview',
  extraccion_testimonios:               '/penal/extraccion-testimonios/preview',
  archivo_notificacion:                 '/penal/archivo-notificacion/preview',
  // Niñez — adicionales
  auto_medida_abrigo:                   '/ninez/medida-abrigo/preview',
  notificacion_senaf:                   '/ninez/notificacion-senaf/preview',
  auto_internacion_salud_mental:        '/ninez/internacion-salud-mental/preview',
  decreto_visitas_supervisadas:         '/ninez/visitas-supervisadas/preview',
  auto_reintegro_familiar:              '/ninez/reintegro-familiar/preview',
  citacion_seguimiento_nna:             '/ninez/citacion-seguimiento/preview',
  // Sucesorio — adicionales
  citacion_herederos_acreedores:        '/civil-comercial/sucesorio/citacion-herederos/preview',
  aprobacion_inventario_avaluo:         '/civil-comercial/sucesorio/aprobacion-inventario/preview',
  // Incidentes civiles
  caducidad_instancia:                  '/civil-comercial/incidentes/caducidad-instancia/preview',
  designacion_perito:                   '/civil-comercial/incidentes/designacion-perito/preview',
  intimacion_cumplimiento_sentencia:    '/civil-comercial/incidentes/intimacion-cumplimiento-sentencia/preview',
  auto_desglose:                        '/civil-comercial/incidentes/desglose/preview',
  citacion_audiencia_conciliacion:      '/civil-comercial/incidentes/citacion-audiencia-conciliacion/preview',
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
  // Familia
  admision_alimentos:      '/familia/alimentos/admision/docx',
  admision_divorcio:       '/familia/divorcio/admision/docx',
  admision_comunicacion:   '/familia/comunicacion/admision/docx',
  // Violencia Familiar — audiencia
  citacion_audiencia_vf:   '/violencia-familiar/citacion-audiencia/docx',
  // Sucesorio — declaratoria
  declaratoria_herederos:  '/civil-comercial/sucesorio/declaratoria/docx',
  // Ejecutivo — admisión
  admision_ejecutivo:      '/civil-comercial/ejecutivo/admision/docx',
  // Niñez — seguimiento
  prorroga_medida_nna:     '/ninez/prorroga-medida/docx',
  cese_medida_nna:         '/ninez/cese-medida/docx',
  // Penal — resoluciones definitivas
  sobreseimiento:                '/penal/sobreseimiento/docx',
  desestimacion_denuncia:        '/penal/desestimacion-denuncia/docx',
  // Familia — homologación
  homologacion_acuerdo_familia:  '/familia/homologacion-acuerdo/docx',
  // Contencioso Administrativo — adicionales
  traslado_demanda_ca:                  '/contencioso-administrativo/traslado-demanda/docx',
  apertura_prueba_ca:                   '/contencioso-administrativo/apertura-prueba/docx',
  citacion_audiencia_preliminar_ca:     '/contencioso-administrativo/citacion-audiencia-preliminar/docx',
  suspension_acto_administrativo:       '/contencioso-administrativo/suspension-acto-administrativo/docx',
  llamamiento_autos_ca:                 '/contencioso-administrativo/llamamiento-autos/docx',
  intimacion_organismo_demandado:       '/contencioso-administrativo/intimacion-organismo/docx',
  // Violencia Familiar — adicionales
  prorroga_medidas_vf:                  '/violencia-familiar/prorroga-medidas/docx',
  cese_medidas_vf:                      '/violencia-familiar/cese-medidas/docx',
  oficio_policia_vf:                    '/violencia-familiar/oficio-policia/docx',
  // Familia — adicionales
  exclusion_hogar:                      '/familia/exclusion-hogar/docx',
  regimen_comunicacion_provisorio:      '/familia/comunicacion/regimen-provisorio/docx',
  intimacion_pago_cuotas_alimentarias:  '/familia/alimentos/intimacion-pago-cuotas/docx',
  atribucion_hogar_conyugal:            '/familia/atribucion-hogar-conyugal/docx',
  citacion_conciliacion_familia:        '/familia/citacion-conciliacion/docx',
  // Laboral — adicionales
  traslado_contestacion_laboral:        '/laboral/traslado-contestacion/docx',
  citacion_vista_causa:                 '/laboral/citacion-vista-causa/docx',
  intimacion_pago_liquidacion:          '/laboral/intimacion-pago-liquidacion/docx',
  homologacion_acuerdo_laboral:         '/laboral/homologacion-acuerdo/docx',
  auto_liquidacion_aprobada:            '/laboral/liquidacion-aprobada/docx',
  // Concursal — adicionales
  periodo_exclusividad:                 '/concursal/periodo-exclusividad/docx',
  homologacion_acuerdo_concursal:       '/concursal/homologacion-acuerdo/docx',
  citacion_acreedores_edicto:           '/concursal/citacion-acreedores/docx',
  designacion_sindico:                  '/concursal/designacion-sindico/docx',
  verificacion_creditos:                '/concursal/verificacion-creditos/docx',
  realizacion_bienes:                   '/concursal/realizacion-bienes/docx',
  // Penal — adicionales
  prision_preventiva:                   '/penal/prision-preventiva/docx',
  cese_prision_preventiva:              '/penal/cese-prision-preventiva/docx',
  admision_partes_civiles:              '/penal/admision-partes-civiles/docx',
  traslado_vista_fiscal:                '/penal/traslado-vista-fiscal/docx',
  citacion_testigos_peritos:            '/penal/citacion-testigos-peritos/docx',
  suspension_juicio_prueba:             '/penal/suspension-juicio-prueba/docx',
  extraccion_testimonios:               '/penal/extraccion-testimonios/docx',
  archivo_notificacion:                 '/penal/archivo-notificacion/docx',
  // Niñez — adicionales
  auto_medida_abrigo:                   '/ninez/medida-abrigo/docx',
  notificacion_senaf:                   '/ninez/notificacion-senaf/docx',
  auto_internacion_salud_mental:        '/ninez/internacion-salud-mental/docx',
  decreto_visitas_supervisadas:         '/ninez/visitas-supervisadas/docx',
  auto_reintegro_familiar:              '/ninez/reintegro-familiar/docx',
  citacion_seguimiento_nna:             '/ninez/citacion-seguimiento/docx',
  // Sucesorio — adicionales
  citacion_herederos_acreedores:        '/civil-comercial/sucesorio/citacion-herederos/docx',
  aprobacion_inventario_avaluo:         '/civil-comercial/sucesorio/aprobacion-inventario/docx',
  // Incidentes civiles
  caducidad_instancia:                  '/civil-comercial/incidentes/caducidad-instancia/docx',
  designacion_perito:                   '/civil-comercial/incidentes/designacion-perito/docx',
  intimacion_cumplimiento_sentencia:    '/civil-comercial/incidentes/intimacion-cumplimiento-sentencia/docx',
  auto_desglose:                        '/civil-comercial/incidentes/desglose/docx',
  citacion_audiencia_conciliacion:      '/civil-comercial/incidentes/citacion-audiencia-conciliacion/docx',
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

export async function calcularVencimiento(body) {
  return (await post('/calculadora/vencimiento', body)).json()
}

export async function verificarDiaHabil(fecha) {
  return get(`/calculadora/dia-habil?fecha=${fecha}`)
}
