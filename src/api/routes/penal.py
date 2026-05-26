"""
Endpoints para documentos del fuero Penal — CPP Ley 8123 (Córdoba).
"""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query
from fastapi.responses import Response

from ...engine import render
from ...generador import texto_a_docx
from ...models.documentos.penal import CitacionImputacionInput, AutoElevacionJuicioInput, FijacionAudienciaDebateInput

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
