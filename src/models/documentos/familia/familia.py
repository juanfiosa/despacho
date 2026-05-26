"""
Modelos de input para documentos del fuero Familia (CPF Ley 10305, Córdoba).
Documentos cubiertos:
  - AlimentosProvisioriosInput          → auto que fija cuota alimentaria provisoria
  - AdmisionAlimentosInput              → decreto de admisión de demanda de alimentos + citación
  - AdmisionDivorcioInput               → decreto de admisión de divorcio (arts. 437-438 CCyCN)
  - AdmisionComunicacionInput           → decreto de admisión de régimen de comunicación + citación
  - HomologacionAcuerdoFamiliaInput     → auto homologando acuerdo en causa de familia
  - ExclusionHogarInput                 → decreto de exclusión del hogar (art. 519 CCyCN / art. 6 CPF)
  - RegimenComunicacionProvisorioInput  → decreto que fija régimen de comunicación provisorio
  - IntimacionPagoCuotasAlimentariasInput → intimación de pago de cuotas alimentarias adeudadas
  - AtribucionHogarConyugalInput        → auto de atribución del hogar conyugal (art. 443 CCyCN)
  - CitacionConciliacionFamiliaInput    → citación a audiencia de conciliación (CPF Ley 10305)
"""

from datetime import date
from typing import Literal

from pydantic import Field

from ...base import ExpedienteBase, DatosEconomicos


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


class AdmisionAlimentosInput(ExpedienteBase):
    """
    Decreto de admisión de demanda de alimentos y citación a audiencia
    (arts. 2 y 3 CPF Ley 10305; art. 544 CCyCN).
    """
    objeto: str = Field(
        default="fijación de cuota alimentaria",
        description="Objeto del proceso (ej: 'fijación de cuota alimentaria', 'aumento de cuota')",
    )
    fecha_audiencia: date = Field(
        description="Fecha de la audiencia de conciliación",
    )
    hora_audiencia: str = Field(
        default="09:00",
        description="Hora de la audiencia en formato HH:MM",
    )
    sala: str | None = Field(
        default=None,
        description="Sala o número de despacho (opcional)",
    )


class HomologacionAcuerdoFamiliaInput(ExpedienteBase):
    """
    Auto que homologa el acuerdo alcanzado entre las partes en una causa
    de familia (alimentos, régimen de comunicación, divorcio, etc.) y le
    confiere fuerza de sentencia firme (art. 166 inc. 1 CPCC / CPF Ley 10305).
    """
    tipo_acuerdo: Literal["alimentos", "comunicacion", "divorcio", "guarda", "otro"] = Field(
        default="alimentos",
        description="Tipo de acuerdo a homologar",
    )
    descripcion_acuerdo: str = Field(
        description=(
            "Descripción detallada del acuerdo homologado, en texto libre "
            "(ej: 'cuota alimentaria de $X mensual pagadera los días 5 de cada mes, "
            "modalidad depósito judicial')"
        )
    )
    tipo_acuerdo_descripcion: str | None = Field(
        default=None,
        description="Descripción cuando tipo_acuerdo='otro'",
    )


class AdmisionDivorcioInput(ExpedienteBase):
    """
    Decreto de admisión formal de demanda/petición de divorcio vincular
    (arts. 437 y 438 CCyCN). Aplica tanto al divorcio unilateral como al
    presentado de común acuerdo.
    """
    tipo_divorcio: Literal["unilateral", "bilateral"] = Field(
        default="unilateral",
        description="'unilateral' = petición de uno de los cónyuges; 'bilateral' = petición conjunta",
    )
    plazo_retiro_documentos_dias: int = Field(
        default=10,
        gt=0,
        description="Plazo en días para que las partes retiren la documentación para protocolización",
    )


class AdmisionComunicacionInput(ExpedienteBase):
    """
    Decreto de admisión de demanda sobre régimen de comunicación (art. 555 CCyCN)
    y citación a audiencia de conciliación (CPF Ley 10305).
    """
    objeto: str = Field(
        default="fijación de régimen de comunicación y contacto",
        description="Objeto del proceso",
    )
    fecha_audiencia: date = Field(
        description="Fecha de la audiencia",
    )
    hora_audiencia: str = Field(
        default="09:00",
        description="Hora de la audiencia en formato HH:MM",
    )
    sala: str | None = Field(
        default=None,
        description="Sala o número de despacho (opcional)",
    )


