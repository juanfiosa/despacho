"""
Modelos de input para documentos del fuero Niñez y Adolescencia (Ley 9944, Córdoba).
Documentos cubiertos:
  - AutoControlLegalidadInput     → auto de control de legalidad de medida excepcional (art. 52 Ley 9944)
  - ProrrogaMedidaNNAInput        → auto que prorroga la medida excepcional (art. 55 Ley 9944)
  - CeseMedidaNNAInput            → auto que dispone el cese de la medida (art. 52/55 Ley 9944)
  - AutoMedidaAbrigoInput         → auto de medida de abrigo (art. 48 Ley 9944)
  - NotificacionSENAFInput        → decreto de notificación a SENAF / organismo administrativo
  - AutoInternacionSaludMentalInput → auto de internación involuntaria (art. 43 Ley 26657)
  - DecretoVisitasSupervisadasInput  → decreto que fija régimen de visitas supervisadas
  - AutoReintegroFamiliarInput    → auto de reintegro del NNyA al grupo familiar
  - CitacionSeguimientoNNAInput   → citación a audiencia de seguimiento de medida
"""

from datetime import date
from typing import Literal

from pydantic import Field

from ...base import ExpedienteBase


class AutoControlLegalidadInput(ExpedienteBase):
    """
    Auto que avoca el control de legalidad de la medida de protección
    excepcional de derechos adoptada por la autoridad administrativa
    (art. 52 Ley Provincial N.° 9944 — Promoción y Protección de los
    Derechos de las Niñas, Niños y Adolescentes de Córdoba).
    """
    nombre_nnya: str = Field(
        description="Nombre y apellido del niño, niña o adolescente (NNyA)"
    )
    edad_nnya: int | None = Field(
        default=None,
        ge=0,
        le=17,
        description="Edad del NNyA en años cumplidos (opcional)",
    )
    organismo_administrativo: str = Field(
        default="la Secretaría de Niñez, Adolescencia y Familia",
        description="Organismo que adoptó la medida de protección excepcional",
    )
    medida_adoptada: str = Field(
        description=(
            "Descripción de la medida adoptada (ej: 'inclusión transitoria en "
            "familia alternativa / hogar convivencial')"
        )
    )
    fecha_medida_administrativa: date = Field(
        description="Fecha en que la autoridad administrativa adoptó la medida"
    )
    plazo_revision_dias: int = Field(
        default=30,
        gt=0,
        description="Plazo para la revisión periódica de la medida en días",
    )


class ProrrogaMedidaNNAInput(ExpedienteBase):
    """
    Auto que prorroga la medida de protección excepcional por un nuevo período
    (art. 55 Ley 9944 — máximo 180 días en total, prorrogable en circunstancias
    excepcionales).
    """
    nombre_nnya: str = Field(
        description="Nombre y apellido del NNyA"
    )
    edad_nnya: int | None = Field(
        default=None,
        ge=0,
        le=17,
        description="Edad del NNyA en años cumplidos (opcional)",
    )
    organismo_administrativo: str = Field(
        default="la Secretaría de Niñez, Adolescencia y Familia",
        description="Organismo que ejecuta la medida",
    )
    medida_adoptada: str = Field(
        description="Descripción de la medida que se prorroga"
    )
    motivo_prorroga: str = Field(
        description=(
            "Fundamento de la prórroga (ej: 'no han variado sustancialmente "
            "las circunstancias que motivaron la medida')"
        )
    )
    plazo_prorroga_dias: int = Field(
        default=30,
        gt=0,
        description="Días por los que se prorroga la medida",
    )


class CeseMedidaNNAInput(ExpedienteBase):
    """
    Auto que dispone el cese de la medida de protección excepcional por haberse
    superado la situación de riesgo o por otra causa legal (art. 52/55 Ley 9944).
    """
    nombre_nnya: str = Field(
        description="Nombre y apellido del NNyA"
    )
    edad_nnya: int | None = Field(
        default=None,
        ge=0,
        le=17,
        description="Edad del NNyA en años cumplidos (opcional)",
    )
    organismo_administrativo: str = Field(
        default="la Secretaría de Niñez, Adolescencia y Familia",
        description="Organismo que ejecutó la medida",
    )
    medida_adoptada: str = Field(
        description="Descripción de la medida que cesa"
    )
    motivo_cese: str = Field(
        description=(
            "Fundamento del cese (ej: 'han cesado las circunstancias que "
            "motivaron la medida excepcional'; 'reintegro al grupo familiar')"
        )
    )


class AutoMedidaAbrigoInput(ExpedienteBase):
    """
    Auto que ordena medida de abrigo: alojamiento transitorio del NNyA en
    familia alternativa, hogar convivencial o establecimiento de protección
    (art. 48 Ley 9944 Córdoba).
    """
    nombre_nnya: str = Field(
        description="Nombre y apellido del NNyA"
    )
    edad_nnya: int | None = Field(
        default=None,
        ge=0,
        le=17,
        description="Edad del NNyA en años cumplidos (opcional)",
    )
    modalidad_abrigo: Literal[
        "familia_alternativa",
        "hogar_convivencial",
        "establecimiento_proteccion",
        "otra",
    ] = Field(
        default="hogar_convivencial",
        description=(
            "Modalidad de la medida de abrigo: "
            "'familia_alternativa' (familia acogedora); "
            "'hogar_convivencial' (institución de abrigo); "
            "'establecimiento_proteccion' (establecimiento especializado); "
            "'otra'"
        ),
    )
    establecimiento: str | None = Field(
        default=None,
        description="Nombre del hogar o familia alternativa donde se alojará el NNyA (si se conoce)",
    )
    motivo_abrigo: str = Field(
        description=(
            "Situación de vulneración de derechos que justifica la medida "
            "(ej: 'ausencia de adulto responsable', 'situación de riesgo grave')"
        )
    )
    plazo_dias: int = Field(
        default=30,
        gt=0,
        description="Plazo de la medida de abrigo en días (máx. 180 días por art. 55 Ley 9944)",
    )


