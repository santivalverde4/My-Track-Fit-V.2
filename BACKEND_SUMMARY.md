# 📋 Resumen del Backend - My Track Fit v2.0

## ✅ Backend Completado

### 📂 Estructura Creada

```
My-Track-Fit-V.2/
├── .env                          # Variables de entorno (CONFIGURAR!)
├── .env.example                  # Ejemplo de variables de entorno
├── SETUP.md                      # Guía de configuración completa
├── package.json                  # Dependencias actualizadas
│
└── app/server/
    ├── index.js                  # 🚀 Servidor principal Express
    ├── README.md                 # Documentación de la API
    ├── scripts.sql               # Script SQL existente
    │
    ├── config/                   # ⚙️ Configuración
    │   ├── supabase.js          # Cliente de Supabase
    │   ├── database.js          # Helpers de base de datos
    │   └── middleware.js        # Middleware de autenticación JWT
    │
    ├── models/                   # 📊 Modelos de datos
    │   ├── user.model.js        # Usuarios
    │   ├── exercise.model.js    # Ejercicios base
    │   ├── routine.model.js     # Rutinas, entrenamientos, instancias
    │   ├── nutrition.model.js   # Alimentos, logs, objetivos
    │   ├── injury.model.js      # Lesiones
    │   └── statistics.model.js  # Métricas y archivos de usuario
    │
    ├── services/                 # 🔧 Lógica de negocio
    │   ├── auth.service.js      # Autenticación y perfiles
    │   ├── exercise.service.js  # CRUD de ejercicios
    │   ├── routine.service.js   # Gestión de rutinas completas
    │   ├── nutrition.service.js # Nutrición y objetivos
    │   ├── injury.service.js    # Gestión de lesiones
    │   └── statistics.service.js # Métricas y estadísticas
    │
    └── routes/                   # 🛣️ Endpoints de la API
        ├── auth.routes.js       # /api/auth
        ├── exercise.routes.js   # /api/exercises
        ├── routine.routes.js    # /api/routines
        ├── nutrition.routes.js  # /api/nutrition
        ├── injury.routes.js     # /api/injuries
        └── statistics.routes.js # /api/statistics
```

## 🎯 Endpoints Disponibles

### 🔐 Autenticación (`/api/auth`)
- `POST /register` - Registrar usuario
- `POST /login` - Iniciar sesión
- `GET /profile` - Ver perfil
- `PUT /profile` - Actualizar perfil
- `GET /verify` - Verificar token

### 💪 Ejercicios (`/api/exercises`)
- `GET /` - Listar ejercicios
- `GET /search?q=` - Buscar
- `GET /category/:categoria` - Por categoría
- `POST /` - Crear
- `PUT /:id` - Actualizar
- `DELETE /:id` - Eliminar

### 📅 Rutinas (`/api/routines`)
- `GET /` - Mis rutinas
- `GET /:id` - Ver rutina completa
- `POST /` - Crear rutina
- `PUT /:id` - Actualizar
- `PATCH /:id/toggle` - Activar/desactivar
- `DELETE /:id` - Eliminar

#### Entrenamientos
- `GET /:routineId/workouts`
- `POST /:routineId/workouts`
- `PUT /workouts/:workoutId`
- `DELETE /workouts/:workoutId`

#### Ejercicios en Entrenamientos
- `POST /workouts/:workoutId/exercises`
- `PUT /exercises/:instanceId`
- `DELETE /exercises/:instanceId`

### 🥗 Nutrición (`/api/nutrition`)
- `GET /foods` - Alimentos base
- `GET /foods/search?q=` - Buscar alimentos
- `POST /foods` - Crear alimento
- `GET /logs` - Registros nutricionales
- `POST /logs` - Crear registro
- `GET /summary?fecha=` - Resumen del día
- `GET /goals` - Objetivos nutricionales
- `POST /goals` - Establecer objetivos

### 🤕 Lesiones (`/api/injuries`)
- `GET /` - Mis lesiones
- `GET /?active=true` - Solo activas
- `GET /body-part/:parte` - Por zona del cuerpo
- `POST /` - Registrar lesión
- `PUT /:id` - Actualizar
- `PATCH /:id/status` - Cambiar estado
- `DELETE /:id` - Eliminar

