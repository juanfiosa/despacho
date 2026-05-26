"""
Endpoints para documentos del fuero Penal — CPP Ley 8123 (Córdoba).
"""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query
from fastapi.responses import Response

from ...engine import render
from ...generador import texto_a_docx
from ...models.documentos.penal import (
    CitacionImputacionInput,
    AutoElevacionJuicioInput,
    FijacionAudienciaDebateInput,
    SobreseimientoInput,
    DesestimacionDenunciaInput,
    PrisionPreventivaInput,
    CesePrisionPreventivaInput,
    AdmisionPartesCivilesInput,
    TrasladoVistaFiscalInput,
    CitacionTestigosPeritosInput,
    SuspensionJuicioPruebaInput,
    ExtraccionTestimoniosInput,
    ArchivoNotificacionInput,
)

router = APIRouter(prefix="/penal", tags=["Penal"])

_DOCX_MEDIA = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


def _fecha_param(fecha_resolucion: str | None) -> date | None:
    if not fecha_resolucion:
        return None
    return date.fromisoformat(fecha_resolucion)


# ---------------------------------------------------------------------------
# Citación a acto de imputación
# ---------------------------------------------------------------------------

@router.post("/citacion-imputacion/preview", summary="Vista previa en texto")
def citacion_imputacion_preview(
    body: CitacionImputacionInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/citacion-imputacion/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def citacion_imputacion_docx(
    body: CitacionImputacionInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="citacion_imputacion.docx"'},
    )


# ---------------------------------------------------------------------------
# Auto de elevación a juicio
# ---------------------------------------------------------------------------

@router.post("/elevacion-juicio/preview", summary="Vista previa en texto")
def elevacion_juicio_preview(
    body: AutoElevacionJuicioInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/elevacion-juicio/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def elevacion_juicio_docx(
    body: AutoElevacionJuicioInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="auto_elevacion_juicio.docx"'},
    )


# ---------------------------------------------------------------------------
# Fijación de audiencia de debate
# ---------------------------------------------------------------------------

@router.post("/fijacion-debate/preview", summary="Vista previa en texto")
def fijacion_debate_preview(
    body: FijacionAudienciaDebateInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/fijacion-debate/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def fijacion_debate_docx(
    body: FijacionAudienciaDebateInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="fijacion_debate.docx"'},
    )


# ---------------------------------------------------------------------------
# Auto de sobreseimiento definitivo
# ---------------------------------------------------------------------------

@router.post("/sobreseimiento/preview", summary="Vista previa en texto")
def sobreseimiento_preview(
    body: SobreseimientoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/sobreseimiento/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def sobreseimiento_docx(
    body: SobreseimientoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="sobreseimiento.docx"'},
    )


# ---------------------------------------------------------------------------
# Auto de desestimación de denuncia/querella
# ---------------------------------------------------------------------------

@router.post("/desestimacion-denuncia/preview", summary="Vista previa en texto")
def desestimacion_denuncia_preview(
    body: DesestimacionDenunciaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/desestimacion-denuncia/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def desestimacion_denuncia_docx(
    body: DesestimacionDenunciaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="desestimacion_denuncia.docx"'},
    )


# ---------------------------------------------------------------------------
# Prisión preventiva
# ---------------------------------------------------------------------------

@router.post("/prision-preventiva/preview", summary="Vista previa en texto")
def prision_preventiva_preview(
    body: PrisionPreventivaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/prision-preventiva/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def prision_preventiva_docx(
    body: PrisionPreventivaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="prision_preventiva.docx"'},
    )


# ---------------------------------------------------------------------------
# Cese de prisión preventiva
# ---------------------------------------------------------------------------

@router.post("/cese-prision-preventiva/preview", summary="Vista previa en texto")
def cese_prision_preventiva_preview(
    body: CesePrisionPreventivaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/cese-prision-preventiva/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def cese_prision_preventiva_docx(
    body: CesePrisionPreventivaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="cese_prision_preventiva.docx"'},
    )


# ---------------------------------------------------------------------------
# Admisión de partes civiles
# ---------------------------------------------------------------------------

@router.post("/admision-partes-civiles/preview", summary="Vista previa en texto")
def admision_partes_civiles_preview(
    body: AdmisionPartesCivilesInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/admision-partes-civiles/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def admision_partes_civiles_docx(
    body: AdmisionPartesCivilesInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="admision_partes_civiles.docx"'},
    )


# ---------------------------------------------------------------------------
# Traslado para vista fiscal
# ---------------------------------------------------------------------------

@router.post("/traslado-vista-fiscal/preview", summary="Vista previa en texto")
def traslado_vista_fiscal_preview(
    body: TrasladoVistaFiscalInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/traslado-vista-fiscal/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def traslado_vista_fiscal_docx(
    body: TrasladoVistaFiscalInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="traslado_vista_fiscal.docx"'},
    )


# ---------------------------------------------------------------------------
# Citación de testigos y peritos a debate
# ---------------------------------------------------------------------------

@router.post("/citacion-testigos-peritos/preview", summary="Vista previa en texto")
def citacion_testigos_peritos_preview(
    body: CitacionTestigosPeritosInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/citacion-testigos-peritos/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def citacion_testigos_peritos_docx(
    body: CitacionTestigosPeritosInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="citacion_testigos_peritos.docx"'},
    )


# ---------------------------------------------------------------------------
# Auto de suspensión del juicio a prueba (homologación)
# ---------------------------------------------------------------------------

@router.post("/suspension-juicio-prueba/preview", summary="Vista previa en texto")
def suspension_juicio_prueba_preview(
    body: SuspensionJuicioPruebaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/suspension-juicio-prueba/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def suspension_juicio_prueba_docx(
    body: SuspensionJuicioPruebaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="suspension_juicio_prueba.docx"'},
    )


# ---------------------------------------------------------------------------
# Decreto de extracción de testimonios
# ---------------------------------------------------------------------------

@router.post("/extraccion-testimonios/preview", summary="Vista previa en texto")
def extraccion_testimonios_preview(
    body: ExtraccionTestimoniosInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/extraccion-testimonios/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def extraccion_testimonios_docx(
    body: ExtraccionTestimoniosInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="extraccion_testimonios.docx"'},
    )


# ---------------------------------------------------------------------------
# Auto de archivo con notificación
# ---------------------------------------------------------------------------

@router.post("/archivo-notificacion/preview", summary="Vista previa en texto")
def archivo_notificacion_preview(
    body: ArchivoNotificacionInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/archivo-notificacion/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def archivo_notificacion_docx(
    body: ArchivoNotificacionInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="archivo_notificacion.docx"'},
    )
