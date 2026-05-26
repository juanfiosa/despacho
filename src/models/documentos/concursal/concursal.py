"""
Modelos de input para documentos del fuero Concursal (Ley 24522, Córdoba).
Documentos cubiertos:
  - AutoAperturaConcursalInput → auto de apertura del concurso preventivo (art. 14 Ley 24522)
  - AutoDeclaracionQuiebraInput → sentencia de quiebra (art. 88 Ley 24522)
"""

from datetime import date

from pydantic import Field, model_validator

from ...base import ExpedienteBase


class AutoAperturaConcursalInput(ExpedienteBase):
    """
    Auto de apertura del concurso preventivo (art. 14 Ley 24522).
    Designa síndico, fija período informativo, audiencia informativa y
    ordena medidas cautelares provisionales.
    """
    # Síndico
    sindico_nombre: str = Field(
        description="Nombre y apellido del síndico designado"
    )
    sindico_matricula: str | None = Field(
        default=None,
        description="Matrícula profesional del síndico (CPCE o equivalente)",
    )

    # Fechas clave del proceso (art. 14 incs. 3, 5, 6 Ley 24522)
    fecha_limite_verificacion: date = Field(
        description="Fecha límite para que los acreedores se presenten a verificar (art. 32 Ley 24522)"
    )
    fecha_informe_individual: date = Field(
        description="Fecha para la presentación del informe individual por el síndico (art. 35 Ley 24522)"
    )
    fecha_informe_general: date = Field(
        description="Fecha para la presentación del informe general por el síndico (art. 39 Ley 24522)"
    )
    fecha_audiencia_informativa: date = Field(
        description="Fecha de la audiencia informativa (art. 45 Ley 24522)"
    )

    # Medida cautelar provisional
    inhibicion_provisional: bool = Field(
        default=True,
        description="Decretar inhibición general de bienes provisoria sobre el concursado",
    )

    @model_validator(mode="after")
    def fechas_en_orden(self) -> "AutoAperturaConcursalInput":
        fechas = [
            ("fecha_limite_verificacion", self.fecha_limite_verificacion),
            ("fecha_informe_individual", self.fecha_informe_individual),
            ("fecha_informe_general", self.fecha_informe_general),
            ("fecha_audiencia_informativa", self.fecha_audiencia_informativa),
        ]
        for i in range(len(fechas) - 1):
            nombre_a, fecha_a = fechas[i]
            nombre_b, fecha_b = fechas[i + 1]
            if fecha_a is not None and fecha_b is not None and fecha_a >= fecha_b:
                raise ValueError(
                    f"'{nombre_a}' ({fecha_a}) debe ser anterior a '{nombre_b}' ({fecha_b})"
                )
        return self


class AutoDeclaracionQuiebraInput(ExpedienteBase):
    """
    Sentencia de quiebra (art. 88 Ley 24522). Declara la quiebra, designa
    síndico, fija período informativo y ordena medidas cautelares y de
    publicidad.
    """
    # Síndico
    sindico_nombre: str = Field(description="Nombre y apellido del síndico designado")
    sindico_matricula: str | None = Field(default=None, description="Matrícula CPCE (opcional)")

    # Fechas del período informativo (arts. 32, 35, 39)
    fecha_limite_verificacion: date = Field(
        description="Fecha límite para que los acreedores presenten sus créditos (art. 32)"
    )
    fecha_informe_individual: date = Field(
        description="Fecha de presentación del informe individual del síndico (art. 35)"
    )
    fecha_informe_general: date = Field(
        description="Fecha de presentación del informe general del síndico (art. 39)"
    )

    # Medidas típicas de la quiebra
    clausura_establecimiento: bool = Field(
        default=False,
        description="Ordenar la clausura del establecimiento comercial (art. 88 inc. 5)",
    )
    inhabilitacion_fallido: bool = Field(
        default=True,
        description="Declarar la inhabilitación del fallido (art. 238 LCQ)",
    )
    tipo_quiebra: str = Field(
        default="voluntaria",
        description="Tipo de quiebra: 'voluntaria' (pedida por el propio deudor) o 'necesaria' (pedida por acreedor)",
    )

    @model_validator(mode="after")
    def fechas_en_orden(self) -> "AutoDeclaracionQuiebraInput":
        if self.fecha_limite_verificacion >= self.fecha_informe_individual:
            raise ValueError(
                "'fecha_limite_verificacion' debe ser anterior a 'fecha_informe_individual'"
            )
        if self.fecha_informe_individual >= self.fecha_informe_general:
            raise ValueError(
                "'fecha_informe_individual' debe ser anterior a 'fecha_informe_general'"
            )
        return self
