# Estilos

Sistema de estilos 100% custom usando SASS/SCSS. No se utilizan frameworks CSS como Tailwind o Bootstrap.

## Estructura

```
styles/
├── _theme.scss      # Variables del design system
├── _mixins.scss     # Mixins reutilizables
└── main.scss        # Estilos globales
```

## Design System

### Variables Globales (`_theme.scss`)

Todas las variables están centralizadas en este archivo:

#### Colores

```scss
$color-primary: #0d4b85;
$color-primary-light: #1a6ba8;
$color-primary-dark: #0a3a6b;
// ... más colores
```

**Regla crítica**: Prohibido usar colores hexadecimales directos en componentes. Todo debe usar variables SASS.

#### Tipografía

```scss
$font-size-xs: 0.75rem; // 12px
$font-size-sm: 0.875rem; // 14px
$font-size-base: 1rem; // 16px
// ... más tamaños
```

#### Espaciado

```scss
$spacing-xs: 0.25rem; // 4px
$spacing-sm: 0.5rem; // 8px
$spacing-md: 1rem; // 16px
// ... más espaciados
```

#### Breakpoints (Mobile First)

```scss
$breakpoint-xs: 320px;
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;
```

## 🔧 Mixins (`_mixins.scss`)

### Media Queries

```scss
@include respond-to(md) {
  // Estilos para tablet y superior
}
```

### Utilidades

```scss
@include flex-center; // Flexbox centrado
@include flex-between; // Flexbox space-between
@include truncate; // Texto truncado
@include card; // Estilo de tarjeta
@include custom-scrollbar; // Scrollbar personalizado
```

## Uso en Componentes

### Importar Mixins

```scss
@import "../../styles/mixins";

.mi-componente {
  // Estilos aquí
}
```

### Usar Variables

```scss
.mi-componente {
  padding: $spacing-md;
  background-color: $color-white;
  color: $color-gray-900;
  border-radius: $border-radius-md;
  box-shadow: $shadow-sm;
}
```

### Mobile First

```scss
.mi-componente {
  padding: $spacing-md; // Mobile

  @include respond-to(md) {
    padding: $spacing-lg; // Tablet y superior
  }

  @include respond-to(lg) {
    padding: $spacing-xl; // Desktop
  }
}
```

## Cómo Añadir Nuevas Variables

1. **Abrir `_theme.scss`**
2. **Añadir la variable en la sección correspondiente**

   ```scss
   // Colores
   $color-nuevo: #HEX;

   // Espaciado
   $spacing-nuevo: 2rem;
   ```

3. **Usar la variable en los componentes**

## Cómo Añadir Nuevos Mixins

1. **Abrir `_mixins.scss`**
2. **Crear el mixin**
   ```scss
   @mixin mi-mixin($parametro) {
     // Código del mixin
   }
   ```
3. **Usar en componentes**
   ```scss
   @include mi-mixin(valor);
   ```

## Reglas Estrictas

1. **NO usar colores hexadecimales directos**

   ```scss
   // MAL
   .componente {
     color: #ff0000;
   }

   // ✅ BIEN
   .componente {
     color: $color-error;
   }
   ```

2. **NO usar valores hardcodeados para espaciado**

   ```scss
   // MAL
   .componente {
     padding: 16px;
   }

   // BIEN
   .componente {
     padding: $spacing-md;
   }
   ```

3. **Siempre Mobile First**

   ```scss
   // BIEN
   .componente {
     font-size: $font-size-base;

     @include respond-to(md) {
       font-size: $font-size-lg;
     }
   }
   ```

4. **Usar mixins para media queries**

   ```scss
   // MAL
   @media (min-width: 768px) {
     // ...
   }

   // BIEN
   @include respond-to(md) {
     // ...
   }
   ```

## Unidades Especiales

Para pantallas grandes (TVs), usar unidades relativas:

```scss
// Para vistas de TV/kiosco
.turnos-publicos {
  font-size: 5vh; // Viewport height
  padding: 2vw; // Viewport width
}
```

## Buenas Prácticas

1. **Organización**: Agrupar estilos relacionados
2. **Especificidad**: Evitar selectores muy específicos
3. **Reutilización**: Usar mixins y variables
4. **Nomenclatura**: BEM o similar para clases
5. **Comentarios**: Documentar secciones complejas

## Recursos

- [SASS Documentation](https://sass-lang.com/documentation)
- Variables disponibles en `_theme.scss`
- Mixins disponibles en `_mixins.scss`

