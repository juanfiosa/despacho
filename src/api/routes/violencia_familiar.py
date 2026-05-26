"""
Endpoints para documentos del fuero Violencia Familiar — Ley 9283 (Córdoba).
"""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query
from fastapi.responses import Response

from ...engine import render
from ...generador import texto_a_docx
from ...models.documentos.violencia_familiar import (
    MedidasUrgentesVFInput,
    CitacionAudienciaVFInput,
    ProrrogaMedidasVFInput,
    CeseMedidasVFInput,
    OficioPoliciaVFInput,
)

router = APIRouter(prefix="/violencia-familiar", tags=["Violencia Familiar"])

_DOCX_MEDIA = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


def _fecha_param(fecha_resolucion: str | None) -> date | None:
    if not fecha_resolucion:
        return None
    return date.fromisoformat(fecha_resolucion)


# ---------------------------------------------------------------------------
# Medidas urgentes de protección
# ---------------------------------------------------------------------------

@router.post("/medidas-urgentes/preview", summary="Vista previa en texto")
def medidas_urgentes_preview(
    body: MedidasUrgentesVFInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/medidas-urgentes/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def medidas_urgentes_docx(
    body: MedidasUrgentesVFInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="medidas_urgentes_vf.docx"'},
    )


# ---------------------------------------------------------------------------
# Citación a audiencia (art. 27 Ley 9283)
# ---------------------------------------------------------------------------

@router.post("/citacion-audiencia/preview", summary="Vista previa en texto")
def citacion_audiencia_vf_preview(
    body: CitacionAudienciaVFInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/citacion-audiencia/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def citacion_audiencia_vf_docx(
    body: CitacionAudienciaVFInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="citacion_audiencia_vf.docx"'},
    )


# ---------------------------------------------------------------------------
# Prórroga de medidas de protección
# ---------------------------------------------------------------------------

@router.post("/prorroga-medidas/preview", summary="Vista previa en texto")
def prorroga_medidas_vf_preview(
    body: ProrrogaMedidasVFInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/prorroga-medidas/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def prorroga_medidas_vf_docx(
    body: ProrrogaMedidasVFInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="prorroga_medidas_vf.docx"'},
    )


# ---------------------------------------------------------------------------
# Cese de medidas de protección
# ---------------------------------------------------------------------------

@router.post("/cese-medidas/preview", summary="Vista previa en texto")
def cese_medidas_vf_preview(
    body: CeseMedidasVFInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/cese-medidas/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def cese_medidas_vf_docx(
    body: CeseMedidasVFInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="cese_medidas_vf.docx"'},
    )


# ---------------------------------------------------------------------------
# Oficio a la Policía (custodia)
# ---------------------------------------------------------------------------

@router.post("/oficio-policia/preview", summary="Vista previa en texto")
def oficio_policia_vf_preview(
    body: OficioPoliciaVFInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/oficio-policia/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def oficio_policia_vf_docx(
    body: OficioPoliciaVFInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="oficio_policia_vf.docx"'},
    )
