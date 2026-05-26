"""Tests de validación de modelos Pydantic."""

import pytest
from datetime import date
from pydantic import ValidationError

from src.models import (
    Fuero, TasaInteres,
    IdentificacionExpediente, Parte, DatosEconomicos,
    IntimacionPagoInput, MandamientoPagoInput,
)
from src.models.documentos.civil_comercial import (
    AutoAperturaPruebaInput, DecretoTramiteInput,
    TipoPrueba, TipoDecretoTramite,
)

# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def id_exp():
    return IdentificacionExpediente(
        numero="0012345/2026",
        caratula="García c/ López - Ejecutivo",
        fuero=Fuero.CIVIL_COMERCIAL,
        juzgado="Juzgado Civil N° 5",
        secretaria="Secretaría N° 1",
    )

@pytest.fixture
def partes():
    return [
        Parte(rol="actor",     nombre="García, Juan"),
        Parte(rol="demandado", nombre="López, Pedro"),
    ]

@pytest.fixture
def datos_eco():
    return DatosEconomicos(
        capital=100_000,
        tasa=TasaInteres.BNA_ACTIVA,
        fecha_mora=date(2025, 1, 1),
        costas=True,
    )

# ---------------------------------------------------------------------------
# IdentificacionExpediente
# ---------------------------------------------------------------------------

class TestIdentificacion:
    def test_numero_valido(self, id_exp):
        assert id_exp.numero == "0012345/2026"

    @pytest.mark.parametrize("numero", [
        "ABC/2026", "123456", "1234567/26", "1234567/2026/extra", "",
    ])
    def test_numero_invalido(self, numero):
        with pytest.raises(ValidationError):
            IdentificacionExpediente(
                numero=numero, caratula="X",
                fuero=Fuero.CIVIL_COMERCIAL, juzgado="J",
            )

    def test_año_futuro_lejano_invalido(self):
        with pytest.raises(ValidationError):
            IdentificacionExpediente(
                numero="0001/2099", caratula="X",
                fuero=Fuero.CIVIL_COMERCIAL, juzgado="J",
            )

    def test_ciudad_default(self, id_exp):
        assert id_exp.ciudad == "Córdoba"

# ---------------------------------------------------------------------------
# DatosEconomicos
# ---------------------------------------------------------------------------

class TestDatosEconomicos:
    def test_tasa_otra_sin_descripcion_falla(self):
        with pytest.raises(ValidationError, match="tasa_descripcion es obligatorio"):
            DatosEconomicos(
                capital=1000, tasa=TasaInteres.OTRA,
                fecha_mora=date(2025, 1, 1),
            )

    def test_tasa_otra_con_descripcion_ok(self):
        d = DatosEconomicos(
            capital=1000, tasa=TasaInteres.OTRA,
            tasa_descripcion="Tasa activa Banco de Córdoba",
            fecha_mora=date(2025, 1, 1),
        )
        assert d.tasa_descripcion == "Tasa activa Banco de Córdoba"

    def test_capital_cero_invalido(self):
        with pytest.raises(ValidationError):
            DatosEconomicos(capital=0, tasa=TasaInteres.BNA_ACTIVA, fecha_mora=date(2025,1,1))

    def test_capital_negativo_invalido(self):
        with pytest.raises(ValidationError):
            DatosEconomicos(capital=-100, tasa=TasaInteres.BNA_ACTIVA, fecha_mora=date(2025,1,1))

# ---------------------------------------------------------------------------
# AutoAperturaPruebaInput
# ---------------------------------------------------------------------------

class TestAutoAperturaPrueba:
    def test_prueba_rechazada_sin_fundamento_falla(self, id_exp, partes):
        with pytest.raises((ValidationError, ValueError)):
            AutoAperturaPruebaInput(
                identificacion=id_exp, partes=partes,
                fecha_inicio_prueba=date(2026, 6, 1),
                prueba_admitida=[TipoPrueba.DOCUMENTAL],
                prueba_rechazada=[TipoPrueba.TESTIMONIAL],
                fundamento_rechazo=None,
            )

    def test_prueba_rechazada_con_fundamento_ok(self, id_exp, partes):
        doc = AutoAperturaPruebaInput(
            identificacion=id_exp, partes=partes,
            fecha_inicio_prueba=date(2026, 6, 1),
            prueba_admitida=[TipoPrueba.DOCUMENTAL],
            prueba_rechazada=[TipoPrueba.TESTIMONIAL],
            fundamento_rechazo="No ofrecida en demanda.",
        )
        assert doc.prueba_rechazada == [TipoPrueba.TESTIMONIAL]

    def test_sin_prueba_admitida_invalido(self, id_exp, partes):
        with pytest.raises(ValidationError):
            AutoAperturaPruebaInput(
                identificacion=id_exp, partes=partes,
                fecha_inicio_prueba=date(2026, 6, 1),
                prueba_admitida=[],
            )

# ---------------------------------------------------------------------------
# DecretoTramiteInput
# ---------------------------------------------------------------------------

class TestDecretoTramite:
    def test_tipo_otro_sin_descripcion_falla(self, id_exp, partes):
        with pytest.raises((ValidationError, ValueError)):
            DecretoTramiteInput(
                identificacion=id_exp, partes=partes,
                tipo=TipoDecretoTramite.OTRO,
                destinatario_rol="demandado",
                tipo_descripcion=None,
            )

    def test_tipo_otro_con_descripcion_ok(self, id_exp, partes):
        doc = DecretoTramiteInput(
            identificacion=id_exp, partes=partes,
            tipo=TipoDecretoTramite.OTRO,
            destinatario_rol="demandado",
            tipo_descripcion="Fíjase audiencia preliminar.",
        )
        assert doc.tipo_descripcion == "Fíjase audiencia preliminar."

# ---------------------------------------------------------------------------
# Sin partes falla
# ---------------------------------------------------------------------------

def test_sin_partes_invalido(id_exp):
    with pytest.raises(ValidationError):
        IntimacionPagoInput(
            identificacion=id_exp,
            partes=[],
            datos_economicos=DatosEconomicos(
                capital=1000, tasa=TasaInteres.BNA_ACTIVA, fecha_mora=date(2025,1,1)
            ),
            domicilio_intimacion="Calle 1",
        )
