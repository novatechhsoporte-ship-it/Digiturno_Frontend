import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const TRAMITES: Record<string, string> = {
  A: 'LIQUIDACION',
  B: 'AUTENTICACION',
  C: 'CONSULTA JURIDICA',
  D: 'DECLARACIONES',
  E: 'RADICACION',
  F: 'REGISTRO CIVIL',
  G: 'VIGENCIAS',
  H: 'CERTIFICADO DE LIBERTAD',
  I: 'EXPEDICIÓN DE COPIAS',
  J: 'PAGO DE BENEFICENCIA Y REGISTRO',
}

export default function TramitesPublicosPage() {
  const navigate = useNavigate()
  const [search] = useSearchParams()
  const tenantId = search.get('tenantId') || ''

  const goToDatos = (tramite: string) => {
    const qp = new URLSearchParams()
    if (tenantId) qp.set('tenantId', tenantId)
    qp.set('tramite', tramite)
    // Preservar modo kiosco si viene
    const kiosk = new URLSearchParams(window.location.search).get('kiosk')
    if (kiosk === '1') qp.set('kiosk', '1')
    navigate(`/public/turno/cedula?${qp.toString()}`)
  }

  return (
    <div style={{maxWidth:960, margin:'0 auto', padding:'24px 16px'}}>
      <h1 style={{fontSize:28, fontWeight:700, marginBottom:12, color:'#0D4B85'}}>Selecciona el trámite</h1>
      {!tenantId && (
        <p style={{marginBottom:16, fontSize:14, color:'#64748b'}}>Sugerencia: añade <code>?tenantId=UUID</code> en la URL para precargar el tenant.</p>
      )}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:16}}>
        {Object.entries(TRAMITES).map(([k, label]) => (
          <button
            key={k}
            onClick={() => goToDatos(k)}
            style={{
              border:'1px solid #e2e8f0', borderRadius:12, padding:'18px 16px', textAlign:'left', background:'#ffffff',
              boxShadow:'0 1px 2px rgba(0,0,0,0.04)', cursor:'pointer'
            }}
            onMouseOver={(e)=>{ (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc' }}
            onMouseOut={(e)=>{ (e.currentTarget as HTMLButtonElement).style.background = '#ffffff' }}
          >
            <div style={{display:'flex', alignItems:'center', gap:12}}>
              <div style={{width:44, height:44, borderRadius:10, background:'#0D4B85', color:'#fff', display:'grid', placeItems:'center', fontSize:20, fontWeight:800}}>{k}</div>
              <div>
                <div style={{fontSize:16, fontWeight:600, color:'#0f172a'}}>{label}</div>
                <div style={{fontSize:12, color:'#64748b'}}>Toca para continuar</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
