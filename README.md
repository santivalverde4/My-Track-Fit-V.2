# � My Track-Fit V.2

Una aplicación móvil de fitness completa desarrollada con React Native y backend Express que permite a los usuarios gestionar sus entrenamientos, bienestar y progreso fitness con un enfoque en experiencia de usuario nativa y rendimiento optimizado para dispositivos móviles.

## 🌟 Características

### ✅ Implementadas
- **Autenticación Completa**: Sistema de registro e inicio de sesión con validaciones robustas
- **Dashboard Nativo**: Interfaz principal optimizada para dispositivos móviles
- **Gestión de Cuenta**: Editar usuario, cambiar contraseña y eliminar cuenta
- **Sistema de Entrenamientos**: Gestión completa de rutinas, entrenamientos y ejercicios
- **Módulo de Bienestar**: Seguimiento de nutrición, lesiones y estadísticas
- **Smart Trainer con IA**: Entrenador personal inteligente con interfaz de chat
- **Navegación Nativa**: Experiencia fluida con React Navigation
- **API RESTful**: Backend completo con endpoints para todas las funcionalidades

### 🚧 En Desarrollo
- **Notificaciones Push**: Recordatorios de entrenamientos y objetivos
- **Modo Offline**: Funcionalidad sin conexión a internet
- **Integración IA avanzada**: Conexión con APIs de IA reales
- **Sincronización en la Nube**: Backup automático de datos
- **Wearables Integration**: Conexión con dispositivos fitness

## 🛠️ Stack Tecnológico

### Frontend Móvil
- **React Native** - Framework de desarrollo móvil multiplataforma
- **React Navigation** - Navegación nativa para móviles
- **React Native Vector Icons** - Iconos nativos
- **AsyncStorage** - Almacenamiento local persistente
- **React Native Gesture Handler** - Gestos nativos optimizados

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **CORS** - Manejo de políticas de origen cruzado
- **dotenv** - Gestión de variables de entorno

### Base de Datos (Preparado)
- **MySQL** - Base de datos relacional
- **MySQL2** - Driver para Node.js

### Desarrollo Móvil
- **Android Studio** - IDE para desarrollo Android
- **Xcode** - IDE para desarrollo iOS (macOS requerido)
- **Metro Bundler** - Bundler optimizado para React Native
- **Flipper** - Herramienta de debugging para React Native

## 📁 Estructura del Proyecto

```
My-Track-Fit-V.2/
├── mobile/                     # Aplicación React Native
│   ├── android/               # Proyecto Android nativo
│   ├── ios/                   # Proyecto iOS nativo (macOS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── SignUp.js
│   │   │   │   └── Login.js
│   │   │   ├── dashboard/
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── ProfileSettings.js
│   │   │   │   ├── SmartTrainer.js
│   │   │   │   ├── Routines.js
│   │   │   │   ├── Workouts.js
│   │   │   │   ├── Exercises.js
│   │   │   │   └── Wellness.js
│   │   │   └── navigation/
│   │   │       └── TabNavigator.js
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── globalStyles.js
│   │   ├── utils/
│   │   │   ├── storage.js
│   │   │   └── constants.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── metro.config.js
│   ├── package.json
│   └── app.json
│   └── server/                 # Backend Express
│       ├── index.js
│       └── package.json
├── README.md
└── .gitignore
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** (v16 o superior)
- **npm** o **yarn**
- **Git**
- **Android Studio** (para desarrollo Android)
- **Xcode** (para desarrollo iOS - solo macOS)
- **Java Development Kit (JDK)** 11 o superior
- **Android SDK** con API Level 31+

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

### 3. Configurar la App Móvil
```bash
cd mobile
npm install
```

### 4. Configurar React Native
```bash
# Instalar CLI de React Native (si no está instalado)
npm install -g @react-native-community/cli

# Para Android (configurar variables de entorno)
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## 🏃‍♂️ Ejecutar la Aplicación

### 1. Iniciar el Backend
```bash
cd app/server
npm run dev
```

### 2. Ejecutar en Android
```bash
cd mobile

# Iniciar Metro Bundler
npm start

# En otra terminal - Ejecutar en Android
npm run android

# O ejecutar en emulador específico
npx react-native run-android
```

