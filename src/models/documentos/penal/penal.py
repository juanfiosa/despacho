"""
Modelos de input para documentos del fuero Penal (CPP Ley 8123, Córdoba).
Documentos cubiertos:
  - CitacionImputacionInput         → citación del imputado al acto de imputación (art. 271 CPP)
  - AutoElevacionJuicioInput        → auto de elevación a juicio (art. 354 CPP)
  - FijacionAudienciaDebateInput    → decreto que fija fecha del debate oral (art. 374 CPP)
  - SobreseimientoInput             → auto de sobreseimiento definitivo (arts. 350-351 CPP)
  - DesestimacionDenunciaInput      → auto desestimando denuncia o querella (art. 250 CPP)
  - PrisionPreventivaInput          → auto de prisión preventiva (art. 281 CPP)
  - CesePrisionPreventivaInput      → auto de cese de prisión preventiva (art. 283 CPP)
  - AdmisionPartesCivilesInput      → decreto de admisión de partes civiles (art. 96 CPP)
  - TrasladoVistaFiscalInput        → decreto de traslado para vista al fiscal (art. 334 CPP)
  - CitacionTestigosPeritosInput    → citación de testigos y/o peritos al debate (art. 374 CPP)
  - SuspensionJuicioPruebaInput     → auto de suspensión del juicio a prueba / probation (art. 76 CP)
  - ExtraccionTestimoniosInput      → decreto de extracción de testimonios (art. 181 CPP)
  - ArchivoNotificacionInput        → auto de archivo con notificación (art. 334 CPP)
"""

from datetime import date
from typing import Literal

from pydantic import Field

from ...base import ExpedienteBase


class CitacionImputacionInput(ExpedienteBase):
    """
    Decreto que cita al imputado a comparecer al acto formal de imputación
    ante el fiscal de instrucción (art. 271 CPP Ley 8123, Córdoba).
    """
    fiscal_nombre: str = Field(
        description="Nombre y apellido del fiscal requirente"
    )
    fiscal_unidad: str | None = Field(
        default=None,
        description="Unidad Fiscal o Fiscalía (ej: Fiscalía de Instrucción N.° 4)",
    )
    objeto_imputacion: str = Field(
        description=(
            "Descripción del hecho imputado (ej: 'homicidio culposo en accidente "
            "de tránsito, art. 84 CP')"
        )
    )
    fecha_citacion: date = Field(
        description="Fecha en que deberá comparecer el imputado"
    )
    hora_citacion: str = Field(
        default="09:00",
        description="Hora de comparecencia en formato HH:MM",
    )


class AutoElevacionJuicioInput(ExpedienteBase):
    """
    Auto que clausura la investigación penal preparatoria y eleva la causa
    a juicio oral (art. 354 CPP Ley 8123, Córdoba).
    """
    fiscal_nombre: str = Field(
        description="Nombre del fiscal que formuló el requerimiento de elevación"
    )
    calificacion_legal: str = Field(
        description=(
            "Calificación legal del hecho (ej: 'robo calificado, arts. 164 y 166 inc. 2 CP')"
        )
    )
    tipo_juicio: str = Field(
        default="oral",
        description="Tipo de juicio: 'oral' (público y oral) o 'abreviado'",
    )


class FijacionAudienciaDebateInput(ExpedienteBase):
    """
    Decreto que fija fecha, hora y sede del debate oral y público
    (art. 374 CPP Ley 8123, Córdoba).
    """
    fiscal_nombre: str = Field(description="Nombre del fiscal que sostendrá la acusación")
    calificacion_legal: str = Field(
        description="Calificación legal del hecho (ej: 'estafa reiterada, art. 172 CP')"
    )
    fecha_debate: date = Field(description="Fecha del debate oral")
    hora_debate: str = Field(default="09:00", description="Hora de inicio del debate (HH:MM)")
    sala: str | None = Field(default=None, description="Sala o sede del tribunal (opcional)")
    dias_duracion_estimada: int | None = Field(
        default=None,
        ge=1,
        description="Duración estimada en días de audiencia (opcional)",
    )


class SobreseimientoInput(ExpedienteBase):
    """
    Auto de sobreseimiento definitivo en causa penal (arts. 350-351 CPP
    Ley 8123, Córdoba). Extingue la acción penal y prohíbe nuevo proceso
    por el mismo hecho.
    """
    fiscal_nombre: str | None = Field(
        default=None,
        description="Nombre del fiscal (opcional — si la petición vino del fiscal)",
    )
    causal: Literal[
        "extincion_accion",
        "falta_participacion",
        "atipicidad_justificacion",
        "falta_prueba",
    ] = Field(
        default="falta_prueba",
        description=(
            "Causal legal del sobreseimiento: "
            "'extincion_accion' (art. 350 inc. 1: prescripción/muerte/indulto); "
            "'falta_participacion' (inc. 2: el imputado no participó); "
            "'atipicidad_justificacion' (inc. 3: hecho atípico o mediando causa de justificación); "
            "'falta_prueba' (inc. 4: prueba insuficiente para fundar la acusación)"
        ),
    )
    calificacion_provisional: str | None = Field(
        default=None,
        description="Calificación legal que se descarta (ej: 'art. 172 CP — estafa')",
    )
    descripcion_hecho: str | None = Field(
        default=None,
        description="Breve descripción del hecho investigado (opcional)",
    )


