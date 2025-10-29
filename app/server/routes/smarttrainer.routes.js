import express from 'express';
import { AIService } from '../services/ai.service.js';
import { authMiddleware } from '../config/middleware.js';

const router = express.Router();

/**
 * POST /api/smarttrainer/chat
 * Enviar mensaje al chatbot
 */
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'El mensaje es requerido'
      });
    }

    const result = await AIService.chat(message, conversationHistory || []);

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error en chat:', error);
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

/**
 * POST /api/smarttrainer/generate-workout
 * Generar rutina de entrenamiento personalizada
 */
router.post('/generate-workout', authMiddleware, async (req, res) => {
  try {
    const userProfile = req.body;

    const result = await AIService.generateWorkoutPlan(userProfile);

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error generando rutina:', error);
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

/**
 * POST /api/smarttrainer/generate-nutrition
 * Generar plan nutricional
 */
router.post('/generate-nutrition', authMiddleware, async (req, res) => {
  try {
    const userProfile = req.body;

    const result = await AIService.generateNutritionPlan(userProfile);

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error generando plan nutricional:', error);
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

/**
 * POST /api/smarttrainer/analyze-exercise
 * Analizar técnica de ejercicio
 */
router.post('/analyze-exercise', authMiddleware, async (req, res) => {
  try {
    const { exerciseName } = req.body;

    if (!exerciseName) {
      return res.status(400).json({
        success: false,
        error: 'El nombre del ejercicio es requerido'
      });
    }

    const result = await AIService.analyzeExercise(exerciseName);

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error analizando ejercicio:', error);
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

/**
 * POST /api/smarttrainer/injury-advice
 * Obtener consejos para lesiones
 */
router.post('/injury-advice', authMiddleware, async (req, res) => {
  try {
    const { injuryType, description } = req.body;

    if (!injuryType) {
      return res.status(400).json({
        success: false,
        error: 'El tipo de lesión es requerido'
      });
    }

    const result = await AIService.getInjuryAdvice(injuryType, description || '');

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error obteniendo consejos:', error);
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
});

export default router;
