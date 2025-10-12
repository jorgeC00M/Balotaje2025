from django.contrib import admin # 
from django.urls import path, include
from django.http import HttpResponse  # 👈 agrega esto

def home(request):
    return HttpResponse("Backend del sistema de encuestas funcionando correctamente ✅")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', home),  # 👈 esto maneja la ruta raíz "/"
]
