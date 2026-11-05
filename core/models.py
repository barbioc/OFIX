from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Usuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil_usuario')
    telefono = models.CharField(max_length=30)
    fecha_alta = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=50, default='ACTIVO')  # ACTIVO, INACTIVO, SUSPENDIDO

    class Meta:
        verbose_name = "Usuario Base"
        verbose_name_plural = "Usuarios Base"

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} ({self.user.email})"


class Cliente(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, primary_key=True, related_name='cliente')
    calificaciones_emitidas = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Cliente: {self.usuario}"


class Direccion(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='direcciones')
    calle = models.CharField(max_length=150)
    numero = models.CharField(max_length=20)
    localidad = models.CharField(max_length=100)
    cod_postal = models.CharField(max_length=20)
    latitud = models.FloatField(null=True, blank=True)
    longitud = models.FloatField(null=True, blank=True)
    es_principal = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.calle} {self.numero}, {self.localidad}"


class Oficio(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre


class Profesional(models.Model):
    class EstadoValidacion(models.TextChoices):
        PENDIENTE = 'PENDIENTE', 'Pendiente'
        APROBADO = 'APROBADO', 'Aprobado'
        RECHAZADO = 'RECHAZADO', 'Rechazado'

    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, primary_key=True, related_name='profesional')
    estado_validacion = models.CharField(
        max_length=20,
        choices=EstadoValidacion.choices,
        default=EstadoValidacion.PENDIENTE
    )
    descripcion = models.TextField(blank=True)
    disponibilidad_horaria = models.CharField(max_length=100, blank=True)
    puntaje_promedio = models.FloatField(default=0.0)
    servicios_realizados = models.PositiveIntegerField(default=0)
    localidad_base = models.CharField(max_length=100)
    radio_cobertura_km = models.PositiveIntegerField(default=10)

    def __str__(self):
        return f"Profesional: {self.usuario}"


class ExperienciaOficio(models.Model):
    profesional = models.ForeignKey(Profesional, on_delete=models.CASCADE, related_name='experiencias')
    oficio = models.ForeignKey(Oficio, on_delete=models.CASCADE, related_name='profesionales_con_experiencia')
    anios_experiencia = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('profesional', 'oficio')

    def __str__(self):
        return f"{self.profesional} - {self.oficio.nombre} ({self.anios_experiencia} años)"


class Certificacion(models.Model):
    class EstadoCert(models.TextChoices):
        PENDIENTE = 'PENDIENTE', 'Pendiente'
        VALIDADO = 'VALIDADO', 'Validado'
        RECHAZADO = 'RECHAZADO', 'Rechazado'

    profesional = models.ForeignKey(Profesional, on_delete=models.CASCADE, related_name='certificaciones')
    entidad_emisora = models.CharField(max_length=150)
    fecha_emision = models.DateField()
    estado = models.CharField(max_length=20, choices=EstadoCert.choices, default=EstadoCert.PENDIENTE)
    archivo_url = models.CharField(max_length=255)

    def __str__(self):
        return f"Certificación {self.entidad_emisora} - {self.profesional}"


class SolicitudServicio(models.Model):
    class EstadoSolicitud(models.TextChoices):
        CREADA = 'CREADA', 'Creada'
        NOTIFICANDO = 'NOTIFICANDO', 'Notificando'
        ACEPTADA = 'ACEPTADA', 'Aceptada'
        EN_CURSO = 'EN_CURSO', 'En curso'
        FINALIZADA = 'FINALIZADA', 'Finalizada'
        CANCELADA = 'CANCELADA', 'Cancelada'

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='solicitudes')
    profesional = models.ForeignKey(Profesional, on_delete=models.SET_NULL, null=True, blank=True, related_name='solicitudes_atendidas')
    oficio = models.ForeignKey(Oficio, on_delete=models.PROTECT, related_name='solicitudes')
    direccion = models.ForeignKey(Direccion, on_delete=models.PROTECT, related_name='solicitudes')
    descripcion_problema = models.TextField()
    fecha_solicitud = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=EstadoSolicitud.choices, default=EstadoSolicitud.CREADA)
    fecha_visita_acordada = models.DateTimeField(null=True, blank=True)
    es_urgente = models.BooleanField(default=False)
    completado_cliente = models.BooleanField(default=False)
    completado_profesional = models.BooleanField(default=False)

    def __str__(self):
        return f"Solicitud #{self.id} - {self.oficio.nombre} ({self.estado})"


class Calificacion(models.Model):
    solicitud = models.OneToOneField(SolicitudServicio, on_delete=models.CASCADE, related_name='calificacion')
    puntaje = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comentario = models.TextField(blank=True)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Calificación {self.puntaje}★ - Solicitud #{self.solicitud.id}"


class Conversacion(models.Model):
    solicitud = models.OneToOneField(SolicitudServicio, on_delete=models.CASCADE, related_name='conversacion')
    fecha_apertura = models.DateTimeField(auto_now_add=True)
    activa = models.BooleanField(default=True)

    def __str__(self):
        return f"Conversación Solicitud #{self.solicitud.id}"


class Mensaje(models.Model):
    conversacion = models.ForeignKey(Conversacion, on_delete=models.CASCADE, related_name='mensajes')
    emisor = models.CharField(max_length=50)  # 'CLIENTE' o 'PROFESIONAL'
    texto = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)
    leido = models.BooleanField(default=False)

    def __str__(self):
        return f"Mensaje de {self.emisor} ({self.fecha_envio.strftime('%d/%m %H:%M')})"


class Notificacion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='notificaciones')
    tipo = models.CharField(max_length=50)
    mensaje = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)
    leida = models.BooleanField(default=False)

    def __str__(self):
        return f"Notificación para {self.usuario.user.email} - {self.tipo}"