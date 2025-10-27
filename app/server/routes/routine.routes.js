import express from 'express';
import { RoutineService, WorkoutService, ExerciseInstanceService } from '../services/routine.service.js';
import { authMiddleware } from '../config/middleware.js';

const router = express.Router();

// ==================== RUTINAS ====================

/**
 * GET /api/routines
 * Obtener todas las rutinas del usuario
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await RoutineService.getUserRoutines(req.user.userId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

/**
 * GET /api/routines/:id
 * Obtener rutina por ID con todos sus datos
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await RoutineService.getRoutineById(id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

/**
 * POST /api/routines
 * Crear nueva rutina
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const routineData = req.body;
    const result = await RoutineService.createRoutine(req.user.userId, routineData);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

/**
 * PUT /api/routines/:id
 * Actualizar rutina
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const routineData = req.body;
    const result = await RoutineService.updateRoutine(id, routineData);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

/**
 * PATCH /api/routines/:id/toggle
 * Activar/desactivar rutina
 */
router.patch('/:id/toggle', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { activa } = req.body;

    if (activa === undefined) {
      return res.status(400).json({
        success: false,
        error: 'El campo activa es requerido'
      });
    }

    const result = await RoutineService.toggleRoutineActive(id, activa);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

/**
 * DELETE /api/routines/:id
 * Eliminar rutina
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await RoutineService.deleteRoutine(id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

// ==================== ENTRENAMIENTOS ====================

/**
 * GET /api/routines/:routineId/workouts
 * Obtener entrenamientos de una rutina
 */
router.get('/:routineId/workouts', authMiddleware, async (req, res) => {
  try {
    const { routineId } = req.params;
    const result = await WorkoutService.getWorkoutsByRoutineId(routineId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

/**
 * POST /api/routines/:routineId/workouts
 * Crear nuevo entrenamiento en una rutina
 */
router.post('/:routineId/workouts', authMiddleware, async (req, res) => {
  try {
    const { routineId } = req.params;
    const workoutData = {
      ...req.body,
      rutina_id: routineId
    };

    const result = await WorkoutService.createWorkout(workoutData);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

/**
 * PUT /api/routines/workouts/:workoutId
 * Actualizar entrenamiento
 */
router.put('/workouts/:workoutId', authMiddleware, async (req, res) => {
  try {
    const { workoutId } = req.params;
    const workoutData = req.body;
    const result = await WorkoutService.updateWorkout(workoutId, workoutData);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

/**
 * DELETE /api/routines/workouts/:workoutId
 * Eliminar entrenamiento
 */
router.delete('/workouts/:workoutId', authMiddleware, async (req, res) => {
  try {
    const { workoutId } = req.params;
    const result = await WorkoutService.deleteWorkout(workoutId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

// ==================== INSTANCIAS DE EJERCICIOS ====================

/**
 * POST /api/routines/workouts/:workoutId/exercises
 * Agregar ejercicios a un entrenamiento
 */
router.post('/workouts/:workoutId/exercises', authMiddleware, async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { exercises } = req.body;

    if (!exercises || !Array.isArray(exercises)) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere un array de ejercicios'
      });
    }

    const result = await ExerciseInstanceService.addExercisesToWorkout(workoutId, exercises);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

/**
 * PUT /api/routines/exercises/:instanceId
 * Actualizar instancia de ejercicio
 */
router.put('/exercises/:instanceId', authMiddleware, async (req, res) => {
  try {
    const { instanceId } = req.params;
    const instanceData = req.body;
    const result = await ExerciseInstanceService.updateExerciseInstance(instanceId, instanceData);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

/**
 * DELETE /api/routines/exercises/:instanceId
 * Eliminar instancia de ejercicio
 */
router.delete('/exercises/:instanceId', authMiddleware, async (req, res) => {
  try {
    const { instanceId } = req.params;
    const result = await ExerciseInstanceService.deleteExerciseInstance(instanceId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

export default router;
