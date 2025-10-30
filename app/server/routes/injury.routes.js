import express from 'express';
import { InjuryService } from '../services/injury.service.js';
import { authMiddleware } from '../config/middleware.js';

const router = express.Router();

/**
 * GET /api/injuries
 * Obtener todas las lesiones del usuario
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { active } = req.query;

    let result;
    if (active === 'true') {
      result = await InjuryService.getActiveInjuries(req.user.userId);
    } else {
      result = await InjuryService.getUserInjuries(req.user.userId);
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
 * GET /api/injuries/body-part/:parteCuerpo
 * Obtener lesiones por parte del cuerpo
 */
router.get('/body-part/:parteCuerpo', authMiddleware, async (req, res) => {
  try {
    const { parteCuerpo } = req.params;
    const result = await InjuryService.getInjuriesByBodyPart(req.user.userId, parteCuerpo);

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
 * GET /api/injuries/:id
 * Obtener lesión por ID
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await InjuryService.getInjuryById(id);

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
 * POST /api/injuries
 * Crear nueva lesión
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const injuryData = req.body;
    const result = await InjuryService.createInjury(req.user.userId, injuryData);

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
 * PUT /api/injuries/:id
 * Actualizar lesión
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const injuryData = req.body;
    const result = await InjuryService.updateInjury(id, injuryData);

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
 * PATCH /api/injuries/:id/status
 * Cambiar estado de lesión
 */
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Recibir 'status' del frontend (inglés)

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Estado es requerido'
      });
    }

    const result = await InjuryService.updateInjuryStatus(id, status);

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
 * DELETE /api/injuries/:id
 * Eliminar lesión
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await InjuryService.deleteInjury(id);

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
