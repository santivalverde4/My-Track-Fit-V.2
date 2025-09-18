const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware temporal para simulación de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  // Simulación - en producción verificar JWT real
  if (token === 'null' || token === 'undefined') {
    return res.status(403).json({ message: 'Token inválido' });
  }

  // Simulamos usuario autenticado
  req.user = { id: 1, username: 'usuario_actual', email: 'usuario@example.com' };
  next();
};

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ message: 'Servidor de My Track-Fit V.2 funcionando!' });
});

app.get('/api/ping', (req, res) => {
  res.json({ message: 'Pong! Servidor conectado', timestamp: new Date().toISOString() });
});

// ========================================
// RUTAS DE AUTENTICACIÓN
// ========================================

app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;

  // Validaciones básicas
  if (!username || !email || !password) {
    return res.status(400).json({
      message: 'Todos los campos son requeridos',
      fields: { username: !username, email: !email, password: !password }
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: 'La contraseña debe tener al menos 6 caracteres'
    });
  }

  // Simulamos registro exitoso
  setTimeout(() => {
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token: 'simulated_jwt_token_123',
      user: {
        id: Math.floor(Math.random() * 1000),
        username,
        email
      }
    });
  }, 1000);
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  // Validaciones básicas
  if (!username || !password) {
    return res.status(400).json({
      message: 'Usuario y contraseña son requeridos'
    });
  }

  // Simulamos verificación de credenciales
  setTimeout(() => {
    if (username === 'admin' && password === 'password') {
      res.json({
        message: 'Inicio de sesión exitoso',
        token: 'simulated_jwt_token_123',
        user: {
          id: 1,
          username,
          email: 'admin@trackfit.com'
        }
      });
    } else {
      res.status(401).json({
        message: 'Credenciales inválidas'
      });
    }
  }, 1000);
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({
    message: 'Token válido',
    user: req.user
  });
});

// ========================================
// RUTAS DE USUARIO
// ========================================

app.get('/api/user/profile', authenticateToken, (req, res) => {
  res.json({
    user: req.user,
    profile: {
      createdAt: '2024-01-01',
      lastLogin: new Date().toISOString(),
      workouts: 15,
      streak: 7
    }
  });
});

app.put('/api/user/profile', authenticateToken, (req, res) => {
  const { email, firstName, lastName } = req.body;

  setTimeout(() => {
    res.json({
      message: 'Perfil actualizado exitosamente',
      user: {
        ...req.user,
        email: email || req.user.email,
        firstName,
        lastName
      }
    });
  }, 800);
});

app.put('/api/user/username', authenticateToken, (req, res) => {
  const { newUsername } = req.body;

  if (!newUsername) {
    return res.status(400).json({
      message: 'El nuevo nombre de usuario es requerido'
    });
  }

  if (newUsername.length < 3) {
    return res.status(400).json({
      message: 'El nombre de usuario debe tener al menos 3 caracteres'
    });
  }

  if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
    return res.status(400).json({
      message: 'El nombre de usuario solo puede contener letras, números y guiones bajos'
    });
  }

  // Simular verificación de disponibilidad
  if (newUsername === 'admin' || newUsername === 'root') {
    return res.status(409).json({
      message: 'Este nombre de usuario no está disponible'
    });
  }

  setTimeout(() => {
    res.json({
      message: 'Nombre de usuario actualizado exitosamente',
      user: {
        ...req.user,
        username: newUsername
      }
    });
  }, 1000);
});

app.put('/api/user/password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: 'Contraseña actual y nueva contraseña son requeridas'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: 'La nueva contraseña debe tener al menos 6 caracteres'
    });
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
    return res.status(400).json({
      message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    });
  }

  // Simular verificación de contraseña actual
  if (currentPassword !== 'password') {
    return res.status(401).json({
      message: 'La contraseña actual es incorrecta'
    });
  }

  setTimeout(() => {
    res.json({
      message: 'Contraseña actualizada exitosamente'
    });
  }, 1200);
});

app.delete('/api/user/account', authenticateToken, (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      message: 'Contraseña requerida para confirmar eliminación'
    });
  }

  // Simular verificación de contraseña
  if (password !== 'password') {
    return res.status(401).json({
      message: 'Contraseña incorrecta'
    });
  }

  setTimeout(() => {
    res.json({
      message: 'Cuenta eliminada exitosamente'
    });
  }, 1500);
});

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Manejo de errores globales
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('Servidor iniciado exitosamente!');
  console.log(`Puerto: ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
});