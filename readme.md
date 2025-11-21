# Digiturno Frontend

Aplicación web frontend para la gestión de turnos (digiturno), desarrollada con **React + TypeScript + Vite**, utilizando **React Router**, **React Query**, **Zustand** y **Tailwind CSS**.  

Este documento constituye la **documentación de entrega** para que otro desarrollador pueda continuar con el mantenimiento y evolución del proyecto.

---

## 1. Tecnologías principales

- **Vite** (React + TS) – herramienta de desarrollo y empaquetado.
- **React 19** – librería de interfaz de usuario.
- **TypeScript** – tipado estático.
- **React Router DOM** – enrutamiento y navegación.
- **@tanstack/react-query** – manejo de estados remotos (fetch, cache, reintentos).
- **Zustand** – store global para autenticación y tenant.
- **Tailwind CSS 4** – estilos.
- **React Hook Form + Zod** – formularios y validación.
- **Sonner** – notificaciones tipo toast.
- **Lucide React** – iconos.

Archivo de referencia: `package.json`.

---

## 2. Requisitos previos

- **Node.js**: versión recomendada >= 20.x  
- **npm** (incluido con Node) o **pnpm/yarn** (opcional, aquí se documenta con `npm`).
- Acceso a la URL del backend (API REST), que se configura mediante variable de entorno `VITE_API_URL`.

---

## 3. Instalación del proyecto

1. Clonar o copiar el proyecto:
   ```bash
   # Ejemplo
   git clone <url-del-repo>
   cd Digiturno_Frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

   Esto utiliza la información de `package.json` para descargar todas las dependencias y devDependencies.

---

## 4. Configuración de variables de entorno

El frontend necesita saber a qué backend conectarse.  
Para ello se utiliza la variable de entorno **`VITE_API_URL`**.

1. En la raíz del proyecto, crear un archivo `.env` (no se sube a git por seguridad):
   ```bash
   touch .env
   ```

2. Definir la URL base de la API:
   ```env
   VITE_API_URL=https://tu-backend.com/api
   ```

   - Debe incluir la parte base que luego se completa con los paths, por ejemplo:  
     - `https://mi-servidor.com/api`  
     - `http://localhost:3000/api`

3. Uso interno:
   - En `src/api/client.ts`:
     ```ts
     const API_URL = import.meta.env.VITE_API_URL as string
     ```
   - La función `getApiUrl(path: string)` concatena `API_URL + path`.
   - `apiFetch` se usa en el código para todas las llamadas HTTP (`GET`, `POST`, etc.).

Si `VITE_API_URL` **no está configurada**, `getApiUrl` lanza error y la aplicación no podrá consumir la API.

---

## 5. Scripts disponibles (`package.json`)

En `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview"
}
```

- `npm run dev`  
  Levanta el servidor de desarrollo de Vite (por defecto en `http://localhost:5173`).

- `npm run build`  
  - Ejecuta el compilador de TypeScript (`tsc`) para verificar tipos.
  - Genera el build optimizado de producción en la carpeta `dist/` mediante Vite.

- `npm run preview`  
  Sirve el build de producción (contenido de `dist/`) en un servidor local para pruebas finales.

---

## 6. Estructura principal del proyecto

(Solo se listan las partes más relevantes para comprender la arquitectura.)

```text
Digiturno_Frontend/
  package.json
  tsconfig.json
  postcss.config.js
  tailwind.config.js
  index.html
  src/
    main.tsx
    App.tsx
    app/
      routes.tsx
      providers.tsx
    api/
      client.ts
    auth/
      auth.store.ts
    tenant/
      tenant.store.ts
    pages/
      login/
        Login.tsx
      public/
        CrearTurno.tsx
        SeleccionTramite.tsx
        IdentificacionTurno.tsx
        KioskTurno.tsx
        CedulaTurno.tsx
        DatosTurno.tsx
        Tramites.tsx
      superadmin/
        Tenants.tsx
        Admins.tsx
      admin/
        Users.tsx
        Dashboard.tsx
      usuario/
        Turnos.tsx
        Historial.tsx
  public/
    brand/novatechh.svg
    ...
```

### 6.1 `src/main.tsx`

