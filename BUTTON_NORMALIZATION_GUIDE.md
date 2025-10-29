# Guía de Normalización de Botones

## Sistema Global de Botones (GlobalStyles.css)

Todos los componentes deben usar las clases globales de botones definidas en `GlobalStyles.css` para mantener consistencia.

### Clases Disponibles

#### Botones Principales
- `.btn` - Clase base para todos los botones
- `.btn-primary` - Botón primario (azul) - Para acciones principales
- `.btn-success` - Botón de éxito (verde) - Para confirmar/guardar/agregar
- `.btn-secondary` - Botón secundario (gris oscuro) - Para cancelar/volver
- `.btn-danger` - Botón de peligro (rojo) - Para eliminar/borrar
- `.btn-warning` - Botón de advertencia (naranja)
- `.btn-info` - Botón informativo (cyan)

#### Tamaños
- `.btn-sm` - Botón pequeño (36px altura)
- `.btn` (sin modificador) - Botón mediano (44px altura) - **Por defecto**
- `.btn-lg` - Botón grande (48px altura)
- `.btn-xl` - Botón extra grande (56px altura)

#### Variantes
- `.btn-outline-primary` - Botón outline primario
- `.btn-outline-secondary` - Botón outline secundario
- `.btn-outline-danger` - Botón outline de peligro
- `.btn-icon` - Botón circular para íconos solamente
- `.btn-block` - Botón de ancho completo

### Ejemplos de Uso

```jsx
// Botón principal (Crear, Aceptar)
<button className="btn btn-primary">
  Aceptar
</button>

// Botón de éxito (Guardar, Agregar)
<button className="btn btn-success">
  Guardar
</button>

// Botón secundario (Cancelar, Volver)
<button className="btn btn-secondary">
  Cancelar
</button>

// Botón de peligro (Eliminar)
<button className="btn btn-danger">
  Eliminar
</button>

// Botón con ícono circular
<button className="btn btn-secondary btn-icon" aria-label="Volver">
  <i className="bi bi-arrow-left"></i>
</button>

// Botón success con ícono circular
<button className="btn btn-success btn-icon" aria-label="Agregar">
  <i className="bi bi-plus-lg"></i>
</button>

// Botón pequeño
<button className="btn btn-success btn-sm">
  Agregar
</button>
```

### Actualiz aciones Necesarias por Componente

#### Routines.jsx
- `add-routine-btn` → `btn btn-success btn-icon`
- `add-exercise-btn` → `btn btn-success btn-lg`
- `create-first-routine-btn` → `btn btn-primary btn-lg`
- `modal-btn primary` → `btn btn-success`
- `modal-btn secondary` → `btn btn-secondary`
- `modal-close` → mantener custom (es un botón X especial)

#### Workouts.jsx
- `back-btn` → `btn btn-secondary btn-icon`
- `add-workout-btn` → `btn btn-success btn-icon`
- `create-first-workout-btn` → `btn btn-primary btn-lg`
- Botones en modales: igual que Routines

#### Exercises.jsx
- `back-btn` → `btn btn-secondary btn-icon`
- `add-exercise-btn` → `btn btn-success btn-icon`
- `create-first-exercise-btn` → `btn btn-primary btn-lg`
- `add-set-btn` → `btn btn-success`
- `remove-set-btn` → `btn btn-danger btn-icon btn-sm`
- Botones en modales: igual que anteriores

#### ProfileSettings.jsx
- `logout-button` → `btn btn-secondary btn-lg`
- `settings-button primary` → `btn btn-primary`
- `settings-button secondary` → `btn btn-secondary`
- `settings-button danger` → `btn btn-danger`

## Beneficios

1. **Consistencia**: Todos los botones se ven igual en toda la aplicación
2. **Tema oscuro**: Ya están adaptados al esquema oscuro
3. **Accesibilidad**: Tamaños mínimos táctiles (48px)
4. **Mantenibilidad**: Un solo lugar para actualizar estilos
5. **Menos CSS**: Eliminar CSS duplicado de cada componente