### 📊 Estadísticas (`/api/statistics`)
- `GET /metrics?fecha=` - Métricas por fecha
- `GET /metrics?last=30` - Últimas métricas
- `POST /metrics` - Guardar métricas
- `GET /summary?days=30` - Resumen estadístico
- `GET /files` - Archivos JSONB del usuario
- `PUT /files/:fileType` - Actualizar archivo

## 🔑 Tecnologías Utilizadas

- **Express 5.1.0** - Framework web
- **Supabase** - Base de datos PostgreSQL
- **@supabase/supabase-js** - Cliente oficial
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas
- **CORS** - Manejo de Cross-Origin
- **dotenv** - Variables de entorno
- **nodemon** - Auto-reload en desarrollo

## 📝 Pasos para Iniciar

### 1. Configurar `.env`
```bash
cp .env.example .env
# Editar .env con tus credenciales de Supabase
```

### 2. Instalar dependencias (ya hecho ✅)
```bash
npm install
```

### 3. Ejecutar script SQL en Supabase
- Ir a Supabase SQL Editor
- Copiar contenido de `app/server/scripts.sql`
- Ejecutar

### 4. Iniciar servidor
```bash
npm run dev
```

### 5. Verificar
```bash
curl http://localhost:5000/health
```

## 🎨 Arquitectura del Backend

### Flujo de una Petición

```
Cliente → Express Router → Middleware Auth → Service Layer → Model → Supabase → PostgreSQL
                                ↓
                           Validación JWT
                                ↓
                           req.user = { userId, username }
```

### Capas de Separación

1. **Routes** - Manejo HTTP, validación de requests
2. **Services** - Lógica de negocio, validaciones complejas
3. **Models** - Queries a Supabase, acceso a datos
4. **Config** - Configuración, middleware, utilidades

### Ventajas de esta Arquitectura

✅ **Separación de responsabilidades** - Código organizado y mantenible
✅ **Escalabilidad** - Fácil agregar nuevas features
✅ **Testeable** - Cada capa puede probarse independientemente
✅ **Reutilizable** - Services y models pueden usarse en múltiples rutas
✅ **Seguro** - Autenticación centralizada con middleware

## 🔒 Seguridad Implementada

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ JWT con secret key para autenticación
- ✅ Middleware de autenticación en todas las rutas protegidas
- ✅ CORS configurado para frontend específico
- ✅ Variables sensibles en .env (no en el código)
- ✅ Validación de datos en services
- ⚠️ RLS de Supabase (opcional, ver SETUP.md)

## 📦 Base de Datos Supabase

### Tablas Principales
- `users` - Usuarios del sistema
- `exercises` - Catálogo de ejercicios
- `rutinas` - Rutinas de entrenamiento
- `entrenamientos` - Días de entrenamiento
- `exercise_instances` - Ejercicios con configuración
- `AlimentosBase` - Catálogo de alimentos
- `NutricionTemporal` - Logs de comidas
- `ObjetivosNutricionales` - Metas nutricionales
- `LesionesTemporales` - Registro de lesiones
- `MetricasDiarias` - Peso, sueño, etc.
- `ArchivosUsuario` - Datos JSONB adicionales

## 🚀 Siguientes Pasos Recomendados

1. **Configurar Supabase** (ver SETUP.md)
   - Obtener SUPABASE_KEY
   - Ejecutar scripts.sql
   - Actualizar .env

2. **Probar API**
   - Usar Thunder Client o Postman
   - Probar registro y login
   - Verificar token en rutas protegidas

3. **Conectar Frontend**
   - Actualizar service api.js del cliente
   - Implementar autenticación
   - Consumir endpoints

4. **Opcional: Mejorar**
   - Agregar validaciones con Joi/Zod
   - Implementar rate limiting
   - Agregar logs con Winston
   - Tests con Jest
   - Documentación con Swagger

## 💡 Tips

- Todos los archivos usan **ES Modules** (`import/export`)
- Las respuestas siempre tienen formato `{ success, data?, error?, message? }`
- Los errores se manejan con try/catch en cada ruta
- Supabase maneja automáticamente las conexiones a PostgreSQL
- No necesitas pool de conexiones, Supabase lo gestiona

## 🆘 Soporte

Si tienes problemas:
1. Revisa `SETUP.md` para configuración detallada
2. Verifica logs del servidor en la terminal
3. Comprueba que `.env` está configurado correctamente
4. Asegúrate de que Supabase tiene las tablas creadas
5. Verifica que el token JWT es válido

---

**¡El backend está 100% completo y listo para usar! 🎉**
