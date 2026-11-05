from rest_framework import serializers
from .models import (
    Usuario, Cliente, Direccion, Oficio, Profesional,
    ExperienciaOficio, Certificacion, SolicitudServicio,
    Calificacion, Conversacion, Mensaje, Notificacion
)


class UsuarioSerializer(serializers.ModelSerializer):
    email = serializers.ReadOnlyField(source='user.email')
    nombre = serializers.ReadOnlyField(source='user.first_name')
    apellido = serializers.ReadOnlyField(source='user.last_name')

    class Meta:
        model = Usuario
        fields = ['id', 'user', 'email', 'nombre', 'apellido', 'telefono', 'fecha_alta', 'estado']


class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = '__all__'


class ClienteSerializer(serializers.ModelSerializer):
    perfil_usuario = UsuarioSerializer(source='usuario', read_only=True)
    direcciones = DireccionSerializer(many=True, read_only=True)

    class Meta:
        model = Cliente
        fields = ['usuario', 'perfil_usuario', 'calificaciones_emitidas', 'direcciones']


class OficioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oficio
        fields = '__all__'


class ExperienciaOficioSerializer(serializers.ModelSerializer):
    nombre_oficio = serializers.ReadOnlyField(source='oficio.nombre')

    class Meta:
        model = ExperienciaOficio
        fields = ['id', 'oficio', 'nombre_oficio', 'anios_experiencia']


class CertificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificacion
        fields = '__all__'


class ProfesionalSerializer(serializers.ModelSerializer):
    perfil_usuario = UsuarioSerializer(source='usuario', read_only=True)
    experiencias = ExperienciaOficioSerializer(many=True, read_only=True)
    certificaciones = CertificacionSerializer(many=True, read_only=True)

    class Meta:
        model = Profesional
        fields = [
            'usuario', 'perfil_usuario', 'estado_validacion', 'descripcion',
            'disponibilidad_horaria', 'puntaje_promedio', 'servicios_realizados',
            'localidad_base', 'radio_cobertura_km', 'experiencias', 'certificaciones'
        ]


class CalificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calificacion
        fields = '__all__'


class MensajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mensaje
        fields = '__all__'


class ConversacionSerializer(serializers.ModelSerializer):
    mensajes = MensajeSerializer(many=True, read_only=True)

    class Meta:
        model = Conversacion
        fields = ['id', 'solicitud', 'fecha_apertura', 'activa', 'mensajes']


class SolicitudServicioSerializer(serializers.ModelSerializer):
    cliente_info = ClienteSerializer(source='cliente', read_only=True)
    profesional_info = ProfesionalSerializer(source='profesional', read_only=True)
    oficio_nombre = serializers.ReadOnlyField(source='oficio.nombre')
    direccion_detalle = DireccionSerializer(source='direccion', read_only=True)
    calificacion = CalificacionSerializer(read_only=True)
    conversacion = ConversacionSerializer(read_only=True)

    class Meta:
        model = SolicitudServicio
        fields = '__all__'


class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'