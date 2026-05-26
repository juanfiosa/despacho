"""
Endpoints para documentos del fuero Laboral — CPT Ley 7987 (Córdoba).
"""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query
from fastapi.responses import Response

from ...engine import render
from ...generador import texto_a_docx
from ...models.documentos.laboral import (
    AutoAdmisionLaboralInput,
    AutoAperturaLaboralInput,
    TrasladoContestacionLaboralInput,
    CitacionVistaCausaInput,
    IntimacionPagoLiquidacionInput,
    HomologacionAcuerdoLaboralInput,
    AutoLiquidacionAprobadaInput,
)

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


# ---------------------------------------------------------------------------
# Auto de apertura a prueba laboral
# ---------------------------------------------------------------------------

@router.post("/apertura-prueba/preview", summary="Vista previa en texto")
def apertura_prueba_laboral_preview(
    body: AutoAperturaLaboralInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/apertura-prueba/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def apertura_prueba_laboral_docx(
    body: AutoAperturaLaboralInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="auto_apertura_prueba_laboral.docx"'},
    )


# ---------------------------------------------------------------------------
# Traslado de contestación
# ---------------------------------------------------------------------------

@router.post("/traslado-contestacion/preview", summary="Vista previa en texto")
def traslado_contestacion_laboral_preview(
    body: TrasladoContestacionLaboralInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/traslado-contestacion/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def traslado_contestacion_laboral_docx(
    body: TrasladoContestacionLaboralInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="traslado_contestacion_laboral.docx"'},
    )


# ---------------------------------------------------------------------------
# Citación a audiencia de vista de causa
# ---------------------------------------------------------------------------

@router.post("/citacion-vista-causa/preview", summary="Vista previa en texto")
def citacion_vista_causa_laboral_preview(
    body: CitacionVistaCausaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/citacion-vista-causa/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def citacion_vista_causa_laboral_docx(
    body: CitacionVistaCausaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="citacion_vista_causa_laboral.docx"'},
    )


# ---------------------------------------------------------------------------
# Intimación de pago de liquidación
# ---------------------------------------------------------------------------

@router.post("/intimacion-pago-liquidacion/preview", summary="Vista previa en texto")
def intimacion_pago_liquidacion_laboral_preview(
    body: IntimacionPagoLiquidacionInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/intimacion-pago-liquidacion/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def intimacion_pago_liquidacion_laboral_docx(
    body: IntimacionPagoLiquidacionInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="intimacion_pago_liquidacion_laboral.docx"'},
    )


# ---------------------------------------------------------------------------
# Homologación de acuerdo conciliatorio
# ---------------------------------------------------------------------------

@router.post("/homologacion-acuerdo/preview", summary="Vista previa en texto")
def homologacion_acuerdo_laboral_preview(
    body: HomologacionAcuerdoLaboralInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/homologacion-acuerdo/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def homologacion_acuerdo_laboral_docx(
    body: HomologacionAcuerdoLaboralInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="homologacion_acuerdo_laboral.docx"'},
    )


# ---------------------------------------------------------------------------
# Auto de liquidación aprobada
# ---------------------------------------------------------------------------

@router.post("/liquidacion-aprobada/preview", summary="Vista previa en texto")
def auto_liquidacion_aprobada_laboral_preview(
    body: AutoLiquidacionAprobadaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/liquidacion-aprobada/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def auto_liquidacion_aprobada_laboral_docx(
    body: AutoLiquidacionAprobadaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="auto_liquidacion_aprobada_laboral.docx"'},
    )
