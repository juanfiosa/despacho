"""
Modelos de input para incidentes y resoluciones especiales en materia
civil y comercial (CPCC Ley 8465, Córdoba).
Documentos cubiertos:
  - CaducidadInstanciaInput             → decreto de caducidad de instancia (art. 339 CPCC)
  - DesignacionPeritoInput              → auto de designación de perito (art. 261 CPCC)
  - IntimacionCumplimientoSentenciaInput → intimación a cumplir sentencia (art. 559 CPCC)
  - AutoDesgloseInput                   → decreto de desglose de documentación (art. 75 CPCC)
  - CitacionAudienciaConciliacionInput  → citación a audiencia de conciliación (art. 58 CPCC)
  - DecretoVistaInput                   → decreto de vista/traslado a la contraria (art. 107 CPCC)
  - ProvidenciaAgregacionInput          → providencia de agregación de escrito (art. 107 CPCC)
"""

from datetime import date
from typing import Literal

from pydantic import Field

from ...base import ExpedienteBase


class CaducidadInstanciaInput(ExpedienteBase):
    """
    Decreto que declara operada la caducidad de instancia por inactividad
    procesal durante el plazo legal (art. 339 CPCC Ley 8465, Córdoba).

    Plazos legales (art. 339 CPCC):
      - Instancia principal:     6 meses (proceso ordinario)
      - Segunda instancia:       3 meses
      - Ejecución de sentencia:  no opera caducidad (art. 340 CPCC)
    """
    instancia: Literal["primera", "segunda", "unica"] = Field(
        default="primera",
        description="Instancia en que opera la caducidad",
    )
    plazo_meses: int = Field(
        default=6,
        ge=1,
        description=(
            "Plazo de inactividad (en meses) que genera la caducidad. "
            "Primera instancia: 6 meses; segunda: 3 meses (art. 339 CPCC)."
        ),
    )
    ultima_actuacion: str | None = Field(
        default=None,
        description="Descripción de la última actuación procesalmente útil (fecha y tipo)",
    )
    parte_peticionante: Literal["demandado", "de_oficio", "actor"] = Field(
        default="demandado",
        description=(
            "Quién pide o motiva la caducidad: "
            "'demandado' (a pedido del demandado); "
            "'de_oficio' (el tribunal la declara de oficio); "
            "'actor' (raramente, en reconvención)"
        ),
    )
    costas_al_actor: bool = Field(
        default=True,
        description="Imponer costas al actor por la caducidad",
    )


class DesignacionPeritoInput(ExpedienteBase):
    """
    Auto que designa al perito, le notifica el cargo y le fija plazo para
    aceptarlo y presentar el dictamen (art. 261 CPCC Ley 8465, Córdoba).
    """
    especialidad: str = Field(
        description=(
            "Especialidad de la pericia (ej: 'contador público', 'ingeniero mecánico', "
            "'médico traumatólogo', 'arquitecto')"
        )
    )
    perito_nombre: str | None = Field(
        default=None,
        description="Nombre del perito designado. Si None, se sortea de la lista oficial.",
    )
    plazo_aceptacion_dias: int = Field(
        default=5,
        ge=1,
        description="Plazo en días hábiles para que el perito acepte el cargo (art. 261 CPCC)",
    )
    plazo_dictamen_dias: int = Field(
        default=30,
        ge=1,
        description="Plazo en días hábiles para presentar el dictamen pericial",
    )
    puntos_periciales: list[str] = Field(
        default_factory=list,
        description="Lista de puntos de pericia propuestos/admitidos. Puede completarse en la plantilla.",
    )


