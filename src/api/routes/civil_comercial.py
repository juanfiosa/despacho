"""
Endpoints para documentos del fuero Civil y Comercial — Córdoba.
"""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query
from fastapi.responses import Response, JSONResponse

from ...engine import render
from ...generador import texto_a_docx
from ...models.documentos.civil_comercial import (
    IntimacionPagoInput,
    MandamientoPagoInput,
    AutoAperturaPruebaInput,
    DecretoTramiteInput,
)

router = APIRouter(prefix="/civil-comercial", tags=["Civil y Comercial"])

_DOCX_MEDIA = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


def _fecha_param(fecha_resolucion: str | None) -> date | None:
    if not fecha_resolucion:
        return None
    return date.fromisoformat(fecha_resolucion)


def _render_y_docx(documento, fecha_resolucion: date | None, nombre: str):
    texto = render(documento, fecha_resolucion)
    docx_bytes = texto_a_docx(texto, nombre)
    return texto, docx_bytes


# ---------------------------------------------------------------------------
# Intimación de pago
# ---------------------------------------------------------------------------

@router.post("/ejecutivo/intimacion-pago/preview", summary="Vista previa en texto")
def intimacion_pago_preview(
    body: IntimacionPagoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/ejecutivo/intimacion-pago/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def intimacion_pago_docx(
    body: IntimacionPagoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="intimacion_pago.docx"'},
    )


# ---------------------------------------------------------------------------
# Mandamiento de pago y embargo
# ---------------------------------------------------------------------------

@router.post("/ejecutivo/mandamiento-pago/preview", summary="Vista previa en texto")
def mandamiento_preview(
    body: MandamientoPagoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/ejecutivo/mandamiento-pago/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def mandamiento_docx(
    body: MandamientoPagoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="mandamiento_pago.docx"'},
    )


# ---------------------------------------------------------------------------
# Auto de apertura a prueba
# ---------------------------------------------------------------------------

@router.post("/ejecutivo/apertura-prueba/preview", summary="Vista previa en texto")
def apertura_prueba_preview(
    body: AutoAperturaPruebaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/ejecutivo/apertura-prueba/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def apertura_prueba_docx(
    body: AutoAperturaPruebaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="auto_apertura_prueba.docx"'},
    )


# ---------------------------------------------------------------------------
# Decreto de trámite
# ---------------------------------------------------------------------------

@router.post("/decreto-tramite/preview", summary="Vista previa en texto")
def decreto_tramite_preview(
    body: DecretoTramiteInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/decreto-tramite/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def decreto_tramite_docx(
    body: DecretoTramiteInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="decreto_tramite.docx"'},
    )
