"""
Modelos de input para documentos del fuero Familia (CPF Ley 10305, Córdoba).
Documentos cubiertos:
  - AlimentosProvisioriosInput → auto que fija cuota alimentaria provisoria
"""

from typing import Literal

from pydantic import Field

from ...base import ExpedienteBase


class AlimentosProvisioriosInput(ExpedienteBase):
    """
    Auto que fija cuota alimentaria provisoria mientras tramita el proceso
    principal (art. 544 CCyCN). Bajo apercibimiento de lo dispuesto por el
    art. 553 CCyCN en caso de incumplimiento.
    """
    cuota: float = Field(
        gt=0,
        description="Monto de la cuota alimentaria provisoria en pesos",
    )
    periodicidad: Literal["mensual", "quincenal", "semanal"] = Field(
        default="mensual",
        description="Periodicidad de pago de la cuota",
    )
    dia_vencimiento: int = Field(
        default=1,
        ge=1,
        le=31,
        description="Día del mes/período de vencimiento de la cuota (para periodicidad mensual)",
    )
    forma_pago: Literal["deposito_judicial", "transferencia_bancaria", "efectivo"] = Field(
        default="deposito_judicial",
        description="Forma en que deberá abonarse la cuota",
    )
    cbu_alias: str | None = Field(
        default=None,
        description="CBU o alias bancario para transferencia (obligatorio si forma_pago=transferencia_bancaria)",
    )

    def model_post_init(self, __context: object) -> None:
        if self.forma_pago == "transferencia_bancaria" and not self.cbu_alias:
            raise ValueError(
                "'cbu_alias' es obligatorio cuando forma_pago='transferencia_bancaria'"
            )
