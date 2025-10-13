import pandas as pd
from sklearn.linear_model import LogisticRegression
from django.conf import settings
from pathlib import Path

def analizar_datos():
    # Construir ruta absoluta al archivo de datos
    path = Path(settings.BASE_DIR) / "data" / "Encuesta_google.xlsx"

    try:
        df = pd.read_excel(path)
    except FileNotFoundError:
        return {"error": f"No se encontró el archivo: {path}"}
    except Exception as e:
        return {"error": f"Error al leer el archivo: {e}"}

    # Verificar que las columnas necesarias existan
    if not {'Voto', 'Edad', 'Estrato'}.issubset(df.columns):
        return {"error": "Faltan columnas requeridas: Voto, Edad, Estrato"}

    # Conteo simple de votos
    conteo = df['Voto'].value_counts().to_dict()

    # Preprocesar columnas numéricas (manejo de nulos o strings)
    X = df[['Edad', 'Estrato']].apply(pd.to_numeric, errors='coerce').fillna(0)
    y = (df['Voto'] == 'Rodrigo Paz').astype(int)

    # Ajustar el modelo de regresión logística
    modelo = LogisticRegression(max_iter=1000)
    modelo.fit(X, y)
    coef = dict(zip(X.columns, modelo.coef_[0]))

    # Retornar resultados
    return {
        "conteo": conteo,
        "coeficientes": coef,
        "ruta_datos": str(path)
    }
