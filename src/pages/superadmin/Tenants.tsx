import React from 'react'
import { useAuth } from '../../auth/auth.store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SuperAdminAPI } from '../../api/superadmin'
import type { Tenant } from '../../api/superadmin'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'

export default function TenantsPage() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const qc = useQueryClient()

  const tenantsQ = useQuery({
    queryKey: ['tenants'],
    queryFn: () => SuperAdminAPI.listTenants(token!),
    enabled: !!token,
  })

  const createM = useMutation({
    mutationFn: (body: { nombre: string; nit: string }) => SuperAdminAPI.createTenant(token!, body),
    onSuccess: () => {
      toast.success('Tenant creado')
      setForm({ nombre: '', nit: '' })
      qc.invalidateQueries({ queryKey: ['tenants'] })
    },
    onError: (e: any) => {
      const msg = (e?.message || '').toLowerCase()
      if (msg.includes('duplicate') || msg.includes('unique') || msg.includes('nit')) {
        toast.error('El NIT ya está registrado')
      } else {
        toast.error(e?.message || 'Error al crear tenant')
      }
    },
  })

  const updateM = useMutation({
    mutationFn: (v: { id: string; body: Partial<Pick<Tenant,'nombre'|'nit'>> }) => SuperAdminAPI.updateTenant(token!, v.id, v.body),
    onSuccess: () => { toast.success('Tenant actualizado'); qc.invalidateQueries({ queryKey: ['tenants'] }) },
    onError: (e: any) => toast.error(e?.message || 'Error al actualizar tenant'),
  })

  const statusM = useMutation({
    mutationFn: (v: { id: string; estado: boolean }) => SuperAdminAPI.patchTenantStatus(token!, v.id, v.estado),
    onSuccess: () => { toast.success('Estado actualizado'); qc.invalidateQueries({ queryKey: ['tenants'] }) },
    onError: (e: any) => toast.error(e?.message || 'Error al actualizar estado'),
  })

  const [form, setForm] = React.useState({ nombre: '', nit: '' })
  const [query, setQuery] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(5)
  const [estadoFilter, setEstadoFilter] = React.useState<'all'|'activo'|'inactivo'>('all')
  const [showCreate, setShowCreate] = React.useState(false)

  const getTenantId = (t: any): string => (t?.id ?? t?.id_tenant ?? t?.tenantId ?? '')

  return (
    <div id="tenants-page" style={{display:'grid', gap:24}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');
        #tenants-page { padding-left:16px; padding-right:16px; }
        @media (min-width: 768px) { #tenants-page { padding-left:48px; padding-right:48px; } }
        @media (min-width: 1280px) { #tenants-page { padding-left:72px; padding-right:72px; } }
      `}</style>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:16}}>
        <div>
          <h1 style={{fontSize:28, fontWeight:600, color:'#004584', margin:0, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>Tenants</h1>
          <p style={{color:'#64748b', fontSize:13, marginTop:6, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>Gesti|ona empresa. NIT y estade. Crea. edita y acministria sus usuarios.</p>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{position:'relative'}}>
            <span style={{position:'absolute', left:12, top:10, color:'#94a3b8'}}>🔍</span>
            <input
              value={query}
              onChange={(e)=>{ setQuery(e.target.value); setPage(1) }}
              placeholder="Buscar por nombre, NIT o estado…"
              style={{border:'1px solid #cbd5e1', borderRadius:9999, padding:'10px 36px 10px 32px', width:300, outline:'none', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}
            />
          </div>
          <select value={estadoFilter} onChange={(e)=>{ setEstadoFilter(e.target.value as any); setPage(1) }}
            style={{border:'1px solid #cbd5e1', borderRadius:9999, padding:'10px 12px', outline:'none', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}>
            <option value="all">Todos</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
          <button type="button" onClick={()=>setShowCreate(s=>!s)}
            style={{
              display:'inline-flex', alignItems:'center', gap:8,
              color:'#fff', borderRadius:9999, padding:'10px 14px', cursor:'pointer',
              fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial', fontWeight:600,
              border: '1px solid #004584',
              background: '#004584',
              boxShadow: '0 2px 6px rgba(2,6,23,0.15)'
            }}>
            <span></span> <span>{showCreate ? 'Cerrar' : 'Crear socio'}</span>
          </button>
        </div>
      </div>

      {showCreate && (
      <form style={{display:'flex', flexWrap:'wrap', gap:12, alignItems:'center', background:'rgba(255,255,255,0.8)', backdropFilter:'blur(2px)', border:'1px solid #e2e8f0', borderRadius:12, padding:16, boxShadow:'0 1px 2px rgba(2,6,23,0.06)'}} onSubmit={(e) => {
        e.preventDefault()
        const exists = Array.isArray(tenantsQ.data) && tenantsQ.data.some(t => t.nit === form.nit)
        if (exists) {
          toast.error('El NIT ya está registrado')
          return
        }
        if (!form.nombre.trim() || !form.nit.trim()) {
          toast.error('Completa nombre y NIT')
          return
        }
        createM.mutate(form)
      }}>
        <input style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', width:256, outline:'none', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}} placeholder="Nombre" value={form.nombre} onChange={(e)=>setForm(s=>({...s,nombre:e.target.value}))} />
        <input style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', width:220, outline:'none', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}} placeholder="NIT" value={form.nit} onChange={(e)=>setForm(s=>({...s,nit:e.target.value}))} />
        <button disabled={createM.isPending} style={{
          display:'inline-flex', alignItems:'center', gap:8, color:'#fff', borderRadius:10, padding:'10px 14px',
          border: '1px solid #004584',
          background: '#004584',
          boxShadow: '0 2px 6px rgba(2,6,23,0.15)',
          opacity:createM.isPending?0.7:1,
          fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial', fontWeight:600
        }}>{createM.isPending?'Creando...':'Crear'}</button>
      </form>
      )}

      {tenantsQ.isLoading && <p>Cargando...</p>}
      {tenantsQ.error && <p className="text-red-600">Error: {(tenantsQ.error as any).message}</p>}

      {Array.isArray(tenantsQ.data) && tenantsQ.data.length === 0 && (
        <p className="text-slate-600">No hay tenants.</p>
      )}

      {Array.isArray(tenantsQ.data) && tenantsQ.data.length > 0 && (
        <div style={{overflowX:'auto', border:'1px solid #e2e8f0', borderRadius:12, boxShadow:'0 1px 2px rgba(2,6,23,0.06)', background:'#fff'}}>
          {(()=>{
            const raw = tenantsQ.data as any[]
            const q = query.trim().toLowerCase()
            let filtered = q ? raw.filter(t =>
              String(t?.nombre||'').toLowerCase().includes(q) || String(t?.nit||'').toLowerCase().includes(q) || String(t?.estado?'activo':'inactivo').includes(q)
            ) : raw
            if (estadoFilter !== 'all') {
              filtered = filtered.filter(t => (t?.estado ? 'activo' : 'inactivo') === estadoFilter)
            }
            const total = filtered.length
            const totalPages = Math.max(1, Math.ceil(total / pageSize))
            const safePage = Math.min(page, totalPages)
            const start = (safePage - 1) * pageSize
            const items = filtered.slice(start, start + pageSize)
            return (
              <>
                <table style={{minWidth:'100%', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}> 
                  <thead style={{background:'#f8fafc', textAlign:'left'}}>
                    <tr>
                      <th style={{padding:12, color:'#475569', fontSize:12, letterSpacing:0.4, fontWeight:700, borderBottom:'1px solid #e2e8f0', textTransform:'uppercase'}}>Nombre</th>
                      <th style={{padding:12, color:'#475569', fontSize:12, letterSpacing:0.4, fontWeight:700, borderBottom:'1px solid #e2e8f0', textTransform:'uppercase'}}>NIT</th>
                      <th style={{padding:12, color:'#475569', fontSize:12, letterSpacing:0.4, fontWeight:700, borderBottom:'1px solid #e2e8f0', textTransform:'uppercase'}}>Estado</th>
                      <th style={{padding:12, color:'#475569', fontSize:12, letterSpacing:0.4, fontWeight:700, borderBottom:'1px solid #e2e8f0', textTransform:'uppercase'}}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
              {items.map((t, idx) => (
                <tr key={getTenantId(t)} style={{background: idx % 2 ? '#f8fafc' : '#ffffff'}}>
                  <td style={{padding:12, borderBottom:'1px solid #e2e8f0'}}>
                    <InlineEdit value={t.nombre} onSave={(val)=>updateM.mutate({ id: getTenantId(t), body: { nombre: val } })} />
                  </td>
                  <td style={{padding:12, borderBottom:'1px solid #e2e8f0'}}>
                    <InlineEdit value={t.nit} onSave={(val)=>updateM.mutate({ id: getTenantId(t), body: { nit: val } })} />
                  </td>
                  <td style={{padding:12, borderBottom:'1px solid #e2e8f0'}}>
                    <span style={{fontSize:12, padding:'4px 10px', borderRadius:9999, fontWeight:600, color: t.estado ? '#047857' : '#991b1b', background: t.estado ? '#ecfdf5' : '#fee2e2', border: '1px solid ' + (t.estado ? '#a7f3d0' : '#fecaca')}}>
                      {t.estado ? '🟢 Activo' : '🔴 Inactivo'}
                    </span>
                  </td>
                  <td style={{padding:12, borderBottom:'1px solid #e2e8f0'}}>
                    <button title="Desactivar/Activar" onClick={()=>statusM.mutate({ id: getTenantId(t), estado: !t.estado })} style={{fontSize:14, border:'1px solid #cbd5e1', borderRadius:8, padding:'6px 10px', background:'#fff', cursor:'pointer', marginRight:8}}> 
                      {t.estado ? '🚫' : '✅'}
                    </button>
                    {getTenantId(t) ? (
                      <button title="Administrar usuarios" onClick={()=>{
                        const id = getTenantId(t)
                        navigate(`/superadmin/${encodeURIComponent(id)}/admins`, { state: { tenantId: id } })
                      }} style={{
                        display:'inline-flex', alignItems:'center', gap:6,
                        fontSize:13, color:'#0369a1', background:'#fff',
                        border:'1px solid #cbd5e1', borderRadius:9999, padding:'6px 12px', cursor:'pointer'
                      }}>
                        <span>🛠️</span>
                        <span>Admins</span>
                      </button>
                    ) : (
                      <button disabled style={{
                        display:'inline-flex', alignItems:'center', gap:6,
                        fontSize:13, opacity:0.6, background:'#fff',
                        border:'1px solid #e2e8f0', borderRadius:9999, padding:'6px 12px'
                      }} title="Este tenant no tiene un ID válido">
                        <span>🛠️</span>
                        <span>Admins</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
                  </tbody>
                </table>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:12, borderTop:'1px solid #e2e8f0'}}>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <span style={{fontSize:12, color:'#475569'}}>Mostrando {total === 0 ? 0 : (start+1)}–{Math.min(start+items.length, total)} de {total} registros</span>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:12}}>
                    <div style={{display:'flex', alignItems:'center', gap:6}}>
                      <span style={{fontSize:12, color:'#475569'}}>Filas:</span>
                      <select value={pageSize} onChange={(e)=>{ setPageSize(Number(e.target.value)); setPage(1) }} style={{border:'1px solid #cbd5e1', borderRadius:8, padding:'6px 8px'}}>
                        {[5,10,20,50].map(n=> <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <button disabled={safePage<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} style={{border:'1px solid #cbd5e1', borderRadius:9999, padding:'6px 12px', background:'#fff', cursor:'pointer', opacity: safePage<=1?0.5:1}}>Anterior</button>
                      <span style={{fontSize:12, color:'#475569'}}>Página {safePage} de {totalPages}</span>
                      <button disabled={safePage>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} style={{border:'1px solid #cbd5e1', borderRadius:9999, padding:'6px 12px', background:'#fff', cursor:'pointer', opacity: safePage>=totalPages?0.5:1}}>Siguiente</button>
                    </div>
                  </div>
                </div>
              </>
            )
          })()}
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
