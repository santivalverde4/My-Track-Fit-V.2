import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';
import { UserFilesModel } from '../models/statistics.model.js';

export const AuthService = {
  /**
   * Registrar nuevo usuario
   */
  async register(username, password) {
    try {
      // Verificar si el usuario ya existe
      const { data: existingUser } = await UserModel.findByUsername(username);
      if (existingUser) {
        return { 
          success: false, 
          error: 'El usuario ya existe' 
        };
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const { data: newUser, error } = await UserModel.create({
        username,
        password: hashedPassword,
        confirmed: false
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Crear archivos de usuario
      await UserFilesModel.create(newUser.id);

      // Generar token
      const token = jwt.sign(
        { userId: newUser.id, username: newUser.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return {
        success: true,
        data: {
          user: {
            id: newUser.id,
            username: newUser.username,
            confirmed: newUser.confirmed
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