Punto de entrada de la aplicación.  
Realiza el render de `App.tsx` dentro de `ReactDOM.createRoot`, incluyendo `AppProviders` y `AppRoutes`.

### 6.2 `src/app/providers.tsx`

Define proveedores globales de la aplicación:

```ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}
```

- **React Query**: caché y manejo de peticiones asíncronas.
- **Sonner**: notificaciones globales (`Toaster`).

### 6.3 `src/app/routes.tsx`

Configura todas las rutas de la aplicación usando `createBrowserRouter`.  
Puntos clave:

- Componente `Layout`:
  - Administra el header, logo de Novatechh y logo del tenant.
  - Detecta modo kiosk por query param `?kiosk=1` para ajustar el layout.
  - Muestra botón de "Cerrar sesión" si el usuario está autenticado.
  - Renderiza el contenido de la ruta actual a través de `<Outlet />`.

- Componente `RoleGuard`:
  - Recibe un array `allow` con roles permitidos (`SuperAdmin`, `Admin`, `Usuario`).
  - Valida:
    - Que exista `token` y `user`, que no esté expirado (`expiresAt`).
    - Que el usuario tenga al menos un rol permitido.
  - Si no pasa las validaciones, redirige a `/login`.

- Rutas principales:
  - Rutas públicas:
    - `/login`
    - `/public/turno`, `/public/tramites`, `/public/turno/identificacion`, `/public/turno/kiosk`, `/public/turno/cedula`, `/public/turno/datos`
  - Rutas privadas, protegidas con `RoleGuard`:
    - `superadmin`: gestión de tenants y admins
      - `/superadmin`
      - `/superadmin/:tenantId/admins`
    - `admin`: panel de administración
      - `/admin` (usuarios)
      - `/admin/dashboard`
    - `usuario`: vista de usuario final
      - `/usuario`
      - `/usuario/historial`

- `DashboardRedirect`:
  - Según el rol del usuario, redirige a `/superadmin`, `/admin` o `/usuario`.

### 6.4 `src/auth/auth.store.ts`

Manejo de autenticación global con **Zustand**.

- Tipo `User`:
  - `id`, `email`, `nombre`, `roles: Role[]`, `tenantId?`.
- Tipo `Role`:
  - `'SuperAdmin' | 'Admin' | 'Usuario'`.

- `useAuth` expone:
  - `token: string | null`
  - `user: User | null`
  - `expiresAt: number | null`
  - `login(token, user, ttlMinutes?)`
  - `logout()`

- **Persistencia en localStorage**:
  - En el login:
    - Guarda `{ token, user, expiresAt }` en `localStorage` bajo la clave `'auth'`.
  - Al cargar el módulo:
    - Lee `localStorage.getItem('auth')`.
    - Valida `expiresAt`; si está expirado, limpia el storage.
    - Si es válido, rehidrata el estado de `useAuth`.

- **Auto logout**:
  - `setInterval` cada 30 segundos revisa si `expiresAt` ya pasó:
    - Si sí, ejecuta `logout()`.

### 6.5 `src/tenant/tenant.store.ts`

Maneja el **logo del tenant** y lo persiste en `localStorage`.

- Estado:
  - `logoUrl: string`
  - `setLogoUrl(url: string, tenantId?: string)`

- Lógica:
  - Obtiene `tenantId` actual desde `localStorage` (leyendo el usuario en `'auth'`).
  - Construye una clave específica por tenant:  
    - `tenant_logo_url_<tenantId>` o `tenant_logo_url` genérico.
  - Al cambiar el logo:
    - Lo guarda en `localStorage`.
    - Actualiza el estado global de `logoUrl`.

- Uso:
  - En el `Layout` (rutas), se muestra el logo del tenant si:
    - Hay `logoUrl`.
    - El usuario **no** es `SuperAdmin` ni `Usuario` (caso Admin / Backoffice del tenant).

### 6.6 `src/api/client.ts`

Wrapper centralizado para llamadas HTTP al backend.

- Definición:
  - `type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'`
- `getApiUrl(path: string)`:
  - Lanza error si `VITE_API_URL` no está configurada.
  - Concatena la base con el `path`.
