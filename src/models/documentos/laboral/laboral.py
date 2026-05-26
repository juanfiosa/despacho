"""
Modelos de input para documentos del fuero Laboral (CPT Ley 7987, Córdoba).
Documentos cubiertos:
  - AutoAdmisionLaboralInput           → decreto de admisión + citación audiencia conciliación (art. 83 CPT)
  - AutoAperturaLaboralInput           → auto de apertura a prueba laboral (art. 83 CPT)
  - TrasladoContestacionLaboralInput   → decreto de traslado de contestación al actor
  - CitacionVistaCausaInput            → citación a audiencia de vista de causa (art. 83 CPT)
  - IntimacionPagoLiquidacionInput     → intimación de pago de liquidación aprobada (art. 132 CPT)
  - HomologacionAcuerdoLaboralInput    → auto de homologación de acuerdo conciliatorio (art. 83 CPT)
  - AutoLiquidacionAprobadaInput       → auto que aprueba la liquidación practicada (art. 132 CPT)
"""

from datetime import date
from typing import Literal

from pydantic import Field

from ...base import ExpedienteBase, DatosEconomicos
from ..civil_comercial.ejecutivo import AutoAperturaPruebaInput


class AutoAdmisionLaboralInput(ExpedienteBase):
    """
    Decreto que tiene por presentada la demanda laboral ordinaria, admite la
    pretensión y cita a las partes a audiencia de conciliación
    (art. 83 CPT Ley 7987 Córdoba).
    """
    objeto: str = Field(
        description=(
            "Objeto del reclamo laboral (ej: 'indemnización por despido "
            "injustificado, diferencias salariales y demás rubros emergentes "
            "de la relación laboral')"
        )
    )
    fecha_audiencia: date = Field(
        description="Fecha de la audiencia de conciliación",
    )
    hora_audiencia: str = Field(
        default="10:00",
        description="Hora de la audiencia en formato HH:MM",
    )
    sala: str | None = Field(
        default=None,
        description="Sala o número de sala donde se celebrará la audiencia (opcional)",
    )


class AutoAperturaLaboralInput(AutoAperturaPruebaInput):
    """
    Auto de apertura a prueba en el proceso laboral ordinario (art. 83 CPT).
    Mismos campos que el civil pero apunta a template con referencia CPT.
    """
    pass


class TrasladoContestacionLaboralInput(ExpedienteBase):
    """
    Decreto que tiene por contestada la demanda laboral y corre traslado de
    la contestación al actor para su conocimiento (CPT Ley 7987, Córdoba).
    """
    plazo_dias: int = Field(
        default=5,
        ge=1,
        description="Plazo en días hábiles para que el actor tome conocimiento (art. 83 CPT)",
    )
    con_reconvencion: bool = Field(
        default=False,
        description="Si True, la contestación incluye reconvención y se corre traslado de ésta",
    )
    plazo_reconvencion_dias: int | None = Field(
        default=None,
        ge=1,
        description="Plazo para contestar la reconvención (si corresponde)",
    )


class CitacionVistaCausaInput(ExpedienteBase):
    """
    Decreto que cita a las partes a la audiencia de vista de causa en el
    proceso laboral ordinario (art. 83 CPT Ley 7987, Córdoba).
    """
    fecha_audiencia: date = Field(
        description="Fecha de la audiencia de vista de causa",
    )
    hora_audiencia: str = Field(
        default="09:00",
        description="Hora de la audiencia en formato HH:MM",
    )
    sala: str | None = Field(
        default=None,
        description="Sala o número del tribunal (opcional)",
    )
    con_peritos: bool = Field(
        default=False,
        description="Si True, se cita también a los peritos designados",
    )
    con_testigos: bool = Field(
        default=False,
        description="Si True, se cita también a los testigos ofrecidos",
    )


class IntimacionPagoLiquidacionInput(ExpedienteBase):
    """
    Intimación al condenado a abonar la liquidación practicada y aprobada,
    bajo apercibimiento de embargo (art. 132 CPT Ley 7987, Córdoba).
    """
    datos_economicos: DatosEconomicos
    plazo_dias: int = Field(
        default=5,
        ge=1,
        description="Plazo en días hábiles para el pago (art. 132 CPT)",
    )
    incluye_intereses_moratorios: bool = Field(
        default=True,
        description="Si True, la intimación incluye los intereses moratorios calculados",
    )


class HomologacionAcuerdoLaboralInput(ExpedienteBase):
    """
    Auto que homologa el acuerdo conciliatorio alcanzado entre las partes
    y le confiere fuerza de sentencia firme (art. 83 CPT Ley 7987, Córdoba).
    """
    descripcion_acuerdo: str = Field(
        description=(
            "Descripción detallada del acuerdo homologado (ej: 'el demandado abonará "
            "la suma de $X en concepto de indemnización por despido y demás rubros, "
            "en X cuotas iguales de $Y, la primera con vencimiento el DD/MM/AAAA')"
        )
    )
    monto_total: float | None = Field(
        default=None,
        gt=0,
        description="Monto total del acuerdo en pesos (opcional)",
    )
    tipo_acuerdo: Literal["total", "parcial"] = Field(
        default="total",
        description="'total' extingue el proceso; 'parcial' continúa por rubros no acordados",
    )


class AutoLiquidacionAprobadaInput(ExpedienteBase):
    """
    Auto que aprueba la liquidación de créditos laborales practicada por el
    perito contador y ordena la intimación de pago (art. 132 CPT Ley 7987).
    """
    monto_liquidado: float = Field(
        gt=0,
        description="Monto total liquidado en pesos (capital + intereses + costas)",
    )
    fecha_liquidacion: date = Field(
        description="Fecha hasta la que se practica la liquidación",
    )
    aprobada_por: Literal["perito_contador", "actuario", "secretaria"] = Field(
        default="perito_contador",
        description="Quién practicó la liquidación aprobada",
    )
    observaciones_liquidacion: str | None = Field(
        default=None,
        description="Observaciones del tribunal sobre la liquidación (opcional)",
    )
