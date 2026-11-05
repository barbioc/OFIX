from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import (
    Usuario, Cliente, Direccion, Oficio, Profesional,
    ExperienciaOficio, Certificacion, SolicitudServicio,
    Calificacion, Conversacion, Mensaje, Notificacion
)
from .serializers import (
    UsuarioSerializer, ClienteSerializer, DireccionSerializer,
    OficioSerializer, ProfesionalSerializer, ExperienciaOficioSerializer,
    CertificacionSerializer, SolicitudServicioSerializer,
    CalificacionSerializer, ConversacionSerializer, MensajeSerializer,
    NotificacionSerializer
)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer


class DireccionViewSet(viewsets.ModelViewSet):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer


class OficioViewSet(viewsets.ModelViewSet):
    queryset = Oficio.objects.all()
    serializer_class = OficioSerializer


class ProfesionalViewSet(viewsets.ModelViewSet):
    queryset = Profesional.objects.all()
    serializer_class = ProfesionalSerializer


class ExperienciaOficioViewSet(viewsets.ModelViewSet):
    queryset = ExperienciaOficio.objects.all()
    serializer_class = ExperienciaOficioSerializer


class CertificacionViewSet(viewsets.ModelViewSet):
    queryset = Certificacion.objects.all()
    serializer_class = CertificacionSerializer


class SolicitudServicioViewSet(viewsets.ModelViewSet):
    queryset = SolicitudServicio.objects.all().order_by('-fecha_solicitud')
    serializer_class = SolicitudServicioSerializer


class CalificacionViewSet(viewsets.ModelViewSet):
    queryset = Calificacion.objects.all()
    serializer_class = CalificacionSerializer


class ConversacionViewSet(viewsets.ModelViewSet):
    queryset = Conversacion.objects.all()
    serializer_class = ConversacionSerializer


class MensajeViewSet(viewsets.ModelViewSet):
    queryset = Mensaje.objects.all().order_by('fecha_envio')
    serializer_class = MensajeSerializer


class NotificacionViewSet(viewsets.ModelViewSet):
    queryset = Notificacion.objects.all().order_by('-fecha_envio')
    serializer_class = NotificacionSerializer