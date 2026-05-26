"""
Punto de entrada para Vercel Serverless Functions.

Vercel detecta la variable `app` y la utiliza como handler ASGI
para todas las rutas que coincidan con /api/(*).
"""

import sys
from pathlib import Path

# Agregar la raíz del proyecto al path para que `src.*` sea importable.
_ROOT = Path(__file__).parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from src.api.app import app  # noqa: F401, E402

__all__ = ["app"]
