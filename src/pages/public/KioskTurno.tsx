import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function KioskTurnoPublico() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const numero = params.get('numero') || ''

  React.useEffect(() => {
    if (!numero) {
      navigate('/public/tramites', { replace: true })
    }
  }, [numero, navigate])

  return (
    <div style={{display:'grid', placeItems:'center', minHeight:'70vh', textAlign:'center'}}>
      <div>
        <div style={{fontSize:18, color:'#334155', marginBottom:8}}>Tu turno es</div>
        <div style={{fontSize:'120px', lineHeight:1, fontWeight:800, letterSpacing:8, color:'#004584', textShadow:'0 6px 20px rgba(2,6,23,0.15)'}}>{numero}</div>
        <div style={{marginTop:16}}>
          <a href="/public/tramites" style={{color:'#004584', fontWeight:600}}>Volver al inicio</a>
        </div>
      </div>
    </div>
  )
}
