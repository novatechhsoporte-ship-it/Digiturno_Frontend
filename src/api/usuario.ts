import { apiFetch } from './client'

export type EstadoTurno = 'pendiente' | 'en_proceso' | 'finalizado' | 'corregido'

export interface Turno {
  id_turno: string
  numero_turno: string
  id_usuario?: string | null
  id_tramite: string
  id_tramite_correccion?: string | null
  estado: EstadoTurno
  fecha_creacion: string
  fecha_inicio?: string | null
  fecha_finalizacion?: string | null
  id_modulo?: string | null
}

export interface HistItem {
  numero_turno: string
  tramite: string
  estado: EstadoTurno
  fecha_inicio: string | null
  fecha_finalizacion: string | null
}

export const UsuarioAPI = {
  listTurnos: (
    token: string,
    params?: { id_modulo?: string; estado?: 'pendiente' | 'en_proceso'; fecha?: string }
  ) => {
    const q = new URLSearchParams()
    if (params?.id_modulo) q.set('id_modulo', params.id_modulo)
    if (params?.estado) q.set('estado', params.estado)
    if (params?.fecha) q.set('fecha', params.fecha)
    const qs = q.toString()
    const path = `/usuario/turnos${qs ? `?${qs}` : ''}`
    return apiFetch<Turno[]>(path, { token })
  },

  listTurnosByModulo: (
    token: string,
    id_modulo: string,
    params?: { estado?: 'pendiente' | 'en_proceso'; fecha?: string }
  ) => {
    const q = new URLSearchParams()
    if (params?.estado) q.set('estado', params.estado)
    if (params?.fecha) q.set('fecha', params.fecha)
    const qs = q.toString()
    const path = `/usuario/turnos/modulo/${encodeURIComponent(id_modulo)}${qs ? `?${qs}` : ''}`
    return apiFetch<Turno[]>(path, { token })
  },

  atenderTurno: (token: string, id_turno: string, id_usuario_funcionario: string) =>
    apiFetch<Turno>(`/usuario/turnos/${encodeURIComponent(id_turno)}/atender`, {
      method: 'POST',
      body: { id_usuario_funcionario },
      token,
    }),

  finalizarTurno: (token: string, id_turno: string) =>
    apiFetch<Turno>(`/usuario/turnos/${encodeURIComponent(id_turno)}/finalizar`, {
      method: 'POST',
      token,
    }),

  corregirTramite: (token: string, id_turno: string, id_tramite_correccion: string) =>
    apiFetch<Turno>(`/usuario/turnos/${encodeURIComponent(id_turno)}/corregir-tramite`, {
      method: 'PUT',
      body: { id_tramite_correccion },
      token,
    }),

  historial: (token: string, id_usuario_funcionario: string) =>
    apiFetch<HistItem[]>(`/usuario/turnos/historial/${encodeURIComponent(id_usuario_funcionario)}`, { token }),
}
