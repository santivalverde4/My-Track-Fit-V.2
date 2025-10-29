import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from '../models/user.model.js';
import { UserFilesModel } from '../models/statistics.model.js';
import { EmailService } from './email.service.js';

// Almacén temporal de usuarios pendientes de confirmación
const pendingUsers = {};

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
        return { 
          success: false, 
          error: 'El usuario ya existe' 
        };
      }

      // Verificar si el email ya existe
      const { data: existingEmail } = await UserModel.findByEmail(email);
      if (existingEmail) {
        return { 
          success: false, 
          error: 'El email ya está registrado' 
        };
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
      console.log('📧 Enviando email de confirmación a:', email);
      const emailResult = await EmailService.sendConfirmationEmail(email, username, token);
      
      if (!emailResult.success) {
        // Si el email no se pudo enviar, eliminar usuario pendiente
        delete pendingUsers[token];
        console.error('❌ Email NO enviado. Cuenta NO se creará.');
        return {
          success: false,
          error: 'No se pudo enviar el email de confirmación. Verifica que el correo sea válido.'
        };
      }

      console.log('✅ Email de confirmación enviado. Usuario debe confirmar para completar registro.');
      
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

      // Crear usuario en la base de datos
      const { data: newUser, error } = await UserModel.create({
        username: userData.username,
        password: userData.password,
        correo: userData.correo,
        confirmed: true
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Crear archivos de usuario
      await UserFilesModel.create(newUser.id);

      // Eliminar usuario pendiente
      delete pendingUsers[token];

      console.log('✅ Cuenta confirmada exitosamente para:', userData.username);

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
      // Si se actualiza la contraseña, hashearla
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
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
  }
};
