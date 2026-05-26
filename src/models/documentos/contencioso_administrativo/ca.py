"""
Modelos de input para documentos del fuero Contencioso Administrativo
(CPCA Ley 7182, Córdoba).
Documentos cubiertos:
  - ContenciosoAdmisibilidadInput        → decreto de admisibilidad formal de la acción (art. 13 CPCA)
  - TrasladoDemandaCAInput               → traslado de demanda a la Provincia/municipio (art. 13 CPCA)
  - AperturaPruebaCAInput                → decreto de apertura a prueba (art. 47 CPCA)
  - CitacionAudienciaPreliminarCAInput   → citación a audiencia preliminar (art. 46 CPCA)
  - SuspensionActoAdministrativoInput    → auto de suspensión cautelar del acto impugnado (art. 19 CPCA)
  - LlamamientoAutosCAInput              → decreto de llamamiento de autos (art. 51 CPCA)
  - IntimacionOrganismoDemandadoInput    → intimación al organismo demandado a remitir expediente
"""

from datetime import date
from typing import Literal

from pydantic import Field

from ...base import ExpedienteBase


class ContenciosoAdmisibilidadInput(ExpedienteBase):
    """
    Decreto que declara formalmente admisible la acción contencioso
    administrativa y ordena el traslado al organismo demandado
    (art. 13 CPCA Ley 7182, Córdoba).
    """
    objeto_accion: str = Field(
        description=(
            "Objeto de la acción (ej: 'impugnación del Decreto N.° 123/2025 "
            "que dispuso la cesantía del actor')"
        )
    )
    organismo_demandado: str = Field(
        default="la Provincia de Córdoba",
        description="Organismo o ente demandado (ej: 'la Provincia de Córdoba', 'la Municipalidad de...')",
    )
    plazo_contestacion_dias: int = Field(
        default=30,
        gt=0,
        description="Plazo para contestar la demanda en días hábiles (art. 13 CPCA prevé 30 días)",
    )
    requiere_expediente_administrativo: bool = Field(
        default=True,
        description="Ordenar la remisión del expediente administrativo original",
    )


class TrasladoDemandaCAInput(ExpedienteBase):
    """
    Decreto que corre traslado de la demanda contencioso-administrativa al
    organismo o ente demandado para que conteste (art. 13 CPCA Ley 7182).
    Este decreto puede emitirse separado del de admisibilidad si el tribunal
    lo resuelve en dos actos.
    """
    organismo_demandado: str = Field(
        default="la Provincia de Córdoba",
        description="Organismo o ente demandado",
    )
    plazo_contestacion_dias: int = Field(
        default=30,
        gt=0,
        description="Plazo en días hábiles para contestar la demanda (art. 13 CPCA: 30 días)",
    )
    domicilio_notificacion: str | None = Field(
        default=None,
        description="Domicilio donde se practicará la notificación al organismo (opcional)",
    )
    con_remision_expediente: bool = Field(
        default=True,
        description="Si True, se ordena simultáneamente la remisión del expediente administrativo",
    )


class AperturaPruebaCAInput(ExpedienteBase):
    """
    Decreto de apertura del período de prueba en el proceso contencioso
    administrativo (art. 47 CPCA Ley 7182, Córdoba).
    """
    plazo_dias: int = Field(
        default=40,
        gt=0,
        description="Plazo del período de prueba en días hábiles (art. 47 CPCA: 40 días)",
    )
    fecha_inicio_prueba: date = Field(
        description="Fecha desde la que corre el plazo probatorio",
    )
    prueba_admitida: list[str] = Field(
        default_factory=list,
        description=(
            "Tipos de prueba admitidos (ej: 'documental', 'informativa', 'pericial contable')"
        ),
    )


class CitacionAudienciaPreliminarCAInput(ExpedienteBase):
    """
    Citación a la audiencia preliminar prevista para la fijación de hechos
    controvertidos y saneamiento procesal (art. 46 CPCA Ley 7182, Córdoba).
    """
    fecha_audiencia: date = Field(
        description="Fecha de la audiencia preliminar",
    )
    hora_audiencia: str = Field(
        default="09:00",
        description="Hora de la audiencia en formato HH:MM",
    )
    sala: str | None = Field(
        default=None,
        description="Sala o despacho del tribunal (opcional)",
    )
    objeto_audiencia: str = Field(
        default="fijación de hechos controvertidos, saneamiento y ofrecimiento de prueba",
        description="Objeto de la audiencia preliminar",
    )


class SuspensionActoAdministrativoInput(ExpedienteBase):
    """
    Auto que dispone la suspensión cautelar de los efectos del acto
    administrativo impugnado hasta la resolución definitiva del proceso
    (art. 19 CPCA Ley 7182, Córdoba).
    """
    acto_impugnado: str = Field(
        description=(
            "Descripción del acto administrativo cuya ejecución se suspende "
            "(ej: 'Decreto Municipal N.° 456/2025 que dispone la demolición del inmueble')"
        )
    )
    organismo_emisor: str = Field(
        description="Organismo que dictó el acto (ej: 'la Municipalidad de Córdoba')",
    )
    causal_suspension: Literal[
        "verosimilitud_derecho_peligro_demora",
        "irreparabilidad_perjuicio",
        "no_afectacion_interes_publico",
    ] = Field(
        default="verosimilitud_derecho_peligro_demora",
        description=(
            "Causal invocada para la medida cautelar (art. 19 CPCA): "
            "'verosimilitud_derecho_peligro_demora' (fumus boni iuris + periculum in mora); "
            "'irreparabilidad_perjuicio'; "
            "'no_afectacion_interes_publico'"
        ),
    )
    contracautela: str | None = Field(
        default=None,
        description="Contracautela que se impone al solicitante (ej: 'caución juratoria', 'garantía real')",
    )


class LlamamientoAutosCAInput(ExpedienteBase):
    """
    Decreto de llamamiento de autos para dictar sentencia definitiva en el
    proceso contencioso administrativo (art. 51 CPCA Ley 7182, Córdoba).
    """
    etapa: Literal["sentencia_definitiva", "resolucion_incidente", "otro"] = Field(
        default="sentencia_definitiva",
        description="Etapa para la que se llaman los autos",
    )
    vencio_prueba: bool = Field(
        default=True,
        description="Si True, se deja constancia del vencimiento del período de prueba",
    )
    presentaron_alegatos: bool = Field(
        default=False,
        description="Si True, las partes presentaron alegatos antes del llamamiento",
    )


class IntimacionOrganismoDemandadoInput(ExpedienteBase):
    """
    Decreto que intima al organismo demandado a remitir el expediente
    administrativo original bajo apercibimiento de ley (CPCA Ley 7182).
    """
    organismo_demandado: str = Field(
        default="la Provincia de Córdoba",
        description="Organismo demandado",
    )
    plazo_dias: int = Field(
        default=10,
        ge=1,
        description="Plazo en días hábiles para la remisión del expediente",
    )
    numero_expediente_administrativo: str | None = Field(
        default=None,
        description="Número del expediente administrativo a remitir (si se conoce)",
    )
    apercibimiento: str = Field(
        default="tener por ciertos los hechos invocados por el actor (art. 355 CPCC, aplicación supletoria)",
        description="Apercibimiento en caso de incumplimiento",
    )
