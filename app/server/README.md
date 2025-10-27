# My Track Fit API v2.0

Backend de la aplicación My Track Fit desarrollado con Node.js, Express y Supabase.

## 🚀 Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Supabase** - Base de datos PostgreSQL y autenticación
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Encriptación de contraseñas

## 📁 Estructura del Proyecto

```
app/server/
├── config/              # Configuración (Supabase, middleware)
│   ├── database.js      # Helpers de Supabase
│   ├── middleware.js    # Middleware de autenticación
│   └── supabase.js      # Cliente de Supabase
├── models/              # Modelos de datos
│   ├── exercise.model.js
│   ├── injury.model.js
│   ├── nutrition.model.js
│   ├── routine.model.js
│   ├── statistics.model.js
│   └── user.model.js
├── routes/              # Rutas de la API
│   ├── auth.routes.js
│   ├── exercise.routes.js
│   ├── injury.routes.js
│   ├── nutrition.routes.js
│   ├── routine.routes.js
│   └── statistics.routes.js
├── services/            # Lógica de negocio
│   ├── auth.service.js
│   ├── exercise.service.js
│   ├── injury.service.js
│   ├── nutrition.service.js
│   ├── routine.service.js
│   └── statistics.service.js
└── index.js             # Punto de entrada del servidor
```

## 🔧 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno (ver `.env.example`):
```env
SUPABASE_URL=tu_supabase_url
SUPABASE_KEY=tu_supabase_anon_key
JWT_SECRET=tu_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

3. Ejecutar el servidor:
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📡 API Endpoints

### Autenticación (`/api/auth`)
- `POST /register` - Registrar usuario
- `POST /login` - Iniciar sesión
- `GET /profile` - Obtener perfil (requiere auth)
- `PUT /profile` - Actualizar perfil (requiere auth)
- `GET /verify` - Verificar token (requiere auth)

### Ejercicios (`/api/exercises`)
- `GET /` - Obtener todos los ejercicios
- `GET /search?q=` - Buscar ejercicios
- `GET /category/:categoria` - Obtener por categoría
- `GET /:id` - Obtener ejercicio por ID
- `POST /` - Crear ejercicio
- `PUT /:id` - Actualizar ejercicio
- `DELETE /:id` - Eliminar ejercicio

### Rutinas (`/api/routines`)
- `GET /` - Obtener rutinas del usuario
- `GET /:id` - Obtener rutina completa por ID
- `POST /` - Crear rutina
- `PUT /:id` - Actualizar rutina
- `PATCH /:id/toggle` - Activar/desactivar rutina
- `DELETE /:id` - Eliminar rutina

#### Entrenamientos
- `GET /:routineId/workouts` - Obtener entrenamientos de rutina
- `POST /:routineId/workouts` - Crear entrenamiento
- `PUT /workouts/:workoutId` - Actualizar entrenamiento
- `DELETE /workouts/:workoutId` - Eliminar entrenamiento

#### Ejercicios en Entrenamientos
- `POST /workouts/:workoutId/exercises` - Agregar ejercicios
- `PUT /exercises/:instanceId` - Actualizar ejercicio
- `DELETE /exercises/:instanceId` - Eliminar ejercicio

### Nutrición (`/api/nutrition`)

#### Alimentos
- `GET /foods` - Obtener alimentos
- `GET /foods/search?q=` - Buscar alimentos
- `POST /foods` - Crear alimento

#### Registros
- `GET /logs?fecha=` - Obtener registros por fecha
- `GET /logs?fechaInicio=&fechaFin=` - Obtener por rango
- `GET /summary?fecha=` - Resumen del día
- `POST /logs` - Crear registro
- `PUT /logs/:id` - Actualizar registro
- `DELETE /logs/:id` - Eliminar registro

#### Objetivos
- `GET /goals` - Obtener objetivos
- `POST /goals` - Crear/actualizar objetivos
- `PUT /goals` - Actualizar objetivos

### Lesiones (`/api/injuries`)
- `GET /` - Obtener lesiones del usuario
- `GET /?active=true` - Obtener lesiones activas
- `GET /body-part/:parteCuerpo` - Obtener por parte del cuerpo
- `GET /:id` - Obtener lesión por ID
- `POST /` - Crear lesión
- `PUT /:id` - Actualizar lesión
- `PATCH /:id/status` - Cambiar estado
- `DELETE /:id` - Eliminar lesión

### Estadísticas (`/api/statistics`)

#### Métricas
- `GET /metrics?fecha=` - Obtener métricas por fecha
- `GET /metrics?fechaInicio=&fechaFin=` - Por rango
- `GET /metrics?last=30` - Últimas N métricas
- `POST /metrics` - Guardar métricas
- `GET /summary?days=30` - Resumen estadístico

#### Archivos
- `GET /files` - Obtener archivos de usuario
- `PUT /files/:fileType` - Actualizar archivo

## 🔒 Autenticación

La API usa JWT (JSON Web Tokens). Para acceder a rutas protegidas, incluye el token en el header:

```
Authorization: Bearer {tu_token}
```

## 🗄️ Base de Datos (Supabase)

Las tablas principales son:
- `users` - Usuarios
- `exercises` - Ejercicios base
- `rutinas` - Rutinas de usuario
- `entrenamientos` - Entrenamientos dentro de rutinas
- `exercise_instances` - Ejercicios en entrenamientos
- `AlimentosBase` - Alimentos disponibles
- `NutricionTemporal` - Registros nutricionales
- `ObjetivosNutricionales` - Objetivos nutricionales
- `LesionesTemporales` - Lesiones del usuario
- `MetricasDiarias` - Métricas diarias
- `ArchivosUsuario` - Archivos JSONB del usuario

## 📝 Notas

- Todas las rutas (excepto `/api/auth/register` y `/api/auth/login`) requieren autenticación
- Las respuestas siguen el formato: `{ success: boolean, data?: any, error?: string, message?: string }`
- Supabase maneja automáticamente las conexiones a PostgreSQL
- Las políticas RLS (Row Level Security) deben configurarse en Supabase para mayor seguridad

## 🔄 Scripts Disponibles

```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar con nodemon (desarrollo)
npm run client     # Iniciar cliente React
npm run dev:both   # Iniciar servidor y cliente
npm run build      # Build del cliente
```

## 🤝 Contribución

1. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
2. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
3. Push a la rama (`git push origin feature/AmazingFeature`)
4. Abre un Pull Request

## 📄 Licencia

ISC
