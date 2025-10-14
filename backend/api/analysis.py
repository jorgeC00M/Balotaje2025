import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from django.conf import settings
from pathlib import Path

FILEPATH = Path(settings.BASE_DIR) / "data" / "Encuesta_google.xlsx"

def load_data():
    """Carga el archivo Excel de datos"""
    try:
        df = pd.read_excel(FILEPATH, engine='openpyxl')
        return df
    except FileNotFoundError:
        return None
    except Exception as e:
        print(f"Error al cargar datos: {e}")
        return None


# ========================================
# 1. ANÁLISIS DESCRIPTIVO
# ========================================

def analisis_descriptivo():
    """
    Calcula porcentajes y medias para la intención de voto general
    """
    df = load_data()
    if df is None or df.empty:
        return {"error": "No hay datos disponibles"}
    
    resultado = {
        "total_respuestas": int(len(df)),
        "distribucion_voto": {},
        "promedios_likert": {}
    }
    
    # Buscar columna de intención de voto (puede tener diferentes nombres)
    voto_cols = [col for col in df.columns if 'voto' in col.lower() or 'intencion' in col.lower()]
    
    if voto_cols:
        voto_col = voto_cols[0]
        conteo = df[voto_col].value_counts()
        resultado["distribucion_voto"] = {
            str(k): {
                "cantidad": int(v),
                "porcentaje": round(float(v / len(df) * 100), 2)
            }
            for k, v in conteo.items()
        }
    
    # Promedios de escalas Likert (columnas con valores 1-5)
    for col in df.columns:
        if df[col].dtype in ['int64', 'float64']:
            valores_unicos = df[col].dropna().unique()
            # Si los valores están entre 1 y 5, es probablemente Likert
            if len(valores_unicos) <= 5 and all(v in range(1, 6) for v in valores_unicos if not pd.isna(v)):
                resultado["promedios_likert"][col] = round(float(df[col].mean()), 2)
    
    return resultado


# ========================================
# 2. SEGMENTACIÓN CRUZADA (CROSSTABS)
# ========================================

def crosstabs_analisis():
    """
    Genera tablas cruzadas: Intención de Voto vs otras variables
    """
    df = load_data()
    if df is None or df.empty:
        return {"error": "No hay datos disponibles"}
    
    # Identificar columnas clave
    voto_col = next((col for col in df.columns if 'voto' in col.lower()), None)
    estrato_col = next((col for col in df.columns if 'estrato' in col.lower()), None)
    educacion_col = next((col for col in df.columns if 'educati' in col.lower() or 'situacion' in col.lower()), None)
    
    resultado = {}
    
    # Crosstab 1: Voto × Estrato Socioeconómico
    if voto_col and estrato_col:
        ct = pd.crosstab(df[voto_col], df[estrato_col], margins=True)
        resultado["voto_por_estrato"] = {
            "tabla": ct.to_dict(),
            "descripcion": "Distribución de intención de voto según estrato socioeconómico"
        }
    
    # Crosstab 2: Voto × Situación Educativa
    if voto_col and educacion_col:
        ct = pd.crosstab(df[voto_col], df[educacion_col], margins=True)
        resultado["voto_por_educacion"] = {
            "tabla": ct.to_dict(),
            "descripcion": "Distribución de intención de voto según situación educativa"
        }
    
    # Crosstab 3: Voto × Género
    genero_col = next((col for col in df.columns if 'genero' in col.lower()), None)
    if voto_col and genero_col:
        ct = pd.crosstab(df[voto_col], df[genero_col], margins=True)
        resultado["voto_por_genero"] = {
            "tabla": ct.to_dict(),
            "descripcion": "Distribución de intención de voto según género"
        }
    
    # Convertir todo a tipos serializables
    return convert_to_native(resultado)


# ========================================
# 3. REGRESIÓN LOGÍSTICA
# ========================================

