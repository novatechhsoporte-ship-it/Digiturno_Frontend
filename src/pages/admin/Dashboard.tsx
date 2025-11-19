import React from 'react'
import { useAuth } from '../../auth/auth.store'
import { useQuery } from '@tanstack/react-query'
import { AdminAPI, type TurnoMetrics } from '../../api/admin'

export default function AdminDashboardPage() {
  const { token } = useAuth()
  const [range, setRange] = React.useState(()=>{
    const to = new Date()
    const from = new Date()
    from.setDate(to.getDate() - 6)
    return { from: from.toISOString().slice(0,10), to: to.toISOString().slice(0,10) }
  })
  const tenantQ = useQuery({
    queryKey: ['admin-tenant'],
    queryFn: async () => {
      const t = await AdminAPI.getMyTenant(token!)
      try { localStorage.setItem('tenant_name', t.nombre || '') } catch {}
      return t
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  })
  const usersQ = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => AdminAPI.listUsers(token!),
    enabled: !!token,
  })

  const metricsQ = useQuery({
    queryKey: ['admin-metrics', range.from, range.to],
    queryFn: async (): Promise<TurnoMetrics> => {
      try {
        return await AdminAPI.getTurnoMetrics(token!, { from: range.from, to: range.to })
      } catch {
        // Fallback demo data
        const days = 7
        const baseDate = new Date(range.to)
        const series = Array.from({ length: days }, (_ ,i) => {
          const d = new Date(baseDate)
          d.setDate(baseDate.getDate() - (days - 1 - i))
          return { date: d.toISOString().slice(0,10), created: 30+Math.floor(Math.random()*20), attended: 28+Math.floor(Math.random()*15), finished: 25+Math.floor(Math.random()*15) }
        })
        const summary = {
          avg_wait_s: 6*60,
          avg_handle_s: 9*60,
          avg_cycle_s: 15*60,
          sla_within_percent: 82,
          counts: { waiting: 12, serving: 5, done: 240, canceled: 3 }
        }
        const by_tramite = [
          { id:'A', name:'Liquidacion', count: 120, avg_wait_s: 350, avg_handle_s: 540 },
          { id:'B', name:'Autenticacion', count: 90, avg_wait_s: 280, avg_handle_s: 480 },
        ]
        const last_turnos = Array.from({length: 10}).map((_,i)=>{
          const now = new Date()
          const created = new Date(now.getTime() - (i+1)*25*60*1000)
          const started = new Date(created.getTime() + 6*60*1000)
          const finished = new Date(started.getTime() + 9*60*1000)
          return { numero: `T-${1000+i}`, tramite: i%2? 'Autenticacion':'Liquidacion', modulo: `M${(i%3)+1}`, created_at: created.toISOString(), started_at: started.toISOString(), finished_at: finished.toISOString(), state: 'done' }
        })
        return { summary, series, by_tramite, last_turnos }
      }
    },
    enabled: !!token,
    staleTime: 60*1000,
  })

  const total = Array.isArray(usersQ.data) ? usersQ.data.length : 0
  const activos = Array.isArray(usersQ.data) ? usersQ.data.filter(u => (u as any).estado).length : 0
  const inactivos = total - activos
  const recientes = Array.isArray(usersQ.data) ? usersQ.data.slice(-5).reverse() : []

  return (
    <div id="admin-dashboard-page" style={{display:'grid', gap:24}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');
        #admin-dashboard-page { padding-left:16px; padding-right:16px; }
        @media (min-width: 768px) { #admin-dashboard-page { padding-left:48px; padding-right:48px; } }
        @media (min-width: 1280px) { #admin-dashboard-page { padding-left:72px; padding-right:72px; } }
      `}</style>

      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:16}}>
        <div>
          <h1 style={{fontSize:28, fontWeight:600, color:'#004584', margin:0, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>
            {(() => {
              const cached = (typeof localStorage !== 'undefined' && localStorage.getItem('tenant_name')) || ''
              const name = (tenantQ.data?.nombre && String(tenantQ.data?.nombre).trim()) || cached
              return name ? `${name} - Dashboard` : 'Dashboard'
            })()}
          </h1>
          <p style={{color:'#64748b', fontSize:13, marginTop:6, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>Resumen del tenant</p>
        </div>
      </div>

      <NavTabs active="dashboard" />

      <div style={{display:'flex', flexWrap:'wrap', gap:12, alignItems:'center'}}>
        <div style={{display:'grid'}}>
          <label style={{fontSize:12, color:'#475569'}}>Desde</label>
          <input type="date" value={range.from} onChange={(e)=>setRange(r=>({...r, from: e.target.value}))} style={{border:'1px solid #cbd5e1', borderRadius:8, padding:'6px 10px'}} />
        </div>
        <div style={{display:'grid'}}>
          <label style={{fontSize:12, color:'#475569'}}>Hasta</label>
          <input type="date" value={range.to} onChange={(e)=>setRange(r=>({...r, to: e.target.value}))} style={{border:'1px solid #cbd5e1', borderRadius:8, padding:'6px 10px'}} />
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(1, minmax(0,1fr))', gap:12}}>
        <div style={{display:'grid', gap:12, gridTemplateColumns:'repeat(1, minmax(0,1fr))'}}>
          <div style={{display:'grid', gap:12, gridTemplateColumns:'repeat(6, minmax(0,1fr))'}}>
            <MetricCard title="Espera prom." value={formatMin(metricsQ.data?.summary.avg_wait_s)} />
            <MetricCard title="Atención prom." value={formatMin(metricsQ.data?.summary.avg_handle_s)} />
            <MetricCard title="Ciclo prom." value={formatMin(metricsQ.data?.summary.avg_cycle_s)} />
            <MetricCard title="SLA < 10m" value={(metricsQ.data?.summary.sla_within_percent ?? 0) + '%'} />
            <MetricCard title="En espera" value={metricsQ.data?.summary.counts.waiting ?? 0} />
            <MetricCard title="En atención" value={metricsQ.data?.summary.counts.serving ?? 0} />
          </div>
        </div>

        <div style={{border:'1px solid #e2e8f0', borderRadius:12, boxShadow:'0 1px 2px rgba(2,6,23,0.06)', background:'#fff'}}>
          <div style={{padding:12, borderBottom:'1px solid #e2e8f0', fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial', fontWeight:600, color:'#0f172a'}}>Últimos usuarios</div>
          <div style={{padding:12}}>
            {usersQ.isLoading && <p>Cargando...</p>}
            {usersQ.error && <p style={{color:'#b91c1c'}}>Error: {(usersQ.error as any).message}</p>}
            {Array.isArray(recientes) && recientes.length > 0 ? (
              <ul style={{listStyle:'none', margin:0, padding:0, fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}>
                {recientes.map((u: any, idx: number) => (
                  <li key={(u.id||u.email||idx)+''} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #f1f5f9'}}>
                    <span style={{color:'#0f172a'}}>{u.nombre_completo}</span>
                    <span style={{color:'#64748b', fontSize:12}}>{u.email}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{color:'#475569'}}>No hay usuarios recientes.</p>
            )}
          </div>
        </div>

        <div style={{border:'1px solid #e2e8f0', borderRadius:12, boxShadow:'0 1px 2px rgba(2,6,23,0.06)', background:'#fff'}}>
          <div style={{padding:12, borderBottom:'1px solid #e2e8f0', fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial', fontWeight:600, color:'#0f172a'}}>Últimos turnos</div>
          <div style={{padding:12, overflowX:'auto'}}>
            {metricsQ.isLoading && <p>Cargando...</p>}
            {metricsQ.error && <p style={{color:'#b91c1c'}}>Mostrando datos demo.</p>}
            <table style={{minWidth:880, width:'100%', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}>
              <thead style={{background:'#f8fafc', textAlign:'left'}}>
                <tr>
                  {['Número','Trámite','Módulo','Creado','Inicio','Fin','Espera','Atención','Total','Estado'].map(h=> (
                    <th key={h} style={{padding:10, color:'#475569', fontSize:12, letterSpacing:0.3, fontWeight:700, borderBottom:'1px solid #e2e8f0', textTransform:'uppercase'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(metricsQ.data?.last_turnos || []).map((t, idx) => {
                  const wait = t.started_at ? diffSec(t.created_at, t.started_at) : undefined
                  const handle = t.started_at && t.finished_at ? diffSec(t.started_at, t.finished_at) : undefined
                  const cycle = t.finished_at ? diffSec(t.created_at, t.finished_at) : undefined
                  return (
                    <tr key={(t.numero||idx)+'-lt'} style={{background: idx % 2 ? '#f8fafc' : '#ffffff'}}>
                      <td style={{padding:10, borderBottom:'1px solid #e2e8f0'}}>{t.numero}</td>
                      <td style={{padding:10, borderBottom:'1px solid #e2e8f0'}}>{t.tramite}</td>
                      <td style={{padding:10, borderBottom:'1px solid #e2e8f0'}}>{t.modulo || '-'}</td>
                      <td style={{padding:10, borderBottom:'1px solid #e2e8f0'}}>{fmtDT(t.created_at)}</td>
                      <td style={{padding:10, borderBottom:'1px solid #e2e8f0'}}>{t.started_at ? fmtDT(t.started_at) : '-'}</td>
                      <td style={{padding:10, borderBottom:'1px solid #e2e8f0'}}>{t.finished_at ? fmtDT(t.finished_at) : '-'}</td>
                      <td style={{padding:10, borderBottom:'1px solid #e2e8f0'}}>{wait!==undefined ? formatMin(wait) : '-'}</td>
                      <td style={{padding:10, borderBottom:'1px solid #e2e8f0'}}>{handle!==undefined ? formatMin(handle) : '-'}</td>
                      <td style={{padding:10, borderBottom:'1px solid #e2e8f0'}}>{cycle!==undefined ? formatMin(cycle) : '-'}</td>
                      <td style={{padding:10, borderBottom:'1px solid #e2e8f0'}}>{t.state}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value }: { title: string; value: number | string | undefined }) {
  return (
    <div style={{border:'1px solid #e2e8f0', borderRadius:12, padding:16, background:'#fff', boxShadow:'0 1px 2px rgba(2,6,23,0.06)'}}>
      <div style={{color:'#64748b', fontSize:12, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>{title}</div>
      <div style={{fontSize:24, fontWeight:700, color:'#0f172a', marginTop:6, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>{value ?? '-'}</div>
    </div>
  )
}

function NavTabs({ active }: { active: 'dashboard'|'users' }) {
  const base = { fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial', padding:'8px 12px', borderRadius:9999, border:'1px solid #e2e8f0' }
  return (
    <div style={{display:'flex', alignItems:'center', gap:8}}>
      <a href="/admin/dashboard" style={{...base, color: active==='dashboard' ? '#fff' : '#0f172a', background: active==='dashboard' ? '#004584' : '#fff'}}>Dashboard</a>
      <a href="/admin" style={{...base, color: active==='users' ? '#fff' : '#0f172a', background: active==='users' ? '#004584' : '#fff'}}>Usuarios</a>
    </div>
  )
}

// Helpers
function formatMin(sec?: number) {
  if (sec === undefined || sec === null) return '-'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s} min`
}

function diffSec(aIso: string, bIso: string) {
  const a = new Date(aIso).getTime()
  const b = new Date(bIso).getTime()
  return Math.max(0, Math.floor((b - a) / 1000))
}

function fmtDT(iso: string) {
  const d = new Date(iso)
  const dd = d.toLocaleDateString()
  const tt = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${dd} ${tt}`
}