class ExclusionHogarInput(ExpedienteBase):
    """
    Decreto que ordena la exclusión del hogar del conviviente o cónyuge
    que ejerce violencia, en el marco de un proceso de familia
    (art. 519 CCyCN; art. 6 CPF Ley 10305, Córdoba).
    """
    plazo_cumplimiento_horas: int = Field(
        default=24,
        ge=1,
        description="Plazo en horas para el cumplimiento de la exclusión",
    )
    con_auxilio_policial: bool = Field(
        default=True,
        description="Si True, se autoriza el auxilio de la fuerza pública para el diligenciamiento",
    )
    con_prohibicion_acercamiento: bool = Field(
        default=True,
        description="Si True, se fija también prohibición de acercamiento al domicilio y a la persona",
    )
    distancia_metros: int | None = Field(
        default=None,
        ge=1,
        description="Distancia mínima de acercamiento en metros (si aplica prohibición)",
    )
    domicilio_exclusion: str = Field(
        description="Domicilio del que se ordena la exclusión",
    )


class RegimenComunicacionProvisorioInput(ExpedienteBase):
    """
    Decreto que fija régimen de comunicación y contacto provisorio entre
    el progenitor no conviviente y el/los hijo/s (art. 555 CCyCN;
    CPF Ley 10305, Córdoba).
    """
    descripcion_regimen: str = Field(
        description=(
            "Descripción del régimen de comunicación provisorio (ej: 'fines de semana "
            "alternos de sábado 10 hs. a domingo 18 hs., más los miércoles de 17 a 20 hs.')"
        )
    )
    lugar_entrega: str | None = Field(
        default=None,
        description="Lugar de entrega y reintegro del/los menor/es (opcional)",
    )
    con_supervision: bool = Field(
        default=False,
        description="Si True, el régimen se cumple bajo supervisión del equipo técnico del juzgado",
    )
    vigencia: Literal["hasta_sentencia", "hasta_nueva_resolucion", "plazo_determinado"] = Field(
        default="hasta_sentencia",
        description="Vigencia del régimen provisorio",
    )


class IntimacionPagoCuotasAlimentariasInput(ExpedienteBase):
    """
    Intimación al alimentante a abonar las cuotas alimentarias adeudadas
    bajo apercibimiento de lo dispuesto por el art. 553 CCyCN
    (CPF Ley 10305, Córdoba).
    """
    cuotas_adeudadas: int = Field(
        ge=1,
        description="Número de cuotas alimentarias adeudadas",
    )
    monto_total_adeudado: float = Field(
        gt=0,
        description="Monto total adeudado en pesos (cuotas vencidas + intereses si aplica)",
    )
    plazo_dias: int = Field(
        default=5,
        ge=1,
        description="Plazo en días hábiles para el pago",
    )
    apercibimiento_art553: bool = Field(
        default=True,
        description="Si True, se apercibe con las consecuencias del art. 553 CCyCN (intereses, medidas compulsivas)",
    )
    con_embargo: bool = Field(
        default=False,
        description="Si True, se traba embargo preventivo sobre bienes del alimentante en el mismo acto",
    )


class AtribucionHogarConyugalInput(ExpedienteBase):
    """
    Auto que atribuye el uso del hogar conyugal a uno de los cónyuges
    durante el proceso o con carácter definitivo (art. 443 CCyCN;
    CPF Ley 10305, Córdoba).
    """
    domicilio_hogar: str = Field(
        description="Domicilio del hogar cuyo uso se atribuye",
    )
    caracter: Literal["provisorio", "definitivo"] = Field(
        default="provisorio",
        description="'provisorio' durante el proceso; 'definitivo' en sentencia o acuerdo",
    )
    con_exclusion_otro_conyuge: bool = Field(
        default=True,
        description="Si True, el decreto incluye la exclusión del otro cónyuge del inmueble",
    )
    plazo_exclusion_horas: int = Field(
        default=24,
        ge=1,
        description="Plazo en horas para que el excluido desaloje (si con_exclusion_otro_conyuge=True)",
    )
    fundamento: Literal["hijos_menores", "enfermedad", "situacion_economica", "violencia", "otro"] = Field(
        default="hijos_menores",
        description="Fundamento principal de la atribución (art. 443 CCyCN)",
    )


class CitacionConciliacionFamiliaInput(ExpedienteBase):
    """
    Decreto que cita a las partes a audiencia de conciliación en proceso de
    familia (art. 58 y conc. CPF Ley 10305, Córdoba).
    """
    tipo_proceso: Literal[
        "alimentos", "comunicacion", "guarda", "divorcio", "liquidacion_bienes", "otro"
    ] = Field(
        default="alimentos",
        description="Tipo de proceso de familia en el que se convoca a conciliación",
    )
    fecha_audiencia: date = Field(
        description="Fecha de la audiencia de conciliación",
    )
    hora_audiencia: str = Field(
        default="09:00",
        description="Hora de la audiencia en formato HH:MM",
    )
    sala: str | None = Field(
        default=None,
        description="Sala o número de despacho (opcional)",
    )
    con_equipo_tecnico: bool = Field(
        default=False,
        description="Si True, se convoca también al equipo técnico interdisciplinario del juzgado",
    )
