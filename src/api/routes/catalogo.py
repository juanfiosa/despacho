"""Endpoints del catálogo de procesos judiciales."""

from fastapi import APIRouter, Query
from src.catalogo import catalogo_serializable, get_fuero, get_proceso, get_etapa, FUEROS

router = APIRouter(prefix="/catalogo", tags=["Catálogo"])


@router.get("", summary="Catálogo completo: fueros → procesos → etapas → documentos")
def catalogo_completo():
    return catalogo_serializable()


@router.get("/buscar", summary="Búsqueda global de documentos por texto libre")
def buscar_documentos(
    q: str = Query(..., min_length=2, description="Texto a buscar (mínimo 2 caracteres)")
):
    """Busca en todos los documentos del catálogo por label, descripción y norma.
    Devuelve lista de resultados con contexto de fuero/proceso/etapa."""
    q_lower = q.lower()
    resultados = []
    for fuero in FUEROS:
        for proceso in fuero.procesos:
            for etapa in proceso.etapas:
                for doc in etapa.documentos:
                    if (q_lower in doc.label.lower()
                            or q_lower in doc.descripcion.lower()
                            or q_lower in doc.norma.lower()
                            or q_lower in etapa.label.lower()
                            or q_lower in proceso.label.lower()):
                        resultados.append({
                            "tipo":             doc.tipo,
                            "label":            doc.label,
                            "descripcion":      doc.descripcion,
                            "norma":            doc.norma,
                            "fuero_id":         fuero.id,
                            "fuero_label":      fuero.label,
                            "proceso_id":       proceso.id,
                            "proceso_label":    proceso.label,
                            "etapa_id":         etapa.id,
                            "etapa_label":      etapa.label,
                        })
    # Deduplicar por tipo (un mismo tipo puede aparecer en varias etapas)
    seen = set()
    unicos = []
    for r in resultados:
        if r["tipo"] not in seen:
            seen.add(r["tipo"])
            unicos.append(r)
    return unicos


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
