import { apiFetch } from './client'

export interface Tenant {
  id: string
  nombre: string
  nit: string
  estado?: boolean
  logoUrl?: string | null
}

export interface AdminUser {
  id: string
  nombre_completo: string
  email: string
  estado?: boolean
}

export const SuperAdminAPI = {
  // Tenants
  listTenants: (token: string) => apiFetch<Tenant[]>(`/superadmin/tenants`, { token }),
  createTenant: (token: string, body: { nombre: string; nit: string }) => apiFetch<Tenant>(`/superadmin/tenants`, { method: 'POST', body, token }),
  getTenant: (token: string, id: string) => apiFetch<Tenant>(`/superadmin/tenants/${id}`, { token }),
  updateTenant: (token: string, id: string, body: Partial<{ nombre: string; nit: string }>) => apiFetch<Tenant>(`/superadmin/tenants/${id}`, { method: 'PUT', body, token }),
  patchTenantStatus: (token: string, id: string, estado: boolean) => apiFetch<Tenant>(`/superadmin/tenants/${id}/status`, { method: 'PATCH', body: { estado }, token }),

  // Admins por tenant
  listAdmins: (token: string, tenantId: string) => apiFetch<AdminUser[]>(`/superadmin/tenants/${tenantId}/admins`, { token }),
  createAdmin: (token: string, tenantId: string, body: { nombre_completo: string; email: string; password: string }) => apiFetch<AdminUser>(`/superadmin/tenants/${tenantId}/admins`, { method: 'POST', body, token }),
  updateAdmin: (token: string, tenantId: string, id: string, body: Partial<{ nombre_completo: string; email: string; password: string; estado: boolean }>) => apiFetch<AdminUser>(`/superadmin/tenants/${tenantId}/admins/${id}`, { method: 'PUT', body, token }),
  deleteAdmin: (token: string, tenantId: string, id: string) => apiFetch<void>(`/superadmin/tenants/${tenantId}/admins/${id}`, { method: 'DELETE', token }),
}
