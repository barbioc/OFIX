from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet, ClienteViewSet, DireccionViewSet,
    OficioViewSet, ProfesionalViewSet, ExperienciaOficioViewSet,
    CertificacionViewSet, SolicitudServicioViewSet,
    CalificacionViewSet, ConversacionViewSet, MensajeViewSet,
    NotificacionViewSet
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'direcciones', DireccionViewSet)
router.register(r'oficios', OficioViewSet)
router.register(r'profesionales', ProfesionalViewSet)
router.register(r'experiencias', ExperienciaOficioViewSet)
router.register(r'certificaciones', CertificacionViewSet)
router.register(r'solicitudes', SolicitudServicioViewSet)
router.register(r'calificaciones', CalificacionViewSet)
router.register(r'conversaciones', ConversacionViewSet)
router.register(r'mensajes', MensajeViewSet)
router.register(r'notificaciones', NotificacionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]