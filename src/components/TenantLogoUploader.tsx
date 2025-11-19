import React from 'react'
import { useAuth } from '../auth/auth.store'
import { useTenant } from '../tenant/tenant.store'
import { getApiUrl } from '../api/client'
import { toast } from 'sonner'

export default function TenantLogoUploader({ showPreview = true }: { showPreview?: boolean }) {
  const { token, user } = useAuth()
  const { logoUrl, setLogoUrl } = useTenant()
  const [file, setFile] = React.useState<File | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [err, setErr] = React.useState('')

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErr('')
    const f = e.target.files?.[0] || null
    setFile(f)
  }

  const onUpload = async () => {
    setErr('')
    if (!token) return toast.error('No hay token')
    if (!file) return setErr('Selecciona un archivo')
    if (!['image/png','image/jpeg','image/webp','image/svg+xml'].includes(file.type)) {
      return setErr('Tipo no permitido (PNG, JPEG, WEBP, SVG)')
    }
    if (file.size > 5 * 1024 * 1024) return setErr('Máx 5MB')

    setLoading(true)
    try {
      const form = new FormData()
      form.append('logo', file)
      const res = await fetch(getApiUrl('/admin/tenant/logo'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      if (!res.ok) {
        let msg = 'Error al subir logo'
        try {
          const j = await res.json()
          msg = j?.error || msg
        } catch {}
        throw new Error(msg)
      }
      const data = await res.json() as { logo_url: string }
      const url = `${data.logo_url}?t=${Date.now()}`
      const tenantId = user?.tenantId
      setLogoUrl(url, tenantId)
      toast.success('Logo actualizado')
      setFile(null)
    } catch (e: any) {
      setErr(e?.message || 'Error al subir logo')
      toast.error(e?.message || 'Error al subir logo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{display:'flex', alignItems:'center', gap:12, flexWrap:'wrap'}}>
      {showPreview && (
        <div style={{ marginRight: 8 }}>
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" style={{ maxHeight: 48, borderRadius: 8 }} />
          ) : (
            <div style={{ height: 48, width: 96, background: '#e2e8f0', display:'flex',alignItems:'center',justifyContent:'center', borderRadius:8, color:'#64748b', fontSize:12 }}>
              Sin logo
            </div>
          )}
        </div>
      )}
      {!logoUrl && (
        <>
          <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={onFile} />
          <button onClick={onUpload} disabled={loading || !file} className="border rounded px-3 py-1.5">
            {loading ? 'Subiendo...' : 'Subir logo'}
          </button>
        </>
      )}
      {err && <span style={{ color: 'red', fontSize: 12 }}>{err}</span>}
    </div>
  )
}
