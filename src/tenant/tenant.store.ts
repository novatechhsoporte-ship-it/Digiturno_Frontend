import { create } from 'zustand'

interface TenantState {
  logoUrl: string
  setLogoUrl: (url: string, tenantId?: string) => void
}

function getCurrentTenantIdFromStorage(): string | undefined {
  if (typeof localStorage === 'undefined') return undefined
  try {
    const raw = localStorage.getItem('auth')
    if (!raw) return undefined
    const parsed = JSON.parse(raw) as { user?: { tenantId?: string } }
    return parsed?.user?.tenantId || undefined
  } catch {
    return undefined
  }
}

function getLogoKey(tenantId?: string) {
  return tenantId ? `tenant_logo_url_${tenantId}` : 'tenant_logo_url'
}

function getInitialLogoUrl(): string {
  if (typeof localStorage === 'undefined') return ''
  try {
    const tenantId = getCurrentTenantIdFromStorage()
    const key = getLogoKey(tenantId)
    return localStorage.getItem(key) || ''
  } catch {
    return ''
  }
}

export const useTenant = create<TenantState>((set) => ({
  logoUrl: getInitialLogoUrl(),
  setLogoUrl: (url: string, tenantId?: string) => {
    try {
      const effectiveTenantId = tenantId ?? getCurrentTenantIdFromStorage()
      const key = getLogoKey(effectiveTenantId)
      localStorage.setItem(key, url)
    } catch {}
    set({ logoUrl: url })
  },
}))