class NotificacionSENAFInput(ExpedienteBase):
    """
    Decreto que ordena notificar a la SENAF (Secretaría de Niñez, Adolescencia
    y Familia) u organismo administrativo local en causa de niñez
    (Ley 9944 Córdoba; Ley 26061 Nacional).
    """
    nombre_nnya: str = Field(
        description="Nombre y apellido del NNyA",
    )
    organismo_notificar: str = Field(
        default="la Secretaría de Niñez, Adolescencia y Familia (SENAF)",
        description="Organismo a notificar",
    )
    objeto_notificacion: str = Field(
        description=(
            "Motivo de la notificación (ej: 'resolución de control de legalidad', "
            "'dictado de medida de abrigo', 'audiencia de seguimiento del día DD/MM/AAAA')"
        )
    )
    plazo_respuesta_dias: int | None = Field(
        default=None,
        ge=1,
        description="Plazo en días hábiles para que el organismo informe (opcional)",
    )


class AutoInternacionSaludMentalInput(ExpedienteBase):
    """
    Auto que dispone la internación involuntaria de un NNyA por razones de
    salud mental (art. 43 Ley 26657 — Salud Mental; Ley 9944, Córdoba).
    """
    nombre_nnya: str = Field(
        description="Nombre y apellido del NNyA",
    )
    edad_nnya: int | None = Field(
        default=None,
        ge=0,
        le=17,
        description="Edad del NNyA (opcional)",
    )
    establecimiento_salud: str = Field(
        description="Hospital o institución de salud mental donde se ordenará la internación",
    )
    diagnostico_provisional: str | None = Field(
        default=None,
        description="Diagnóstico o motivo clínico de la internación (opcional)",
    )
    medico_interviniente: str | None = Field(
        default=None,
        description="Nombre del médico o equipo de salud que recomienda la internación (opcional)",
    )
    plazo_revision_dias: int = Field(
        default=30,
        gt=0,
        description="Plazo para la revisión judicial de la internación (art. 43 Ley 26657: 30 días)",
    )


class DecretoVisitasSupervisadasInput(ExpedienteBase):
    """
    Decreto que fija un régimen de visitas supervisadas entre el NNyA y
    su/s progenitor/es o referentes familiares, bajo supervisión del equipo
    técnico del juzgado (Ley 9944; art. 555 CCyCN).
    """
    nombre_nnya: str = Field(
        description="Nombre y apellido del NNyA",
    )
    descripcion_regimen: str = Field(
        description=(
            "Descripción del régimen de visitas (ej: 'una vez por semana, los sábados "
            "de 10 a 12 hs., en la sede del juzgado')"
        )
    )
    lugar_visitas: Literal["sede_juzgado", "hogar_alternativo", "externo_supervisado", "otro"] = Field(
        default="sede_juzgado",
        description="Lugar donde se realizarán las visitas",
    )
    supervisor: str | None = Field(
        default=None,
        description="Profesional o institución a cargo de la supervisión (opcional)",
    )
    vigencia: Literal["hasta_nueva_resolucion", "plazo_determinado"] = Field(
        default="hasta_nueva_resolucion",
        description="Vigencia del régimen de visitas",
    )


class AutoReintegroFamiliarInput(ExpedienteBase):
    """
    Auto que ordena el reintegro del NNyA a su grupo familiar de origen
    o ampliado por haberse superado la situación de vulneración de derechos
    (Ley 9944, art. 48 y conc., Córdoba).
    """
    nombre_nnya: str = Field(
        description="Nombre y apellido del NNyA",
    )
    grupo_familiar_reintegro: str = Field(
        description=(
            "Descripción del grupo familiar al que se reintegra el NNyA "
            "(ej: 'su madre, Sra. María Pérez, en el domicilio de calle X N.° Y')"
        )
    )
    condiciones_reintegro: list[str] = Field(
        default_factory=list,
        description=(
            "Condiciones para el reintegro (ej: 'seguimiento mensual por SENAF', "
            "'vinculación con centro de salud', 'escolarización')"
        ),
    )
    motivo_reintegro: str = Field(
        default="han cesado las circunstancias que motivaron la medida excepcional",
        description="Fundamento del reintegro familiar",
    )


class CitacionSeguimientoNNAInput(ExpedienteBase):
    """
    Decreto que convoca a las partes, al organismo administrativo y/o al
    equipo técnico a audiencia de seguimiento de la medida de protección
    excepcional (art. 52 Ley 9944, Córdoba).
    """
    nombre_nnya: str = Field(
        description="Nombre y apellido del NNyA",
    )
    tipo_audiencia: Literal["seguimiento", "revision_medida", "reintegracion", "otro"] = Field(
        default="seguimiento",
        description="Tipo de audiencia de seguimiento",
    )
    fecha_audiencia: date = Field(
        description="Fecha de la audiencia",
    )
    hora_audiencia: str = Field(
        default="09:00",
        description="Hora de la audiencia en formato HH:MM",
    )
    citar_senaf: bool = Field(
        default=True,
        description="Si True, se cita al representante de SENAF",
    )
    citar_equipo_tecnico: bool = Field(
        default=True,
        description="Si True, se convoca al equipo técnico interdisciplinario del juzgado",
    )
