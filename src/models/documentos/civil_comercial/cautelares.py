"""
Modelos de input para medidas cautelares (CPCC Ley 8465, arts. 456-484).
Documentos cubiertos:
  - EmbargoPreventivoInput  → auto decretando embargo preventivo
  - InhibicionGeneralInput  → auto de inhibición general de bienes
"""

from pydantic import Field

from ...base import ExpedienteBase, DatosEconomicos


class EmbargoPreventivoInput(ExpedienteBase):
    """
    Auto que decreta embargo preventivo sobre bienes del demandado hasta cubrir
    el monto reclamado (art. 466 CPCC).
    """
    monto: float = Field(gt=0, description="Suma a cautelar en pesos (capital + estimación intereses y costas)")
    bienes: str | None = Field(
        default=None,
        description="Descripción del bien a embargar. Si None: embargo genérico sobre bienes.",
    )
    domicilio_diligenciamiento: str = Field(
        description="Domicilio donde se diligenciará el mandamiento de embargo"
    )


class InhibicionGeneralInput(ExpedienteBase):
    """
    Auto que decreta inhibición general de bienes del demandado para registrar
    ante el Registro General de la Provincia (art. 466 CPCC).
    """
    monto: float = Field(gt=0, description="Suma a cautelar en pesos")
