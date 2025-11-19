import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiFetch } from '../../api/client'

export default function IdentificacionTurnoPublico() {
  const nav = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const defaultTenant = params.get('tenantId') || localStorage.getItem('public_tenantId') || ''
  const defaultTramite = params.get('tramite') || localStorage.getItem('public_tramite') || ''

  const [tenantId, setTenantId] = React.useState(defaultTenant)
  const [tramite, setTramite] = React.useState(defaultTramite)
  const [cedula, setCedula] = React.useState('')
  const [nombre, setNombre] = React.useState('')
  const [apellido, setApellido] = React.useState('')
  const [telefono, setTelefono] = React.useState('')
  const [needExtra, setNeedExtra] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    if (defaultTenant) setTenantId(defaultTenant)
    if (defaultTramite) setTramite(defaultTramite)
  }, [defaultTenant, defaultTramite])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!tenantId || !tramite || !cedula) {
      setError('Ingresa tenantId, trámite y cédula')
      return
    }
    setLoading(true)
    try {
      localStorage.setItem('public_tenantId', tenantId)
      localStorage.setItem('public_tramite', tramite)
      const body: any = { id_tenant: tenantId, id_tramite: tramite, cedula }
      if (needExtra) {
        body.nombre = nombre
        body.apellido = apellido
        if (telefono) body.telefono = telefono
      }
      const res = await apiFetch<{ id_turno: string; numero_turno: string }>("/public/turnos", { method: 'POST', body })
      nav(`/public/turno/kiosk?numero=${encodeURIComponent(res.numero_turno)}&kiosk=1`)
    } catch (err: any) {
      const msg: string = err?.message || 'No se pudo crear el turno'
      setError(msg)
      if (msg.toLowerCase().includes('nombre y apellido son requeridos')) {
        setNeedExtra(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{maxWidth:720, margin:'0 auto', display:'grid', gap:16}}>
      <h1 style={{fontSize:28, fontWeight:700, color:'#004584', marginBottom:8}}>Identificación</h1>
      <p style={{color:'#64748b', marginTop:0}}>Escanea tu cédula o ingrésala manualmente.</p>

      <form onSubmit={submit} style={{display:'grid', gap:12, background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:16}}>
        <div style={{display:'grid', gap:6}}>
          <label style={{fontSize:12, color:'#475569'}}>Tenant ID</label>
          <input value={tenantId} onChange={(e)=>setTenantId(e.target.value)} placeholder="uuid del tenant" style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', outline:'none'}} />
        </div>
        <div style={{display:'grid', gap:6}}>
          <label style={{fontSize:12, color:'#475569'}}>Trámite (A-J)</label>
          <input value={tramite} onChange={(e)=>setTramite(e.target.value.toUpperCase().slice(0,1))} placeholder="A" style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', outline:'none', width:120}} />
        </div>
        <div style={{display:'grid', gap:6}}>
          <label style={{fontSize:12, color:'#475569'}}>Cédula</label>
          <input
            value={cedula}
            onChange={(e)=>setCedula(e.target.value)}
            placeholder="Escanear o escribir"
            inputMode="numeric"
            pattern="[0-9]*"
            type="tel"
            autoComplete="off"
            style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', outline:'none'}}
          />
        </div>

        {needExtra && (
          <div style={{display:'grid', gap:12, gridTemplateColumns:'1fr 1fr'}}>
            <div style={{display:'grid', gap:6}}>
              <label style={{fontSize:12, color:'#475569'}}>Nombre</label>
              <input
                value={nombre}
                onChange={(e)=>setNombre(e.target.value)}
                type="text"
                autoCapitalize="words"
                autoComplete="given-name"
                style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', outline:'none'}}
              />
            </div>
            <div style={{display:'grid', gap:6}}>
              <label style={{fontSize:12, color:'#475569'}}>Apellido</label>
              <input
                value={apellido}
                onChange={(e)=>setApellido(e.target.value)}
                type="text"
                autoCapitalize="words"
                autoComplete="family-name"
                style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', outline:'none'}}
              />
            </div>
            <div style={{display:'grid', gap:6}}>
              <label style={{fontSize:12, color:'#475569'}}>Teléfono (opcional)</label>
              <input
                value={telefono}
                onChange={(e)=>setTelefono(e.target.value)}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', outline:'none'}}
              />
            </div>
          </div>
        )}


        {error && <div style={{color:'#b91c1c', background:'#fff', border:'1px solid #fecaca', borderRadius:10, padding:'10px 12px'}}>{error}</div>}

        <div style={{display:'flex', gap:12}}>
          <button type="submit" disabled={loading} style={{
            border:'1px solid #004584', background:'#004584', color:'#fff', borderRadius:10, padding:'10px 14px', fontWeight:700,
            boxShadow:'0 2px 6px rgba(2,6,23,0.15)', opacity: loading ? 0.7 : 1
          }}>{loading ? 'Enviando...' : 'Continuar'}</button>
          <a href="/public/tramites" style={{alignSelf:'center', color:'#004584'}}>Volver</a>
        </div>
      </form>
    </div>
  )
}
