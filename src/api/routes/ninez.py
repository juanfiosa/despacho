"""
Endpoints para documentos del fuero Niñez y Adolescencia — Ley 9944 (Córdoba).
"""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query
from fastapi.responses import Response

from ...engine import render
from ...generador import texto_a_docx
from ...models.documentos.ninez import AutoControlLegalidadInput

router = APIRouter(prefix="/ninez", tags=["Niñez y Adolescencia"])

_DOCX_MEDIA = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


def _fecha_param(fecha_resolucion: str | None) -> date | None:
    if not fecha_resolucion:
        return None
    return date.fromisoformat(fecha_resolucion)


# ---------------------------------------------------------------------------
# Auto de control de legalidad de medida de protección excepcional
# ---------------------------------------------------------------------------

@router.post("/control-legalidad/preview", summary="Vista previa en texto")
def control_legalidad_preview(
    body: AutoControlLegalidadInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/control-legalidad/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def control_legalidad_docx(
    body: AutoControlLegalidadInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="auto_control_legalidad.docx"'},
    )
