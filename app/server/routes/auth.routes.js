import express from 'express';
import { AuthService } from '../services/auth.service.js';
import { authMiddleware } from '../config/middleware.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Usuario y contraseña son requeridos'
      });
    }

    const result = await AuthService.register(username, password);

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
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Usuario y contraseña son requeridos'
      });
    }

    const result = await AuthService.login(username, password);

    if (!result.success) {
      return res.status(401).json(result);
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
 * GET /api/auth/profile
 * Obtener perfil del usuario autenticado
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await AuthService.getUserProfile(req.user.userId);

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
 * PUT /api/auth/profile
 * Actualizar perfil del usuario autenticado
 */
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    const result = await AuthService.updateProfile(req.user.userId, updates);

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
 * GET /api/auth/verify
 * Verificar si el token es válido
 */
router.get('/verify', authMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      userId: req.user.userId,
      username: req.user.username
    }
  });
});

export default router;