- `apiFetch<T>(path, { method, body, token })`:
  - Configura headers, incluyendo `Authorization: Bearer <token>` si se proporciona.
  - Realiza `fetch`.
  - Maneja:
    - Respuesta 204 (sin body).
    - Intento de parsear `JSON`.
    - Errores HTTP:
      - Extrae mensaje desde `data.error` o `data.errors`.
      - Adjunta `status` y `payload` en el error.

Todas las peticiones deberían usar este helper para mantener comportamiento consistente.

---

## 7. Flujo funcional de alto nivel

- **Público / Kiosko**:
  - Rutas `public/*` permiten:
    - Crear turnos desde una interfaz pública (pantallas de kiosko).
    - Identificar al ciudadano y seleccionar trámite.
    - Ver datos y cédula asociada al turno.
  - Ruta especial `public/turno/kiosk` para vista tipo kiosko (detectada por query param y/o layout).

- **Autenticación**:
  - El usuario ingresa por `/login`.
  - El backend devuelve `token`, `user` y (probablemente) TTL.
  - El frontend llama a `useAuth.getState().login(...)`.
  - Toda la navegación privada se controla con `RoleGuard`.

- **Roles**:
  - `SuperAdmin`:
    - Gestión global de tenants (`/superadmin`).
    - Gestión de administradores por tenant (`/superadmin/:tenantId/admins`).
  - `Admin`:
    - Gestión de usuarios y panel administrativo del tenant (`/admin`, `/admin/dashboard`).
  - `Usuario`:
    - Visualizar turnos y su historial (`/usuario`, `/usuario/historial`).

---

## 8. Estilos y diseño

- **Tailwind CSS 4**:
  - Configuración en `tailwind.config.js`.
  - Se utiliza en toda la aplicación a través de clases en los componentes React.

- **Branding**:
  - Logo base en `public/brand/novatechh.svg`.
  - Logo de tenant dinámico a través de `useTenant`.

---

## 9. Cómo ejecutar en modo desarrollo

1. Asegurarse de tener `.env` configurado con `VITE_API_URL`.
2. Ejecutar:
   ```bash
   npm run dev
   ```
3. Abrir el navegador en:
   - `http://localhost:5173` (por defecto).

Vite recarga automáticamente al guardar cambios en los archivos fuente.

---

## 10. Cómo generar el build de producción

1. Ejecutar:
   ```bash
   npm run build
   ```
2. Se generará la carpeta `dist/` con los archivos estáticos optimizados.

Para probar el build localmente:

```bash
npm run preview
# luego abrir la URL que muestra la consola, típicamente http://localhost:4173
```

---

## 11. Despliegue

El contenido de `dist/` es **estático** y se puede desplegar en cualquier servicio de hosting de archivos estáticos, por ejemplo:

- Nginx / Apache sirviendo los archivos.
- Servicios tipo Vercel, Netlify, GitHub Pages (ajustando configuración de SPA / 404 hacia `index.html`).

Puntos a considerar:

- Configurar `VITE_API_URL` adecuada para el entorno de producción antes de ejecutar `npm run build`.
- Asegurar que el servidor esté configurado para redirigir rutas no encontradas a `index.html` (single-page application).

---

## 12. Siguientes pasos sugeridos para quien continúa el proyecto

- **Integración con backend**:
  - Revisar todos los endpoints utilizados en `src/api/` (si se agregan más helpers).
  - Mantener la cohesión usando `apiFetch` para todas las llamadas.

- **Manejo de errores y UX**:
  - Unificar manejo de errores globales (401, 403, etc.) usando interceptores o wrappers.
  - Extender el uso de `sonner` para notificaciones consistentes.

- **Gestión de estado**:
  - Mantener `auth` y `tenant` únicamente vía stores de `Zustand`.
  - Evitar replicar información en otros estados globales.

---

## 13. Contacto / Notas del desarrollador original

- El proyecto está preparado para ser extendido:
  - Añadiendo nuevas páginas bajo `src/pages/...`.
  - Añadiendo nuevas rutas en `src/app/routes.tsx`.
  - Reutilizando el patrón de stores con `Zustand` para nuevos estados globales.
- Cualquier duda sobre roles, tenants o flujos específicos deberá alinearse con la lógica del backend y los requerimientos del cliente.
