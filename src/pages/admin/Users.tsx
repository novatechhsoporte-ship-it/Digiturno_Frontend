import React from 'react'
import TenantLogoUploader from '../../components/TenantLogoUploader'
import { useTenant } from '../../tenant/tenant.store'
import { useAuth } from '../../auth/auth.store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AdminAPI } from '../../api/admin'
import { SuperAdminAPI } from '../../api/superadmin'
import { toast } from 'sonner'

export default function AdminUsersPage() {
  const { token, user, logout } = useAuth()
  const qc = useQueryClient()
  const { setLogoUrl } = useTenant()
  const getUserId = React.useCallback((u: any) => (u?.id || u?.id_usuario || u?.userId || ''), [])

  const usersQ = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => AdminAPI.listUsers(token!),
    enabled: !!token,
  })

  // Nombre del tenant para el encabezado (evitar 403 con tokens Admin):
  const tenantId = user?.tenantId
  const isSuperAdmin = Array.isArray(user?.roles) && user!.roles.includes('SuperAdmin')
  const cachedTenantName = (typeof localStorage !== 'undefined' && localStorage.getItem('tenant_name')) || ''
  const tenantQ = useQuery({
    queryKey: ['tenant-name', tenantId],
    queryFn: async () => {
      if (!tenantId) return ''
      if (isSuperAdmin) {
        const t = await SuperAdminAPI.getTenant(token!, tenantId)
        try { localStorage.setItem('tenant_name', t.nombre || '') } catch {}
        return t.nombre || ''
      }
      const t = await AdminAPI.getMyTenant(token!)
      try { localStorage.setItem('tenant_name', t.nombre || '') } catch {}
      return t.nombre || ''
    },
    enabled: !!token && !!tenantId,
    staleTime: 5 * 60 * 1000,
  })

  const createM = useMutation({
    mutationFn: (body: { nombre_completo: string; email: string; password: string; estado: boolean }) => AdminAPI.createUser(token!, body),
    onSuccess: () => { toast.success('Usuario creado'); setForm({ nombre_completo: '', email: '', password: '', estado: true }); qc.invalidateQueries({ queryKey: ['admin-users'] }) },
    onError: (e: any) => toast.error(e?.message || 'Error al crear usuario'),
  })

  const updateM = useMutation({
    mutationFn: (v: { id: string; body: Partial<{ nombre_completo: string; email: string; password: string; estado: boolean }> }) => AdminAPI.updateUser(token!, v.id, v.body),
    onSuccess: () => { toast.success('Usuario actualizado'); qc.invalidateQueries({ queryKey: ['admin-users'] }) },
    onError: (e: any) => toast.error(e?.message || 'Error al actualizar usuario'),
  })

  const deleteM = useMutation({
    mutationFn: (id: string) => AdminAPI.deleteUser(token!, id),
    onSuccess: () => { toast.success('Usuario eliminado'); qc.invalidateQueries({ queryKey: ['admin-users'] }) },
    onError: (e: any) => toast.error(e?.message || 'Error al eliminar usuario'),
  })

  const deleteLogoM = useMutation({
    mutationFn: () => AdminAPI.deleteTenantLogo(token!),
    onSuccess: () => { toast.success('Logo eliminado'); setLogoUrl('') },
    onError: (e: any) => toast.error(e?.message || 'Error al eliminar logo'),
  })

  const [form, setForm] = React.useState({ nombre_completo: '', email: '', password: '', estado: true })
  const [actionsOpen, setActionsOpen] = React.useState(false)

  return (
    <div id="admin-users-page" style={{display:'grid', gap:24}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');
        #admin-users-page { padding-left:16px; padding-right:16px; }
        @media (min-width: 768px) { #admin-users-page { padding-left:48px; padding-right:48px; } }
        @media (min-width: 1280px) { #admin-users-page { padding-left:72px; padding-right:72px; } }
      `}</style>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:24, flexWrap:'wrap'}}>
        <div>
          <h1 style={{fontSize:28, fontWeight:600, color:'#004584', margin:0, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>
            {(() => {
              const name = (tenantQ.data && String(tenantQ.data).trim()) || cachedTenantName
              return name ? `${name} - Usuarios` : 'Admin - Usuarios'
            })()}
          </h1>
          <p style={{color:'#64748b', fontSize:13, marginTop:6, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>Usuarios del tenant</p>
        </div>
        <div style={{position:'relative', display:'flex', alignItems:'center', flexWrap:'wrap'}}>
          <button
            type="button"
            onClick={()=>setActionsOpen(o=>!o)}
            style={{
              display:'inline-flex', alignItems:'center', gap:8, color:'#fff', borderRadius:9999, padding:'8px 14px', cursor:'pointer',
              border:'1px solid #004584', background:'#004584', boxShadow:'0 2px 6px rgba(2,6,23,0.15)',
              fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial', fontWeight:600
            }}
          >
            Opciones
          </button>
          {actionsOpen && (
            <div
              style={{
                position:'absolute', top:'110%', right:0, minWidth:190,
                background:'#fff', borderRadius:12, border:'1px solid #e2e8f0',
                boxShadow:'0 10px 30px rgba(15,23,42,0.18)', padding:8,
                zIndex:10
              }}
            >
              <button
                type="button"
                onClick={() => { window.location.href = '/admin/dashboard' }}
                style={{
                  width:'100%', textAlign:'left', padding:'8px 10px',
                  border:'none', background:'transparent', cursor:'pointer',
                  borderRadius:8, fontSize:13,
                  fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'
                }}
              >
                Ir al dashboard
              </button>
              <button
                type="button"
                onClick={()=>{
                  if (deleteLogoM.isPending) return
                  if (window.confirm('¿Eliminar logo del tenant?')) deleteLogoM.mutate()
                }}
                disabled={deleteLogoM.isPending}
                style={{
                  width:'100%', textAlign:'left', padding:'8px 10px',
                  border:'none', background:'transparent', cursor:'pointer',
                  borderRadius:8, fontSize:13,
                  fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'
                }}
              >
                Eliminar logo
              </button>
              <button
                type="button"
                onClick={() => { logout(); window.location.href = '/login' }}
                style={{
                  width:'100%', textAlign:'left', padding:'8px 10px',
                  border:'none', background:'transparent', cursor:'pointer',
                  borderRadius:8, fontSize:13, color:'#b91c1c',
                  fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'
                }}
              >
                Cerrar sesión
              </button>
              <div style={{marginTop:6}}>
                <TenantLogoUploader showPreview={false} />
              </div>
            </div>
          )}
        </div>
      </div>

      <form style={{display:'flex', flexWrap:'wrap', gap:12, alignItems:'center', background:'rgba(255,255,255,0.8)', border:'1px solid #e2e8f0', borderRadius:12, padding:16, boxShadow:'0 1px 2px rgba(2,6,23,0.06)'}} onSubmit={(e)=>{ e.preventDefault();
        if (!form.nombre_completo.trim() || !form.email.trim() || !form.password.trim()) { toast.error('Completa nombre, email y password'); return }
        createM.mutate(form)
      }}>
        <input style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', width:260, outline:'none', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}} placeholder="Nombre completo" value={form.nombre_completo} onChange={(e)=>setForm(s=>({...s,nombre_completo:e.target.value}))} />
        <input style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', width:260, outline:'none', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}} placeholder="Email" value={form.email} onChange={(e)=>setForm(s=>({...s,email:e.target.value}))} />
        <input style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', width:220, outline:'none', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}} placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm(s=>({...s,password:e.target.value}))} />
        <label style={{display:'inline-flex', alignItems:'center', gap:8, fontSize:13}}><input type="checkbox" checked={form.estado} onChange={(e)=>setForm(s=>({...s,estado:e.target.checked}))}/> Activo</label>
        <button disabled={createM.isPending} style={{
          display:'inline-flex', alignItems:'center', gap:8, color:'#fff', borderRadius:10, padding:'10px 14px',
          border: '1px solid #004584', background: '#004584', boxShadow: '0 2px 6px rgba(2,6,23,0.15)',
          opacity:createM.isPending?0.7:1, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial', fontWeight:600
        }}>{createM.isPending?'Creando...':'Crear'}</button>
      </form>

      {usersQ.isLoading && <p>Cargando...</p>}
      {usersQ.error && <p className="text-red-600">Error: {(usersQ.error as any).message}</p>}

      {Array.isArray(usersQ.data) && usersQ.data.length === 0 && (
        <p className="text-slate-600">No hay usuarios.</p>
      )}

      {Array.isArray(usersQ.data) && usersQ.data.length > 0 && (
        <div style={{overflowX:'auto', border:'1px solid #e2e8f0', borderRadius:12, boxShadow:'0 1px 2px rgba(2,6,23,0.06)', background:'#fff'}}>
          <table style={{minWidth:'100%', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}>
            <thead style={{background:'#f8fafc', textAlign:'left'}}>
              <tr>
                <th style={{padding:12, color:'#475569', fontSize:12, letterSpacing:0.4, fontWeight:700, borderBottom:'1px solid #e2e8f0', textTransform:'uppercase'}}>Nombre</th>
                <th style={{padding:12, color:'#475569', fontSize:12, letterSpacing:0.4, fontWeight:700, borderBottom:'1px solid #e2e8f0', textTransform:'uppercase'}}>Email</th>
                <th style={{padding:12, color:'#475569', fontSize:12, letterSpacing:0.4, fontWeight:700, borderBottom:'1px solid #e2e8f0', textTransform:'uppercase'}}>Estado</th>
                <th style={{padding:12, color:'#475569', fontSize:12, letterSpacing:0.4, fontWeight:700, borderBottom:'1px solid #e2e8f0', textTransform:'uppercase'}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usersQ.data.map((u: any) => (
                <tr key={`${getUserId(u) || u.email || ''}-${u.email || ''}`} className="odd:bg-white even:bg-slate-50">
                  <td className="p-2 border"><InlineEdit value={u.nombre_completo} onSave={(val)=>updateM.mutate({ id: getUserId(u), body: { nombre_completo: val } })} /></td>
                  <td className="p-2 border"><InlineEdit value={u.email} onSave={(val)=>updateM.mutate({ id: getUserId(u), body: { email: val } })} /></td>
                  <td className="p-2 border">
                    <span
                      style={{
                        fontSize:12,
                        padding:'4px 10px',
                        borderRadius:9999,
                        fontWeight:600,
                        background: u.estado ? '#ecfdf5' : '#fff7ed',
                        color: u.estado ? '#047857' : '#b45309',
                        border: '1px solid',
                        borderColor: u.estado ? '#a7f3d0' : '#fed7aa',
                        boxShadow:'0 1px 2px rgba(2,6,23,0.04)'
                      }}
                    >
                      {u.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={()=>updateM.mutate({ id: getUserId(u), body: { estado: !u.estado } })}
                      style={{fontSize:12, fontWeight:600, border:'1px solid #e2e8f0', borderRadius:8, height:28, padding:'0 12px', background:'#fff', cursor:'pointer', boxShadow:'0 1px 2px rgba(2,6,23,0.04)'}}
                    >
                      {u.estado ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={()=>deleteM.mutate(getUserId(u))}
                      style={{fontSize:12, fontWeight:600, border:'1px solid #fecaca', color:'#b91c1c', background:'#fff', borderRadius:8, height:28, padding:'0 12px', cursor:'pointer', boxShadow:'0 1px 2px rgba(2,6,23,0.04)'}}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function InlineEdit({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = React.useState(false)
  const [val, setVal] = React.useState(value)
  React.useEffect(()=>setVal(value),[value])
  if (!editing) return (
    <div style={{display:'flex', alignItems:'center', gap:8}}>
      <span>{value}</span>
      <button
        title="Editar"
        onClick={()=>setEditing(true)}
        style={{
          fontSize:12,
          display:'inline-flex', alignItems:'center', gap:6,
          height:28, padding:'0 12px',
          border:'1px solid #e2e8f0', borderRadius:8,
          background:'#fff', color:'#0f172a', cursor:'pointer', boxShadow:'0 1px 2px rgba(2,6,23,0.04)'
        }}
      >
        ✏️ Editar
      </button>
    </div>
  )
  return (
    <div style={{display:'flex', alignItems:'center', gap:8}}>
      <input style={{border:'1px solid #cbd5e1', borderRadius:8, padding:'6px 8px', outline:'none'}} value={val} onChange={(e)=>setVal(e.target.value)} />
      <button
        title="Guardar"
        style={{fontSize:12, display:'inline-flex', alignItems:'center', height:28, padding:'0 12px', border:'1px solid #22c55e', background:'#10b981', color:'#fff', borderRadius:8, cursor:'pointer'}}
        onClick={()=>{ onSave(val); setEditing(false) }}>Guardar</button>
      <button
        title="Cancelar"
        style={{fontSize:12, display:'inline-flex', alignItems:'center', height:28, padding:'0 12px', border:'1px solid #e2e8f0', background:'#fff', color:'#0f172a', borderRadius:8, cursor:'pointer'}}
        onClick={()=>{ setVal(value); setEditing(false) }}>Cancelar</button>
    </div>
  )
}
