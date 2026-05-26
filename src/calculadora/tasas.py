"""
Registro de tasas de interés judiciales para Córdoba.

Las tasas se almacenan como porcentaje anual nominal (ej: 97.5 = 97.5% anual).
En producción este módulo se alimentaría de la API del BCRA o resoluciones del TSJA.
Para v1 se incluyen valores históricos aproximados para cálculos orientativos.
El documento generado siempre debe indicar la tasa aplicada para que el actuario
pueda verificar contra la fuente oficial (BCRA / acordadas TSJA).
"""

from dataclasses import dataclass
from datetime import date


@dataclass(frozen=True)
class Tasa:
    desde: date
    hasta: date | None        # None = vigente
    tasa_anual_pct: float     # porcentaje nominal anual


# ---------------------------------------------------------------------------
# Tasas BNA activa (fuente: comunicados BNA — valores referenciales)
# ---------------------------------------------------------------------------

_BNA_ACTIVA: list[Tasa] = [
    Tasa(date(2024,  1,  1), date(2024,  3, 31), 97.00),
    Tasa(date(2024,  4,  1), date(2024,  6, 30), 70.00),
    Tasa(date(2024,  7,  1), date(2024, 12, 31), 60.00),
    Tasa(date(2025,  1,  1), date(2025,  6, 30), 50.00),
    Tasa(date(2025,  7,  1), None,               45.00),   # referencial
]

# ---------------------------------------------------------------------------
# Tasas BNA pasiva (caja de ahorro)
# ---------------------------------------------------------------------------

_BNA_PASIVA: list[Tasa] = [
    Tasa(date(2024,  1,  1), date(2024,  3, 31), 69.00),
    Tasa(date(2024,  4,  1), date(2024,  6, 30), 50.00),
    Tasa(date(2024,  7,  1), date(2024, 12, 31), 40.00),
    Tasa(date(2025,  1,  1), date(2025,  6, 30), 35.00),
    Tasa(date(2025,  7,  1), None,               30.00),   # referencial
]

# ---------------------------------------------------------------------------
# Tasa pasiva BCRA (promedio ponderado de plazos fijos)
# ---------------------------------------------------------------------------

_BCRA_PASIVA: list[Tasa] = [
    Tasa(date(2024,  1,  1), date(2024,  3, 31), 110.00),
    Tasa(date(2024,  4,  1), date(2024,  6, 30),  60.00),
    Tasa(date(2024,  7,  1), date(2024, 12, 31),  40.00),
    Tasa(date(2025,  1,  1), date(2025,  6, 30),  32.00),
    Tasa(date(2025,  7,  1), None,                28.00),  # referencial
]

_TABLAS = {
    "BNA_ACTIVA":  _BNA_ACTIVA,
    "BNA_PASIVA":  _BNA_PASIVA,
    "BCRA_PASIVA": _BCRA_PASIVA,
}


def tasa_para_fecha(codigo: str, fecha: date) -> float:
    """
    Devuelve la tasa anual porcentual vigente para una fecha dada.

    Args:
        codigo: 'BNA_ACTIVA' | 'BNA_PASIVA' | 'BCRA_PASIVA'
        fecha: fecha de consulta

    Raises:
        KeyError: si el código de tasa no existe
        ValueError: si no hay tasa registrada para esa fecha
    """
    tabla = _TABLAS[codigo]
    for t in reversed(tabla):
        if t.desde <= fecha and (t.hasta is None or fecha <= t.hasta):
            return t.tasa_anual_pct
    raise ValueError(
        f"Sin tasa registrada para {codigo} en {fecha}. "
        "Ingrese la tasa manualmente (campo tasa_descripcion)."
    )
