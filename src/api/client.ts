export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const API_URL = import.meta.env.VITE_API_URL as string

export function getApiUrl(path: string) {
  if (!API_URL) throw new Error('VITE_API_URL not configured')
  return `${API_URL}${path}`
}

export async function apiFetch<T>(path: string, options: { method?: HttpMethod; body?: any; token?: string } = {}): Promise<T> {
  const { method = 'GET', body, token } = options
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(getApiUrl(path), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return undefined as unknown as T

  let data: any
  try {
    data = await res.json()
  } catch {
    throw new Error('Invalid JSON response')
  }

  if (!res.ok) {
    const message = data?.error || (Array.isArray(data?.errors) ? data.errors.map((e: any) => e.msg).join(', ') : 'Request failed')
    const err: any = new Error(message)
    err.status = res.status
    err.payload = data
    throw err
  }

  return data as T
}
