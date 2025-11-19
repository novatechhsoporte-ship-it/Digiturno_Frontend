import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const TRAMITES = [
  { id: 'A', label: 'A: LIQUIDACION' },
  { id: 'B', label: 'B: AUTENTICACION' },
  { id: 'C', label: 'C: CONSULTA JURIDICA' },
  { id: 'D', label: 'D: DECLARACIONES' },
  { id: 'E', label: 'E: RADICACION' },
  { id: 'F', label: 'F: REGISTRO CIVIL' },
  { id: 'G', label: 'G: VIGENCIAS' },
  { id: 'H', label: 'H: CERTIFICADO DE LIBERTAD' },
  { id: 'I', label: 'I: EXPEDICIÓN DE COPIAS' },
  { id: 'J', label: 'J: PAGO DE BENEFICENCIA Y REGISTRO' },
]

export default function SeleccionTramitePublico() {
  const nav = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const defaultTenantId = params.get('tenantId') || localStorage.getItem('public_tenantId') || ''
  const [tenantId, setTenantId] = React.useState(defaultTenantId)

  const go = (id: string) => {
    try { localStorage.setItem('public_tramite', id) } catch {}
    const qs = new URLSearchParams()
    if (tenantId) qs.set('tenantId', tenantId)
    nav(`/public/turno/identificacion?${qs.toString()}`)
  }

  return (
    <div id="seleccion-tramite" style={{display:'flex', justifyContent:'center'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');
        #seleccion-tramite { padding-left:16px; padding-right:16px; width:100%; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        @media (min-width: 768px) { #seleccion-tramite { padding-left:48px; padding-right:48px; } }
        @media (min-width: 1280px) { #seleccion-tramite { padding-left:72px; padding-right:72px; } }
      `}</style>
      <div style={{maxWidth:960, width:'100%', display:'grid', gap:16, margin:'0 auto'}}>
        <div style={{marginTop:8}}>
          <h1 style={{fontSize:30, fontWeight:700, color:'#004584', margin:0, letterSpacing:0.2, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>Selecciona el trámite</h1>
          <p style={{color:'#475569', marginTop:6, fontSize:14, fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}>Solo puedes escoger uno.</p>
        </div>

        <div style={{display:'flex', gap:12, flexWrap:'wrap', alignItems:'flex-end', background:'rgba(255,255,255,0.92)',
          border:'1px solid #e2e8f0', borderRadius:12, padding:16, boxShadow:'0 1px 2px rgba(2,6,23,0.06)'}}>
          <div style={{display:'grid', gap:6}}>
            <label style={{fontSize:12, color:'#1f2937', fontWeight:600, fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>Tenant ID</label>
            <input
              value={tenantId}
              onChange={(e)=>setTenantId(e.target.value)}
              placeholder="uuid del tenant"
              style={{
                border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', width:340, outline:'none',
                fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Roboto, Arial'
              }}
            />
          </div>
          <span style={{fontSize:12, color:'#64748b', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>También puedes pasar <code style={{background:'#f1f5f9', padding:'2px 6px', borderRadius:6}}>?tenantId=...</code> en la URL.</span>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:12}}>
          {TRAMITES.map(t => (
            <button key={t.id}
              onClick={()=>go(t.id)}
              style={{
                textAlign:'left', border:'1px solid #cbd5e1', background:'#fff', borderRadius:12,
                padding:'16px 14px', cursor:'pointer', boxShadow:'0 1px 2px rgba(2,6,23,0.06)',
                fontWeight:700, color:'#0f172a', letterSpacing:0.2,
                fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial',
                transition:'transform 120ms ease, box-shadow 160ms ease, background 160ms ease, border-color 160ms ease, color 160ms ease',
              }}
              onMouseOver={(e)=>{ const b=e.currentTarget as HTMLButtonElement; b.style.borderColor='#004584'; b.style.boxShadow='0 3px 10px rgba(0,69,132,0.18)'; b.style.background='#f1f7ff'; b.style.color='#003763'; b.style.transform='translateY(-1px)'; }}
              onMouseOut={(e)=>{ const b=e.currentTarget as HTMLButtonElement; b.style.borderColor='#cbd5e1'; b.style.boxShadow='0 1px 2px rgba(2,6,23,0.06)'; b.style.background='#fff'; b.style.color='#0f172a'; b.style.transform='translateY(0)'; }}
            >{t.label.replace(/^[A-J]:\s*/, '')}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
