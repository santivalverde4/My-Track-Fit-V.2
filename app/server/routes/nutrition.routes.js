import express from 'express';
import { NutritionService } from '../services/nutrition.service.js';
import { authMiddleware } from '../config/middleware.js';

const router = express.Router();

// ==================== ALIMENTOS BASE ====================

/**
 * GET /api/nutrition/foods
 * Obtener todos los alimentos
 */
router.get('/foods', authMiddleware, async (req, res) => {
  try {
    const result = await NutritionService.getAllFoods();

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
 * GET /api/nutrition/foods/search
 * Buscar alimentos
 */
router.get('/foods/search', authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Parámetro de búsqueda requerido'
      });
    }

    const result = await NutritionService.searchFoods(q);

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
 * POST /api/nutrition/foods
 * Crear nuevo alimento
 */
router.post('/foods', authMiddleware, async (req, res) => {
  try {
    const foodData = req.body;
    const result = await NutritionService.createFood(foodData);

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

// ==================== REGISTROS NUTRICIONALES ====================

/**
 * GET /api/nutrition/logs
 * Obtener registros nutricionales por fecha o rango
 */
router.get('/logs', authMiddleware, async (req, res) => {
  try {
    const { fecha, fechaInicio, fechaFin } = req.query;

    let result;
    if (fecha) {
      result = await NutritionService.getNutritionLogsByDate(req.user.userId, fecha);
    } else if (fechaInicio && fechaFin) {
      result = await NutritionService.getNutritionLogsByDateRange(req.user.userId, fechaInicio, fechaFin);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Se requiere fecha o rango de fechas'
      });
    }

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
 * GET /api/nutrition/summary
 * Obtener resumen nutricional del día
 */
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const { fecha } = req.query;

    if (!fecha) {
      return res.status(400).json({
        success: false,
        error: 'Fecha es requerida'
      });
    }

    const result = await NutritionService.getDailySummary(req.user.userId, fecha);

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
 * POST /api/nutrition/logs
 * Crear registro nutricional
 */
router.post('/logs', authMiddleware, async (req, res) => {
  try {
    const nutritionData = req.body;
    const result = await NutritionService.createNutritionLog(req.user.userId, nutritionData);

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
 * PUT /api/nutrition/logs/:id
 * Actualizar registro nutricional
 */
router.put('/logs/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const nutritionData = req.body;
    const result = await NutritionService.updateNutritionLog(id, nutritionData);

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
 * DELETE /api/nutrition/logs/:id
 * Eliminar registro nutricional
 */
router.delete('/logs/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await NutritionService.deleteNutritionLog(id);

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

// ==================== OBJETIVOS NUTRICIONALES ====================

/**
 * GET /api/nutrition/goals
 * Obtener objetivos nutricionales
 */
router.get('/goals', authMiddleware, async (req, res) => {
  try {
    const result = await NutritionService.getNutritionGoals(req.user.userId);

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
 * POST /api/nutrition/goals
 * PUT /api/nutrition/goals
 * Crear o actualizar objetivos nutricionales
 */
router.post('/goals', authMiddleware, async (req, res) => {
  try {
    const goalsData = req.body;
    const result = await NutritionService.setNutritionGoals(req.user.userId, goalsData);

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

router.put('/goals', authMiddleware, async (req, res) => {
  try {
    const goalsData = req.body;
    const result = await NutritionService.setNutritionGoals(req.user.userId, goalsData);

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

// ==================== RUTAS ADICIONALES ====================

/**
 * GET /api/nutrition/today
 * Obtener comidas y métricas del día de hoy
 */
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await NutritionService.getTodayData(req.user.userId, today);

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
 * POST /api/nutrition/water
 * Actualizar consumo de agua
 */
router.post('/water', authMiddleware, async (req, res) => {
  try {
    const { glasses } = req.body; // Recibir 'glasses' del frontend (inglés)
    const today = new Date().toISOString().split('T')[0];
    
    if (glasses === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Campo glasses es requerido'
      });
    }

    // Actualizar métricas diarias con el consumo de agua
    const result = await NutritionService.updateWaterIntake(req.user.userId, today, glasses);

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
