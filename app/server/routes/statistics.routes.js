import express from 'express';
import { StatisticsService, UserFilesService } from '../services/statistics.service.js';
import { authMiddleware } from '../config/middleware.js';

const router = express.Router();

// ==================== MÉTRICAS DIARIAS ====================

/**
 * GET /api/statistics/metrics
 * Obtener métricas por fecha o rango
 */
router.get('/metrics', authMiddleware, async (req, res) => {
  try {
    const { fecha, fechaInicio, fechaFin, last } = req.query;

    let result;
    if (last) {
      result = await StatisticsService.getLastMetrics(req.user.userId, parseInt(last));
    } else if (fecha) {
      result = await StatisticsService.getMetricsByDate(req.user.userId, fecha);
    } else if (fechaInicio && fechaFin) {
      result = await StatisticsService.getMetricsByDateRange(req.user.userId, fechaInicio, fechaFin);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Se requiere fecha, rango de fechas o parámetro last'
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
 * POST /api/statistics/metrics
 * Crear o actualizar métricas del día
 */
router.post('/metrics', authMiddleware, async (req, res) => {
  try {
    const { fecha, ...metricsData } = req.body;

    if (!fecha) {
      return res.status(400).json({
        success: false,
        error: 'Fecha es requerida'
      });
    }

    const result = await StatisticsService.saveMetrics(req.user.userId, fecha, metricsData);

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
 * GET /api/statistics/summary
 * Obtener resumen estadístico
 */
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const { days } = req.query;
    const result = await StatisticsService.getStatsSummary(
      req.user.userId, 
      days ? parseInt(days) : 30
    );

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

// ==================== ARCHIVOS DE USUARIO ====================

/**
 * GET /api/statistics/files
 * Obtener archivos de usuario
 */
router.get('/files', authMiddleware, async (req, res) => {
  try {
    const result = await UserFilesService.getUserFiles(req.user.userId);

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
 * PUT /api/statistics/files/:fileType
 * Actualizar archivo específico
 */
router.put('/files/:fileType', authMiddleware, async (req, res) => {
  try {
    const { fileType } = req.params;
    const fileData = req.body;

    const result = await UserFilesService.updateUserFile(req.user.userId, fileType, fileData);

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
