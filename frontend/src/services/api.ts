const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Error ${response.status}: ${errorBody}`);
  }

  // 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ================= Interfaces =================

export interface Oficio {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface UsuarioDTO {
  id: number;
  user: number;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  fecha_alta: string;
  estado: string;
}

export interface Direccion {
  id?: number;
  cliente: number;
  calle: string;
  numero: string;
  localidad: string;
  cod_postal: string;
  latitud?: number;
  longitud?: number;
  es_principal: boolean;
}

export interface ClienteDTO {
  usuario: number;
  perfil_usuario?: UsuarioDTO;
  calificaciones_emitidas: number;
  direcciones?: Direccion[];
}

export interface ProfesionalDTO {
  usuario: number;
  perfil_usuario?: UsuarioDTO;
  estado_validacion: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  descripcion: string;
  disponibilidad_horaria: string;
  puntaje_promedio: number;
  servicios_realizados: number;
  localidad_base: string;
  radio_cobertura_km: number;
  experiencias?: { id: number; oficio: number; nombre_oficio: string; anios_experiencia: number }[];
  certificaciones?: any[];
}

export interface SolicitudServicioDTO {
  id?: number;
  cliente: number;
  profesional?: number | null;
  oficio: number;
  direccion: number;
  descripcion_problema: string;
  fecha_solicitud?: string;
  estado?: 'CREADA' | 'NOTIFICANDO' | 'ACEPTADA' | 'EN_CURSO' | 'FINALIZADA' | 'CANCELADA';
  fecha_visita_acordada?: string | null;
  es_urgente: boolean;
  completado_cliente?: boolean;
  completado_profesional?: boolean;
  oficio_nombre?: string;
  cliente_info?: ClienteDTO;
  profesional_info?: ProfesionalDTO;
  direccion_detalle?: Direccion;
}

export interface CalificacionDTO {
  id?: number;
  solicitud: number;
  puntaje: number;
  comentario: string;
  fecha?: string;
}

// ================= Métodos de API =================

export const api = {
  // Oficios
  getOficios: () => request<Oficio[]>('/oficios/'),

  // Profesionales
  getProfesionales: () => request<ProfesionalDTO[]>('/profesionales/'),
  getProfesional: (id: number) => request<ProfesionalDTO>(`/profesionales/${id}/`),

  // Clientes
  getClientes: () => request<ClienteDTO[]>('/clientes/'),
  getCliente: (id: number) => request<ClienteDTO>(`/clientes/${id}/`),

  // Direcciones
  getDirecciones: () => request<Direccion[]>('/direcciones/'),
  crearDireccion: (data: Direccion) =>
    request<Direccion>('/direcciones/', { method: 'POST', body: JSON.stringify(data) }),

  // Solicitudes
  getSolicitudes: () => request<SolicitudServicioDTO[]>('/solicitudes/'),
  getSolicitud: (id: number) => request<SolicitudServicioDTO>(`/solicitudes/${id}/`),
  crearSolicitud: (data: SolicitudServicioDTO) =>
    request<SolicitudServicioDTO>('/solicitudes/', { method: 'POST', body: JSON.stringify(data) }),
  actualizarSolicitud: (id: number, data: Partial<SolicitudServicioDTO>) =>
    request<SolicitudServicioDTO>(`/solicitudes/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Calificaciones
  crearCalificacion: (data: CalificacionDTO) =>
    request<CalificacionDTO>('/calificaciones/', { method: 'POST', body: JSON.stringify(data) }),
};