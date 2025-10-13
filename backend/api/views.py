import os, io, json
from datetime import datetime
import pandas as pd
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

FILENAME = "Encuesta_google.xlsx"
FILEPATH = settings.DATA_DIR / FILENAME

# Encabezados/columnas estándar (ajústalos a tu encuesta)
COLUMNS = [
    "timestamp",
    "edad", "genero", "departamento", "localidad",
    "situacion_educativa", "estrato", "estatus_laboral",
    "frecuencia_participacion", "orientacion_familiar"
]

def _ensure_excel_exists():
    if not FILEPATH.exists():
        df = pd.DataFrame(columns=COLUMNS)
        df.to_excel(FILEPATH, index=False)

def _load_df():
    _ensure_excel_exists()
    return pd.read_excel(FILEPATH)

def _save_df(df: pd.DataFrame):
    df.to_excel(FILEPATH, index=False)

@csrf_exempt
def import_excel(request):
    """
    POST multipart/form-data con 'file' (.xlsx o .csv)
    - Si es .xlsx: se guarda tal cual como Encuesta_google.xlsx
    - Si es .csv: se convierte a .xlsx y se guarda
    Reemplaza el archivo actual.
    """
    if request.method != "POST":
        return HttpResponseBadRequest("Solo POST")

    f = request.FILES.get("file")
    if not f:
        return HttpResponseBadRequest("Falta 'file'")

    name = f.name.lower()
    try:
        if name.endswith(".xlsx"):
            with open(FILEPATH, "wb+") as dest:
                for chunk in f.chunks():
                    dest.write(chunk)
            df = pd.read_excel(FILEPATH)
        elif name.endswith(".csv"):
            df = pd.read_csv(f)
            # normaliza columnas a tus nombres estándar si quieres
            df.to_excel(FILEPATH, index=False)
        else:
            return HttpResponseBadRequest("Formato no soportado (usa .xlsx o .csv)")

        total = len(df)
        return JsonResponse({"message": "ok", "total": total, "path": str(FILEPATH)})
    except Exception as e:
        return HttpResponseBadRequest(f"Error al importar: {e}")

@csrf_exempt
def append_response(request):
    """
    POST JSON con una respuesta de encuesta.
    Agrega una fila al mismo Excel.
    Body JSON esperado (ids de tu formulario):
    {
      "edad": "18-24" | "25-30" | ">30",
      "genero": "masculino" | "femenino" | "no-binario" | "prefiero-no-decir",
      "departamento": "Cochabamba" | "La Paz" | ...,
      "localidad": "Cliza" ...,
      "situacion_educativa": "estudiante" | "recien-prof",
      "estrato": "bajo" | "medio-bajo" | "medio" | "medio-alto",
      "estatus_laboral": "publica" | "privada" | "desempleado" | "emprendedor" | "freelance" | "innovador",
      "frecuencia_participacion": "1".."5",
      "orientacion_familiar": "izquierda" | "centro-izquierda" | "centro" | "centro-derecha" | "no-se"
    }
    """
    if request.method != "POST":
        return HttpResponseBadRequest("Solo POST")
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except Exception:
        return HttpResponseBadRequest("JSON inválido")

    # Crea df si no existe y carga
    df = _load_df()

    # Construir nueva fila con columnas estándar
    row = {
        "timestamp": datetime.utcnow().isoformat(timespec="seconds"),
        "edad": payload.get("edad"),
        "genero": payload.get("genero"),
        "departamento": payload.get("departamento"),
        "localidad": payload.get("localidad"),
        "situacion_educativa": payload.get("situacion_educativa"),
        "estrato": payload.get("estrato"),
        "estatus_laboral": payload.get("estatus_laboral"),
        "frecuencia_participacion": payload.get("frecuencia_participacion"),
        "orientacion_familiar": payload.get("orientacion_familiar"),
    }

    # Si faltan columnas (por importes antiguos), añádelas vacías
    for col in COLUMNS:
        if col not in df.columns:
            df[col] = None

    df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
    _save_df(df)
    return JsonResponse({"message": "ok", "added": 1, "total": len(df)})

def summary(request):
    """
    Devuelve conteos para gráficos (edad/genero/departamento).
    """
    if request.method != "GET":
        return HttpResponseBadRequest("Solo GET")
    try:
        df = _load_df()
        def counts(col):
            if col not in df.columns:
                return {"labels": [], "values": []}
            vc = df[col].fillna("N/D").value_counts()
            return {"labels": list(vc.index), "values": list(vc.values)}

        return JsonResponse({
            "total": len(df),
            "edad": counts("edad"),
            "genero": counts("genero"),
            "departamento": counts("departamento"),
        })
    except Exception as e:
        return HttpResponseBadRequest(f"Error summary: {e}")
