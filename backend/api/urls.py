from django.urls import path
from . import views

urlpatterns = [
    path('import', views.import_excel, name='import_excel'),          # subir o reemplazar Excel
    path('survey/append', views.append_response, name='append_resp'), # agregar una fila
    path('summary', views.summary, name='summary'),                   # resumen p/ analítica
]