def regresion_logistica():
    """
    Modela la probabilidad de votar por un candidato específico
    Retorna coeficientes y variables más influyentes
    """
    df = load_data()
    if df is None or df.empty:
        return {"error": "No hay datos disponibles"}
    
    # Identificar columna de voto
    voto_col = next((col for col in df.columns if 'voto' in col.lower()), None)
    if not voto_col:
        return {"error": "No se encontró columna de intención de voto"}
    
    # Preparar variable dependiente (binaria: Rodrigo Paz = 1, Otros = 0)
    df_clean = df.dropna(subset=[voto_col])
    y = (df_clean[voto_col].str.contains('Rodrigo|rodrigo', case=False, na=False)).astype(int)
    
    # Seleccionar variables predictoras (numéricas)
    predictores = []
    for col in df_clean.columns:
        if col != voto_col and df_clean[col].dtype in ['int64', 'float64']:
            if df_clean[col].notna().sum() > len(df_clean) * 0.5:  # Al menos 50% de datos
                predictores.append(col)
    
    if len(predictores) == 0:
        return {"error": "No hay suficientes variables numéricas para el modelo"}
    
    X = df_clean[predictores].fillna(df_clean[predictores].mean())
    
    # Entrenar modelo
    try:
        modelo = LogisticRegression(max_iter=1000, random_state=42)
        modelo.fit(X, y)
        
        # Obtener coeficientes
        coeficientes = dict(zip(predictores, modelo.coef_[0]))
        
        # Ordenar por importancia (valor absoluto)
        coef_ordenados = sorted(coeficientes.items(), key=lambda x: abs(x[1]), reverse=True)
        
        resultado = {
            "modelo": "Regresión Logística",
            "variable_objetivo": "Probabilidad de votar por Rodrigo Paz Pereira",
            "coeficientes": {k: round(float(v), 4) for k, v in coeficientes.items()},
            "top_factores": [
                {
                    "variable": var,
                    "coeficiente": round(float(coef), 4),
                    "impacto": "Aumenta probabilidad" if coef > 0 else "Disminuye probabilidad"
                }
                for var, coef in coef_ordenados[:5]
            ],
            "precision": round(float(modelo.score(X, y)), 4),
            "intercepto": round(float(modelo.intercept_[0]), 4)
        }
        
        return resultado
    
    except Exception as e:
        return {"error": f"Error en regresión logística: {str(e)}"}


# ========================================
# 4. ANÁLISIS DE SENSIBILIDAD
# ========================================

def analisis_sensibilidad(factor, cambio_porcentual):
    """
    Simula cómo cambiaría la intención de voto si un factor se modifica
    
    factor: nombre de la columna (ej: 'factor_economia_empleo')
    cambio_porcentual: +/- porcentaje de cambio (ej: 20 para +20%)
    """
    df = load_data()
    if df is None or df.empty:
        return {"error": "No hay datos disponibles"}
    
    voto_col = next((col for col in df.columns if 'voto' in col.lower()), None)
    
    if not voto_col or factor not in df.columns:
        return {"error": "Columna no encontrada"}
    
    # Distribución original
    dist_original = df[voto_col].value_counts().to_dict()
    
    # Simular cambio: aumentar/disminuir valores del factor
    df_simulado = df.copy()
    if df_simulado[factor].dtype in ['int64', 'float64']:
        multiplicador = 1 + (cambio_porcentual / 100)
        df_simulado[factor] = df_simulado[factor] * multiplicador
        df_simulado[factor] = df_simulado[factor].clip(1, 5)  # Mantener en rango Likert
    
    # Aquí podrías aplicar el modelo de regresión para predecir nuevas intenciones
    # Por simplicidad, mostramos el impacto teórico
    
    resultado = {
        "factor_modificado": factor,
        "cambio_aplicado": f"{cambio_porcentual:+.1f}%",
        "distribucion_original": {str(k): int(v) for k, v in dist_original.items()},
        "nota": "Simulación básica. Para resultados precisos, integrar con modelo predictivo."
    }
    
    return resultado


# ========================================
# 5. ANÁLISIS TEMPORAL (PREPARACIÓN)
# ========================================

def preparar_analisis_temporal():
    """
    Estructura para análisis de evolución en el tiempo
    Requiere datos con timestamp
    """
    df = load_data()
    if df is None or df.empty:
        return {"error": "No hay datos disponibles"}
    
    # Buscar columna de timestamp
    timestamp_col = next((col for col in df.columns if 'time' in col.lower() or 'fecha' in col.lower()), None)
    
    if not timestamp_col:
        return {
            "mensaje": "No hay columna de timestamp",
            "recomendacion": "Agregar columna 'timestamp' para análisis temporal"
        }
    
    df[timestamp_col] = pd.to_datetime(df[timestamp_col])
    df = df.sort_values(timestamp_col)
    
    # Agrupar por período (día/semana)
    df['periodo'] = df[timestamp_col].dt.date
    
    voto_col = next((col for col in df.columns if 'voto' in col.lower()), None)
    
    if voto_col:
        evolucion = df.groupby('periodo')[voto_col].value_counts().unstack(fill_value=0)
        
        resultado = {
            "periodos": [str(p) for p in evolucion.index],
            "evolucion_voto": evolucion.to_dict(),
            "descripcion": "Evolución de la intención de voto por período"
        }
        
        return convert_to_native(resultado)
    
    return {"error": "No se pudo generar análisis temporal"}


# ========================================
# UTILIDADES
# ========================================

def convert_to_native(obj):
    """Convierte tipos NumPy/Pandas a tipos Python nativos para JSON"""
    if isinstance(obj, (np.integer, np.int64, np.int32)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64, np.float32)):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, pd.Series):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {key: convert_to_native(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_native(item) for item in obj]
    else:
        return obj


# ========================================
# FUNCIÓN PRINCIPAL DE ANÁLISIS
# ========================================

def analisis_completo():
    """
    Ejecuta todos los análisis requeridos por el documento
    """
    return {
        "1_descriptivo": analisis_descriptivo(),
        "2_crosstabs": crosstabs_analisis(),
        "3_regresion_logistica": regresion_logistica(),
        "4_temporal": preparar_analisis_temporal()
    }