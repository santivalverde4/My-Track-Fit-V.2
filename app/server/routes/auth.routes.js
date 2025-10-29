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
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        error: 'Usuario, contraseña y email son requeridos'
      });
    }

    const result = await AuthService.register(username, password, email);

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
 * GET /api/auth/confirm/:token
 * Confirmar cuenta con token del email
 */
router.get('/confirm/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const result = await AuthService.confirmAccount(token);

    if (!result.success) {
      // Token inválido o expirado
      return res.send(`
        <html>
          <head>
            <title>Token inválido</title>
            <style>
              body { background: #f7f7f7; font-family: Arial, sans-serif; }
              .container {
                background: #fff;
                max-width: 400px;
                margin: 80px auto;
                padding: 32px 24px;
                border-radius: 10px;
                box-shadow: 0 2px 12px rgba(0,0,0,0.12);
                text-align: center;
              }
              .icon { font-size: 48px; color: #d32f2f; margin-bottom: 16px; }
              h2 { color: #d32f2f; margin-bottom: 8px; }
              p { color: #444; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">❌</div>
              <h2>Token inválido o expirado</h2>
              <p>El enlace de confirmación no es válido o ya fue utilizado.</p>
            </div>
          </body>
        </html>
      `);
    }

    // Cuenta confirmada exitosamente
    return res.send(`
      <html>
        <head>
          <title>Cuenta confirmada</title>
          <style>
            body { background: #f7f7f7; font-family: Arial, sans-serif; }
            .container {
              background: #fff;
              max-width: 400px;
              margin: 80px auto;
              padding: 32px 24px;
              border-radius: 10px;
              box-shadow: 0 2px 12px rgba(0,0,0,0.12);
              text-align: center;
            }
            .icon {
              font-size: 48px;
              color: #43a047;
              margin-bottom: 16px;
            }
            h2 { color: #1976d2; margin-bottom: 8px; }
            p { color: #444; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">✅</div>
            <h2>¡Cuenta confirmada!</h2>
            <p>Tu cuenta ha sido creada exitosamente.<br>Puedes iniciar sesión en la app.</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    // Error en el servidor
    return res.status(500).send(`
      <html>
        <head>
          <title>Error</title>
          <style>
            body { background: #f7f7f7; font-family: Arial, sans-serif; }
            .container {
              background: #fff;
              max-width: 400px;
              margin: 80px auto;
              padding: 32px 24px;
              border-radius: 10px;
              box-shadow: 0 2px 12px rgba(0,0,0,0.12);
              text-align: center;
            }
            .icon { font-size: 48px; color: #d32f2f; margin-bottom: 16px; }
            h2 { color: #d32f2f; margin-bottom: 8px; }
            p { color: #444; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">❌</div>
            <h2>Error</h2>
            <p>Ocurrió un error al confirmar tu cuenta. Intenta de nuevo.</p>
          </div>
        </body>
      </html>
    `);
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
