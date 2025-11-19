import React from 'react'
import { useAuth } from '../../auth/auth.store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SuperAdminAPI } from '../../api/superadmin'
import type { AdminUser } from '../../api/superadmin'
import { toast } from 'sonner'
import { Link, useParams, useLocation } from 'react-router-dom'

export default function AdminsPage() {
  const { token } = useAuth()
  const { tenantId } = useParams<{ tenantId: string }>()
  const location = useLocation() as unknown as { state?: { tenantId?: string } }
  const stateTenantId = location?.state?.tenantId
  const effectiveTenantId = tenantId && tenantId !== 'undefined' ? tenantId : (stateTenantId || '')
  const qc = useQueryClient()

  const validTenantId = Boolean(effectiveTenantId)

  const adminsQ = useQuery({
    queryKey: ['admins', effectiveTenantId],
    queryFn: () => SuperAdminAPI.listAdmins(token!, effectiveTenantId!),
    enabled: !!token && validTenantId,
  })

  const createM = useMutation({
    mutationFn: (body: { nombre_completo: string; email: string; password: string }) => SuperAdminAPI.createAdmin(token!, effectiveTenantId!, body),
    onSuccess: () => { toast.success('Admin creado'); qc.invalidateQueries({ queryKey: ['admins', effectiveTenantId] }) },
    onError: (e: any) => {
      const msg = (e?.message || '').toLowerCase()
      if (msg.includes('uuid') || msg.includes('undefined')) {
        toast.error('No se encontró el tenant. Vuelve desde la lista de Tenants.')
      } else {
        toast.error(e?.message || 'Error al crear admin')
      }
    },
  })

  const updateM = useMutation({
    mutationFn: (v: { id: string; body: Partial<{ nombre_completo: string; email: string; password: string; estado: boolean }> }) => SuperAdminAPI.updateAdmin(token!, effectiveTenantId!, v.id, v.body),
    onSuccess: () => { toast.success('Admin actualizado'); qc.invalidateQueries({ queryKey: ['admins', effectiveTenantId] }) },
    onError: (e: any) => toast.error(e?.message || 'Error al actualizar admin'),
  })

  const deleteM = useMutation({
    mutationFn: (id: string) => SuperAdminAPI.deleteAdmin(token!, effectiveTenantId!, id),
    onSuccess: () => { toast.success('Admin eliminado'); qc.invalidateQueries({ queryKey: ['admins', effectiveTenantId] }) },
    onError: (e: any) => toast.error(e?.message || 'Error al eliminar admin'),
  })

  const [form, setForm] = React.useState({ nombre_completo: '', email: '', password: '' })

  if (!validTenantId) {
    return (
      <div className="space-y-3">
        <Link to="/superadmin" style={{
          display:'inline-flex', alignItems:'center', gap:8, color:'#004584', borderRadius:9999, padding:'8px 12px',
          border:'1px solid #004584', background:'#fff', textDecoration:'none'
        }}>← Volver a Tenants</Link>
        <p className="text-red-600">No se recibió un tenantId válido. Ingresa desde la página de Tenants.</p>
      </div>
    )
  }

  return (
    <div id="admins-page" style={{display:'grid', gap:24}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');
        #admins-page { padding-left:16px; padding-right:16px; }
        @media (min-width: 768px) { #admins-page { padding-left:48px; padding-right:48px; } }
        @media (min-width: 1280px) { #admins-page { padding-left:72px; padding-right:72px; } }
      `}</style>

      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:16}}>
        <div>
          <div style={{marginBottom:8}}>
            <Link to="/superadmin" style={{
              display:'inline-flex', alignItems:'center', gap:8, color:'#004584', borderRadius:9999, padding:'8px 12px',
              border:'1px solid #004584', background:'#fff', textDecoration:'none', fontSize:13, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial', fontWeight:600
            }}>← Volver a Tenants</Link>
          </div>
          <h1 style={{fontSize:28, fontWeight:600, color:'#004584', margin:0, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>Admins del tenant</h1>
          <p style={{color:'#64748b', fontSize:13, marginTop:6, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>Gestiona los administradores asociados al tenant</p>
        </div>
      </div>

      <form style={{display:'flex', flexWrap:'wrap', gap:12, alignItems:'center', background:'rgba(255,255,255,0.8)', border:'1px solid #e2e8f0', borderRadius:12, padding:16, boxShadow:'0 1px 2px rgba(2,6,23,0.06)'}} onSubmit={(e) => {
        e.preventDefault()
        if (!validTenantId) return
        if (!form.nombre_completo.trim() || !form.email.trim() || !form.password.trim()) {
          toast.error('Completa nombre, email y password')
          return
        }
        createM.mutate(form)
      }}>
        <input style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', width:260, outline:'none', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}} placeholder="Nombre completo" value={form.nombre_completo} onChange={(e)=>setForm(s=>({...s,nombre_completo:e.target.value}))} />
        <input style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', width:260, outline:'none', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}} placeholder="Email" value={form.email} onChange={(e)=>setForm(s=>({...s,email:e.target.value}))} />
        <input style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', width:220, outline:'none', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}} placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm(s=>({...s,password:e.target.value}))} />
        <button disabled={createM.isPending || !validTenantId} style={{
          display:'inline-flex', alignItems:'center', gap:8, color:'#fff', borderRadius:10, padding:'10px 14px',
          border: '1px solid #004584', background: '#004584', boxShadow: '0 2px 6px rgba(2,6,23,0.15)',
          opacity:(createM.isPending||!validTenantId)?0.7:1, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial', fontWeight:600
        }}>{createM.isPending?'Creando...':'Crear'}</button>
      </form>

      {adminsQ.isLoading && <p>Cargando...</p>}
      {adminsQ.error && <p style={{color:'#b91c1c'}}>Error: {(adminsQ.error as any).message}</p>}

      {Array.isArray(adminsQ.data) && adminsQ.data.length === 0 && (
        <p style={{color:'#475569'}}>No hay admins.</p>
      )}

      {Array.isArray(adminsQ.data) && adminsQ.data.length > 0 && (
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
              {adminsQ.data.map((u: any, idx: number) => (
                <tr key={u.id} style={{background: idx % 2 ? '#f8fafc' : '#ffffff'}}>
                  <td style={{padding:12, borderBottom:'1px solid #e2e8f0'}}><InlineEdit value={u.nombre_completo} onSave={(val)=>updateM.mutate({ id: u.id, body: { nombre_completo: val } })} /></td>
                  <td style={{padding:12, borderBottom:'1px solid #e2e8f0'}}><InlineEdit value={u.email} onSave={(val)=>updateM.mutate({ id: u.id, body: { email: val } })} /></td>
                  <td style={{padding:12, borderBottom:'1px solid #e2e8f0'}}>
                    <span style={{fontSize:12, padding:'4px 10px', borderRadius:9999, fontWeight:600, color: u.estado ? '#047857' : '#991b1b', background: u.estado ? '#ecfdf5' : '#fee2e2', border: '1px solid ' + (u.estado ? '#a7f3d0' : '#fecaca')}}>
                      {u.estado ? '🟢 Activo' : '🔴 Inactivo'}
                    </span>
                  </td>
                  <td style={{padding:12, borderBottom:'1px solid #e2e8f0'}}>
                    <button title="Desactivar/Activar" onClick={()=>updateM.mutate({ id: u.id, body: { estado: !u.estado } })} style={{fontSize:12, border:'1px solid #e2e8f0', borderRadius:8, height:28, padding:'0 12px', background:'#fff', cursor:'pointer', marginRight:8}}>
                      {u.estado ? 'Desactivar' : 'Activar'}
                    </button>
                    <button title="Eliminar" onClick={()=>deleteM.mutate(u.id)} style={{fontSize:12, border:'1px solid #fecaca', color:'#b91c1c', background:'#fff', borderRadius:8, height:28, padding:'0 12px', cursor:'pointer'}}>
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
