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

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ message: 'Servidor de My Track-Fit V.2 funcionando!' });
});

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