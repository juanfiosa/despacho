"""
Endpoints para documentos del fuero Laboral — CPT Ley 7987 (Córdoba).
"""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query
from fastapi.responses import Response

from ...engine import render
from ...generador import texto_a_docx
from ...models.documentos.laboral import AutoAdmisionLaboralInput

router = APIRouter(prefix="/laboral", tags=["Laboral"])

_DOCX_MEDIA = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


def _fecha_param(fecha_resolucion: str | None) -> date | None:
    if not fecha_resolucion:
        return None
    return date.fromisoformat(fecha_resolucion)


# ---------------------------------------------------------------------------
# Auto de admisión de demanda laboral
# ---------------------------------------------------------------------------

@router.post("/admision-demanda/preview", summary="Vista previa en texto")
def admision_laboral_preview(
    body: AutoAdmisionLaboralInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/admision-demanda/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def admision_laboral_docx(
    body: AutoAdmisionLaboralInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="admision_demanda_laboral.docx"'},
    )
