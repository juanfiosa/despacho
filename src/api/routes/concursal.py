"""
Endpoints para documentos del fuero Concursal — Ley 24522 (Córdoba).
"""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query
from fastapi.responses import Response

from ...engine import render
from ...generador import texto_a_docx
from ...models.documentos.concursal import (
    AutoAperturaConcursalInput,
    AutoDeclaracionQuiebraInput,
    DecretoPeriodoExclusividadInput,
    AutoHomologacionAcuerdoInput,
    CitacionAcreedoresEdictoInput,
    DesignacionSindicoInput,
    AutoVerificacionCreditosInput,
    DecretoRealizacionBienesInput,
)

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


# ---------------------------------------------------------------------------
# Sentencia de quiebra
# ---------------------------------------------------------------------------

@router.post("/declaracion-quiebra/preview", summary="Vista previa en texto")
def declaracion_quiebra_preview(
    body: AutoDeclaracionQuiebraInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/declaracion-quiebra/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def declaracion_quiebra_docx(
    body: AutoDeclaracionQuiebraInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="sentencia_quiebra.docx"'},
    )


# ---------------------------------------------------------------------------
# Decreto de fijación del período de exclusividad
# ---------------------------------------------------------------------------

@router.post("/periodo-exclusividad/preview", summary="Vista previa en texto")
def periodo_exclusividad_preview(
    body: DecretoPeriodoExclusividadInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/periodo-exclusividad/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def periodo_exclusividad_docx(
    body: DecretoPeriodoExclusividadInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="decreto_periodo_exclusividad.docx"'},
    )


# ---------------------------------------------------------------------------
# Auto de homologación del acuerdo preventivo
# ---------------------------------------------------------------------------

@router.post("/homologacion-acuerdo/preview", summary="Vista previa en texto")
def homologacion_acuerdo_concursal_preview(
    body: AutoHomologacionAcuerdoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/homologacion-acuerdo/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def homologacion_acuerdo_concursal_docx(
    body: AutoHomologacionAcuerdoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="auto_homologacion_acuerdo_concursal.docx"'},
    )


# ---------------------------------------------------------------------------
# Citación de acreedores por edictos
# ---------------------------------------------------------------------------

@router.post("/citacion-acreedores/preview", summary="Vista previa en texto")
def citacion_acreedores_edicto_preview(
    body: CitacionAcreedoresEdictoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/citacion-acreedores/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def citacion_acreedores_edicto_docx(
    body: CitacionAcreedoresEdictoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="citacion_acreedores_edicto.docx"'},
    )


# ---------------------------------------------------------------------------
# Decreto de designación de síndico
# ---------------------------------------------------------------------------

@router.post("/designacion-sindico/preview", summary="Vista previa en texto")
def designacion_sindico_preview(
    body: DesignacionSindicoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/designacion-sindico/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def designacion_sindico_docx(
    body: DesignacionSindicoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="designacion_sindico.docx"'},
    )


# ---------------------------------------------------------------------------
# Auto de verificación de créditos (lista provisional)
# ---------------------------------------------------------------------------

@router.post("/verificacion-creditos/preview", summary="Vista previa en texto")
def verificacion_creditos_preview(
    body: AutoVerificacionCreditosInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/verificacion-creditos/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def verificacion_creditos_docx(
    body: AutoVerificacionCreditosInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="auto_verificacion_creditos.docx"'},
    )


# ---------------------------------------------------------------------------
# Decreto de realización de bienes
# ---------------------------------------------------------------------------

@router.post("/realizacion-bienes/preview", summary="Vista previa en texto")
def realizacion_bienes_preview(
    body: DecretoRealizacionBienesInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/realizacion-bienes/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def realizacion_bienes_docx(
    body: DecretoRealizacionBienesInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="decreto_realizacion_bienes.docx"'},
    )
