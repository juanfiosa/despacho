"""
Endpoints para documentos del fuero Niñez y Adolescencia — Ley 9944 (Córdoba).
"""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query
from fastapi.responses import Response

from ...engine import render
from ...generador import texto_a_docx
from ...models.documentos.ninez import (
    AutoControlLegalidadInput,
    ProrrogaMedidaNNAInput,
    CeseMedidaNNAInput,
    AutoMedidaAbrigoInput,
    NotificacionSENAFInput,
    AutoInternacionSaludMentalInput,
    DecretoVisitasSupervisadasInput,
    AutoReintegroFamiliarInput,
    CitacionSeguimientoNNAInput,
)

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


# ---------------------------------------------------------------------------
# Prórroga de medida de protección excepcional
# ---------------------------------------------------------------------------

@router.post("/prorroga-medida/preview", summary="Vista previa en texto")
def prorroga_medida_preview(
    body: ProrrogaMedidaNNAInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/prorroga-medida/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def prorroga_medida_docx(
    body: ProrrogaMedidaNNAInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="prorroga_medida_nna.docx"'},
    )


# ---------------------------------------------------------------------------
# Cese de medida de protección excepcional
# ---------------------------------------------------------------------------

@router.post("/cese-medida/preview", summary="Vista previa en texto")
def cese_medida_preview(
    body: CeseMedidaNNAInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/cese-medida/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def cese_medida_docx(
    body: CeseMedidaNNAInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="cese_medida_nna.docx"'},
    )


# ---------------------------------------------------------------------------
# Auto de medida de abrigo
# ---------------------------------------------------------------------------

@router.post("/medida-abrigo/preview", summary="Vista previa en texto")
def auto_medida_abrigo_preview(
    body: AutoMedidaAbrigoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/medida-abrigo/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def auto_medida_abrigo_docx(
    body: AutoMedidaAbrigoInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="auto_medida_abrigo.docx"'},
    )


# ---------------------------------------------------------------------------
# Decreto de notificación a SENAF
# ---------------------------------------------------------------------------

@router.post("/notificacion-senaf/preview", summary="Vista previa en texto")
def notificacion_senaf_preview(
    body: NotificacionSENAFInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/notificacion-senaf/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def notificacion_senaf_docx(
    body: NotificacionSENAFInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="notificacion_senaf.docx"'},
    )


# ---------------------------------------------------------------------------
# Auto de internación (salud mental, art. 43 Ley 9944)
# ---------------------------------------------------------------------------

@router.post("/internacion-salud-mental/preview", summary="Vista previa en texto")
def auto_internacion_salud_mental_preview(
    body: AutoInternacionSaludMentalInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/internacion-salud-mental/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def auto_internacion_salud_mental_docx(
    body: AutoInternacionSaludMentalInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="auto_internacion_salud_mental.docx"'},
    )


# ---------------------------------------------------------------------------
# Decreto de visitas supervisadas
# ---------------------------------------------------------------------------

@router.post("/visitas-supervisadas/preview", summary="Vista previa en texto")
def decreto_visitas_supervisadas_preview(
    body: DecretoVisitasSupervisadasInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/visitas-supervisadas/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def decreto_visitas_supervisadas_docx(
    body: DecretoVisitasSupervisadasInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="decreto_visitas_supervisadas.docx"'},
    )


# ---------------------------------------------------------------------------
# Auto de reintegro familiar
# ---------------------------------------------------------------------------

@router.post("/reintegro-familiar/preview", summary="Vista previa en texto")
def auto_reintegro_familiar_preview(
    body: AutoReintegroFamiliarInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/reintegro-familiar/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def auto_reintegro_familiar_docx(
    body: AutoReintegroFamiliarInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="auto_reintegro_familiar.docx"'},
    )


# ---------------------------------------------------------------------------
# Citación a audiencia de seguimiento de medida
# ---------------------------------------------------------------------------

@router.post("/citacion-seguimiento/preview", summary="Vista previa en texto")
def citacion_seguimiento_nna_preview(
    body: CitacionSeguimientoNNAInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    return {"documento": texto}


@router.post(
    "/citacion-seguimiento/docx",
    summary="Descarga DOCX",
    response_class=Response,
)
def citacion_seguimiento_nna_docx(
    body: CitacionSeguimientoNNAInput,
    fecha_resolucion: Annotated[str | None, Query(description="YYYY-MM-DD")] = None,
):
    texto = render(body, _fecha_param(fecha_resolucion))
    docx = texto_a_docx(texto)
    return Response(
        content=docx,
        media_type=_DOCX_MEDIA,
        headers={"Content-Disposition": 'attachment; filename="citacion_seguimiento_nna.docx"'},
    )
