"""Tests de la CalculadoraLegal."""

import pytest
from datetime import date

from src.calculadora import (
    calcular_intereses, vencimiento_plazo,
    es_dia_habil, sumar_dias_habiles, dias_habiles_entre,
)
from src.models.enums import TasaInteres

# ---------------------------------------------------------------------------
# Intereses
# ---------------------------------------------------------------------------

class TestIntereses:
    def test_cero_dias_da_cero_intereses(self):
        r = calcular_intereses(
            capital=100_000,
            tasa=TasaInteres.BNA_ACTIVA,
            desde=date(2026, 1, 15),
            hasta=date(2026, 1, 15),
        )
        assert r.intereses == 0.0
        assert r.dias == 0

    def test_un_año_aproximado(self):
        r = calcular_intereses(
            capital=100_000,
            tasa=TasaInteres.BNA_ACTIVA,
            desde=date(2025, 7, 1),
            hasta=date(2026, 7, 1),
        )
        # A ~45% anual, en 365 días → ~45.000
        assert 40_000 < r.intereses < 50_000

    def test_tasa_otra_requiere_manual(self):
        with pytest.raises(ValueError, match="tasa_anual_pct_manual requerida"):
            calcular_intereses(
                capital=1000,
                tasa=TasaInteres.OTRA,
                desde=date(2025, 1, 1),
                hasta=date(2025, 6, 1),
            )

    def test_tasa_otra_con_manual(self):
        r = calcular_intereses(
            capital=100_000,
            tasa=TasaInteres.OTRA,
            desde=date(2025, 1, 1),
            hasta=date(2026, 1, 1),
            tasa_anual_pct_manual=36.5,
            tasa_descripcion_manual="Tasa activa Banco de Córdoba",
        )
        # 36.5% / 365 * 365 días = 36.500 exactos
        assert abs(r.intereses - 36_500) < 1
        assert not r.es_estimado

    def test_fecha_desde_posterior_falla(self):
        with pytest.raises(ValueError):
            calcular_intereses(
                capital=1000,
                tasa=TasaInteres.BNA_ACTIVA,
                desde=date(2026, 6, 1),
                hasta=date(2025, 1, 1),
            )

    def test_total_es_capital_mas_intereses(self):
        r = calcular_intereses(
            capital=50_000,
            tasa=TasaInteres.BNA_PASIVA,
            desde=date(2025, 1, 1),
            hasta=date(2025, 7, 1),
        )
        assert abs(r.total - (r.capital + r.intereses)) < 0.01

# ---------------------------------------------------------------------------
# Plazos procesales
# ---------------------------------------------------------------------------

class TestPlazos:
    @pytest.mark.parametrize("fecha,esperado", [
        (date(2026, 1,  1),  False),   # enero — asueto judicial
        (date(2026, 1, 31),  False),   # enero — asueto judicial
        (date(2026, 5, 25),  False),   # feriado nacional (25 de mayo)
        (date(2026, 7,  6),  False),   # feriado provincial Córdoba (Fund. ciudad)
        (date(2026, 12, 25), False),   # Navidad
        (date(2026, 4,  2),  False),   # Jueves Santo 2026
        (date(2026, 4,  3),  False),   # Viernes Santo 2026
        (date(2026, 5, 22),  True),    # viernes hábil
        (date(2026, 6,  1),  True),    # lunes hábil
        (date(2026, 5, 23),  False),   # sábado
        (date(2026, 5, 24),  False),   # domingo
    ])
    def test_dia_habil(self, fecha, esperado):
        assert es_dia_habil(fecha) == esperado

    def test_sumar_cinco_dias_desde_viernes(self):
        # Desde viernes 22/5/2026: lun 25 (feriado) → lun 1/6 (5 días hábiles)
        resultado = sumar_dias_habiles(date(2026, 5, 22), 5)
        assert resultado == date(2026, 6, 1)

    def test_vencimiento_en_dia_inhabil_se_corre(self):
        # Vence en sábado → se corre al lunes
        from datetime import timedelta
        sabado = date(2026, 5, 30)  # sábado
        assert not es_dia_habil(sabado)
        lunes  = date(2026, 6,  1)  # lunes hábil
        # Buscamos un sumar que caiga en sábado
        venc = vencimiento_plazo(date(2026, 5, 22), 5)
        assert es_dia_habil(venc)

    def test_dias_habiles_entre_fechas(self):
        # semana completa sin feriados: lun-vie = 5 días hábiles
        lunes  = date(2026, 6, 1)
        viernes = date(2026, 6, 5)
        assert dias_habiles_entre(lunes, viernes) == 5

    def test_plazo_cero_invalido(self):
        with pytest.raises(ValueError):
            sumar_dias_habiles(date(2026, 5, 22), 0)

# ---------------------------------------------------------------------------
# Rendering (smoke test)
# ---------------------------------------------------------------------------

def test_render_intimacion_no_falla():
    from src.engine import render
    from src.models import (
        IdentificacionExpediente, Parte, DatosEconomicos,
        Fuero, TasaInteres, IntimacionPagoInput,
    )
    doc = IntimacionPagoInput(
        identificacion=IdentificacionExpediente(
            numero="0001234/2026", caratula="A c/ B",
            fuero=Fuero.CIVIL_COMERCIAL, juzgado="Juzgado Test",
        ),
        partes=[Parte(rol="actor", nombre="A"), Parte(rol="demandado", nombre="B")],
        datos_economicos=DatosEconomicos(
            capital=50_000, tasa=TasaInteres.BNA_ACTIVA, fecha_mora=date(2025, 1, 1)
        ),
        domicilio_intimacion="Calle Falsa 123",
    )
    texto = render(doc, date(2026, 5, 22))
    assert "INTÍMASE" in texto
    assert "50.000,00" in texto
    assert "Banco de la Nación Argentina" in texto
