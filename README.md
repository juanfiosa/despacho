# Despacho

Generador de documentos judiciales estandarizados para la justicia de Córdoba.

## Producto

Sistema de template rendering para documentos de trámite (decretos, intimaciones, autos formulaicos).
Complementa a Justia (generador de sentencias con razonamiento jurídico).

## Fueros

civil_comercial | penal | familia | laboral | contencioso_administrativo | violencia_familiar | niñez | concursal

## Stack

- Backend: FastAPI + Jinja2
- Cálculos: Python puro (intereses, plazos procesales)
- LLM: Gemini flash-lite (solo para campos de texto libre)
- Output: DOCX + vista previa HTML
