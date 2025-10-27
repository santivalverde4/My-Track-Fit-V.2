import { AuthService } from '../services/auth.service.js';

/**
 * Middleware para verificar el token JWT
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado'
      });
    }

    const token = authHeader.substring(7); // Remover 'Bearer '
    const result = AuthService.verifyToken(token);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: result.error
      });
    }

    // Agregar información del usuario al request
    req.user = result.data;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error en la autenticación'
    });
  }
};

/**
 * Middleware opcional para rutas que pueden funcionar con o sin autenticación
 */
export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const result = AuthService.verifyToken(token);

      if (result.success) {
        req.user = result.data;
      }
    }

    next();
  } catch (error) {
    next();
  }
};
