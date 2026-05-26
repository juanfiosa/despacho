"""
Modelos de input para documentos del juicio ordinario (CPCC Ley 8465, Córdoba).
Documentos cubiertos:
  - TrasladoDemandaInput      → traslado de demanda, post-contestación, reconvención
  - AutoAperturaOrdinarioInput → auto de apertura a prueba (art. 493 CPCC, 40 días)
"""

from enum import Enum

from pydantic import Field

from ...base import ExpedienteBase
from .ejecutivo import AutoAperturaPruebaInput


# ---------------------------------------------------------------------------
# Traslado de demanda / post-contestación / reconvención
# ---------------------------------------------------------------------------

class TipoTrasladoDemanda(str, Enum):
    DEMANDA      = "demanda"       # primer traslado (art. 176 CPCC)
    CONTESTACION = "contestacion"  # por contestada; si hay reconv. corre nuevo traslado
    RECONVENCION = "reconvencion"  # traslado de reconvención (art. 192 CPCC)


class TrasladoDemandaInput(ExpedienteBase):
    """
    Decreto que:
      - Corre traslado de la demanda al demandado (art. 176 CPCC); o
      - Tiene por contestada la demanda (art. 192 CPCC); o
      - Corre traslado de la reconvención al actor (art. 192 CPCC).
    """
    tipo: TipoTrasladoDemanda = Field(
        default=TipoTrasladoDemanda.DEMANDA,
        description="Subtipo del decreto",
    )
    objeto: str | None = Field(
        default=None,
        description=(
            "Objeto del proceso (ej: 'daños y perjuicios derivados de accidente de tránsito'). "
            "Obligatorio cuando tipo=demanda."
        ),
    )
    plazo_dias: int = Field(
        default=30,
        gt=0,
        description="Plazo en días hábiles para contestar (art. 176 CPCC: 30 días)",
    )

    def model_post_init(self, __context: object) -> None:
        if self.tipo == TipoTrasladoDemanda.DEMANDA and not self.objeto:
            raise ValueError("'objeto' es obligatorio cuando tipo=demanda")


# ---------------------------------------------------------------------------
# Auto de apertura a prueba — juicio ordinario
# ---------------------------------------------------------------------------

class AutoAperturaOrdinarioInput(AutoAperturaPruebaInput):
    """
    Auto que abre el período probatorio en el juicio ordinario (art. 493 CPCC).
    Idéntico en campos a AutoAperturaPruebaInput pero con template propio
    que referencia el art. 493 y el plazo de cuarenta (40) días hábiles.
    """
    pass
