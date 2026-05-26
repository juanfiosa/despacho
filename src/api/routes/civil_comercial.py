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
    TrasladoDemandaInput,
    AutoAperturaOrdinarioInput,
    EmbargoPreventivoInput,
    InhibicionGeneralInput,
    AutoAperturaSuccesorioInput,
    DeclaratoriaHerederosInput,
    AutoSumarisimoCitacionInput,
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
# Ordinario — Traslado de demanda
# ---------------------------------------------------------------------------

@router.post("/ordinario/traslado-demanda/preview", summary="Vista previa en texto")
def traslado_demanda_preview(
    body: TrasladoDemandaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/ordinario/traslado-demanda/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def traslado_demanda_docx(
    body: TrasladoDemandaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="traslado_demanda.docx"'},
    )


# ---------------------------------------------------------------------------
# Ordinario — Auto apertura a prueba
# ---------------------------------------------------------------------------

@router.post("/ordinario/apertura-prueba/preview", summary="Vista previa en texto")
def apertura_prueba_ordinario_preview(
    body: AutoAperturaOrdinarioInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/ordinario/apertura-prueba/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def apertura_prueba_ordinario_docx(
    body: AutoAperturaOrdinarioInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="auto_apertura_prueba_ordinario.docx"'},
    )


# ---------------------------------------------------------------------------
# Cautelares — Embargo preventivo
# ---------------------------------------------------------------------------

@router.post("/cautelares/embargo-preventivo/preview", summary="Vista previa en texto")
def embargo_preventivo_preview(
    body: EmbargoPreventivoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/cautelares/embargo-preventivo/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def embargo_preventivo_docx(
    body: EmbargoPreventivoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="embargo_preventivo.docx"'},
    )


# ---------------------------------------------------------------------------
# Cautelares — Inhibición general de bienes
# ---------------------------------------------------------------------------

@router.post("/cautelares/inhibicion-general/preview", summary="Vista previa en texto")
def inhibicion_general_preview(
    body: InhibicionGeneralInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/cautelares/inhibicion-general/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def inhibicion_general_docx(
    body: InhibicionGeneralInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="inhibicion_general.docx"'},
    )


# ---------------------------------------------------------------------------
# Sucesorio — Auto de apertura
# ---------------------------------------------------------------------------

@router.post("/sucesorio/apertura/preview", summary="Vista previa en texto")
def apertura_sucesorio_preview(
    body: AutoAperturaSuccesorioInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/sucesorio/apertura/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def apertura_sucesorio_docx(
    body: AutoAperturaSuccesorioInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="auto_apertura_sucesorio.docx"'},
    )


# ---------------------------------------------------------------------------
# Sucesorio — Declaratoria de herederos
# ---------------------------------------------------------------------------

@router.post("/sucesorio/declaratoria/preview", summary="Vista previa en texto")
def declaratoria_herederos_preview(
    body: DeclaratoriaHerederosInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/sucesorio/declaratoria/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def declaratoria_herederos_docx(
    body: DeclaratoriaHerederosInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="declaratoria_herederos.docx"'},
    )


# ---------------------------------------------------------------------------
# Sumarísimo — Citación a audiencia
# ---------------------------------------------------------------------------

@router.post("/sumarisimo/citacion-audiencia/preview", summary="Vista previa en texto")
def sumarisimo_citacion_preview(
    body: AutoSumarisimoCitacionInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/sumarisimo/citacion-audiencia/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def sumarisimo_citacion_docx(
    body: AutoSumarisimoCitacionInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="citacion_audiencia_sumarisimo.docx"'},
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
