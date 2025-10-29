import express from 'express';
import { AuthService } from '../services/auth.service.js';

const router = express.Router();

/**
 * GET /forgot-password
 * Página HTML para solicitar recuperación de contraseña
 */
router.get('/forgot-password', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Recuperar contraseña - My Track Fit</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
          }
          .container {
            background: #fff; 
            padding: 40px; 
            border-radius: 10px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.2); 
            max-width: 450px; 
            width: 100%;
          }
          h2 {
            color: #667eea;
            text-align: center;
            margin-bottom: 10px;
          }
          .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 0.95em;
          }
          .form-group {
            margin-bottom: 25px;
          }
          label { 
            font-weight: bold; 
            display: block;
            margin-bottom: 8px;
            color: #333;
          }
          input[type="email"] { 
            padding: 12px; 
            border-radius: 6px; 
            border: 2px solid #e0e0e0;
            width: 100%;
            box-sizing: border-box;
            font-size: 14px;
            transition: border-color 0.3s;
          }
          input[type="email"]:focus {
            outline: none;
            border-color: #667eea;
          }
          button { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff; 
            border: none; 
            padding: 14px; 
            border-radius: 6px; 
            cursor: pointer;
            width: 100%;
            font-size: 16px;
            font-weight: bold;
            transition: transform 0.2s;
          }
          button:hover { 
            transform: translateY(-2px);
          }
          button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          .message { 
            margin-top: 15px;
            padding: 12px;
            border-radius: 6px;
            text-align: center;
            display: none;
          }
          .message.success {
            background: #e8f5e9;
            color: #2e7d32;
            border: 1px solid #4caf50;
            display: block;
          }
          .message.error {
            background: #ffebee;
            color: #c62828;
            border: 1px solid #f44336;
            display: block;
          }
          .back-link {
            text-align: center;
            margin-top: 20px;
          }
          .back-link a {
            color: #667eea;
            text-decoration: none;
            font-size: 0.9em;
          }
          .back-link a:hover {
            text-decoration: underline;
          }
        </style>
        <script>
          async function handleSubmit(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const button = document.querySelector('button[type="submit"]');
            const messageDiv = document.getElementById('message');
            
            // Validar email
            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            if (!emailRegex.test(email)) {
              messageDiv.className = 'message error';
              messageDiv.textContent = 'Por favor ingresa un email válido';
              return;
            }
            
            // Deshabilitar botón
            button.disabled = true;
            button.textContent = 'Enviando...';
            messageDiv.style.display = 'none';
            
            try {
              const response = await fetch('/api/auth/request-password-reset', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
              });
              
              const data = await response.json();
              
              if (data.success) {
                messageDiv.className = 'message success';
                messageDiv.textContent = '✅ ' + data.message + ' Revisa tu correo electrónico.';
                document.getElementById('email').value = '';
              } else {
                messageDiv.className = 'message error';
                messageDiv.textContent = '❌ ' + (data.error || 'Error al enviar el correo');
              }
            } catch (error) {
              messageDiv.className = 'message error';
              messageDiv.textContent = '❌ Error de conexión. Intenta de nuevo.';
            } finally {
              button.disabled = false;
              button.textContent = 'Enviar enlace de recuperación';
            }
          }
        </script>
      </head>
      <body>
        <div class="container">
          <h2>¿Olvidaste tu contraseña?</h2>
          <p class="subtitle">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
          
          <form onsubmit="handleSubmit(event)">
            <div class="form-group">
              <label for="email">Correo electrónico:</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="tucorreo@ejemplo.com"
                required 
                autocomplete="email"
              />
            </div>
            
            <button type="submit">Enviar enlace de recuperación</button>
            
            <div id="message" class="message"></div>
          </form>
          
          <div class="back-link">
            <a href="http://localhost:5173/login">← Volver al inicio de sesión</a>
          </div>
        </div>
      </body>
    </html>
  `);
});

/**
 * GET /reset-password/:token
 * Página HTML para cambiar contraseña
 */
router.get('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  
  if (!AuthService.isResetTokenValid(token)) {
    return res.send(`
      <html>
        <head>
          <title>Enlace inválido</title>
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
            <h2>Enlace inválido o expirado</h2>
            <p>El enlace de recuperación no es válido o ya fue utilizado.</p>
          </div>
        </body>
      </html>
    `);
  }

  // Página de cambio de contraseña
  res.send(`
    <html>
      <head>
        <title>Cambiar contraseña - My Track Fit</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
          }
          .container {
            background: #fff; 
            padding: 40px; 
            border-radius: 10px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.2); 
            max-width: 400px; 
            width: 100%;
          }
          h2 {
            color: #667eea;
            text-align: center;
            margin-bottom: 30px;
          }
          .form-group {
            margin-bottom: 20px;
          }
          label { 
            font-weight: bold; 
            display: block;
            margin-bottom: 8px;
            color: #333;
          }
          input[type="password"] { 
            padding: 12px; 
            border-radius: 6px; 
            border: 2px solid #e0e0e0;
            width: 100%;
            box-sizing: border-box;
            font-size: 14px;
            transition: border-color 0.3s;
          }
          input[type="password"]:focus {
            outline: none;
            border-color: #667eea;
          }
          button { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff; 
            border: none; 
            padding: 14px; 
            border-radius: 6px; 
            cursor: pointer;
            width: 100%;
            font-size: 16px;
            font-weight: bold;
            transition: transform 0.2s;
          }
          button:hover { 
            transform: translateY(-2px);
          }
          .error { 
            color: #d32f2f; 
            font-size: 0.9em; 
            margin-top: 8px;
            display: none;
          }
          .error.show {
            display: block;
          }
          .requirements {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 6px;
            margin-top: 10px;
            font-size: 0.85em;
          }
          .requirements ul {
            margin: 5px 0;
            padding-left: 20px;
          }
          .requirements li {
            color: #666;
            margin: 3px 0;
          }
        </style>
        <script>
          function validateForm() {
            var pass1 = document.getElementById('password').value;
            var pass2 = document.getElementById('password2').value;
            var error = document.getElementById('error-msg');
            
            // Regex: mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
            var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@\$!%*?&._-])[A-Za-z\\d@\$!%*?&._-]{8,}$/;
            
            error.classList.remove('show');
            
            if (!pass1) {
              error.textContent = 'La contraseña es requerida';
              error.classList.add('show');
              return false;
            }
            
            if (pass1 !== pass2) {
              error.textContent = 'Las contraseñas no coinciden';
              error.classList.add('show');
              return false;
            }
            
            if (!passwordRegex.test(pass1)) {
              error.textContent = 'La contraseña no cumple con los requisitos mínimos';
              error.classList.add('show');
              return false;
            }
            
            return true;
          }
        </script>
      </head>
      <body>
        <div class="container">
          <h2>Cambiar contraseña</h2>
          <form method="POST" action="/api/auth/reset-password/${token}" onsubmit="return validateForm();">
            <div class="form-group">
              <label>Nueva contraseña:</label>
              <input type="password" id="password" name="password" required />
            </div>
            
            <div class="form-group">
              <label>Confirmar nueva contraseña:</label>
              <input type="password" id="password2" name="password2" required />
            </div>
            
            <div class="requirements">
              <strong>La contraseña debe contener:</strong>
              <ul>
                <li>Mínimo 8 caracteres</li>
                <li>Una letra mayúscula</li>
                <li>Una letra minúscula</li>
                <li>Un número</li>
                <li>Un carácter especial (@$!%*?&._-)</li>
              </ul>
            </div>
            
            <div id="error-msg" class="error"></div>
            
            <button type="submit">Cambiar contraseña</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

/**
 * POST /api/auth/reset-password/:token
 * Procesar cambio de contraseña
 */
router.post('/api/auth/reset-password/:token', express.urlencoded({ extended: true }), async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const result = await AuthService.resetPassword(token, password);

  if (!result.success) {
    return res.status(400).send(`
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
            <p>${result.error}</p>
          </div>
        </body>
      </html>
    `);
  }

  // Contraseña cambiada exitosamente
  res.send(`
    <html>
      <head>
        <title>Contraseña actualizada</title>
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
          <h2>¡Contraseña actualizada!</h2>
          <p>Tu contraseña ha sido cambiada exitosamente.<br>Ya puedes iniciar sesión con tu nueva contraseña.</p>
        </div>
      </body>
    </html>
  `);
});

export default router;
