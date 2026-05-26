"""
Endpoints de la CalculadoraLegal — intereses y plazos procesales.
"""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

from ...calculadora import calcular_intereses, vencimiento_plazo, dias_habiles_entre, es_dia_habil
from ...models.enums import TasaInteres

router = APIRouter(prefix="/calculadora", tags=["Calculadora Legal"])


# ---------------------------------------------------------------------------
# Intereses
# ---------------------------------------------------------------------------

class InteresesRequest(BaseModel):
    capital: float = Field(gt=0)
    tasa: TasaInteres
    desde: date
    hasta: date | None = None
    tasa_anual_pct_manual: float | None = Field(default=None, gt=0)
    tasa_descripcion_manual: str | None = None


@router.post("/intereses", summary="Calcula intereses devengados")
def calcular_intereses_endpoint(body: InteresesRequest):
    r = calcular_intereses(
        capital=body.capital,
        tasa=body.tasa,
        desde=body.desde,
        hasta=body.hasta,
        tasa_anual_pct_manual=body.tasa_anual_pct_manual,
        tasa_descripcion_manual=body.tasa_descripcion_manual,
    )
    return {
        "capital":          r.capital,
        "intereses":        r.intereses,
        "total":            r.total,
        "dias":             r.dias,
        "tasa_anual_pct":   r.tasa_anual_pct,
        "tasa_descripcion": r.tasa_descripcion,
        "desde":            r.desde.isoformat(),
        "hasta":            r.hasta.isoformat(),
        "es_estimado":      r.es_estimado,
        "advertencia": (
            "Los valores de tasa son referenciales. Verifique contra la fuente "
            "oficial (BNA / BCRA) antes de incluirlos en el expediente."
        ) if r.es_estimado else None,
    }


# ---------------------------------------------------------------------------
# Plazos procesales
# ---------------------------------------------------------------------------

class PlazoRequest(BaseModel):
    desde: date
    dias_habiles: int = Field(gt=0)


@router.post("/vencimiento", summary="Calcula el vencimiento de un plazo procesal")
def calcular_vencimiento(body: PlazoRequest):
    venc = vencimiento_plazo(body.desde, body.dias_habiles)
    return {
        "desde":         body.desde.isoformat(),
        "dias_habiles":  body.dias_habiles,
        "vencimiento":   venc.isoformat(),
        "dia_semana":    ["lunes","martes","miércoles","jueves","viernes","sábado","domingo"][venc.weekday()],
    }


@router.get("/dia-habil", summary="Verifica si una fecha es día hábil judicial")
def verificar_dia_habil(fecha: Annotated[date, Query(description="YYYY-MM-DD")]):
    habil = es_dia_habil(fecha)
    return {
        "fecha":   fecha.isoformat(),
        "es_habil": habil,
        "dia_semana": ["lunes","martes","miércoles","jueves","viernes","sábado","domingo"][fecha.weekday()],
    }
