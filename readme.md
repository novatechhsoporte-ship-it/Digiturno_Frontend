# Digiturno Frontend

Sistema de gestión de turnos para notarías - Frontend multiplataforma desarrollado con React y JavaScript.

## 📋 Stack Tecnológico

### Core

- **React 19** - Librería de interfaz de usuario
- **JavaScript (ES Modules)** - Lenguaje de programación
- **Vite** - Herramienta de desarrollo y build
- **React Router DOM** - Enrutamiento y navegación

### Estilos

- **SASS/SCSS** - Preprocesador CSS (100% custom, sin frameworks CSS)
- **Design System** - Variables centralizadas en `src/styles/_theme.scss`
- **Mobile First** - Enfoque responsive desde móvil

### Estado y Datos

- **Zustand** - Gestión de estado global
- **@tanstack/react-query** - Manejo de datos remotos y caché
- **Axios** - Cliente HTTP con interceptores personalizados
- **Socket.IO Client** - Comunicación en tiempo real

### Componentes

- **@iconify/react** - Iconos SVG desde Iconify

## 🚀 Instalación

### Requisitos Previos

- Node.js >= 18.x
- npm o yarn

### Pasos

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repo>
   cd Digiturno_Frontend
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crear archivo `.env` en la raíz:

   ```env
   VITE_API_URL=http://localhost:4000/api
   VITE_SOCKET_URL=http://localhost:4000
   ```

4. **Ejecutar en desarrollo**

   ```bash
   npm run dev
   ```

5. **Build de producción**
   ```bash
   npm run build
   ```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Átomos (Button, Input, Text, Icon)
│   └── layout/         # Layout (Sidebar, Navbar, Layout)
├── views/              # Páginas completas
│   ├── Login/
│   ├── Dashboard/
│   ├── Notarias/
│   ├── Usuarios/
│   ├── Modulos/
│   ├── TurnosPublicos/
│   └── Operador/
├── features/            # Lógica por módulos (pendiente)
├── store/              # Stores de Zustand
│   ├── authStore.js
│   └── tenantStore.js
├── services/           # Servicios externos
│   ├── api/
│   │   └── axiosClient.js
│   └── socket/
│       └── socketClient.js
├── hooks/              # Custom hooks
│   ├── useAuth.js
│   ├── useUser.js
│   └── useLogout.js
├── constants/          # Constantes y datos mock
│   ├── menu.js
│   └── mockData.js
└── styles/             # Estilos globales
    ├── _theme.scss     # Variables del design system
    ├── _mixins.scss    # Mixins reutilizables
    └── main.scss       # Estilos globales
```

## 🎨 Design System

### Variables SASS

Todas las variables están centralizadas en `src/styles/_theme.scss`:

- **Colores**: Paleta profesional y sobria
- **Tipografía**: Escala legible y jerárquica
- **Espaciado**: Sistema consistente de spacing
- **Sombras**: Elevaciones predefinidas
- **Bordes**: Radios y estilos uniformes

**Regla importante**: Prohibido usar colores hexadecimales directos. Todo debe usar variables SASS.

### Breakpoints (Mobile First)

```scss
$breakpoint-xs: 320px;
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;
```

## 🔧 Configuración

### Variables de Entorno

- `VITE_API_URL`: URL base de la API REST
- `VITE_SOCKET_URL`: URL del servidor Socket.IO

### Autenticación

El sistema usa JWT almacenado en Zustand con persistencia en localStorage. Los hooks de autenticación están configurados pero sin lógica de bloqueo aún (según requerimientos).

## 📱 Vistas Disponibles

### Públicas (sin autenticación)

- `/login` - Página de inicio de sesión
- `/turnos-publicos` - Creación de turnos (optimizada para TV)

### Protegidas (requieren autenticación)

- `/dashboard` - Panel administrativo con estadísticas
- `/notarias` - Gestión de notarías (SuperAdmin)
- `/usuarios` - Gestión de usuarios (Admin)
- `/modulos` - Gestión de módulos (Admin)
- `/operador` - Panel de operador para llamar turnos

## 🧩 Componentes Base

### Button

```jsx
<Button variant='primary' size='md' onClick={handleClick}>
  Texto del botón
</Button>
```

Variantes: `primary`, `secondary`, `outline`, `ghost`, `danger`
Tamaños: `sm`, `md`, `lg`

### Input

```jsx
<Input label='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
```

### Icon

```jsx
<Icon name='mdi:home' size='md' color='currentColor' />
```

Todos los iconos deben ser de Iconify (formato: `collection:icon-name`)

### Text

```jsx
<Text variant='body' weight='medium' color='primary'>
  Contenido del texto
</Text>
```

## 🔌 Servicios

### Axios Client

Cliente HTTP con interceptores para:

- Agregar token JWT automáticamente
- Manejo de errores 400/500 con logs
- Redirección automática en 401

### Socket.IO Client

Configurado con logs básicos para verificar la "tubería" de tiempo real. Se inicializa automáticamente al cargar la app.

## 📚 Documentación Adicional

- [Componentes](./src/components/README.md)
- [Estilos](./src/styles/README.md)
- [Features](./src/features/README.md)

## 🚧 Estado del Proyecto

- ✅ Arquitectura base implementada
- ✅ Design System con SASS
- ✅ Componentes atomizados
- ✅ Vistas con datos mock
- ✅ Configuración de servicios (Axios, Socket.IO)
- ✅ Hooks de autenticación (estructura sin bloqueo)
- ⏳ Integración completa con backend
- ⏳ Validación de rutas por roles
- ⏳ Formularios completos de creación/edición

## 📝 Notas

- El proyecto está en JavaScript puro (no TypeScript)
- Todos los estilos son custom con SASS (sin Tailwind ni Bootstrap)
- La vista de Turnos Públicos usa unidades relativas (vh/vw) para adaptarse a televisores grandes
- Los datos mock están en `src/constants/mockData.js`

## 👥 Desarrollo

Para continuar el desarrollo, consulta los README específicos en cada carpeta principal para entender cómo añadir nuevos elementos siguiendo la arquitectura establecida.
