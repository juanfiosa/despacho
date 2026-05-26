"""
Endpoints para documentos del fuero Contencioso Administrativo — CPCA Ley 7182 (Córdoba).
"""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query
from fastapi.responses import Response

from ...engine import render
from ...generador import texto_a_docx
from ...models.documentos.contencioso_administrativo import (
    ContenciosoAdmisibilidadInput,
    TrasladoDemandaCAInput,
    AperturaPruebaCAInput,
    CitacionAudienciaPreliminarCAInput,
    SuspensionActoAdministrativoInput,
    LlamamientoAutosCAInput,
    IntimacionOrganismoDemandadoInput,
)

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


# ---------------------------------------------------------------------------
# Traslado de demanda a la Provincia/municipio
# ---------------------------------------------------------------------------

@router.post("/traslado-demanda/preview", summary="Vista previa en texto")
def traslado_demanda_ca_preview(
    body: TrasladoDemandaCAInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/traslado-demanda/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def traslado_demanda_ca_docx(
    body: TrasladoDemandaCAInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="traslado_demanda_ca.docx"'},
    )


# ---------------------------------------------------------------------------
# Auto de apertura a prueba
# ---------------------------------------------------------------------------

@router.post("/apertura-prueba/preview", summary="Vista previa en texto")
def apertura_prueba_ca_preview(
    body: AperturaPruebaCAInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/apertura-prueba/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def apertura_prueba_ca_docx(
    body: AperturaPruebaCAInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="apertura_prueba_ca.docx"'},
    )


# ---------------------------------------------------------------------------
# Citación a audiencia preliminar
# ---------------------------------------------------------------------------

@router.post("/citacion-audiencia-preliminar/preview", summary="Vista previa en texto")
def citacion_audiencia_preliminar_ca_preview(
    body: CitacionAudienciaPreliminarCAInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/citacion-audiencia-preliminar/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def citacion_audiencia_preliminar_ca_docx(
    body: CitacionAudienciaPreliminarCAInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="citacion_audiencia_preliminar_ca.docx"'},
    )


# ---------------------------------------------------------------------------
# Auto de suspensión de acto administrativo (cautelar)
# ---------------------------------------------------------------------------

@router.post("/suspension-acto-administrativo/preview", summary="Vista previa en texto")
def suspension_acto_administrativo_preview(
    body: SuspensionActoAdministrativoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/suspension-acto-administrativo/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def suspension_acto_administrativo_docx(
    body: SuspensionActoAdministrativoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="suspension_acto_administrativo.docx"'},
    )


# ---------------------------------------------------------------------------
# Llamamiento de autos
# ---------------------------------------------------------------------------

@router.post("/llamamiento-autos/preview", summary="Vista previa en texto")
def llamamiento_autos_ca_preview(
    body: LlamamientoAutosCAInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/llamamiento-autos/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def llamamiento_autos_ca_docx(
    body: LlamamientoAutosCAInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="llamamiento_autos_ca.docx"'},
    )


# ---------------------------------------------------------------------------
# Intimación al organismo demandado
# ---------------------------------------------------------------------------

@router.post("/intimacion-organismo/preview", summary="Vista previa en texto")
def intimacion_organismo_demandado_preview(
    body: IntimacionOrganismoDemandadoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/intimacion-organismo/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def intimacion_organismo_demandado_docx(
    body: IntimacionOrganismoDemandadoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="intimacion_organismo_demandado.docx"'},
    )
