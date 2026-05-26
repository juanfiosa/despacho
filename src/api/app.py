"""
Aplicación FastAPI — Despacho
Generador de documentos judiciales para el Poder Judicial de Córdoba.
"""

from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from .routes import (
    civil_comercial_router,
    violencia_familiar_router,
    familia_router,
    laboral_router,
    concursal_router,
    penal_router,
    ninez_router,
    calculadora_router,
    catalogo_router,
)

_FRONTEND_DIST = Path(__file__).parent.parent.parent / "frontend" / "dist"

app = FastAPI(
    title="Despacho",
    description=(
        "Generador de documentos judiciales estandarizados para el "
        "Poder Judicial de la Provincia de Córdoba."
    ),
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(catalogo_router,           prefix="/api/v1")
app.include_router(civil_comercial_router,    prefix="/api/v1")
app.include_router(violencia_familiar_router, prefix="/api/v1")
app.include_router(familia_router,            prefix="/api/v1")
app.include_router(laboral_router,            prefix="/api/v1")
app.include_router(concursal_router,          prefix="/api/v1")
app.include_router(penal_router,              prefix="/api/v1")
app.include_router(ninez_router,              prefix="/api/v1")
app.include_router(calculadora_router,        prefix="/api/v1")


@app.get("/health", tags=["Sistema"])
def health():
    return {"status": "ok", "sistema": "Despacho", "provincia": "Córdoba"}


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(status_code=422, content={"detail": str(exc)})


@app.exception_handler(KeyError)
async def key_error_handler(request: Request, exc: KeyError):
    return JSONResponse(status_code=404, content={"detail": str(exc)})


# ── Frontend (SPA) ──────────────────────────────────────────────────────────
if _FRONTEND_DIST.exists():
    _assets = _FRONTEND_DIST / "assets"
    if _assets.exists():
        app.mount("/assets", StaticFiles(directory=str(_assets)), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def spa_fallback(full_path: str):
        """Devuelve index.html para cualquier ruta no-API (SPA routing)."""
        return FileResponse(str(_FRONTEND_DIST / "index.html"))
