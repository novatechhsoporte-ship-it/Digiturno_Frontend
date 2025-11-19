import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

const schema = z.object({
  id_tenant: z.string().min(1, 'Requerido'),
  id_tramite: z.string().min(1, 'Requerido'),
})

type FormValues = z.infer<typeof schema>

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

export default function CrearTurnoPublico() {
  const navigate = useNavigate()
  const defaultTenant = React.useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      return params.get('tenantId') || localStorage.getItem('public_tenantId') || ''
    } catch { return localStorage.getItem('public_tenantId') || '' }
  }, [])
  const defaultTramite = React.useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      return params.get('tramite') || ''
    } catch { return '' }
  }, [])

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { id_tenant: defaultTenant, id_tramite: defaultTramite }
  })

  React.useEffect(() => {
    if (defaultTenant) setValue('id_tenant', defaultTenant)
    if (defaultTramite) setValue('id_tramite', defaultTramite)
  }, [defaultTenant, defaultTramite, setValue])

  const onSubmit = async (values: FormValues) => {
    try {
      localStorage.setItem('public_tenantId', values.id_tenant)
      localStorage.setItem('public_tramite', values.id_tramite)
      const qs = new URLSearchParams({ tenantId: values.id_tenant, tramite: values.id_tramite })
      navigate(`/public/turno/identificacion?${qs.toString()}`)
    } catch {}
  }

  return (
    <div id="public-turno" className="min-h-[calc(100vh-140px)]" style={{display:'flex', justifyContent:'center'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');
        #public-turno { padding-left:16px; padding-right:16px; }
        @media (min-width: 768px) { #public-turno { padding-left:48px; padding-right:48px; } }
        @media (min-width: 1280px) { #public-turno { padding-left:72px; padding-right:72px; } }
      `}</style>
      <div className="w-full" style={{maxWidth: 720, marginTop: 24, marginBottom: 40}}>
        <div style={{marginBottom: 18}}>
          <h1 style={{fontSize:28, fontWeight:600, color:'#004584', margin:0, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>Crear turno público</h1>
          <p style={{color:'#64748b', fontSize:13, marginTop:6, fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}>
            Ingresa los datos del ciudadano y del trámite para generar un turno.
          </p>
        </div>

        

        <div style={{
          border:'1px solid #e2e8f0', borderRadius:12,
          background:'rgba(255,255,255,0.8)', backdropFilter:'blur(2px)',
          boxShadow:'0 1px 2px rgba(2,6,23,0.06)', padding:'18px 20px'
        }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{display:'grid', gap:16}}>
            <h2 style={{fontSize:12, fontWeight:600, color:'#0f172a', fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>Datos del trámite</h2>
            <div style={{display:'grid', gridTemplateColumns:'1fr', gap:12}}>
              <div>
                <label style={{display:'block', fontSize:12, color:'#334155', marginBottom:6, fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}>Tenant ID</label>
                <input
                  style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', width:'100%', outline:'none', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}
                  placeholder="uuid del tenant (requerido)"
                  {...register('id_tenant')}
                />
                {errors.id_tenant && <p style={{marginTop:6, fontSize:12, color:'#dc2626'}}>{errors.id_tenant.message}</p>}
              </div>
              <div>
                <label style={{display:'block', fontSize:12, color:'#334155', marginBottom:6, fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}>Trámite</label>
                <select
                  style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', width:'100%', outline:'none', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}
                  {...register('id_tramite')}
                  defaultValue={defaultTramite || ''}
                >
                  <option value="" disabled>Selecciona un trámite</option>
                  {TRAMITES.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
                {errors.id_tramite && <p style={{marginTop:6, fontSize:12, color:'#dc2626'}}>{errors.id_tramite.message}</p>}
              </div>
            </div>

            <div style={{borderTop:'1px dashed #e2e8f0', margin:'4px 0'}} />
            <p style={{fontSize:12, color:'#64748b', margin:0, fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}>Al continuar se te pedirá la cédula y, si no estás registrado, tus datos básicos.</p>

            <div style={{display:'flex', alignItems:'center', gap:12, paddingTop:4, flexWrap:'wrap'}}>
              <button type="submit" disabled={isSubmitting}
                style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  color:'#fff', borderRadius:9999, padding:'10px 16px', cursor:'pointer',
                  fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial', fontWeight:600,
                  border: '1px solid #004584', background: '#004584', boxShadow: '0 2px 6px rgba(2,6,23,0.15)',
                  opacity: isSubmitting ? 0.7 : 1
                }}>
                {isSubmitting ? 'Creando turno…' : 'Crear turno'}
              </button>
              <a href="/login" style={{fontSize:13, color:'#475569', textDecoration:'underline', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}>Ir a login</a>
            </div>
          </form>

          <div style={{marginTop:16, fontSize:12, color:'#64748b', borderTop:'1px dashed #e2e8f0', paddingTop:10, fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}>
            Puedes prellenar el formulario con query params, por ejemplo: <code style={{fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace', background:'#f1f5f9', padding:'2px 6px', borderRadius:6}}>?tenantId=UUID&tramite=A</code>
          </div>
        </div>
      </div>
    </div>
  )
}