### 3. Ejecutar en iOS (solo macOS)
```bash
cd mobile

# Instalar pods (solo primera vez)
cd ios && pod install && cd ..

# Ejecutar en iOS
npm run ios

# O ejecutar en simulador específico
npx react-native run-ios
```

### 4. Desarrollo con Hot Reload
```bash
# El Metro Bundler proporciona hot reload automático
# Los cambios se reflejan inmediatamente en el dispositivo/emulador
```

## 📱 Características Móviles Nativas

- **Navegación Nativa**: Experiencia fluida con React Navigation
- **Gestos Táctiles**: Soporte completo para gestos nativos (swipe, pinch, etc.)
- **Rendimiento Optimizado**: 60 FPS con optimizaciones nativas
- **Almacenamiento Local**: Persistencia de datos con AsyncStorage
- **Accesibilidad Móvil**: Compatible con lectores de pantalla nativos
- **Notificaciones Push**: Preparado para notificaciones locales y remotas
- **Orientación Adaptativa**: Soporte para modo portrait y landscape
- **Temas del Sistema**: Adaptación automática a modo claro/oscuro

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
# Testing en React Native
cd mobile
npm test

# Testing en dispositivo físico
npm run android --device
npm run ios --device

# Backend testing
cd app/server
npm run test
```

## 📦 Build para Producción

### Android APK
```bash
cd mobile

# Debug APK
npm run build:android:debug

# Release APK (requiere configuración de signing)
npm run build:android:release

# AAB para Google Play Store
npm run build:android:bundle
```

### iOS App
```bash
cd mobile

# Build para simulador
npm run build:ios:debug

# Build para dispositivo (requiere certificados de Apple)
npm run build:ios:release
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📋 Scripts Disponibles

### Aplicación Móvil (`mobile/`)
- `npm start` - Iniciar Metro Bundler
- `npm run android` - Ejecutar en Android
- `npm run ios` - Ejecutar en iOS
- `npm run build:android:debug` - Build debug para Android
- `npm run build:android:release` - Build release para Android
- `npm run build:ios:debug` - Build debug para iOS
- `npm run build:ios:release` - Build release para iOS
- `npm test` - Testing de componentes
- `npm run lint` - ESLint para React Native

### Backend (`app/server`)
- `npm run dev` - Servidor con nodemon
- `npm start` - Servidor de producción
- `npm run lint` - ESLint

## 🔐 Seguridad Móvil

- **Almacenamiento Seguro**: AsyncStorage con encriptación
- **Validación de Datos**: Sanitización en frontend y backend
- **Headers de Seguridad**: CORS configurado para móviles
- **JWT Móvil**: Autenticación persistente y segura
- **Biometría**: Preparado para autenticación biométrica
- **SSL Pinning**: Preparado para conexiones seguras
- **Ofuscación de Código**: Build optimizado para producción

## 📈 Roadmap

### v3.0 - React Native (Actual)
- [x] **Migración Completa**: De React web a React Native
- [x] **Sistema de Entrenamientos**: Gestión completa de rutinas
- [x] **Módulo de Bienestar**: Nutrición, lesiones y estadísticas
- [x] **Smart Trainer**: Interfaz de chat con IA mockup
- [x] **Navegación Nativa**: Tab navigation optimizada

### v3.1 (Próximamente)
- [ ] **Base de Datos Integrada**: MySQL con sincronización
- [ ] **Notificaciones Push**: Recordatorios y motivación
- [ ] **Modo Offline**: Funcionalidad sin conexión
- [ ] **Integración IA Real**: APIs de ChatGPT/Claude

### v3.2
- [ ] **Autenticación Biométrica**: TouchID/FaceID
- [ ] **Sincronización Cloud**: Backup automático
- [ ] **Wearables Integration**: Apple Watch, Fitbit
- [ ] **Gamificación Avanzada**: Sistema de logros y niveles

### v3.3
- [ ] **Publicación en Stores**: Google Play y App Store
- [ ] **Analytics Avanzados**: Métricas de uso y rendimiento
- [ ] **Social Features**: Compartir entrenamientos y competencias
- [ ] **Premium Features**: Suscripción con características avanzadas

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
