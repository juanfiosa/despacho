"""
Calculadora de intereses para documentos judiciales — Córdoba.

Método: tasa nominal anual / 365 × días (método proporcional diario).
Es el método predominante en la jurisprudencia de la Cámara Civil de Córdoba.
"""

from dataclasses import dataclass
from datetime import date

from .tasas import tasa_para_fecha
from ..models.enums import TasaInteres


@dataclass(frozen=True)
class ResultadoIntereses:
    capital: float
    intereses: float
    total: float
    dias: int
    tasa_anual_pct: float
    desde: date
    hasta: date
    tasa_codigo: str
    tasa_descripcion: str
    es_estimado: bool           # True cuando la tasa fue tomada de tabla interna


def calcular(
    capital: float,
    tasa: TasaInteres,
    desde: date,
    hasta: date | None = None,
    tasa_anual_pct_manual: float | None = None,
    tasa_descripcion_manual: str | None = None,
) -> ResultadoIntereses:
    """
    Calcula los intereses devengados sobre un capital.

    Args:
        capital: monto en pesos
        tasa: código de tasa (TasaInteres enum)
        desde: fecha de inicio del devengamiento (mora)
        hasta: fecha de corte (default: hoy)
        tasa_anual_pct_manual: tasa anual % cuando tasa=OTRA
        tasa_descripcion_manual: descripción cuando tasa=OTRA

    Returns:
        ResultadoIntereses con desglose completo
    """
    hasta = hasta or date.today()

    if desde > hasta:
        raise ValueError(f"fecha_desde ({desde}) posterior a fecha_hasta ({hasta})")

    dias = (hasta - desde).days

    es_estimado = False
    if tasa == TasaInteres.OTRA:
        if tasa_anual_pct_manual is None:
            raise ValueError("tasa_anual_pct_manual requerida cuando tasa=OTRA")
        tasa_anual_pct = tasa_anual_pct_manual
        desc = tasa_descripcion_manual or "Tasa especificada por el actuario"
    else:
        tasa_anual_pct = _tasa_promedio_ponderado(tasa.value, desde, hasta)
        desc = _descripcion(tasa)
        es_estimado = True

    tasa_diaria = tasa_anual_pct / 100 / 365
    intereses = round(capital * tasa_diaria * dias, 2)
    total = round(capital + intereses, 2)

    return ResultadoIntereses(
        capital=capital,
        intereses=intereses,
        total=total,
        dias=dias,
        tasa_anual_pct=tasa_anual_pct,
        desde=desde,
        hasta=hasta,
        tasa_codigo=tasa.value,
        tasa_descripcion=desc,
        es_estimado=es_estimado,
    )


def _tasa_promedio_ponderado(codigo: str, desde: date, hasta: date) -> float:
    """
    Cuando el período abarca más de un tramo de tasa, devuelve el promedio
    ponderado por días. Para períodos en un solo tramo, es equivalente a
    tasa_para_fecha directamente.
    """
    from .tasas import _TABLAS
    tabla = _TABLAS[codigo]

    total_dias = (hasta - desde).days
    if total_dias == 0:
        return tasa_para_fecha(codigo, desde)

    suma_ponderada = 0.0
    for tramo in tabla:
        inicio_tramo = max(desde, tramo.desde)
        fin_tramo = min(hasta, tramo.hasta if tramo.hasta else hasta)
        if inicio_tramo >= fin_tramo:
            continue
        dias_tramo = (fin_tramo - inicio_tramo).days
        suma_ponderada += tramo.tasa_anual_pct * dias_tramo

    return round(suma_ponderada / total_dias, 4)


def _descripcion(tasa: TasaInteres) -> str:
    return {
        TasaInteres.BNA_ACTIVA:  "tasa activa del Banco de la Nación Argentina",
        TasaInteres.BNA_PASIVA:  "tasa pasiva del Banco de la Nación Argentina",
        TasaInteres.BCRA_PASIVA: "tasa pasiva del Banco Central de la República Argentina",
    }[tasa]
