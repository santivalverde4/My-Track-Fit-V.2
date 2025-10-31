import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from '../models/user.model.js';
import { UserFilesModel } from '../models/statistics.model.js';
import { EmailService } from './email.service.js';

// Almacén temporal de usuarios pendientes de confirmación
const pendingUsers = {};

// Almacén temporal de tokens de recuperación de contraseña
const passwordResetTokens = {};

export const AuthService = {
  /**
   * Registrar nuevo usuario
   */
  async register(username, password, email) {
    try {
      // Validar email con formato correcto
      if (!email || !EmailService.isValidEmail(email)) {
        return { 
          success: false, 
          error: 'Email inválido. Por favor ingresa un correo válido.' 
        };
      }

      // Verificar si el usuario ya existe
      const { data: existingUser } = await UserModel.findByUsername(username);
      if (existingUser) {
        // Si el usuario existe y está activo, no permitir registro
        if (existingUser.activo) {
          return { 
            success: false, 
            error: 'El usuario ya existe' 
          };
        }
        // Si el usuario existe pero está inactivo, permitir crear nueva cuenta
        // (la cuenta anterior quedará en la BD como inactiva)
      }

      // Verificar si el email ya existe
      const { data: existingEmail } = await UserModel.findByEmail(email);
      if (existingEmail) {
        // Si el email existe y está activo, no permitir registro
        if (existingEmail.activo) {
          return { 
            success: false, 
            error: 'El email ya está registrado' 
          };
        }
        // Si el email existe pero está inactivo, permitir crear nueva cuenta
        // (la cuenta anterior quedará en la BD como inactiva)
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generar token único para confirmación
      const token = uuidv4();

      // Guardar usuario pendiente en memoria (esperando confirmación)
      pendingUsers[token] = {
        username,
        password: hashedPassword,
        correo: email
      };

      // Enviar email con link de confirmación
      console.log(' Enviando email de confirmación a:', email);
      const emailResult = await EmailService.sendConfirmationEmail(email, username, token);
      
      if (!emailResult.success) {
        // Si el email no se pudo enviar, eliminar usuario pendiente
        delete pendingUsers[token];
        console.error(' Email NO enviado. Cuenta NO se creará.');
        return {
          success: false,
          error: 'No se pudo enviar el email de confirmación. Verifica que el correo sea válido.'
        };
      }

      console.log(' Email de confirmación enviado. Usuario debe confirmar para completar registro.');
      
      return {
        success: true,
        message: 'Revisa tu correo electrónico para confirmar tu cuenta.'
      };
    } catch (error) {
      return { 
        success: false, 
        error: 'Error en el registro: ' + error.message 
      };
    }
  },

  /**
   * Confirmar cuenta con token del email
   */
  async confirmAccount(token) {
    try {
      const userData = pendingUsers[token];
      
      if (!userData) {
        return {
          success: false,
          error: 'Token inválido o expirado'
        };
      }

      // Crear nuevo usuario en la base de datos
      const { data: newUser, error } = await UserModel.create({
        username: userData.username,
        password: userData.password,
        correo: userData.correo,
        confirmed: true,
        activo: true
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Crear archivos de usuario
      await UserFilesModel.create(newUser.id);

      // Eliminar usuario pendiente
      delete pendingUsers[token];

      console.log(' Cuenta confirmada exitosamente para:', userData.username);

      return {
        success: true,
        data: {
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.correo
          }
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  /**
   * Login de usuario
   */
  async login(username, password) {
    try {
      // Buscar usuario
      const { data: user, error } = await UserModel.findByUsername(username);
      
      if (error || !user) {
        return { 
          success: false, 
          error: 'Usuario o contraseña incorrectos' 
        };
      }

      // Verificar si la cuenta está activa
      if (user.activo === false) {
        return {
          success: false,
          error: 'Esta cuenta ha sido eliminada. Si deseas volver, puedes crear una nueva cuenta con el mismo correo.'
        };
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return { 
          success: false, 
          error: 'Usuario o contraseña incorrectos' 
        };
      }

      // Generar token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            confirmed: user.confirmed
          },
          token
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  /**
   * Verificar token
   */
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { success: true, data: decoded };
    } catch (error) {
      return { 
        success: false, 
        error: 'Token inválido o expirado' 
      };
    }
  },

  /**
   * Obtener perfil de usuario
   */
  async getUserProfile(userId) {
    try {
      const { data: user, error } = await UserModel.findById(userId);
      
      if (error || !user) {
        return { 
          success: false, 
          error: 'Usuario no encontrado' 
        };
      }

      // No devolver la contraseña
      const { password, ...userProfile } = user;

      return {
        success: true,
        data: userProfile
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  /**
   * Obtener usuarios pendientes (para debugging)
   */
  getPendingUsers() {
    return Object.keys(pendingUsers).map(token => ({
      token,
      username: pendingUsers[token].username,
      email: pendingUsers[token].correo
    }));
  },

  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(userId, updates) {
    try {
      // Si se actualiza la contraseña, validar la contraseña actual primero
      if (updates.password) {
        // Verificar que se proporcionó la contraseña actual
        if (!updates.currentPassword) {
          return { 
            success: false, 
            error: 'Debes proporcionar tu contraseña actual para cambiarla' 
          };
        }

        // Obtener usuario actual
        const { data: user, error: userError } = await UserModel.findById(userId);
        
        if (userError || !user) {
          return { 
            success: false, 
            error: 'Usuario no encontrado' 
          };
        }

        // Verificar que la contraseña actual sea correcta
        const isPasswordValid = await bcrypt.compare(updates.currentPassword, user.password);
        
        if (!isPasswordValid) {
          return { 
            success: false, 
            error: 'La contraseña actual es incorrecta' 
          };
        }

        // Hashear la nueva contraseña
        updates.password = await bcrypt.hash(updates.password, 10);
        
        // Eliminar currentPassword de las actualizaciones (no debe guardarse)
        delete updates.currentPassword;
      }

      // Si se actualiza el username, verificar que no exista (solo para usuarios activos)
      if (updates.username) {
        const { data: existingUser } = await UserModel.findByUsername(updates.username);
        
        if (existingUser && existingUser.id !== userId && existingUser.activo === true) {
          return { 
            success: false, 
            error: 'El nombre de usuario ya existe' 
          };
        }
      }

      const { data, error } = await UserModel.update(userId, updates);
      
      if (error) {
        return { success: false, error: error.message };
      }

      const { password, ...userProfile } = data;

      return {
        success: true,
        data: userProfile
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  /**
   * Solicitar recuperación de contraseña
   */
  async requestPasswordReset(email) {
    try {
      console.log('📧 Iniciando recuperación de contraseña para:', email);
      
      // Buscar usuario por email (sin importar si está activo o no)
      const { data: user, error } = await UserModel.findByEmail(email);
      
      console.log('🔍 Resultado de búsqueda - User:', user, 'Error:', error);
      
      if (!user || error) {
        console.log('⚠️ Usuario no encontrado para email:', email);
        // Por seguridad, no revelar si el email existe o no
        return {
          success: true,
          message: 'Si el correo existe, recibirás un email para restablecer tu contraseña.'
        };
      }

      // Verificar si el usuario está activo
      if (user.activo === false) {
        console.log('⚠️ Usuario inactivo, no se puede restablecer contraseña');
        return {
          success: true,
          message: 'Si el correo existe, recibirás un email para restablecer tu contraseña.'
        };
      }

      console.log('✅ Usuario encontrado:', user.username, '- Activo:', user.activo);

      // Generar token único
      const token = uuidv4();
      passwordResetTokens[token] = email;
      console.log('🔑 Token generado:', token);

      // Enviar email de recuperación
      console.log('📨 Enviando email de recuperación a:', email);
      const emailResult = await EmailService.sendPasswordResetEmail(email, user.username, token);
      
      console.log('📬 Resultado del envío de email:', emailResult);
      
      if (!emailResult.success) {
        console.error('❌ Error enviando email de recuperación:', emailResult.error);
        return {
          success: false,
          error: 'Error enviando correo de recuperación'
        };
      }

      console.log('✅ Email de recuperación enviado exitosamente');
      return {
        success: true,
        message: 'Correo de recuperación enviado exitosamente'
      };
    } catch (error) {
      console.error('❌ Error en requestPasswordReset:', error);
      return {
        success: false,
        error: 'Error en la solicitud de recuperación: ' + error.message
      };
    }
  },

  /**
   * Resetear contraseña con token
   */
  async resetPassword(token, newPassword) {
    try {
      const email = passwordResetTokens[token];
      
      if (!email) {
        return {
          success: false,
          error: 'Token inválido o expirado'
        };
      }

      // Buscar usuario
      const { data: user } = await UserModel.findByEmail(email);
      
      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      // Hashear nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar contraseña
      const { error } = await UserModel.update(user.id, { password: hashedPassword });
      
      if (error) {
        return { success: false, error: error.message };
      }

      // Eliminar token usado
      delete passwordResetTokens[token];

      console.log(' Contraseña actualizada para:', email);

      return {
        success: true,
        message: 'Contraseña actualizada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al resetear contraseña: ' + error.message
      };
    }
  },

  /**
   * Verificar si un token de reset es válido
   */
  isResetTokenValid(token) {
    return !!passwordResetTokens[token];
  },

  /**
   * Desactivar cuenta (soft delete)
   */
  async deleteAccount(userId) {
    try {
      // Marcar cuenta como inactiva en lugar de eliminarla físicamente
      const { data, error } = await UserModel.update(userId, {
        activo: false
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      console.log(' Cuenta desactivada para usuario ID:', userId);

      return {
        success: true,
        message: 'Cuenta eliminada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al eliminar cuenta: ' + error.message
      };
    }
  }
};
