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
// ========================================
// RUTAS DE RUTINAS
// ========================================

// Obtener todas las rutinas del usuario
app.get('/api/routines', authenticateToken, (req, res) => {
  // Simulamos rutinas del usuario
  const mockRoutines = [
    {
      id: 1,
      name: 'Rutina de Fuerza',
      description: 'Entrenamiento completo de fuerza para todo el cuerpo',
      difficulty: 'intermedio',
      estimatedTime: 45,
      category: 'fuerza',
      exercises: [
        {
          id: 1,
          name: 'Sentadillas',
          description: 'Ejercicio para piernas y glúteos',
          sets: 4,
          reps: 12,
          weight: 80,
          restTime: 90,
          notes: 'Mantener la espalda recta'
        }
      ],
      userId: req.user.id,
      createdAt: '2024-01-15',
      lastUsed: '2024-01-20'
    }
  ];

  setTimeout(() => {
    res.json({
      routines: mockRoutines,
      total: mockRoutines.length
    });
  }, 500);
});

// Crear nueva rutina
app.post('/api/routines', authenticateToken, (req, res) => {
  const { name, description, difficulty, estimatedTime, category } = req.body;

  if (!name || !description) {
    return res.status(400).json({
      message: 'Nombre y descripción son requeridos'
    });
  }

  setTimeout(() => {
    const newRoutine = {
      id: Date.now(),
      name,
      description,
      difficulty,
      estimatedTime,
      category,
      exercises: [],
      userId: req.user.id,
      createdAt: new Date().toISOString().split('T')[0]
    };

    res.status(201).json({
      message: 'Rutina creada exitosamente',
      routine: newRoutine
    });
  }, 800);
});

// Agregar ejercicio a rutina
app.post('/api/routines/:id/exercises', authenticateToken, (req, res) => {
  const routineId = parseInt(req.params.id);
  const { name, description, sets, reps, weight, restTime, notes } = req.body;

  if (!name) {
    return res.status(400).json({
      message: 'El nombre del ejercicio es requerido'
    });
  }

  setTimeout(() => {
    const newExercise = {
      id: Date.now(),
      name,
      description: description || '',
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: parseFloat(weight) || 0,
      restTime: parseInt(restTime),
      notes: notes || '',
      routineId
    };

    res.status(201).json({
      message: 'Ejercicio agregado exitosamente',
      exercise: newExercise
    });
  }, 600);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('Servidor iniciado exitosamente!');
  console.log(`Puerto: ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
});