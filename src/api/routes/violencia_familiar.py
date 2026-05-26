"""
Endpoints para documentos del fuero Violencia Familiar — Ley 9283 (Córdoba).
"""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query
from fastapi.responses import Response

from ...engine import render
from ...generador import texto_a_docx
from ...models.documentos.violencia_familiar import MedidasUrgentesVFInput, CitacionAudienciaVFInput

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