class DesestimacionDenunciaInput(ExpedienteBase):
    """
    Auto que desestima la denuncia o querella por no poder proceder o por
    ser manifiestamente improcedente (art. 250/257 CPP Ley 8123, Córdoba).
    """
    tipo_acto: Literal["denuncia", "querella"] = Field(
        default="denuncia",
        description="Si se desestima una denuncia o una querella",
    )
    fiscal_nombre: str | None = Field(
        default=None,
        description="Nombre del fiscal interviniente (opcional)",
    )
    causal: Literal[
        "manifiestamente_improcedente",
        "extincion_accion",
        "atipicidad",
        "no_conforma_delito",
    ] = Field(
        default="manifiestamente_improcedente",
        description=(
            "Causal de desestimación: "
            "'manifiestamente_improcedente' (art. 250 CPP); "
            "'extincion_accion' (prescripción u otra causa); "
            "'atipicidad' (el hecho no encuadra en ninguna figura legal); "
            "'no_conforma_delito' (el hecho relatado no constituye delito alguno)"
        ),
    )
    descripcion: str = Field(
        default="",
        description="Descripción breve de los hechos denunciados/querellados",
    )


class PrisionPreventivaInput(ExpedienteBase):
    """
    Auto que decreta la prisión preventiva del imputado (art. 281 CPP
    Ley 8123, Córdoba). Requiere semiplena prueba sobre el hecho y
    la participación, más peligro de fuga o entorpecimiento.
    """
    fiscal_nombre: str | None = Field(
        default=None,
        description="Nombre del fiscal requirente",
    )
    defensor_nombre: str | None = Field(
        default=None,
        description="Nombre del defensor (público o particular)",
    )
    calificacion_legal: str = Field(
        description="Calificación legal provisional (ej: 'robo agravado, arts. 164 y 166 inc. 2 CP')",
    )
    causal: Literal[
        "peligro_fuga",
        "entorpecimiento",
        "ambas",
    ] = Field(
        default="peligro_fuga",
        description=(
            "Causal de la medida: "
            "'peligro_fuga' (art. 281 inc. 1 CPP); "
            "'entorpecimiento' (art. 281 inc. 2 CPP); "
            "'ambas' (ambas causales concurrentes)"
        ),
    )
    descripcion_hecho: str | None = Field(
        default=None,
        description="Descripción breve del hecho investigado",
    )
    escala_minima_pena: str | None = Field(
        default=None,
        description="Escala penal mínima del delito imputado (ej: '3 años')",
    )


class CesePrisionPreventivaInput(ExpedienteBase):
    """
    Auto que dispone el cese de la prisión preventiva / morigeración
    (art. 283 CPP Ley 8123, Córdoba).
    """
    fiscal_nombre: str | None = Field(
        default=None,
        description="Nombre del fiscal interviniente",
    )
    defensor_nombre: str | None = Field(
        default=None,
        description="Nombre del defensor",
    )
    calificacion_legal: str | None = Field(
        default=None,
        description="Calificación legal del proceso",
    )
    modalidad: Literal[
        "excarcelacion",
        "exencion_prision",
        "morigeracion",
        "cese_automatico",
    ] = Field(
        default="excarcelacion",
        description=(
            "Modalidad de libertad: "
            "'excarcelacion' (liberación del detenido); "
            "'exencion_prision' (antes de ser aprehendido); "
            "'morigeracion' (arresto domiciliario u otra modalidad atenuada); "
            "'cese_automatico' (por vencimiento del plazo legal art. 283 CPP)"
        ),
    )
    causal_cese: Literal[
        "variacion_circunstancias",
        "vencimiento_plazo",
        "sobreseimiento",
        "absolución",
        "monto_pena",
        "otra",
    ] = Field(
        default="variacion_circunstancias",
        description="Causal del cese de la medida cautelar",
    )
    causal_descripcion: str | None = Field(
        default=None,
        description="Descripción adicional de la causal (opcional)",
    )
    condiciones: list[str] = Field(
        default_factory=list,
        description="Condiciones impuestas (ej: 'presentarse quincenalmente', 'no salir del país')",
    )


class AdmisionPartesCivilesInput(ExpedienteBase):
    """
    Decreto que admite la constitución de partes civiles en la causa penal
    (actor civil y/o tercero civilmente demandado, art. 96 y ss. CPP
    Ley 8123, Córdoba).
    """
    tipo_parte_civil: Literal["actor_civil", "tercero_civilmente_demandado", "ambos"] = Field(
        default="actor_civil",
        description="Tipo de parte civil admitida",
    )
    nombre_parte_civil: str = Field(
        description="Nombre de quien se constituye parte civil",
    )
    calificacion_provisional: str | None = Field(
        default=None,
        description="Calificación legal del hecho generador del daño (opcional)",
    )
    plazo_contestacion_dias: int | None = Field(
        default=None,
        ge=1,
        description="Plazo para contestar (si se da traslado al demandado civil)",
    )


