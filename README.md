# 💪 My Track-Fit V.2

Una aplicación web de fitness completa construida con el stack SERN (SQL, Express, React, Node.js) que permite a los usuarios gestionar sus entrenamientos, bienestar y progreso fitness con un enfoque en accesibilidad y experiencia de usuario.

## 🌟 Características

### ✅ Implementadas
- **Autenticación Completa**: Sistema de registro e inicio de sesión con validaciones robustas
- **Dashboard Intuitivo**: Interfaz principal con navegación por pestañas
- **Gestión de Cuenta**: Editar usuario, cambiar contraseña y eliminar cuenta
- **Accesibilidad WCAG AA**: Cumple estándares de accesibilidad web
- **Diseño Responsive**: Optimizado para móviles, tablets y desktop
- **API RESTful**: Backend completo con endpoints para todas las funcionalidades

### 🚧 En Desarrollo
- Sistema de entrenamientos personalizados
- Módulo de bienestar y nutrición
- Smart Trainer con IA
- Seguimiento de progreso y estadísticas

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Herramienta de build rápida
- **React Router** - Navegación SPA
- **Axios** - Cliente HTTP
- **CSS3** - Estilos con variables personalizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **CORS** - Manejo de políticas de origen cruzado
- **dotenv** - Gestión de variables de entorno

### Base de Datos (Preparado)
- **MySQL** - Base de datos relacional
- **MySQL2** - Driver para Node.js

## 📁 Estructura del Proyecto

```
My-Track-Fit-V.2/
├── app/
│   ├── client/                 # Frontend React
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── SignUp.jsx
│   │   │   │   │   └── Login.jsx
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── Dashboard.jsx
│   │   │   │   │   └── ProfileSettings.jsx
│   │   │   │   └── navigation/
│   │   │   │       └── BottomNavigation.jsx
│   │   │   ├── services/
│   │   │   │   └── api.js
│   │   │   ├── styles/
│   │   │   │   ├── Auth.css
│   │   │   │   ├── Dashboard.css
│   │   │   │   ├── Navigation.css
│   │   │   │   └── ProfileSettings.css
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── package.json
│   │   └── vite.config.js
│   └── server/                 # Backend Express
│       ├── index.js
│       └── package.json
├── README.md
└── .gitignore
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- Git

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd My-Track-Fit-V.2
```

### 2. Configurar el Backend
```bash
cd app/server
npm install
```

Crear archivo `.env`:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=trackfit_db
JWT_SECRET=tu_jwt_secret_seguro
```

### 3. Configurar el Frontend
```bash
cd ../client
npm install
```

Crear archivo `.env`:
```env
VITE_API_URL=http://localhost:5000
```

## 🏃‍♂️ Ejecutar la Aplicación

### Opción 1: Desarrollo Simultáneo (Recomendado)
```bash
# Desde la raíz del proyecto
npm install
npm run dev
```

### Opción 2: Ejecutar por Separado

**Terminal 1 - Backend:**
```bash
cd app/server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd app/client
npm run dev
```

## 📱 Características de Accesibilidad

- **Navegación por Teclado**: Toda la interfaz es navegable con teclado
- **Lectores de Pantalla**: Compatible con NVDA, JAWS y VoiceOver
- **Alto Contraste**: Soporte para modo de alto contraste
- **Etiquetas ARIA**: Implementación completa de atributos ARIA
- **Textos Alternativos**: Todas las imágenes e iconos tienen alt text
- **Indicadores de Error**: Mensajes de error claros y descriptivos

## 🎨 Componentes Principales

### Autenticación
- **SignUp**: Registro con validación de campos
- **Login**: Inicio de sesión con opción "recordarme"

### Dashboard
- **Dashboard**: Interfaz principal con navegación
- **ProfileSettings**: Gestión completa de cuenta de usuario

### Navegación
- **BottomNavigation**: Menú inferior con 4 secciones principales

## 🔧 API Endpoints

### Autenticación
```http
POST /api/auth/register    # Registro de usuario
POST /api/auth/login       # Inicio de sesión
GET  /api/auth/verify      # Verificar token
```

### Usuario
```http
GET    /api/user/profile     # Obtener perfil
PUT    /api/user/profile     # Actualizar perfil
PUT    /api/user/username    # Cambiar usuario
PUT    /api/user/password    # Cambiar contraseña
DELETE /api/user/account     # Eliminar cuenta
```

## 🧪 Testing

```bash
# Frontend
cd app/client
npm run test

# Backend
cd app/server
npm run test
```

## 📦 Build para Producción

```bash
# Frontend
cd app/client
npm run build

# El build se genera en app/client/dist/
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📋 Scripts Disponibles

### Root
- `npm run dev` - Ejecuta frontend y backend simultáneamente
- `npm run build` - Build de producción
- `npm run lint` - Linting del código

### Frontend (`app/client`)
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Vista previa del build
- `npm run lint` - ESLint

### Backend (`app/server`)
- `npm run dev` - Servidor con nodemon
- `npm start` - Servidor de producción
- `npm run lint` - ESLint

## 🔐 Seguridad

- Validación de datos en frontend y backend
- Sanitización de inputs
- Headers de seguridad CORS configurados
- JWT para autenticación (preparado)
- Validación de contraseñas seguras

## 📈 Roadmap

### v2.1 (Próximamente)
- [ ] Base de datos MySQL integrada
- [ ] Sistema de entrenamientos
- [ ] Módulo de nutrición

### v2.2
- [ ] Smart Trainer con IA
- [ ] Estadísticas avanzadas
- [ ] Notificaciones push

### v2.3
- [ ] Aplicación móvil nativa
- [ ] Integración con wearables
- [ ] Gamificación

## 📞 Soporte

Para reportar bugs o solicitar features:
- Crea un issue en GitHub
- Contacta al equipo de desarrollo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Desarrollado por

**Santiago Valverde y Adrián Barquero**
- Universidad - Proyecto de Diseño
- Stack: SERN (SQL, Express, React, Node.js)

---
