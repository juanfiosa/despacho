from .civil_comercial import router as civil_comercial_router
from .violencia_familiar import router as violencia_familiar_router
from .familia import router as familia_router
from .laboral import router as laboral_router
from .concursal import router as concursal_router
from .penal import router as penal_router
from .calculadora import router as calculadora_router
from .catalogo import router as catalogo_router

__all__ = [
    "civil_comercial_router",
    "violencia_familiar_router",
    "familia_router",
    "laboral_router",
    "concursal_router",
    "penal_router",
    "calculadora_router",
    "catalogo_router",
]
