import express from 'express';
import { ExerciseService } from '../services/exercise.service.js';
import { authMiddleware } from '../config/middleware.js';

const router = express.Router();

/**
 * GET /api/exercises
 * Obtener todos los ejercicios
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await ExerciseService.getAllExercises();

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
 * GET /api/exercises/search
 * Buscar ejercicios
 */
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Parámetro de búsqueda requerido'
      });
    }

    const result = await ExerciseService.searchExercises(q);

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
 * GET /api/exercises/category/:categoria
 * Obtener ejercicios por categoría
 */
router.get('/category/:categoria', authMiddleware, async (req, res) => {
  try {
    const { categoria } = req.params;
    const result = await ExerciseService.getExercisesByCategory(categoria);

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
 * GET /api/exercises/:id
 * Obtener ejercicio por ID
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ExerciseService.getExerciseById(id);

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
 * POST /api/exercises
 * Crear nuevo ejercicio
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const exerciseData = req.body;
    const result = await ExerciseService.createExercise(exerciseData);

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
 * PUT /api/exercises/:id
 * Actualizar ejercicio
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const exerciseData = req.body;
    const result = await ExerciseService.updateExercise(id, exerciseData);

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
 * DELETE /api/exercises/:id
 * Eliminar ejercicio
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ExerciseService.deleteExercise(id);

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
