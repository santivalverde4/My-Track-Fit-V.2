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
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Token Inválido - My Track Fit</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .container {
              background: #ffffff;
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
              max-width: 500px;
              width: 100%;
              text-align: center;
              padding: 60px 40px;
              animation: slideIn 0.4s ease;
            }
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(-30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .icon { 
              font-size: 80px; 
              margin-bottom: 24px;
              animation: shake 0.5s ease;
            }
            @keyframes shake {
              0%, 100% { transform: rotate(0deg); }
              25% { transform: rotate(-10deg); }
              75% { transform: rotate(10deg); }
            }
            h1 { 
              color: #dc2626;
              margin-bottom: 16px;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: -0.5px;
            }
            p { 
              color: #64748b;
              line-height: 1.7;
              font-size: 16px;
              margin-bottom: 32px;
            }
            .btn-primary {
              display: inline-block;
              padding: 14px 32px;
              background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
              color: white;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 600;
              font-size: 16px;
              transition: all 0.3s ease;
              box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
            }
            .btn-primary:hover {
              transform: translateY(-2px);
              box-shadow: 0 15px 35px rgba(37, 99, 235, 0.35);
            }
            .info-box {
              background: #f1f5f9;
              padding: 20px;
              border-radius: 12px;
              margin-top: 24px;
              border-left: 4px solid #dc2626;
            }
            .info-box p {
              color: #475569;
              font-size: 14px;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">⚠️</div>
            <h1>Enlace Inválido o Expirado</h1>
            <p>El enlace de confirmación no es válido, ya fue utilizado o ha expirado.</p>
            <div class="info-box">
              <p>💡 Los enlaces de confirmación expiran después de 24 horas por razones de seguridad.</p>
            </div>
            <a href="http://localhost:5173/login" class="btn-primary">Volver al Inicio</a>
          </div>
        </body>
        </html>
      `);
    }

    // Cuenta confirmada exitosamente
    return res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cuenta Confirmada - My Track Fit</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
            text-align: center;
            padding: 60px 40px;
            animation: slideIn 0.4s ease;
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .icon { 
            font-size: 80px; 
            margin-bottom: 24px;
            animation: checkmark 0.6s ease-in-out;
          }
          @keyframes checkmark {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
          }
          h1 { 
            color: #10b981;
            margin-bottom: 16px;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }
          p { 
            color: #64748b;
            line-height: 1.7;
            font-size: 16px;
            margin-bottom: 32px;
          }
          .btn-primary {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
          }
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(37, 99, 235, 0.35);
          }
          .features-box {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            padding: 24px;
            border-radius: 12px;
            margin-bottom: 32px;
            border-left: 4px solid #2563eb;
          }
          .features-box h3 {
            color: #1e293b;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
          }
          .features-box ul {
            list-style: none;
            padding: 0;
            text-align: left;
          }
          .features-box li {
            color: #475569;
            padding: 6px 0 6px 28px;
            position: relative;
            font-size: 14px;
            line-height: 1.6;
          }
          .features-box li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #2563eb;
            font-weight: 700;
            font-size: 18px;
          }
          .redirect-text {
            color: #94a3b8;
            font-size: 14px;
            margin-top: 20px;
          }
        </style>
        <script>
          setTimeout(function() {
            window.location.href = 'http://localhost:5173/login';
          }, 5000);
        </script>
      </head>
      <body>
        <div class="container">
          <div class="icon">🎉</div>
          <h1>¡Cuenta Confirmada!</h1>
          <p>Tu cuenta ha sido activada exitosamente.<br>Ya puedes comenzar a usar My Track Fit.</p>
          
          <div class="features-box">
            <h3>🚀 Ahora puedes:</h3>
            <ul>
              <li>Crear rutinas personalizadas</li>
              <li>Registrar tu progreso</li>
              <li>Consultar con nuestro Smart Trainer</li>
              <li>Alcanzar tus metas de fitness</li>
            </ul>
          </div>
          
          <a href="http://localhost:5173/login" class="btn-primary">Iniciar Sesión</a>
          <p class="redirect-text">Redirigiendo automáticamente en 5 segundos...</p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    // Error en el servidor
    return res.status(500).send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error - My Track Fit</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
            text-align: center;
            padding: 60px 40px;
          }
          .icon { 
            font-size: 80px; 
            margin-bottom: 24px;
          }
          h1 { 
            color: #dc2626;
            margin-bottom: 16px;
            font-size: 28px;
            font-weight: 700;
          }
          p { 
            color: #64748b;
            line-height: 1.7;
            font-size: 16px;
            margin-bottom: 32px;
          }
          .btn-primary {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
          }
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(37, 99, 235, 0.35);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">❌</div>
          <h1>Error del Servidor</h1>
          <p>Ocurrió un error al procesar tu solicitud.<br>Por favor, intenta de nuevo más tarde.</p>
          <a href="http://localhost:5173/login" class="btn-primary">Volver al Inicio</a>
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

/**
 * POST /api/auth/request-password-reset
 * Solicitar recuperación de contraseña
 */
router.post('/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'El email es requerido'
      });
    }

    const result = await AuthService.requestPasswordReset(email);

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
 * GET /api/auth/check-reset-token/:token
 * Verificar si un token de recuperación es válido
 */
router.get('/check-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({
        valid: false,
        error: 'Token es requerido'
      });
    }

    const isValid = await AuthService.isResetTokenValid(token);
    
    return res.status(200).json({
      valid: isValid
    });
  } catch (error) {
    return res.status(500).json({
      valid: false,
      error: 'Error al verificar el token'
    });
  }
});

/**
 * POST /api/auth/reset-password/:token
 * Restablecer contraseña con token
 */
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: 'Token y nueva contraseña son requeridos'
      });
    }

    const result = await AuthService.resetPassword(token, password);

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
