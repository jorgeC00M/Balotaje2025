import pandas as pd
from sklearn.linear_model import LogisticRegression

def analizar_datos():
    df = pd.read_excel('data/Encuesta_google.xlsx')

    conteo = df['Voto'].value_counts().to_dict()

    X = df[['Edad', 'Estrato']]
    y = (df['Voto'] == 'Rodrigo Paz').astype(int)

    modelo = LogisticRegression()
    modelo.fit(X, y)
    coef = dict(zip(X.columns, modelo.coef_[0]))

    return {'conteo': conteo, 'coeficientes': coef}
