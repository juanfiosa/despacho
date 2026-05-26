"""
Servidor de previsualización de documentos — solo para desarrollo.
Corre en http://localhost:8000
"""

from datetime import date
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

from src.engine import render
from src.models import (
    Fuero, TasaInteres,
    IdentificacionExpediente, Parte, DatosEconomicos,
    IntimacionPagoInput, MandamientoPagoInput,
)
from src.models.documentos.civil_comercial import (
    DecretoTramiteInput, TipoDecretoTramite,
    AutoAperturaPruebaInput, TipoPrueba,
)

app = FastAPI(title="Despacho — Preview")

# ---------------------------------------------------------------------------
# Datos de ejemplo reutilizables
# ---------------------------------------------------------------------------

_ID = IdentificacionExpediente(
    numero="0012345/2026",
    caratula="García, Juan Carlos c/ López, Pedro Héctor - Juicio Ejecutivo",
    fuero=Fuero.CIVIL_COMERCIAL,
    juzgado="Juzgado Civil y Comercial N° 5",
    secretaria="Secretaría N° 1",
    ciudad="Córdoba",
)
_PARTES = [
    Parte(rol="actor",     nombre="García, Juan Carlos",  dni_cuit="20-12345678-9",
          domicilio_constituido="Bv. San Juan 201, Córdoba"),
    Parte(rol="demandado", nombre="López, Pedro Héctor",  dni_cuit="20-98765432-1",
          domicilio_real="Av. Colón 123, Córdoba"),
]
_ECO = DatosEconomicos(
    capital=150_000.0,
    tasa=TasaInteres.BNA_ACTIVA,
    fecha_mora=date(2025, 3, 1),
    costas=True,
)
_FECHA = date(2026, 5, 22)

_DOCS = {
    "intimacion_pago": IntimacionPagoInput(
        identificacion=_ID, partes=_PARTES, datos_economicos=_ECO,
        domicilio_intimacion="Av. Colón 123, Córdoba",
    ),
    "mandamiento_pago": MandamientoPagoInput(
        identificacion=_ID, partes=_PARTES, datos_economicos=_ECO,
        domicilio_diligenciamiento="Av. Colón 123, Córdoba",
    ),
    "auto_apertura_prueba": AutoAperturaPruebaInput(
        identificacion=_ID, partes=_PARTES,
        fecha_inicio_prueba=date(2026, 5, 25),
        prueba_admitida=[TipoPrueba.DOCUMENTAL, TipoPrueba.TESTIMONIAL, TipoPrueba.PERICIAL],
        prueba_rechazada=[TipoPrueba.CONFESIONAL],
        fundamento_rechazo="No fue ofrecida en el escrito de demanda.",
    ),
    "decreto_traslado": DecretoTramiteInput(
        identificacion=_ID, partes=_PARTES,
        tipo=TipoDecretoTramite.TRASLADO,
        destinatario_rol="demandado",
        plazo_dias=5,
    ),
}

_LABELS = {
    "intimacion_pago":      "Intimación de Pago (art. 529 CPCC)",
    "mandamiento_pago":     "Mandamiento de Intimación y Embargo (art. 531 CPCC)",
    "auto_apertura_prueba": "Auto de Apertura a Prueba (art. 498 CPCC)",
    "decreto_traslado":     "Decreto de Traslado",
}

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

def _html_wrapper(titulo: str, contenido: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>{titulo} — Despacho</title>
  <style>
    body {{ font-family: 'Courier New', monospace; max-width: 800px; margin: 40px auto;
            padding: 0 20px; background: #f5f5f5; color: #222; }}
    nav {{ margin-bottom: 32px; }}
    nav a {{ margin-right: 16px; color: #0047AB; text-decoration: none; font-family: sans-serif; font-size: 14px; }}
    nav a:hover {{ text-decoration: underline; }}
    h1 {{ font-family: sans-serif; font-size: 16px; color: #555; border-bottom: 1px solid #ccc; padding-bottom: 8px; }}
    pre {{ background: #fff; border: 1px solid #ddd; padding: 32px; line-height: 1.8;
           white-space: pre-wrap; word-wrap: break-word; font-size: 14px; }}
  </style>
</head>
<body>
  <nav>
    {''.join(f'<a href="/{k}">{v}</a>' for k, v in _LABELS.items())}
  </nav>
  <h1>{titulo}</h1>
  <pre>{contenido}</pre>
</body>
</html>"""


@app.get("/", response_class=HTMLResponse)
def index():
    links = "".join(
        f'<li><a href="/{k}">{v}</a></li>' for k, v in _LABELS.items()
    )
    return f"""<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Despacho — Preview</title>
<style>body{{font-family:sans-serif;max-width:600px;margin:60px auto;color:#222}}
a{{color:#0047AB}}li{{margin:12px 0}}</style></head>
<body><h2>Despacho — Documentos disponibles</h2><ul>{links}</ul></body></html>"""


@app.get("/intimacion_pago", response_class=HTMLResponse)
def ver_intimacion():
    texto = render(_DOCS["intimacion_pago"], _FECHA)
    return _html_wrapper(_LABELS["intimacion_pago"], texto)


@app.get("/mandamiento_pago", response_class=HTMLResponse)
def ver_mandamiento():
    texto = render(_DOCS["mandamiento_pago"], _FECHA)
    return _html_wrapper(_LABELS["mandamiento_pago"], texto)


@app.get("/auto_apertura_prueba", response_class=HTMLResponse)
def ver_apertura():
    texto = render(_DOCS["auto_apertura_prueba"], _FECHA)
    return _html_wrapper(_LABELS["auto_apertura_prueba"], texto)


@app.get("/decreto_traslado", response_class=HTMLResponse)
def ver_traslado():
    texto = render(_DOCS["decreto_traslado"], _FECHA)
    return _html_wrapper(_LABELS["decreto_traslado"], texto)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("preview:app", host="127.0.0.1", port=8000, reload=True)