class IntimacionCumplimientoSentenciaInput(ExpedienteBase):
    """
    Intimación al condenado a cumplir la sentencia firme bajo apercibimiento
    de ejecución forzada (art. 559 CPCC Ley 8465, Córdoba).
    """
    plazo_dias: int = Field(
        default=10,
        ge=1,
        description=(
            "Plazo en días hábiles para cumplir la sentencia (art. 559 CPCC: "
            "el tribunal fija el plazo según la naturaleza de la obligación)"
        ),
    )
    tipo_obligacion: Literal["dar_dinero", "dar_cosa", "hacer", "no_hacer"] = Field(
        default="dar_dinero",
        description=(
            "Tipo de obligación impuesta por la sentencia: "
            "'dar_dinero' (abonar suma de dinero); "
            "'dar_cosa' (entregar bien determinado); "
            "'hacer' (ejecutar una conducta); "
            "'no_hacer' (abstenerse de una conducta)"
        ),
    )
    descripcion_obligacion: str | None = Field(
        default=None,
        description="Descripción de la obligación a cumplir (opcional, complementa tipo_obligacion)",
    )
    apercibimiento: str = Field(
        default="ejecución forzada con costas",
        description="Apercibimiento en caso de incumplimiento",
    )


class AutoDesgloseInput(ExpedienteBase):
    """
    Decreto que ordena el desglose de documentación del expediente y su
    devolución a la parte que la acompañó (art. 75 CPCC Ley 8465, Córdoba).
    """
    descripcion_documentos: str = Field(
        description=(
            "Descripción de los documentos a desglosar (ej: 'escritura pública N.° 123 "
            "del Esc. Pérez, fojas 45/50 del expediente')"
        )
    )
    parte_solicitante: Literal["actor", "demandado", "tercero", "de_oficio"] = Field(
        default="actor",
        description="Parte que solicita el desglose",
    )
    motivo: str | None = Field(
        default=None,
        description="Motivo del desglose (opcional; ej: 'presentación en otro expediente', 'original único')",
    )
    dejar_testimonio: bool = Field(
        default=True,
        description="Si True, ordena sacar testimonio o fotocopia antes de devolver el original",
    )


class CitacionAudienciaConciliacionInput(ExpedienteBase):
    """
    Decreto que cita a las partes a audiencia de conciliación en el proceso
    civil ordinario (art. 58 CPCC Ley 8465, Córdoba).
    """
    fecha_audiencia: date = Field(
        description="Fecha de la audiencia de conciliación",
    )
    hora_audiencia: str = Field(
        default="09:00",
        description="Hora de la audiencia en formato HH:MM",
    )
    sala: str | None = Field(
        default=None,
        description="Sala o despacho donde se celebrará (opcional)",
    )
    con_asistencia_letrada: bool = Field(
        default=True,
        description="Si True, se intima a las partes a concurrir con patrocinio letrado",
    )


class DecretoVistaInput(ExpedienteBase):
    """
    Decreto que corre vista o traslado a la parte contraria para que tome
    conocimiento y conteste dentro del plazo (art. 107 CPCC Ley 8465, Córdoba).
    Usado para vistas de pericias, informes, excepciones, documentos, etc.
    """
    objeto_vista: str = Field(
        description=(
            "Objeto de la vista (ej: 'pericia contable presentada', "
            "'excepción de prescripción', 'informe de la AFIP')"
        )
    )
    destinatario: str = Field(
        default="la parte contraria",
        description=(
            "Parte a quien se corre la vista "
            "(ej: 'la parte actora', 'la parte demandada', 'ambas partes')"
        ),
    )
    plazo_dias: int = Field(
        default=5,
        gt=0,
        description="Plazo en días hábiles para contestar la vista (art. 107 CPCC)",
    )


class ProvidenciaAgregacionInput(ExpedienteBase):
    """
    Providencia de trámite que tiene por presentado un escrito o documento
    y ordena su agregación al expediente (art. 107 CPCC Ley 8465, Córdoba).
    """
    tipo_escrito: str = Field(
        description=(
            "Tipo de escrito o documento presentado "
            "(ej: 'contestación de demanda', 'pericia médica', "
            "'factura de honorarios del perito', 'informe del Registro de la Propiedad')"
        )
    )
    presentado_por: str = Field(
        default="la parte actora",
        description="Parte o sujeto que presenta el escrito",
    )
    instruccion_adicional: str | None = Field(
        default=None,
        description=(
            "Instrucción adicional a agregar luego de 'Agréguese' "
            "(ej: 'Dése vista a la contraria por cinco días', "
            "'Cítese al perito a aceptar el cargo')"
        ),
    )
