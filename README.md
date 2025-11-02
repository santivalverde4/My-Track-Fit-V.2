# My Track Fit V.2

Aplicación completa de fitness con frontend React (Vite) y backend Node.js/Express que permite a los usuarios gestionar entrenamientos, nutrición, lesiones y estadísticas personales con un sistema de autenticación robusto y base de datos PostgreSQL en Supabase.

## Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Ejecutar la Aplicación](#ejecutar-la-aplicación)
- [API Endpoints](#api-endpoints)
- [Arquitectura del Backend](#arquitectura-del-backend)
- [Base de Datos](#base-de-datos)
- [Scripts Disponibles](#scripts-disponibles)
- [Seguridad](#seguridad)
- [Contribuir](#contribuir)

## Características

### Implementadas

**Autenticación y Usuarios**
- Sistema de registro e inicio de sesión con JWT
- Confirmación de cuenta por email
- Recuperación de contraseña por email
- Gestión de perfil de usuario
- Cambio de contraseña con validación de contraseña actual
- Eliminación de cuenta con confirmación por contraseña
- Autenticación persistente con tokens
- Soft delete (usuarios inactivos permiten reutilizar email/username)

**Sistema de Entrenamientos**
- Gestión completa de rutinas personalizadas
- Creación, edición y eliminación de rutinas
- Creación, edición y eliminación de entrenamientos por rutina
- Catálogo de ejercicios con categorías
- Adición, edición y eliminación de ejercicios en entrenamientos
- Configuración de series, repeticiones, peso y descanso
- Notas personalizadas por serie
- Activación/desactivación de rutinas
- Interfaz responsive con navegación jerárquica (Rutinas → Entrenamientos → Ejercicios)

**Nutrición**
- Registro diario de comidas (desayuno, almuerzo, cena, merienda)
- Catálogo de alimentos base con información nutricional
- Cálculo automático de macronutrientes
- Objetivos nutricionales personalizados
- Resumen nutricional por día

**Gestión de Lesiones**
- Registro de lesiones con nivel de severidad
- Seguimiento por parte del cuerpo afectada
- Estados: activa, en recuperación, curada
- Tiempo estimado de recuperación
- Historial completo de lesiones

**Estadísticas y Métricas**
- Registro diario de peso corporal
- Seguimiento de horas de sueño
- Resúmenes estadísticos con promedios
- Archivos JSONB para datos adicionales
- Visualización de progreso histórico
- Gráficos interactivos con Recharts (lesiones, nutrición)
- Filtrado por rango de tiempo (7, 14, 30 días)
- Interfaz responsive y adaptativa

**Smart Trainer**
- Interfaz de chat con IA (preparado para integración)
- Renderizado de respuestas en Markdown
- Persistencia de conversación durante la sesión con localStorage
- Función de limpiar conversación
- Diseño de chat profesional y responsive
- Timeout extendido (120s) para respuestas de IA
- Recomendaciones personalizadas (en desarrollo)
- Análisis de progreso (en desarrollo)

### En Desarrollo

- Integración completa con APIs de IA (OpenAI, Claude, Gemini)
- Sistema completo de notificaciones y recordatorios
- Exportación de datos en múltiples formatos
- PWA (Progressive Web App) para instalación móvil
- Modo offline con sincronización
- Compartir rutinas entre usuarios

## Stack Tecnológico

### Frontend
- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento del lado del cliente
- **React Icons** - Librería de íconos (fa, ri, io5)
- **React Markdown** - Renderizado de Markdown para respuestas de IA
- **Recharts** - Librería de gráficos para visualización de estadísticas
- **CSS3** - Estilos personalizados con variables CSS

### Backend
- **Node.js** - Runtime de JavaScript
- **Express 5** - Framework web
- **Supabase** - Base de datos PostgreSQL (BaaS)
- **@supabase/supabase-js** - Cliente oficial de Supabase
- **JWT (jsonwebtoken)** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas
- **nodemailer** - Envío de emails (recuperación de contraseña)
- **CORS** - Manejo de Cross-Origin Resource Sharing
- **dotenv** - Variables de entorno

### Desarrollo
- **nodemon** - Auto-restart en desarrollo
- **concurrently** - Ejecutar múltiples comandos
- **ESLint** - Linter de código

## Estructura del Proyecto

```
My-Track-Fit-V.2/
├── app/
│   ├── client/                 # Frontend React (Vite)
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── Login.jsx
│   │   │   │   │   └── SignUp.jsx
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── Dashboard.jsx
│   │   │   │   │   ├── Exercises.jsx
│   │   │   │   │   ├── InjuryManagement.jsx
│   │   │   │   │   ├── NutritionManagement.jsx
│   │   │   │   │   ├── ProfileSettings.jsx
│   │   │   │   │   ├── Routines.jsx
│   │   │   │   │   ├── SmartTrainer.jsx
│   │   │   │   │   ├── UserStatistics.jsx
│   │   │   │   │   ├── Wellness.jsx
│   │   │   │   │   └── Workouts.jsx
│   │   │   │   └── navigation/
│   │   │   │       └── BottomNavigation.jsx
│   │   │   ├── services/
│   │   │   │   └── api.js
│   │   │   ├── styles/
│   │   │   ├── App.jsx
│   │   │   ├── App.css
│   │   │   ├── main.jsx
│   │   │   └── index.css
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   ├── package.json
│   │   └── eslint.config.js
│   │
│   └── server/                 # Backend Express
│       ├── config/             # Configuración
│       │   ├── supabase.js    # Cliente de Supabase
│       │   ├── database.js    # Helpers de DB
│       │   └── middleware.js  # Middleware de autenticación
│       ├── models/             # Modelos de datos
│       │   ├── user.model.js
│       │   ├── exercise.model.js
│       │   ├── routine.model.js
│       │   ├── nutrition.model.js
│       │   ├── injury.model.js
│       │   └── statistics.model.js
│       ├── routes/             # Rutas de la API
│       │   ├── auth.routes.js
│       │   ├── exercise.routes.js
│       │   ├── routine.routes.js
│       │   ├── nutrition.routes.js
│       │   ├── injury.routes.js
│       │   └── statistics.routes.js
│       ├── services/           # Lógica de negocio
│       │   ├── auth.service.js
│       │   ├── exercise.service.js
│       │   ├── routine.service.js
│       │   ├── nutrition.service.js
│       │   ├── injury.service.js
│       │   └── statistics.service.js
│       ├── scripts.sql         # Script de creación de DB
│       ├── index.js            # Servidor principal
│       ├── package.json
│       └── README.md
│
├── .env                        # Variables de entorno
├── .env.example                # Ejemplo de .env
├── .gitignore
├── package.json                # Root package.json
├── nodemon.json
└── README.md                   # Este archivo
```

## Instalación y Configuración

### Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn
- Cuenta en Supabase
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/santivalverde4/My-Track-Fit-V.2.git
cd My-Track-Fit-V.2
```

### 2. Instalar dependencias

```bash
# Instalar dependencias raíz (backend)
npm install

# Instalar dependencias del cliente
cd app/client
npm install
cd ../..
```

### 3. Configurar Supabase

#### Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Anota la URL del proyecto y la clave anon/public

#### Ejecutar script SQL
1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Copia el contenido de `app/server/scripts.sql`
3. Ejecuta el script para crear todas las tablas

#### Obtener credenciales
1. Ve a **Settings** > **API**
2. Copia:
   - **Project URL**: Tu `SUPABASE_URL`
   - **anon public**: Tu `SUPABASE_KEY` (NO uses service_role)

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Supabase Configuration
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu_clave_anon_public_aqui

# JWT Configuration
JWT_SECRET=tu_clave_secreta_jwt_aqui
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:5173

# Email Configuration (Nodemailer - Gmail)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion_gmail
EMAIL_FROM=My Track Fit <tu_email@gmail.com>
```

#### Generar JWT_SECRET

Ejecuta este comando para generar una clave segura:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Ejecutar la Aplicación

### Desarrollo (Frontend y Backend simultáneamente)

```bash
npm run dev:both
```

### Solo Backend

```bash
npm run dev
# o
npm run server
```

### Solo Frontend

```bash
npm run client
```

### Producción

```bash
# Backend
npm start

# Frontend (build)
npm run build
```

### Verificar que funciona

#### Health check del backend
```bash
curl http://localhost:5000/health
```

Deberías ver:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-10-28T..."
}
```

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Autenticación (/api/auth)

```http
POST   /auth/register          # Registrar nuevo usuario
POST   /auth/login             # Iniciar sesión
POST   /auth/forgot-password   # Solicitar recuperación de contraseña
POST   /auth/reset-password    # Restablecer contraseña con token
GET    /auth/profile           # Obtener perfil (requiere auth)
PUT    /auth/profile           # Actualizar perfil (requiere auth)
DELETE /auth/account           # Eliminar cuenta (requiere auth)
GET    /auth/verify            # Verificar token (requiere auth)
```

### Ejercicios (/api/exercises)

```http
GET    /exercises              # Listar todos los ejercicios
GET    /exercises/search?q=    # Buscar ejercicios
GET    /exercises/category/:categoria    # Por categoría
GET    /exercises/:id          # Obtener por ID
POST   /exercises              # Crear ejercicio
PUT    /exercises/:id          # Actualizar ejercicio
DELETE /exercises/:id          # Eliminar ejercicio
```

### Rutinas (/api/routines)

```http
GET    /routines               # Mis rutinas
GET    /routines/:id           # Rutina completa por ID
POST   /routines               # Crear rutina
PUT    /routines/:id           # Actualizar rutina
PATCH  /routines/:id/toggle    # Activar/desactivar
DELETE /routines/:id           # Eliminar rutina
```

#### Entrenamientos

```http
GET    /routines/:routineId/workouts          # Entrenamientos de rutina
POST   /routines/:routineId/workouts          # Crear entrenamiento
PUT    /routines/workouts/:workoutId          # Actualizar entrenamiento
DELETE /routines/workouts/:workoutId          # Eliminar entrenamiento
```

#### Instancias de Ejercicios

```http
POST   /routines/workouts/:workoutId/exercises    # Agregar ejercicios
PUT    /routines/exercises/:instanceId            # Actualizar ejercicio
DELETE /routines/exercises/:instanceId            # Eliminar ejercicio
```

### Nutrición (/api/nutrition)

#### Alimentos

```http
GET    /nutrition/foods            # Listar alimentos
GET    /nutrition/foods/search?q=  # Buscar alimentos
POST   /nutrition/foods            # Crear alimento
```

#### Registros Nutricionales

```http
GET    /nutrition/logs?fecha=                          # Por fecha
GET    /nutrition/logs?fechaInicio=&fechaFin=          # Por rango
GET    /nutrition/summary?fecha=                       # Resumen del día
POST   /nutrition/logs                                 # Crear registro
PUT    /nutrition/logs/:id                             # Actualizar registro
DELETE /nutrition/logs/:id                             # Eliminar registro
```

#### Objetivos Nutricionales

```http
GET    /nutrition/goals         # Obtener objetivos
POST   /nutrition/goals         # Crear objetivos
PUT    /nutrition/goals         # Actualizar objetivos
```

### Lesiones (/api/injuries)

```http
GET    /injuries                        # Mis lesiones
GET    /injuries?active=true            # Solo activas
GET    /injuries/body-part/:parte       # Por zona del cuerpo
GET    /injuries/:id                    # Por ID
POST   /injuries                        # Registrar lesión
PUT    /injuries/:id                    # Actualizar lesión
PATCH  /injuries/:id/status             # Cambiar estado
DELETE /injuries/:id                    # Eliminar lesión
```

### Estadísticas (/api/statistics)

#### Métricas

```http
GET    /statistics/metrics?fecha=                       # Por fecha
GET    /statistics/metrics?fechaInicio=&fechaFin=       # Por rango
GET    /statistics/metrics?last=30                      # Últimas N
POST   /statistics/metrics                              # Guardar métricas
GET    /statistics/summary?days=30                      # Resumen
```

#### Archivos de Usuario

```http
GET    /statistics/files               # Archivos JSONB
PUT    /statistics/files/:fileType     # Actualizar archivo
```

### Formato de Respuestas

Todas las respuestas siguen este formato:

**Éxito:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Mensaje de error descriptivo"
}
```

### Autenticación en Requests

Para rutas protegidas, incluye el token JWT en el header:

```http
Authorization: Bearer {tu_token_jwt}
```

## Arquitectura del Backend

### Patrón de Capas

El backend sigue una arquitectura de tres capas bien definida:

```
Cliente → Routes → Services → Models → Supabase → PostgreSQL
            ↓
       Middleware (Auth)
```

#### 1. Routes (Controladores)
- Manejan requests HTTP
- Validaciones básicas de entrada
- Respuestas HTTP
- No contienen lógica de negocio

#### 2. Services (Lógica de Negocio)
- Validaciones complejas
- Procesamiento de datos
- Coordinación entre múltiples modelos
- Manejo de errores de negocio

#### 3. Models (Acceso a Datos)
- Queries a Supabase
- Operaciones CRUD puras
- Sin lógica de negocio
- Retornan data y error

#### 4. Config (Configuración)
- Cliente de Supabase
- Middleware de autenticación
- Helpers y utilidades

### Flujo de una Petición

1. Cliente envía request a una ruta
2. Middleware verifica autenticación (si es necesario)
3. Route valida parámetros y llama al Service
4. Service ejecuta lógica de negocio y llama a Models
5. Models ejecutan queries en Supabase
6. Respuesta se propaga de vuelta al cliente

### Ventajas de esta Arquitectura

- **Separación de responsabilidades**: Cada capa tiene un propósito claro
- **Mantenibilidad**: Código organizado y fácil de encontrar
- **Escalabilidad**: Fácil agregar nuevas features
- **Testeable**: Cada capa puede probarse independientemente
- **Reutilizable**: Services y Models pueden usarse en múltiples rutas

## Base de Datos

### Tecnología

- **PostgreSQL** - Base de datos relacional
- **Supabase** - Hosting de PostgreSQL con APIs automáticas
- **@supabase/supabase-js** - Cliente para Node.js

### Uso de Supabase

En este proyecto, Supabase se usa como:

- **Base de datos PostgreSQL**: Solo para almacenamiento de datos
- **NO se usa Supabase Auth**: Autenticación personalizada con JWT
- **NO se usa Supabase Storage**: Sin almacenamiento de archivos
- **NO se usa Supabase Realtime**: Sin suscripciones en tiempo real

Básicamente, Supabase = PostgreSQL con hosting gratuito.

### Tablas Principales

**users** - Usuarios del sistema
```sql
id, username, password, correo, confirmed, activo
```

**exercises** - Catálogo de ejercicios
```sql
id, name, categoria, descripcion, created_at
```

**rutinas** - Rutinas de entrenamiento
```sql
id, usuario_id, nombre, descripcion, activa, created_at
```

**entrenamientos** - Días de entrenamiento
```sql
id, rutina_id, nombre, dia_semana, orden, created_at
```

**exercise_instances** - Ejercicios configurados
```sql
id, entrenamiento_id, exercise_id, series, repeticiones, peso, descanso, notas, orden
```

**AlimentosBase** - Catálogo de alimentos
```sql
id, nombre, calorias_por_100g, proteinas_por_100g, carbohidratos_por_100g, grasas_por_100g, categoria
```

**NutricionTemporal** - Registros de comidas
```sql
id, usuario_id, fecha, tipo_comida, alimento_id, cantidad_gramos, calorias, proteinas, carbohidratos, grasas
```

**ObjetivosNutricionales** - Objetivos del usuario
```sql
id, usuario_id, calorias_objetivo, proteinas_objetivo, carbohidratos_objetivo, grasas_objetivo, agua_objetivo
```

**LesionesTemporales** - Registro de lesiones
```sql
id, usuario_id, nombre_lesion, parte_cuerpo, severidad, fecha_lesion, estado, tiempo_estimado_recuperacion
```

**MetricasDiarias** - Métricas diarias
```sql
id, usuario_id, fecha, peso, horas_sueno, created_at
```

**ArchivosUsuario** - Datos JSONB adicionales
```sql
id, idcliente, ArchivoBody, ArchivoRutina, ArchivoEjercicio, archivonutricion, archivolesiones, archivoestadisticas, archivoia
```

### Relaciones

- users → rutinas (1:N)
- rutinas → entrenamientos (1:N)
- entrenamientos → exercise_instances (1:N)
- exercises → exercise_instances (1:N)
- users → NutricionTemporal (1:N)
- users → LesionesTemporales (1:N)
- users → MetricasDiarias (1:N)
- users → ObjetivosNutricionales (1:1)
- users → ArchivosUsuario (1:1)

## Scripts Disponibles

### Root (Backend)

```bash
npm start           # Servidor en producción
npm run dev         # Servidor con nodemon
npm run server      # Servidor con nodemon
npm run client      # Frontend con Vite
npm run dev:both    # Backend + Frontend simultáneamente
npm run build       # Build del frontend
npm test            # Tests (si existen)
```

### Frontend (app/client)

```bash
npm run dev         # Dev server de Vite
npm run build       # Build de producción
npm run preview     # Preview del build
npm run lint        # ESLint
```

## Seguridad

### Implementado

- **Contraseñas hasheadas**: bcrypt con 10 salt rounds
- **Autenticación JWT**: Tokens firmados con secret key
- **Middleware de autenticación**: Verificación en todas las rutas protegidas
- **CORS configurado**: Solo permite requests del frontend autorizado
- **Variables de entorno**: Credenciales fuera del código
- **Validación de datos**: En services antes de guardar en DB
- **Headers seguros**: CORS y headers HTTP apropiados
- **Recuperación de contraseña**: Sistema de tokens por email
- **Soft delete**: Eliminación lógica de usuarios (activo = false)
- **Validación de contraseña actual**: Al cambiar contraseña en perfil
- **Confirmación por email**: Enlaces de confirmación para nuevos usuarios
- **Tokens de un solo uso**: Para reset de contraseña

### Recomendaciones Adicionales

- **Rate Limiting**: Limitar requests por IP
- **Helmet.js**: Headers de seguridad HTTP
- **Input Sanitization**: Validación más estricta con Joi o Zod
- **HTTPS**: En producción, siempre usar SSL/TLS
- **Row Level Security**: Configurar RLS en Supabase (opcional)
- **Logs**: Sistema de logging con Winston o similar
- **Secrets Rotation**: Rotar JWT_SECRET periódicamente

## Testing

### Backend

```bash
cd app/server
npm test
```

### Frontend

```bash
cd app/client
npm test
```

## Deployment

### Backend

**Opciones de hosting:**
- Heroku
- Railway
- Render
- DigitalOcean
- AWS EC2
- Vercel (serverless)

**Pasos generales:**
1. Configurar variables de entorno en el servicio
2. Conectar con repositorio Git
3. Configurar build command: `npm install`
4. Configurar start command: `npm start`

### Frontend

**Opciones de hosting:**
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

**Build:**
```bash
cd app/client
npm run build
# Output en app/client/dist
```

### Base de Datos

Supabase ya está en la nube, no requiere deployment adicional.

## Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/NuevaFeature`)
3. Commit tus cambios (`git commit -m 'Agregar NuevaFeature'`)
4. Push a la rama (`git push origin feature/NuevaFeature`)
5. Abre un Pull Request

### Convenciones

- Usar ES Modules (import/export)
- Nombrar archivos en camelCase o kebab-case
- Comentar código complejo
- Seguir la estructura de carpetas existente
- Validar con ESLint antes de commit

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Verifica que `.env` existe en la raíz
- Comprueba que tiene `SUPABASE_URL` y `SUPABASE_KEY`
- Reinicia el servidor después de modificar `.env`

### Error: "relation does not exist"
- Ejecuta `app/server/scripts.sql` en Supabase SQL Editor
- Verifica que las tablas se crearon correctamente

### Error: "CORS policy"
- Verifica que `CLIENT_URL` en `.env` coincide con la URL del frontend
- Por defecto debe ser `http://localhost:5173` (Vite)

### Error: "Token inválido"
- Verifica que `JWT_SECRET` está configurado en `.env`
- El token expira según `JWT_EXPIRES_IN` (por defecto 7 días)
- Haz logout y login nuevamente

### Puerto ya en uso
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

## Licencia

Este proyecto está bajo la Licencia ISC.

## Autores

**Santiago Valverde y Adrián Barquero**

Universidad - Proyecto de Diseño

Stack: PERN (PostgreSQL, Express, React, Node.js)

## Contacto

Para reportar bugs o solicitar features, crea un issue en GitHub.

---

**Versión: 2.1.0**

**Última actualización: Noviembre 2025**

**Nuevas características en v2.1.0:**
- Sistema completo de recuperación de contraseña por email
- Edición de rutinas, entrenamientos y ejercicios
- Gráficos interactivos en estadísticas con Recharts
- Smart Trainer con renderizado Markdown y persistencia de conversación
- Soft delete de usuarios
- Validación mejorada de contraseña actual
- Íconos unificados con React Icons
- Mejoras de responsive en todas las pantallas
