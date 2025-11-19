import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/auth.store'
import LoginPage from '../pages/login/Login'
import CrearTurnoPublico from '../pages/public/CrearTurno'
import SeleccionTramitePublico from '../pages/public/SeleccionTramite'
import IdentificacionTurnoPublico from '../pages/public/IdentificacionTurno'
import KioskTurnoPublico from '../pages/public/KioskTurno'
import TenantsPage from '../pages/superadmin/Tenants.tsx'
import AdminsPage from '../pages/superadmin/Admins.tsx'
import AdminUsersPage from '../pages/admin/Users'
import AdminDashboardPage from '../pages/admin/Dashboard'
import UsuarioTurnosPage from '../pages/usuario/Turnos'
import UsuarioHistorialPage from '../pages/usuario/Historial'
import TramitesPublicosPage from '../pages/public/Tramites'
import DatosTurnoPublico from '../pages/public/DatosTurno'
import CedulaTurnoPublico from '../pages/public/CedulaTurno'
import { useTenant } from '../tenant/tenant.store'

function RoleGuard({ allow, children }: { allow: ('SuperAdmin'|'Admin'|'Usuario')[]; children: React.ReactNode }) {
  const { user, token, expiresAt } = useAuth()
  const isExpired = !expiresAt || Date.now() >= expiresAt
  const hasRoles = Array.isArray(user?.roles) && user!.roles.length > 0
  if (!token || !user || isExpired || !hasRoles) return <Navigate to="/login" replace />
  const ok = user.roles.some(r => allow.includes(r))
  return ok ? <>{children}</> : <Navigate to="/login" replace />
}

function Layout() {
  const navigate = useNavigate()
  const auth = useAuth()
  const location = useLocation()
  const isKiosk = new URLSearchParams(location.search).get('kiosk') === '1'
  const { logoUrl } = useTenant()
  const isLogin = location.pathname === '/login'
  const isPublic = location.pathname.startsWith('/public')
  const isUsersPage = location.pathname === '/admin'
  const roles: string[] = Array.isArray(auth.user?.roles) ? auth.user!.roles : []
  const isSuperAdmin = roles.includes('SuperAdmin')
  const isUsuario = roles.includes('Usuario')
  const shouldShowTenantLogo = !!logoUrl && !isSuperAdmin && !isUsuario
  return (
    <div className="min-h-screen flex flex-col">
      {!isKiosk && !isLogin && !isPublic && (
        <header className="w-full border-b bg-white">
          <style>{`
            #app-header { padding-left:16px; padding-right:16px; }
            @media (min-width: 768px) { #app-header { padding-left:48px; padding-right:48px; } }
            @media (min-width: 1280px) { #app-header { padding-left:72px; padding-right:72px; } }
          `}</style>
          <div id="app-header" className="container py-3" style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:24}}>
            <div style={{display:'flex', alignItems:'center', gap:16}}>
              <img src="/brand/novatechh.svg" alt="Novatechh" className="w-auto" style={{height: 150}} />
              {shouldShowTenantLogo && <div className="h-6 w-px bg-slate-200" />}
              {shouldShowTenantLogo ? (
                <img src={logoUrl!} alt="Tenant" className="w-auto" style={{height: 44, maxHeight: 44, objectFit:'contain'}} />
              ) : null}
            </div>
            <div>
              {auth.token && !isUsersPage && (
                 <button
                  onClick={() => { auth.logout(); navigate('/login', { replace: true }) }}
                  style={{
                    fontSize: 13,
                    padding: '8px 14px',
                    borderRadius: 12,
                    border: '1px solid #004584',
                    background: '#004584',
                    color: '#fff',
                    boxShadow: '0 2px 6px rgba(2,6,23,0.15)',
                    cursor: 'pointer'
                  }}
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          </div>
        </header>
      )}
      {!isKiosk && !isLogin && isPublic && (
        <header className="w-full border-b bg-white">
          <div className="container py-4" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
            <img src="/brand/novatechh.svg" alt="Novatechh" className="w-auto" style={{height: 100}} />
          </div>
        </header>
      )}
      <main className="container py-8" style={isKiosk ? { maxWidth: '1024px', fontSize: '20px' } : undefined}>
        <Outlet />
      </main>
    </div>
  )
}

function DashboardRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.roles.includes('SuperAdmin')) return <Navigate to="/superadmin" replace />
  if (user.roles.includes('Admin')) return <Navigate to="/admin" replace />
  return <Navigate to="/usuario" replace />
}

function Placeholder({ title }: { title: string }) {
  return <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'public/turno', element: <CrearTurnoPublico /> },
      { path: 'public/tramites', element: <SeleccionTramitePublico /> },
      { path: 'public/turno/identificacion', element: <IdentificacionTurnoPublico /> },
      { path: 'public/turno/kiosk', element: <KioskTurnoPublico /> },
      { path: 'public/turno/cedula', element: <CedulaTurnoPublico /> },
      { path: 'public/turno/datos', element: <DatosTurnoPublico /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'superadmin', element: <RoleGuard allow={["SuperAdmin"]}><TenantsPage /></RoleGuard> },
      { path: 'superadmin/:tenantId/admins', element: <RoleGuard allow={["SuperAdmin"]}><AdminsPage /></RoleGuard> },
      { path: 'admin', element: <RoleGuard allow={["Admin","SuperAdmin"]}><AdminUsersPage /></RoleGuard> },
      { path: 'admin/dashboard', element: <RoleGuard allow={["Admin","SuperAdmin"]}><AdminDashboardPage /></RoleGuard> },
      { path: 'usuario', element: <RoleGuard allow={["Usuario","Admin","SuperAdmin"]}><UsuarioTurnosPage /></RoleGuard> },
      { path: 'usuario/historial', element: <RoleGuard allow={["Usuario","Admin","SuperAdmin"]}><UsuarioHistorialPage /></RoleGuard> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default function AppRoutes() {
  return <RouterProvider router={router} />
}
