"""Endpoints del catálogo de procesos judiciales."""

from fastapi import APIRouter
from src.catalogo import catalogo_serializable, get_fuero, get_proceso, get_etapa

router = APIRouter(prefix="/catalogo", tags=["Catálogo"])


@router.get("", summary="Catálogo completo: fueros → procesos → etapas → documentos")
def catalogo_completo():
    return catalogo_serializable()


@router.get("/{fuero_id}", summary="Procesos de un fuero")
def procesos_del_fuero(fuero_id: str):
    fuero = get_fuero(fuero_id)
    return {
        "id":       fuero.id,
        "label":    fuero.label,
        "norma":    fuero.norma,
        "procesos": [
            {"id": p.id, "label": p.label, "descripcion": p.descripcion}
            for p in fuero.procesos
        ],
    }


@router.get("/{fuero_id}/{proceso_id}", summary="Etapas de un proceso")
def etapas_del_proceso(fuero_id: str, proceso_id: str):
    proceso = get_proceso(fuero_id, proceso_id)
    return {
        "id":    proceso.id,
        "label": proceso.label,
        "etapas": [
            {"id": e.id, "label": e.label, "descripcion": e.descripcion}
            for e in proceso.etapas
        ],
    }


@router.get("/{fuero_id}/{proceso_id}/{etapa_id}", summary="Documentos disponibles en una etapa")
def documentos_de_etapa(fuero_id: str, proceso_id: str, etapa_id: str):
    etapa = get_etapa(fuero_id, proceso_id, etapa_id)
    return {
        "id":    etapa.id,
        "label": etapa.label,
        "documentos": [
            {
                "tipo":        d.tipo,
                "label":       d.label,
                "descripcion": d.descripcion,
                "norma":       d.norma,
            }
            for d in etapa.documentos
        ],
    }