class TrasladoVistaFiscalInput(ExpedienteBase):
    """
    Decreto que corre traslado o da vista al fiscal de instrucción o fiscal
    de cámara, confiriéndole plazo para dictaminar (art. 334 y conc. CPP
    Ley 8123, Córdoba).
    """
    tipo_vista: Literal["fiscal_instruccion", "fiscal_camara", "fiscal_general"] = Field(
        default="fiscal_instruccion",
        description="Jerarquía del ministerio público al que se da la vista",
    )
    objeto_vista: str = Field(
        description=(
            "Objeto de la vista (ej: 'petición de sobreseimiento del imputado', "
            "'recurso interpuesto por la defensa', 'calificación del hecho')"
        )
    )
    plazo_dias: int = Field(
        default=5,
        ge=1,
        description="Plazo en días hábiles para dictaminar",
    )


class CitacionTestigosPeritosInput(ExpedienteBase):
    """
    Decreto que cita a testigos y/o peritos a comparecer al debate oral y
    público bajo apercibimiento de ley (art. 374 y 221 CPP Ley 8123).
    """
    fecha_debate: date = Field(
        description="Fecha del debate al que se cita a declarar",
    )
    hora_debate: str = Field(
        default="09:00",
        description="Hora del debate en formato HH:MM",
    )
    tipo_convocados: Literal["testigos", "peritos", "testigos_y_peritos"] = Field(
        default="testigos",
        description="Tipo de personas convocadas",
    )
    lista_convocados: list[str] = Field(
        default_factory=list,
        description="Nombres y domicilios de los testigos y/o peritos citados",
    )
    apercibimiento: str = Field(
        default="conducción por la fuerza pública en caso de inasistencia injustificada (art. 221 CPP)",
        description="Apercibimiento por inasistencia",
    )


class SuspensionJuicioPruebaInput(ExpedienteBase):
    """
    Auto que homologa el acuerdo de suspensión del juicio a prueba (probation)
    y fija las reglas de conducta impuestas al imputado (art. 76 bis y ss. CP;
    art. 360 CPP Ley 8123, Córdoba).
    """
    fiscal_nombre: str | None = Field(
        default=None,
        description="Nombre del fiscal que prestó conformidad (opcional)",
    )
    defensor_nombre: str | None = Field(
        default=None,
        description="Nombre del defensor (opcional)",
    )
    calificacion_legal: str = Field(
        description="Calificación legal del hecho (ej: 'lesiones leves, art. 89 CP')",
    )
    plazo_suspension_meses: int = Field(
        default=12,
        ge=1,
        description="Plazo de la suspensión en meses (art. 76 bis CP: 1 a 3 años)",
    )
    reglas_conducta: list[str] = Field(
        default_factory=list,
        description=(
            "Reglas de conducta impuestas (ej: 'residir en domicilio declarado', "
            "'abstenerse de bebidas alcohólicas', 'concurrir a talleres')"
        ),
    )
    reparacion_danio: str | None = Field(
        default=None,
        description="Compromiso de reparación del daño causado (art. 76 bis 3° párrafo CP)",
    )


class ExtraccionTestimoniosInput(ExpedienteBase):
    """
    Decreto que ordena la extracción de testimonios para remitir a otro
    tribunal, juzgado o fiscal (art. 181 y conc. CPP Ley 8123, Córdoba).
    """
    objeto_testimonios: str = Field(
        description=(
            "Descripción de lo que se testimoniará (ej: 'copias certificadas de "
            "fs. 1/20 del presente expediente')"
        )
    )
    destino: str = Field(
        description="Tribunal, juzgado o fiscalía a quien se remiten los testimonios",
    )
    motivo: str = Field(
        description=(
            "Motivo de la extracción (ej: 'denuncia de nuevo hecho', "
            "'conexidad con causa N.° X', 'elevación en consulta')"
        )
    )


class ArchivoNotificacionInput(ExpedienteBase):
    """
    Auto que dispone el archivo de las actuaciones y ordena notificar a las
    partes (art. 334 CPP Ley 8123, Córdoba). Se utiliza cuando el fiscal
    desestima o cuando opera alguna causal de extinción.
    """
    causal_archivo: Literal[
        "desestimacion_fiscal",
        "extincion_accion",
        "sobreseimiento_previo",
        "falta_merito",
        "otra",
    ] = Field(
        default="desestimacion_fiscal",
        description=(
            "Causal del archivo: "
            "'desestimacion_fiscal' (el fiscal no ejercita la acción); "
            "'extincion_accion' (prescripción u otra causa); "
            "'sobreseimiento_previo' (ya dictado en la causa); "
            "'falta_merito' (insuficiencia probatoria sin mérito para elevar); "
            "'otra'"
        ),
    )
    causal_descripcion: str | None = Field(
        default=None,
        description="Descripción cuando causal_archivo='otra'",
    )
    notificar_querellante: bool = Field(
        default=False,
        description="Si True, se notifica también al querellante particular (si lo hubiera)",
    )
