from django.urls import path
from . import views

urlpatterns = [
    path('analisis/', views.obtener_analisis),
]
