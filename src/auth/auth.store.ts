import { create } from 'zustand'

export type Role = 'SuperAdmin' | 'Admin' | 'Usuario'
export interface User {
  id: string
  email: string
  nombre: string
  roles: Role[]
  tenantId?: string
}

interface AuthState {
  token: string | null
  user: User | null
  expiresAt: number | null
  login: (token: string, user: User, ttlMinutes?: number) => void
  logout: () => void
}

const TTL_DEFAULT_MINUTES = 15

export const useAuth = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  expiresAt: null,
  login: (token, user, ttlMinutes = TTL_DEFAULT_MINUTES) => {
    const expiresAt = Date.now() + ttlMinutes * 60 * 1000
    localStorage.setItem('auth', JSON.stringify({ token, user, expiresAt }))
    set({ token, user, expiresAt })
  },
  logout: () => {
    localStorage.removeItem('auth')
    set({ token: null, user: null, expiresAt: null })
  },
}))

// Rehydrate from storage
const raw = localStorage.getItem('auth')
if (raw) {
  try {
    const { token, user, expiresAt } = JSON.parse(raw)
    if (expiresAt && Date.now() < expiresAt) {
      useAuth.setState({ token, user, expiresAt })
    } else {
      localStorage.removeItem('auth')
    }
  } catch {
    localStorage.removeItem('auth')
  }
}

// Auto-logout on expiry
setInterval(() => {
  const { expiresAt } = useAuth.getState()
  if (expiresAt && Date.now() >= expiresAt) {
    useAuth.getState().logout()
  }
}, 1000 * 30)
