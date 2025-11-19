import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { apiFetch } from '../../api/client'
import { useAuth } from '../../auth/auth.store'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const loginStore = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await apiFetch<{ token: string, user: any }>("/auth/login", {
        method: 'POST',
        body: values,
      })
      loginStore.login(res.token, res.user, 15)
      toast.success('Bienvenido')
      const roles: string[] = res.user?.roles || []
      if (roles.includes('SuperAdmin')) navigate('/superadmin', { replace: true })
      else if (roles.includes('Admin')) navigate('/admin', { replace: true })
      else navigate('/usuario', { replace: true })
    } catch (e: any) {
      if (e?.status === 401) toast.error('Credenciales inválidas')
      else toast.error(e?.message || 'Error de autenticación')
    }
  }

  return (
    <div style={{minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr', gap:0}}>
      <div style={{
        display:'flex', flexDirection:'column', padding:'32px', position:'relative',
        backgroundImage:'none',
        backgroundColor:'#ffffff',
      }}>
        {/* blobs de fondo para igualar el del formulario */}
        <div style={{position:'absolute', inset:0, pointerEvents:'none', zIndex:0}}>
          <div style={{position:'absolute', top:'18%', left:'12%', width:280, height:280, borderRadius:9999,
            background:'radial-gradient(closest-side, rgba(0,69,131,0.22), rgba(0,69,131,0))', filter:'blur(16px)',
            animation:'loginFloat1 16s ease-in-out infinite', animationDelay:'0.6s'}} />
          <div style={{position:'absolute', bottom:'14%', right:'14%', width:320, height:320, borderRadius:9999,
            background:'radial-gradient(closest-side, rgba(237,24,34,0.22), rgba(237,24,34,0))', filter:'blur(18px)',
            animation:'loginFloat2 22s ease-in-out infinite', animationDelay:'1.2s'}} />
          <div style={{position:'absolute', top:'10%', right:'25%', width:160, height:160, borderRadius:9999,
            background:'radial-gradient(closest-side, rgba(0,69,131,0.16), rgba(0,69,131,0))', filter:'blur(14px)',
            animation:'loginFloat3 18s ease-in-out infinite', animationDelay:'0.2s'}} />
        </div>
        <div style={{position:'relative', zIndex:1, flex:1, display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:'1%'}}>
          <img src="/brand/login-bg.svg" alt="Marca" style={{width:800, maxWidth:'100%', height:'auto'}} />
        </div>
      </div>
      <div style={{display:'flex', alignItems:'center', justifyContent:'center', padding:'32px', paddingTop:0, minHeight:'100vh', position:'relative', overflow:'hidden'}}>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Montserrat+Arabic:wght@400;500;600;700&display=swap');
            /* Animaciones multi-etapa para un movimiento más orgánico */
            @keyframes loginFloat1 {
              0% { transform: translate(0,0) scale(1); }
              25% { transform: translate(40px,-20px) scale(1.05); }
              50% { transform: translate(70px,10px) scale(1.12); }
              75% { transform: translate(30px,30px) scale(1.08); }
              100% { transform: translate(0,0) scale(1); }
            }
            @keyframes loginFloat2 {
              0% { transform: translate(0,0) scale(1); }
              20% { transform: translate(-30px,15px) scale(0.96); }
              50% { transform: translate(-70px,-10px) scale(0.9); }
              80% { transform: translate(-40px,35px) scale(0.95); }
              100% { transform: translate(0,0) scale(1); }
            }
            @keyframes loginFloat3 {
              0% { transform: translate(0,0) scale(1); }
              30% { transform: translate(10px,20px) scale(1.04); }
              60% { transform: translate(25px,35px) scale(1.1); }
              85% { transform: translate(-5px,15px) scale(1.06); }
              100% { transform: translate(0,0) scale(1); }
            }
          `}
        </style>
        <div style={{position:'absolute', inset:0, pointerEvents:'none', zIndex:0}}>
          <div style={{position:'absolute', top:'18%', left:'10%', width:300, height:300, borderRadius:9999,
            background:'radial-gradient(closest-side, rgba(0,69,131,0.32), rgba(0,69,131,0))', filter:'blur(16px)',
            animation:'loginFloat1 14s ease-in-out infinite', animationDelay:'0.3s'}} />
          <div style={{position:'absolute', bottom:'14%', right:'10%', width:340, height:340, borderRadius:9999,
            background:'radial-gradient(closest-side, rgba(237,24,34,0.28), rgba(237,24,34,0))', filter:'blur(18px)',
            animation:'loginFloat2 20s ease-in-out infinite', animationDelay:'0.9s'}} />
          <div style={{position:'absolute', top:'8%', right:'22%', width:180, height:180, borderRadius:9999,
            background:'radial-gradient(closest-side, rgba(0,69,131,0.22), rgba(0,69,131,0))', filter:'blur(14px)',
            animation:'loginFloat3 17s ease-in-out infinite', animationDelay:'0.15s'}} />
        </div>
        <div style={{width:'100%', maxWidth:380}}>
          <form onSubmit={handleSubmit(onSubmit)} style={{display:'grid', gap:14}}>
            <div>
              <label style={{display:'block', fontSize:13, marginBottom:6, color:'#334155', fontFamily:'"Montserrat Arabic", system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>Correo electrónico</label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:10, padding:'12px 14px', fontSize:14, outline:'none'}}
              />
              {errors.email && <div style={{color:'#b91c1c', fontSize:12, marginTop:6}}>{errors.email.message}</div>}
            </div>
            <div>
              <label style={{display:'block', fontSize:13, marginBottom:6, color:'#334155', fontFamily:'"Montserrat Arabic", system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:10, padding:'12px 14px', fontSize:14, outline:'none'}}
              />
              {errors.password && <div style={{color:'#b91c1c', fontSize:12, marginTop:6}}>{errors.password.message}</div>}
            </div>
            <button type="submit" disabled={isSubmitting} style={{
              width:'100%', background:'#0D4B85', color:'#fff', border:'1px solid #0B3F71', borderRadius:9999, padding:'12px 16px', fontSize:16, fontWeight:700,
              boxShadow:'0 6px 20px rgba(13,75,133,0.25)', cursor:'pointer', opacity: isSubmitting ? 0.7 : 1
            }}>
              {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
