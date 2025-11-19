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
  nombre: z.string().optional(),
  apellido: z.string().optional(),
  telefono: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function DatosTurnoPublico() {
  const navigate = useNavigate()
  const [search] = useSearchParams()
  const id_tenant = search.get('tenantId') || ''
  const id_tramite = search.get('tramite') || ''
  const cedulaQS = search.get('cedula') || ''
  const isKiosk = search.get('kiosk') === '1'

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { id_tenant, id_tramite, cedula: cedulaQS },
  })

  const [ticket, setTicket] = React.useState<{ numero_turno: string } | null>(null)

  React.useEffect(() => {
    // Si no hay cédula en la URL, forzar paso anterior
    if (!cedulaQS) {
      const qp = new URLSearchParams(); if (id_tenant) qp.set('tenantId', id_tenant); qp.set('tramite', id_tramite); if (isKiosk) qp.set('kiosk','1')
      navigate(`/public/turno/cedula?${qp.toString()}`)
    }
  }, [cedulaQS, id_tenant, id_tramite, isKiosk, navigate])

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
      toast.error(e?.message || 'Error creando turno')
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

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Datos del turno</h1>

      {ticket && (
        <div className="mb-6 border rounded p-4 bg-slate-50">
          <p className="text-slate-700 mb-2">Tu turno fue generado correctamente.</p>
          <div className="text-4xl font-bold tracking-widest mb-2">{ticket.numero_turno}</div>
          <div style={{display:'flex', gap:12}}>
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
          <div className="flex gap-2 items-center">
            <input type="hidden" {...register('id_tenant')} />
            <input className="border rounded px-3 py-2" readOnly value={id_tenant} />
          </div>
          {errors.id_tenant && <p className="text-sm text-red-600">{errors.id_tenant.message}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Cédula</label>
          <input className="w-full border rounded px-3 py-2" placeholder="123456" {...register('cedula')} readOnly />
          {errors.cedula && <p className="text-sm text-red-600">{errors.cedula.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <input className="w-full border rounded px-3 py-2" {...register('nombre')} />
          </div>
          <div>
            <label className="block text-sm mb-1">Apellido</label>
            <input className="w-full border rounded px-3 py-2" {...register('apellido')} />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Teléfono</label>
          <input className="w-full border rounded px-3 py-2" {...register('telefono')} />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={isSubmitting} className="bg-[rgb(13,75,133)] text-white rounded px-4 py-2 disabled:opacity-50">
            {isSubmitting ? 'Creando...' : 'Crear turno'}
          </button>
          <button type="button" onClick={goTramites} className="text-sm text-slate-600 underline self-center">Volver</button>
        </div>
      </form>
    </div>
  )
}
