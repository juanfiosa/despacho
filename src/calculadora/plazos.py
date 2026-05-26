"""
Calculadora de plazos procesales para la justicia de Córdoba.

Considera:
- Feriados nacionales (Ley 27399 y modificaciones)
- Feriados provinciales de Córdoba
- Asueto judicial del Poder Judicial de Córdoba (enero + semana santa)
- El cómputo excluye sábados y domingos (días inhábiles por regla general)

Fuente: arts. 43-45 CPCC Córdoba (Ley 8465), Acordadas TSJA.
"""

from datetime import date, timedelta


# ---------------------------------------------------------------------------
# Feriados nacionales fijos
# ---------------------------------------------------------------------------

_FERIADOS_FIJOS: set[tuple[int, int]] = {
    (1,   1),   # Año Nuevo
    (3,  24),   # Día Nacional de la Memoria por la Verdad y la Justicia
    (4,   2),   # Día del Veterano y de los Caídos en Malvinas
    (5,   1),   # Día del Trabajador
    (5,  25),   # Día de la Revolución de Mayo
    (6,  17),   # Paso a la Inmortalidad del General Güemes
    (6,  20),   # Paso a la Inmortalidad del General Belgrano
    (7,   9),   # Día de la Independencia
    (8,  17),   # Paso a la Inmortalidad del General San Martín (3° lunes de agosto)
    (10, 12),   # Día del Respeto a la Diversidad Cultural
    (11, 20),   # Día de la Soberanía Nacional
    (12,  8),   # Inmaculada Concepción de María
    (12, 25),   # Navidad
}

# ---------------------------------------------------------------------------
# Semana Santa (Jueves y Viernes Santos — fechas variables)
# ---------------------------------------------------------------------------

_SEMANA_SANTA: dict[int, tuple[date, date]] = {
    2024: (date(2024, 3, 28), date(2024, 3, 29)),
    2025: (date(2025, 4, 17), date(2025, 4, 18)),
    2026: (date(2026, 4,  2), date(2026, 4,  3)),
    2027: (date(2027, 3, 25), date(2027, 3, 26)),
}

# ---------------------------------------------------------------------------
# Feriados provinciales Córdoba
# ---------------------------------------------------------------------------

_FERIADOS_CORDOBA_FIJOS: set[tuple[int, int]] = {
    (7, 6),     # Fundación de la ciudad de Córdoba
}

# ---------------------------------------------------------------------------
# Asueto judicial TSJA: enero completo + Carnaval (2 días previos al miércoles de ceniza)
# ---------------------------------------------------------------------------

_CARNAVAL: dict[int, tuple[date, date]] = {
    2024: (date(2024, 2, 12), date(2024, 2, 13)),
    2025: (date(2025, 3,  3), date(2025, 3,  4)),
    2026: (date(2026, 2, 16), date(2026, 2, 17)),
    2027: (date(2027, 3,  1), date(2027, 3,  2)),
}


def _es_asueto_judicial(d: date) -> bool:
    """Enero es inhábil para el Poder Judicial de Córdoba (feria estival)."""
    return d.month == 1


def _es_semana_santa(d: date) -> bool:
    ss = _SEMANA_SANTA.get(d.year)
    return ss is not None and ss[0] <= d <= ss[1]


def _es_carnaval(d: date) -> bool:
    c = _CARNAVAL.get(d.year)
    return c is not None and (d == c[0] or d == c[1])


def es_dia_habil(d: date) -> bool:
    """
    Retorna True si el día es hábil para el Poder Judicial de Córdoba.

    Un día es inhábil si:
    - Es sábado o domingo
    - Es feriado nacional (fijo o variable)
    - Es feriado provincial de Córdoba
    - Es asueto judicial (enero, semana santa, carnaval)
    """
    if d.weekday() >= 5:                             # sábado=5, domingo=6
        return False
    if (d.month, d.day) in _FERIADOS_FIJOS:
        return False
    if (d.month, d.day) in _FERIADOS_CORDOBA_FIJOS:
        return False
    if _es_semana_santa(d):
        return False
    if _es_carnaval(d):
        return False
    if _es_asueto_judicial(d):
        return False
    return True


def sumar_dias_habiles(desde: date, dias: int) -> date:
    """
    Calcula la fecha que resulta de sumar N días hábiles a una fecha dada.
    El día 'desde' no se cuenta (el plazo empieza a correr el día siguiente).
    """
    if dias <= 0:
        raise ValueError("El plazo debe ser mayor que cero")

    actual = desde
    contados = 0
    while contados < dias:
        actual += timedelta(days=1)
        if es_dia_habil(actual):
            contados += 1
    return actual


def proximo_dia_habil(d: date) -> date:
    """Si 'd' es inhábil, avanza al próximo día hábil."""
    while not es_dia_habil(d):
        d += timedelta(days=1)
    return d


def dias_habiles_entre(desde: date, hasta: date) -> int:
    """Cuenta los días hábiles en el intervalo [desde, hasta] inclusive."""
    contados = 0
    actual = desde
    while actual <= hasta:
        if es_dia_habil(actual):
            contados += 1
        actual += timedelta(days=1)
    return contados


def vencimiento_plazo(desde: date, dias_habiles: int) -> date:
    """
    Fecha de vencimiento de un plazo procesal.
    Si cae en día inhábil, se corre al siguiente hábil (art. 43 CPCC).
    """
    venc = sumar_dias_habiles(desde, dias_habiles)
    return proximo_dia_habil(venc)
