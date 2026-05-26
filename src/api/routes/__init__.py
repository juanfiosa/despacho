from .civil_comercial import router as civil_comercial_router
from .violencia_familiar import router as violencia_familiar_router
from .calculadora import router as calculadora_router
from .catalogo import router as catalogo_router

__all__ = [
    "civil_comercial_router",
    "violencia_familiar_router",
    "calculadora_router",
    "catalogo_router",
]
