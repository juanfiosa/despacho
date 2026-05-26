"""
Endpoints para documentos del fuero Familia — CPF Ley 10305 (Córdoba).
"""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query
from fastapi.responses import Response

from ...engine import render
from ...generador import texto_a_docx
from ...models.documentos.familia import (
    AlimentosProvisioriosInput,
    AdmisionAlimentosInput,
    AdmisionDivorcioInput,
    AdmisionComunicacionInput,
    HomologacionAcuerdoFamiliaInput,
    ExclusionHogarInput,
    RegimenComunicacionProvisorioInput,
    IntimacionPagoCuotasAlimentariasInput,
    AtribucionHogarConyugalInput,
    CitacionConciliacionFamiliaInput,
)

router = APIRouter(prefix="/familia", tags=["Familia"])


_DOCX_MEDIA = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


def _fecha_param(fecha_resolucion: str | None) -> date | None:
    if not fecha_resolucion:
        return None
    return date.fromisoformat(fecha_resolucion)


# ---------------------------------------------------------------------------
# Alimentos provisorios
# ---------------------------------------------------------------------------

@router.post("/alimentos-provisorios/preview", summary="Vista previa en texto")
def alimentos_provisorios_preview(
    body: AlimentosProvisioriosInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/alimentos-provisorios/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def alimentos_provisorios_docx(
    body: AlimentosProvisioriosInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="alimentos_provisorios.docx"'},
    )


# ---------------------------------------------------------------------------
# Admisión — alimentos
# ---------------------------------------------------------------------------

@router.post("/alimentos/admision/preview", summary="Vista previa en texto")
def admision_alimentos_preview(
    body: AdmisionAlimentosInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/alimentos/admision/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def admision_alimentos_docx(
    body: AdmisionAlimentosInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="admision_alimentos.docx"'},
    )


# ---------------------------------------------------------------------------
# Admisión — divorcio
# ---------------------------------------------------------------------------

@router.post("/divorcio/admision/preview", summary="Vista previa en texto")
def admision_divorcio_preview(
    body: AdmisionDivorcioInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/divorcio/admision/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def admision_divorcio_docx(
    body: AdmisionDivorcioInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="admision_divorcio.docx"'},
    )


# ---------------------------------------------------------------------------
# Admisión — régimen de comunicación
# ---------------------------------------------------------------------------

@router.post("/comunicacion/admision/preview", summary="Vista previa en texto")
def admision_comunicacion_preview(
    body: AdmisionComunicacionInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/comunicacion/admision/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def admision_comunicacion_docx(
    body: AdmisionComunicacionInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="admision_comunicacion.docx"'},
    )


# ---------------------------------------------------------------------------
# Homologación de acuerdo
# ---------------------------------------------------------------------------

@router.post("/homologacion-acuerdo/preview", summary="Vista previa en texto")
def homologacion_acuerdo_preview(
    body: HomologacionAcuerdoFamiliaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/homologacion-acuerdo/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def homologacion_acuerdo_docx(
    body: HomologacionAcuerdoFamiliaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="homologacion_acuerdo_familia.docx"'},
    )


# ---------------------------------------------------------------------------
# Exclusión del hogar
# ---------------------------------------------------------------------------

@router.post("/exclusion-hogar/preview", summary="Vista previa en texto")
def exclusion_hogar_preview(
    body: ExclusionHogarInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/exclusion-hogar/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def exclusion_hogar_docx(
    body: ExclusionHogarInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="exclusion_hogar.docx"'},
    )


# ---------------------------------------------------------------------------
# Régimen de comunicación provisorio
# ---------------------------------------------------------------------------

@router.post("/comunicacion/regimen-provisorio/preview", summary="Vista previa en texto")
def regimen_comunicacion_provisorio_preview(
    body: RegimenComunicacionProvisorioInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/comunicacion/regimen-provisorio/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def regimen_comunicacion_provisorio_docx(
    body: RegimenComunicacionProvisorioInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="regimen_comunicacion_provisorio.docx"'},
    )


# ---------------------------------------------------------------------------
# Intimación de pago de cuotas alimentarias
# ---------------------------------------------------------------------------

@router.post("/alimentos/intimacion-pago-cuotas/preview", summary="Vista previa en texto")
def intimacion_pago_cuotas_preview(
    body: IntimacionPagoCuotasAlimentariasInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/alimentos/intimacion-pago-cuotas/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def intimacion_pago_cuotas_docx(
    body: IntimacionPagoCuotasAlimentariasInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="intimacion_pago_cuotas_alimentarias.docx"'},
    )


# ---------------------------------------------------------------------------
# Atribución del hogar conyugal
# ---------------------------------------------------------------------------

@router.post("/atribucion-hogar-conyugal/preview", summary="Vista previa en texto")
def atribucion_hogar_conyugal_preview(
    body: AtribucionHogarConyugalInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/atribucion-hogar-conyugal/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def atribucion_hogar_conyugal_docx(
    body: AtribucionHogarConyugalInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="atribucion_hogar_conyugal.docx"'},
    )


# ---------------------------------------------------------------------------
# Citación a audiencia de conciliación (familia)
# ---------------------------------------------------------------------------

@router.post("/citacion-conciliacion/preview", summary="Vista previa en texto")
def citacion_conciliacion_familia_preview(
    body: CitacionConciliacionFamiliaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/citacion-conciliacion/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def citacion_conciliacion_familia_docx(
    body: CitacionConciliacionFamiliaInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="citacion_conciliacion_familia.docx"'},
    )
