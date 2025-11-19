import React from 'react'
import { useAuth } from '../../auth/auth.store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UsuarioAPI, type Turno } from '../../api/usuario'
import { toast } from 'sonner'

export default function UsuarioTurnosPage() {
  const { token, user } = useAuth()
  const qc = useQueryClient()

  const [idModulo, setIdModulo] = React.useState('')
  const [estado, setEstado] = React.useState<'pendiente' | 'en_proceso' | ''>('')
  const [fecha, setFecha] = React.useState<string>('')

  const canQuery = Boolean(token)

  const turnosQ = useQuery({
    queryKey: ['usuario-turnos', idModulo, estado, fecha],
    queryFn: () => UsuarioAPI.listTurnos(token!, {
      id_modulo: idModulo || undefined,
      estado: estado || undefined,
      fecha: fecha || undefined,
    }),
    enabled: canQuery,
  })

  const atenderM = useMutation({
    mutationFn: (t: Turno) => UsuarioAPI.atenderTurno(token!, t.id_turno, user!.id),
    onSuccess: () => { toast.success('Turno en atención'); qc.invalidateQueries({ queryKey: ['usuario-turnos'] }) },
    onError: (e: any) => toast.error(e?.message || 'No se pudo atender el turno'),
  })

  const finalizarM = useMutation({
    mutationFn: (t: Turno) => UsuarioAPI.finalizarTurno(token!, t.id_turno),
    onSuccess: () => { toast.success('Turno finalizado'); qc.invalidateQueries({ queryKey: ['usuario-turnos'] }) },
    onError: (e: any) => toast.error(e?.message || 'No se pudo finalizar el turno'),
  })

  const [tramiteCorr, setTramiteCorr] = React.useState('')
  const corregirM = useMutation({
    mutationFn: (t: Turno) => UsuarioAPI.corregirTramite(token!, t.id_turno, tramiteCorr),
    onSuccess: () => { toast.success('Trámite corregido'); setTramiteCorr(''); qc.invalidateQueries({ queryKey: ['usuario-turnos'] }) },
    onError: (e: any) => toast.error(e?.message || 'No se pudo corregir el trámite'),
  })

  return (
    <div id="usuario-turnos-page" style={{display:'grid', gap:20}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Roboto:wght@400;500;700&display=swap');
        #usuario-turnos-page { padding-left:16px; padding-right:16px; }
        @media (min-width: 768px) { #usuario-turnos-page { padding-left:48px; padding-right:48px; } }
        @media (min-width: 1280px) { #usuario-turnos-page { padding-left:72px; padding-right:72px; } }
      `}</style>

      <div>
        <h1 style={{fontSize:26, fontWeight:600, color:'#004584', margin:0, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>Usuario - Turnos</h1>
        <p style={{color:'#64748b', fontSize:13, marginTop:6, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>Consulta y gestiona tus turnos.</p>
      </div>

      <div style={{display:'flex', flexWrap:'wrap', alignItems:'flex-end', gap:12, background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:16, boxShadow:'0 1px 2px rgba(2,6,23,0.06)'}}>
        <div style={{display:'grid', gap:6}}>
          <label style={{fontSize:12, color:'#475569'}}>ID módulo</label>
          <input value={idModulo} onChange={(e)=>setIdModulo(e.target.value)} placeholder="uuid del módulo" style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', width:240, outline:'none', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}} />
        </div>
        <div style={{display:'grid', gap:6}}>
          <label style={{fontSize:12, color:'#475569'}}>Estado</label>
          <select value={estado} onChange={(e)=>setEstado(e.target.value as any)} style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', width:200, outline:'none', background:'#fff', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}>
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
          </select>
        </div>
        <div style={{display:'grid', gap:6}}>
          <label style={{fontSize:12, color:'#475569'}}>Fecha</label>
          <input type="date" value={fecha} onChange={(e)=>setFecha(e.target.value)} style={{border:'1px solid #cbd5e1', borderRadius:10, padding:'10px 12px', width:200, outline:'none', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}} />
        </div>
        <button onClick={()=>qc.invalidateQueries({ queryKey: ['usuario-turnos', idModulo, estado, fecha] })} disabled={!canQuery} style={{
          display:'inline-flex', alignItems:'center', gap:8, color:'#fff', borderRadius:10, padding:'10px 14px',
          border:'1px solid #004584', background:'#004584', boxShadow:'0 2px 6px rgba(2,6,23,0.15)',
          opacity:!canQuery?0.6:1, fontFamily:'Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial', fontWeight:600
        }}>Buscar</button>
      </div>

      {!idModulo && <p style={{color:'#64748b', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}>Sin ID de módulo se listan turnos generales según filtros.</p>}
      {turnosQ.isFetching && canQuery && (
        <div style={{border:'1px solid #e2e8f0', borderRadius:12, padding:12, background:'#fff', color:'#0f172a'}}>Cargando...</div>
      )}
      {turnosQ.error && (
        <div style={{border:'1px solid #fecaca', borderRadius:12, padding:12, background:'#fff', color:'#b91c1c'}}>Error: {(turnosQ.error as any).message}</div>
      )}

      {Array.isArray(turnosQ.data) && turnosQ.data.length > 0 && (
        <div style={{overflowX:'auto', border:'1px solid #e2e8f0', borderRadius:12, boxShadow:'0 1px 2px rgba(2,6,23,0.06)', background:'#fff'}}>
          <table style={{minWidth:'100%', fontFamily:'Roboto, system-ui, -apple-system, Segoe UI, Arial'}}>
            <thead style={{background:'#f8fafc', textAlign:'left'}}>
              <tr>
                <th style={{padding:12, color:'#475569', fontSize:12, letterSpacing:0.4, fontWeight:700, borderBottom:'1px solid #e2e8f0', textTransform:'uppercase'}}>N°</th>
                <th style={{padding:12, color:'#475569', fontSize:12, letterSpacing:0.4, fontWeight:700, borderBottom:'1px solid #e2e8f0', textTransform:'uppercase'}}>Trámite</th>
                <th style={{padding:12, color:'#475569', fontSize:12, letterSpacing:0.4, fontWeight:700, borderBottom:'1px solid #e2e8f0', textTransform:'uppercase'}}>Estado</th>
                <th style={{padding:12, color:'#475569', fontSize:12, letterSpacing:0.4, fontWeight:700, borderBottom:'1px solid #e2e8f0', textTransform:'uppercase'}}>Creación</th>
                <th style={{padding:12, color:'#475569', fontSize:12, letterSpacing:0.4, fontWeight:700, borderBottom:'1px solid #e2e8f0', textTransform:'uppercase'}}>Inicio</th>
                <th style={{padding:12, color:'#475569', fontSize:12, letterSpacing:0.4, fontWeight:700, borderBottom:'1px solid #e2e8f0', textTransform:'uppercase'}}>Fin</th>
                <th style={{padding:12, color:'#475569', fontSize:12, letterSpacing:0.4, fontWeight:700, borderBottom:'1px solid #e2e8f0', textTransform:'uppercase'}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turnosQ.data.map(t => (
                <tr key={t.id_turno} className="odd:bg-white even:bg-slate-50">
                  <td className="p-2 border">{t.numero_turno}</td>
                  <td className="p-2 border">{t.id_tramite}{t.id_tramite_correccion ? ` → ${t.id_tramite_correccion}` : ''}</td>
                  <td className="p-2 border">
                    <span style={{
                      fontSize:12, padding:'4px 10px', borderRadius:9999, fontWeight:600,
                      background: t.estado === 'en_proceso' ? '#eff6ff' : '#fef9c3',
                      color: t.estado === 'en_proceso' ? '#1d4ed8' : '#92400e',
                      border:'1px solid', borderColor: t.estado === 'en_proceso' ? '#bfdbfe' : '#fde68a',
                      boxShadow:'0 1px 2px rgba(2,6,23,0.04)'
                    }}>{t.estado === 'en_proceso' ? 'En proceso' : 'Pendiente'}</span>
                  </td>
                  <td className="p-2 border">{new Date(t.fecha_creacion).toLocaleString()}</td>
                  <td className="p-2 border">{t.fecha_inicio ? new Date(t.fecha_inicio).toLocaleString() : '-'}</td>
                  <td className="p-2 border">{t.fecha_finalizacion ? new Date(t.fecha_finalizacion).toLocaleString() : '-'}</td>
                  <td className="p-2 border">
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <button onClick={()=>atenderM.mutate(t)} style={{fontSize:12, fontWeight:600, border:'1px solid #e2e8f0', borderRadius:8, height:28, padding:'0 12px', background:'#fff', cursor:'pointer', boxShadow:'0 1px 2px rgba(2,6,23,0.04)'}}>Atender</button>
                      <button onClick={()=>finalizarM.mutate(t)} style={{fontSize:12, fontWeight:600, border:'1px solid #e2e8f0', borderRadius:8, height:28, padding:'0 12px', background:'#fff', cursor:'pointer', boxShadow:'0 1px 2px rgba(2,6,23,0.04)'}}>Finalizar</button>
                      <span style={{display:'inline-flex', alignItems:'center', gap:8}}>
                        <input value={tramiteCorr} onChange={(e)=>setTramiteCorr(e.target.value)} placeholder="Trámite corr." style={{border:'1px solid #cbd5e1', borderRadius:8, padding:'6px 8px', outline:'none', fontSize:12, width:120}} />
                        <button onClick={()=>corregirM.mutate(t)} style={{fontSize:12, fontWeight:600, border:'1px solid #e2e8f0', borderRadius:8, height:28, padding:'0 12px', background:'#fff', cursor:'pointer', boxShadow:'0 1px 2px rgba(2,6,23,0.04)'}}>Corregir</button>
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {Array.isArray(turnosQ.data) && turnosQ.data.length === 0 && canQuery && (
        <div style={{border:'1px dashed #cbd5e1', borderRadius:12, padding:16, color:'#64748b', background:'#fff'}}>No hay turnos para los filtros seleccionados.</div>
      )}
    </div>
  )
}
