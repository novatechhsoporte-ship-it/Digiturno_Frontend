import { apiFetch } from './client'

export interface AdminScopedUser {
  id: string
  nombre_completo: string
  email: string
  estado: boolean
}

export interface TurnoMetricsSummary {
  avg_wait_s: number
  avg_handle_s: number
  avg_cycle_s: number
  sla_within_percent?: number
  counts: { waiting: number; serving: number; done: number; canceled: number }
}

export interface TurnoMetricsSeriesPoint {
  date: string
  created: number
  attended: number
  finished: number
}

export interface TurnoMetricsByTramiteItem {
  id: string
  name: string
  count: number
  avg_wait_s: number
  avg_handle_s: number
}

export interface TurnoMetrics {
  summary: TurnoMetricsSummary
  series: TurnoMetricsSeriesPoint[]
  by_tramite: TurnoMetricsByTramiteItem[]
  last_turnos: Array<{
    numero: string
    tramite: string
    modulo?: string
    created_at: string
    started_at?: string
    finished_at?: string
    state: string
  }>
}

export const AdminAPI = {
  listUsers: (token: string) => apiFetch<AdminScopedUser[]>(`/admin/users`, { token }),
  createUser: (token: string, body: { nombre_completo: string; email: string; password: string; estado: boolean }) =>
    apiFetch<AdminScopedUser>(`/admin/users`, { method: 'POST', body, token }),
  updateUser: (token: string, id: string, body: Partial<{ nombre_completo: string; email: string; password: string; estado: boolean }>) =>
    apiFetch<AdminScopedUser>(`/admin/users/${id}`, { method: 'PUT', body, token }),
  deleteUser: (token: string, id: string) => apiFetch<void>(`/admin/users/${id}`, { method: 'DELETE', token }),
  deleteTenantLogo: (token: string) => apiFetch<void>(`/admin/tenant/logo`, { method: 'DELETE', token }),
  getMyTenant: (token: string) => apiFetch<{ id: string; nombre: string; nit?: string; logo_url?: string | null }>(`/admin/tenant`, { token }),
  getTurnoMetrics: (token: string, params: { from: string; to: string; moduloId?: string; tramite?: string }): Promise<TurnoMetrics> => {
    const qs = new URLSearchParams({ from: params.from, to: params.to })
    if (params.moduloId) qs.set('moduloId', params.moduloId)
    if (params.tramite) qs.set('tramite', params.tramite)
    return apiFetch<TurnoMetrics>(`/admin/metrics/turnos?${qs.toString()}`, { token })
  },
}
