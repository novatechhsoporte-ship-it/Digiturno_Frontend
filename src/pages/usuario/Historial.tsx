import React from 'react'
import { useAuth } from '../../auth/auth.store'
import { useQuery } from '@tanstack/react-query'
import { UsuarioAPI } from '../../api/usuario'

export default function UsuarioHistorialPage() {
  const { token, user } = useAuth()
  const q = useQuery({
    queryKey: ['usuario-historial', user?.id],
    queryFn: () => UsuarioAPI.historial(token!, user!.id),
    enabled: !!token && !!user?.id,
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Historial</h1>
      {q.isLoading && <p>Cargando...</p>}
      {q.error && <p className="text-red-600">Error: {(q.error as any).message}</p>}
      {Array.isArray(q.data) && q.data.length === 0 && <p className="text-slate-600">Sin registros.</p>}
      {Array.isArray(q.data) && q.data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-2 border">N°</th>
                <th className="p-2 border">Trámite</th>
                <th className="p-2 border">Estado</th>
                <th className="p-2 border">Inicio</th>
                <th className="p-2 border">Fin</th>
              </tr>
            </thead>
            <tbody>
              {q.data.map((h, i) => (
                <tr key={i} className="odd:bg-white even:bg-slate-50">
                  <td className="p-2 border">{h.numero_turno}</td>
                  <td className="p-2 border">{h.tramite}</td>
                  <td className="p-2 border">{h.estado}</td>
                  <td className="p-2 border">{h.fecha_inicio ? new Date(h.fecha_inicio).toLocaleString() : '-'}</td>
                  <td className="p-2 border">{h.fecha_finalizacion ? new Date(h.fecha_finalizacion).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
