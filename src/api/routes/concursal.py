"""
Endpoints para documentos del fuero Concursal — Ley 24522 (Córdoba).
"""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query
from fastapi.responses import Response

from ...engine import render
from ...generador import texto_a_docx
from ...models.documentos.concursal import AutoAperturaConcursalInput

router = APIRouter(prefix="/concursal", tags=["Concursal"])

_DOCX_MEDIA = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


def _fecha_param(fecha_resolucion: str | None) -> date | None:
    if not fecha_resolucion:
        return None
    return date.fromisoformat(fecha_resolucion)


# ---------------------------------------------------------------------------
# Auto de apertura del concurso preventivo
# ---------------------------------------------------------------------------

@router.post("/apertura-concurso/preview", summary="Vista previa en texto")
def apertura_concurso_preview(
    body: AutoAperturaConcursalInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/apertura-concurso/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def apertura_concurso_docx(
    body: AutoAperturaConcursalInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="auto_apertura_concurso.docx"'},
    )
