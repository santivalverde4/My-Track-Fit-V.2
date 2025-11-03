import sgMail from '@sendgrid/mail';

// Configurar SendGrid con la API Key desde variables de entorno
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// URL base del backend (para producción en Render)
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

export const EmailService = {
  /**
   * Enviar email de confirmación de registro con token
   */
  async sendConfirmationEmail(email, username, token) {
    try {
      const confirmUrl = `${BASE_URL}/api/auth/confirm/${token}`;

      const mailOptions = {
        from: '"My Track Fit" <mytrackfit@gmail.com>',
        to: email,
        subject: 'Confirma tu cuenta - My Track Fit',
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
                line-height: 1.6;
                color: #334155;
                background-color: #f8fafc;
                padding: 20px;
              }
              .email-wrapper {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                color: white;
                padding: 48px 32px;
                text-align: center;
              }
              .header-icon {
                font-size: 64px;
                margin-bottom: 16px;
                display: block;
              }
              .header h1 {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
                letter-spacing: -0.5px;
              }
              .header p {
                font-size: 16px;
                opacity: 0.95;
                font-weight: 400;
              }
              .content {
                padding: 40px 32px;
              }
              .greeting {
                font-size: 20px;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 20px;
              }
              .text {
                color: #475569;
                font-size: 16px;
                line-height: 1.7;
                margin-bottom: 24px;
              }
              .button-container {
                text-align: center;
                margin: 40px 0;
              }
              .button {
                display: inline-block;
                padding: 16px 40px;
                background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                color: white !important;
                text-decoration: none;
                border-radius: 12px;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
                transition: all 0.3s ease;
              }
              .button:hover {
                box-shadow: 0 15px 35px rgba(37, 99, 235, 0.35);
                transform: translateY(-2px);
              }
              .link-section {
                background: #f1f5f9;
                padding: 20px;
                border-radius: 12px;
                margin: 32px 0;
              }
              .link-section p {
                color: #64748b;
                font-size: 14px;
                margin-bottom: 12px;
              }
              .link-url {
                background: #ffffff;
                padding: 14px;
                border-radius: 8px;
                word-break: break-all;
                color: #2563eb;
                font-size: 14px;
                border: 1px solid #e2e8f0;
              }
              .features {
                background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
                padding: 28px;
                border-radius: 12px;
                margin: 32px 0;
                border-left: 4px solid #2563eb;
              }
              .features-title {
                font-size: 16px;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 16px;
              }
              .features ul {
                list-style: none;
                padding: 0;
              }
              .features li {
                color: #475569;
                padding: 8px 0 8px 32px;
                position: relative;
                font-size: 15px;
                line-height: 1.6;
              }
              .features li:before {
                content: "✓";
                position: absolute;
                left: 0;
                color: #2563eb;
                font-weight: 700;
                font-size: 18px;
              }
              .footer {
                background: #f8fafc;
                padding: 32px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
              }
              .footer p {
                color: #64748b;
                font-size: 13px;
                line-height: 1.6;
                margin: 8px 0;
              }
              .footer-logo {
                font-size: 14px;
                font-weight: 600;
                color: #2563eb;
                margin-top: 16px;
              }
              @media only screen and (max-width: 600px) {
                .header {
                  padding: 32px 24px;
                }
                .header h1 {
                  font-size: 24px;
                }
                .content {
                  padding: 32px 24px;
                }
                .button {
                  padding: 14px 32px;
                  font-size: 15px;
                }
              }
            </style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="header">
                <span class="header-icon" style="font-size: 64px; color: white;">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </span>
                <h1>¡Bienvenido a My Track Fit!</h1>
                <p>Confirma tu cuenta para empezar</p>
              </div>
              
              <div class="content">
                <p class="greeting">Hola ${username} 👋</p>
                
                <p class="text">
                  ¡Gracias por unirte a <strong>My Track Fit</strong>! Estamos emocionados de acompañarte en tu viaje de fitness y bienestar.
                </p>
                
                <p class="text">
                  Para activar tu cuenta y comenzar a usar todas nuestras funciones, solo necesitas confirmar tu correo electrónico:
                </p>

                <div class="button-container">
                  <a href="${confirmUrl}" class="button">Confirmar mi Cuenta</a>
                </div>

                <div class="link-section">
                  <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                  <div class="link-url">${confirmUrl}</div>
                </div>

                <div class="features">
                  <p class="features-title"><strong>Una vez confirmada tu cuenta podrás:</strong></p>
                  <ul>
                    <li>Crear rutinas de entrenamiento personalizadas</li>
                    <li>Registrar y monitorear tu progreso nutricional</li>
                    <li>Gestionar lesiones y procesos de recuperación</li>
                    <li>Visualizar estadísticas detalladas de tu rendimiento</li>
                    <li>Consultar con nuestro Smart Trainer impulsado por IA</li>
                    <li>Establecer y alcanzar tus metas de fitness</li>
                  </ul>
                </div>
              </div>
              
              <div class="footer">
                <p>Si no creaste esta cuenta, puedes ignorar este correo de forma segura.</p>
                <p>Este enlace de confirmación es válido por 24 horas.</p>
                <p class="footer-logo"><strong>My Track Fit</strong> - Tu compañero de entrenamiento personal</p>
                <p>&copy; 2025 My Track Fit. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      // Enviar email con SendGrid
      const msg = {
        to: email,
        from: 'mytrackfit@gmail.com', // Cambia esto por tu email verificado en SendGrid
        subject: mailOptions.subject,
        html: mailOptions.html
      };

      await sgMail.send(msg);
      
      console.log('✅ Email enviado exitosamente a:', email);
      
      return {
        success: true,
        message: 'Email de confirmación enviado exitosamente'
      };
    } catch (error) {
      console.error('❌ Error al enviar email:', error.message);
      if (error.response) {
        console.error('Error response:', error.response.body);
      }
      return {
        success: false,
        error: error.message || 'Error al enviar el email'
      };
    }
  },

  /**
   * Verificar si un email es válido (formato)
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Enviar email de recuperación de contraseña
   */
  async sendPasswordResetEmail(email, username, token) {
    try {
      const resetUrl = `${BASE_URL.replace('5000', '5173')}/reset-password/${token}`;

      const mailOptions = {
        from: '"My Track Fit" <mytrackfit@gmail.com>',
        to: email,
        subject: 'Recuperación de Contraseña - My Track Fit',
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
                line-height: 1.6;
                color: #334155;
                background-color: #f8fafc;
                padding: 20px;
              }
              .email-wrapper {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                color: white;
                padding: 48px 32px;
                text-align: center;
              }
              .header-icon {
                font-size: 64px;
                margin-bottom: 16px;
                display: block;
              }
              .header h1 {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
                letter-spacing: -0.5px;
              }
              .header p {
                font-size: 16px;
                opacity: 0.95;
                font-weight: 400;
              }
              .content {
                padding: 40px 32px;
              }
              .greeting {
                font-size: 20px;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 20px;
              }
              .text {
                color: #475569;
                font-size: 16px;
                line-height: 1.7;
                margin-bottom: 24px;
              }
              .button-container {
                text-align: center;
                margin: 40px 0;
              }
              .button {
                display: inline-block;
                padding: 16px 40px;
                background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                color: white !important;
                text-decoration: none;
                border-radius: 12px;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
                transition: all 0.3s ease;
              }
              .button:hover {
                box-shadow: 0 15px 35px rgba(37, 99, 235, 0.35);
                transform: translateY(-2px);
              }
              .link-section {
                background: #f1f5f9;
                padding: 20px;
                border-radius: 12px;
                margin: 32px 0;
              }
              .link-section p {
                color: #64748b;
                font-size: 14px;
                margin-bottom: 12px;
              }
              .link-url {
                background: #ffffff;
                padding: 14px;
                border-radius: 8px;
                word-break: break-all;
                color: #2563eb;
                font-size: 14px;
                border: 1px solid #e2e8f0;
              }
              .warning-box {
                background: #fef2f2;
                border-left: 4px solid #dc2626;
                padding: 20px;
                border-radius: 12px;
                margin: 32px 0;
              }
              .warning-box .warning-title {
                color: #dc2626;
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
              }
              .warning-box ul {
                list-style: none;
                padding: 0;
                margin: 0;
              }
              .warning-box li {
                color: #64748b;
                padding: 6px 0;
                font-size: 14px;
                line-height: 1.6;
              }
              .footer {
                background: #f8fafc;
                padding: 32px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
              }
              .footer p {
                color: #64748b;
                font-size: 13px;
                line-height: 1.6;
                margin: 8px 0;
              }
              .footer-logo {
                font-size: 14px;
                font-weight: 600;
                color: #2563eb;
                margin-top: 16px;
              }
              @media only screen and (max-width: 600px) {
                .header {
                  padding: 32px 24px;
                }
                .header h1 {
                  font-size: 24px;
                }
                .content {
                  padding: 32px 24px;
                }
                .button {
                  padding: 14px 32px;
                  font-size: 15px;
                }
              }
            </style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="header">
                <span class="header-icon" style="font-size: 64px; color: white;">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <h1>Recuperación de Contraseña</h1>
                <p>Restablece tu contraseña de forma segura</p>
              </div>
              
              <div class="content">
                <p class="greeting">Hola ${username} 👋</p>
                
                <p class="text">
                  Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>My Track Fit</strong>.
                </p>
                
                <p class="text">
                  Si fuiste tú quien realizó esta solicitud, haz clic en el botón de abajo para crear una nueva contraseña:
                </p>

                <div class="button-container">
                  <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
                </div>

                <div class="link-section">
                  <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                  <div class="link-url">${resetUrl}</div>
                </div>

                <div class="warning-box">
                  <p class="warning-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 8px;">
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                    </svg>
                    <span>Importante - Por tu seguridad</span>
                  </p>
                  <ul>
                    <li>📍 Este enlace expirará en <strong>1 hora</strong></li>
                    <li>Solo se puede usar una vez</li>
                    <li>🚫 Si no solicitaste este cambio, ignora este correo</li>
                    <li>Tu contraseña actual permanecerá sin cambios</li>
                    <li>⛔ Nunca compartas este enlace con nadie</li>
                  </ul>
                </div>
              </div>
              
              <div class="footer">
                <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.</p>
                <p>Tu cuenta permanece protegida y no se realizarán cambios sin tu confirmación.</p>
                <p class="footer-logo"><strong>My Track Fit</strong> - Tu compañero de entrenamiento personal</p>
                <p>&copy; 2025 My Track Fit. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      // Enviar email con SendGrid
      const msg = {
        to: email,
        from: 'mytrackfit@gmail.com', // Cambia esto por tu email verificado en SendGrid
        subject: mailOptions.subject,
        html: mailOptions.html
      };

      await sgMail.send(msg);
      
      console.log('✅ Email de recuperación enviado a:', email);
      
      return {
        success: true,
        message: 'Email de recuperación enviado exitosamente'
      };
    } catch (error) {
      console.error('❌ Error al enviar email de recuperación:', error.message);
      if (error.response) {
        console.error('Error response:', error.response.body);
      }
      return {
        success: false,
        error: error.message || 'Error al enviar el email'
      };
    }
  },

  /**
   * Enviar email de bienvenida
   */
  async sendWelcomeEmail(email, username) {
    return this.sendConfirmationEmail(email, username);
  }
};
