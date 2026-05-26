"""
Endpoints para documentos del fuero Contencioso Administrativo — CPCA Ley 7182 (Córdoba).
"""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query
from fastapi.responses import Response

from ...engine import render
from ...generador import texto_a_docx
from ...models.documentos.contencioso_administrativo import ContenciosoAdmisibilidadInput

router = APIRouter(prefix="/contencioso-administrativo", tags=["Contencioso Administrativo"])

_DOCX_MEDIA = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


def _fecha_param(fecha_resolucion: str | None) -> date | None:
    if not fecha_resolucion:
        return None
    return date.fromisoformat(fecha_resolucion)


# ---------------------------------------------------------------------------
# Admisibilidad formal — decreto de admisión y traslado (art. 13 CPCA)
# ---------------------------------------------------------------------------

@router.post("/admisibilidad/preview", summary="Vista previa en texto")
def admisibilidad_preview(
    body: ContenciosoAdmisibilidadInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/admisibilidad/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def admisibilidad_docx(
    body: ContenciosoAdmisibilidadInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="decreto_admisibilidad_ca.docx"'},
    )
