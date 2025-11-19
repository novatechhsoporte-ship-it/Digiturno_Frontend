import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { apiFetch } from '../../api/client'
import { toast } from 'sonner'

const schema = z.object({
  id_tenant: z.string().min(1, 'Requerido'),
  id_tramite: z.string().min(1, 'Requerido'),
  cedula: z.string().min(3, 'Mínimo 3 caracteres'),
})

type FormValues = z.infer<typeof schema>

export default function CedulaTurnoPublico() {
  const navigate = useNavigate()
  const [search] = useSearchParams()
  const id_tenant = search.get('tenantId') || ''
  const id_tramite = search.get('tramite') || ''
  const isKiosk = search.get('kiosk') === '1'

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, getValues } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { id_tenant, id_tramite, cedula: '' },
  })

  const [ticket, setTicket] = React.useState<{ numero_turno: string } | null>(null)

  const cedulaRef = React.useRef<HTMLInputElement | null>(null)
  const cedulaField = register('cedula')
  React.useEffect(() => {
    cedulaRef.current?.focus()
  }, [])

  React.useEffect(() => {
    if (!ticket) return
    const qp = new URLSearchParams()
    if (id_tenant) qp.set('tenantId', id_tenant)
    if (isKiosk) qp.set('kiosk', '1')
    const t = setTimeout(() => {
      navigate(`/public/tramites?${qp.toString()}`)
    }, 10000)
    return () => clearTimeout(t)
  }, [ticket, id_tenant, isKiosk, navigate])

  const onSubmit = async (values: FormValues) => {
    try {
      const turno = await apiFetch<{ id_turno: string; numero_turno: string }>("/public/turnos", {
        method: 'POST',
        body: values,
      })
      setTicket({ numero_turno: turno.numero_turno })
      toast.success(`Turno: ${turno.numero_turno}`)
      reset({ id_tenant, id_tramite, cedula: '' })
    } catch (e: any) {
      const msg = (e?.message || '').toLowerCase()
      // Si el backend requiere datos adicionales, redirigimos a la página de datos con la cédula prellenada
      if (e?.status === 400 || msg.includes('nombre') || msg.includes('telefono') || msg.includes('apellido') || msg.includes('datos')) {
        const qp = new URLSearchParams()
        qp.set('tenantId', id_tenant)
        qp.set('tramite', id_tramite)
        qp.set('cedula', values.cedula)
        navigate(`/public/turno/datos?${qp.toString()}`)
      } else if (e?.status === 404) {
        // Si el backend indica que no existe, también lo mandamos a completar datos
        const qp = new URLSearchParams()
        qp.set('tenantId', id_tenant)
        qp.set('tramite', id_tramite)
        qp.set('cedula', values.cedula)
        navigate(`/public/turno/datos?${qp.toString()}`)
      } else {
        toast.error(e?.message || 'No se pudo generar el turno')
      }
    }
  }

  const goTramites = () => {
    const qp = new URLSearchParams()
    if (id_tenant) qp.set('tenantId', id_tenant)
    navigate(`/public/tramites?${qp.toString()}`)
  }

  if (ticket && isKiosk) {
    return (
      <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
        <div style={{fontSize:48, color:'#0D4B85', fontWeight:700, marginBottom:12}}>Tu turno</div>
        <div style={{fontSize:112, letterSpacing:8, fontWeight:800, color:'#0D4B85'}}>{ticket.numero_turno}</div>
        <div style={{display:'flex', gap:16, marginTop:24}}>
          <button onClick={()=>setTicket(null)} style={{fontSize:20, textDecoration:'underline'}}>Crear otro turno</button>
          <button
            onClick={()=>{
              const qp = new URLSearchParams(); if(id_tenant) qp.set('tenantId', id_tenant); if(isKiosk) qp.set('kiosk','1');
              navigate(`/public/tramites?${qp.toString()}`)
            }}
            style={{fontSize:20, textDecoration:'underline'}}
          >Inicio</button>
        </div>
      </div>
    )
  }

  const typeDigit = (d: string) => {
    const current = getValues('cedula') || ''
    setValue('cedula', current + d)
    cedulaRef.current?.focus()
  }
  const eraseDigit = () => {
    const current = getValues('cedula') || ''
    setValue('cedula', current.slice(0, -1))
    cedulaRef.current?.focus()
  }
  const submitForm = () => {
    // @ts-ignore
    handleSubmit(onSubmit)()
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Identificación</h1>

      {ticket && (
        <div className="mb-6" style={{border:'1px solid #e2e8f0', borderRadius:8, padding:16, background:'#f8fafc'}}>
          <p className="text-slate-700 mb-2">Tu turno fue generado correctamente.</p>
          <div style={{fontSize:48, letterSpacing:6, fontWeight:800, color:'#0D4B85'}}>{ticket.numero_turno}</div>
          <div style={{display:'flex', gap:12, marginTop:8}}>
            <button className="text-sm underline" onClick={()=>setTicket(null)}>Crear otro turno</button>
            <button
              className="text-sm underline"
              onClick={()=>{
                const qp = new URLSearchParams(); if(id_tenant) qp.set('tenantId', id_tenant); if(isKiosk) qp.set('kiosk','1');
                navigate(`/public/tramites?${qp.toString()}`)
              }}
            >Inicio</button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div>
          <label className="block text-sm mb-1">Trámite</label>
          <div className="flex gap-2 items-center">
            <input type="hidden" {...register('id_tramite')} />
            <input className="border rounded px-3 py-2 w-24" readOnly value={id_tramite} />
            <button type="button" className="text-sm underline" onClick={goTramites}>Cambiar</button>
          </div>
          {errors.id_tramite && <p className="text-sm text-red-600">{errors.id_tramite.message}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Tenant ID</label>
          <input type="hidden" {...register('id_tenant')} />
          <input className="w-full border rounded px-3 py-2" readOnly value={id_tenant} />
          {errors.id_tenant && <p className="text-sm text-red-600">{errors.id_tenant.message}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Cédula</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="123456"
            {...cedulaField}
            ref={(e)=>{ cedulaField.ref(e); cedulaRef.current = e }}
            onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); submitForm() } }}
            inputMode="numeric"
            pattern="[0-9]*"
          />
          {errors.cedula && <p className="text-sm text-red-600">{errors.cedula.message}</p>}
        </div>
        {isKiosk && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12, marginTop:8}}>
            {[...'123456789'].map(n => (
              <button key={n} type="button" onClick={()=>typeDigit(n)} style={{fontSize:24,padding:'16px 0',border:'1px solid #e2e8f0',borderRadius:8,background:'#fff'}}>{n}</button>
            ))}
            <button type="button" onClick={eraseDigit} style={{fontSize:20,padding:'16px 0',border:'1px solid #e2e8f0',borderRadius:8,background:'#fff'}}>Borrar</button>
            <button type="button" onClick={()=>typeDigit('0')} style={{fontSize:24,padding:'16px 0',border:'1px solid #e2e8f0',borderRadius:8,background:'#fff'}}>0</button>
            <button type="button" onClick={submitForm} style={{fontSize:20,padding:'16px 0',border:'1px solid #0D4B85',borderRadius:8,background:'#0D4B85',color:'#fff'}}>Continuar</button>
          </div>
        )}
        <div className="flex gap-3">
          <button type="submit" disabled={isSubmitting} className="bg-[rgb(13,75,133)] text-white rounded px-4 py-2 disabled:opacity-50">
            {isSubmitting ? 'Validando...' : 'Continuar'}
          </button>
          <button type="button" onClick={goTramites} className="text-sm text-slate-600 underline self-center">Volver</button>
        </div>
      </form>
    </div>
  )
}
