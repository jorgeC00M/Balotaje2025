#from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .analysis import analizar_datos

@api_view(['GET'])
def obtener_analisis(request):
    datos = analizar_datos()
    return Response(datos)
