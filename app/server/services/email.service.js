import nodemailer from 'nodemailer';

// Configurar el transporter de nodemailer con Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mytrackfit@gmail.com',
      pass: 'vgcf omys twmk qwun'
    }
  });
};

export const EmailService = {
  /**
   * Enviar email de confirmación de registro con token
   */
  async sendConfirmationEmail(email, username, token) {
    try {
      const transporter = createTransporter();
      const confirmUrl = `http://localhost:5000/api/auth/confirm/${token}`;

      const mailOptions = {
        from: 'mytrackfit@gmail.com',
        to: email,
        subject: 'Confirma tu cuenta - My Track Fit',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                color: #666;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Confirma tu cuenta</h1>
            </div>
            <div class="content">
              <h2>Hola ${username},</h2>
              <p>Gracias por registrarte en My Track Fit. Para completar tu registro, necesitamos que confirmes tu dirección de correo electrónico.</p>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${confirmUrl}" class="button">Confirmar mi cuenta</a>
              </p>

              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="color: #667eea; word-break: break-all;">${confirmUrl}</p>

              <p><strong>Una vez confirmada tu cuenta podrás:</strong></p>
              <ul>
                <li>Crear tus rutinas de entrenamiento personalizadas</li>
                <li>Registrar tu progreso nutricional</li>
                <li>Gestionar lesiones y recuperación</li>
                <li>Ver tus estadísticas y métricas</li>
                <li>Usar nuestro Smart Trainer con IA</li>
              </ul>
              
              <div class="footer">
                <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>
                <p>&copy; 2025 My Track Fit. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      
      console.log('📧 Email enviado exitosamente a:', email);
      console.log('📧 Message ID:', info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
        message: 'Email de confirmación enviado exitosamente'
      };
    } catch (error) {
      console.error('❌ Error al enviar email:', error.message);
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
      const transporter = createTransporter();
      const resetUrl = `http://localhost:5000/reset-password/${token}`;

      const mailOptions = {
        from: 'mytrackfit@gmail.com',
        to: email,
        subject: 'Restablece tu contraseña - My Track Fit',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .button {
                display: inline-block;
                padding: 12px 30px;
                background: #1976d2;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                color: #666;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Restablecimiento de contraseña</h1>
            </div>
            <div class="content">
              <h2>Hola ${username},</h2>
              <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón para continuar:</p>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" class="button">Cambiar contraseña</a>
              </p>

              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="color: #1976d2; word-break: break-all;">${resetUrl}</p>

              <p><strong>Nota de seguridad:</strong></p>
              <ul>
                <li>Este enlace es de un solo uso</li>
                <li>Si no solicitaste este cambio, puedes ignorar este correo</li>
                <li>Tu contraseña actual permanecerá sin cambios</li>
              </ul>
              
              <div class="footer">
                <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
                <p>&copy; 2025 My Track Fit. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      
      console.log('📧 Email de recuperación enviado a:', email);
      console.log('📧 Message ID:', info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
        message: 'Email de recuperación enviado exitosamente'
      };
    } catch (error) {
      console.error('❌ Error al enviar email de recuperación:', error.message);
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
