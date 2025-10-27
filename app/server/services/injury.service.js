import { InjuryModel } from '../models/injury.model.js';

export const InjuryService = {
  /**
   * Obtener todas las lesiones de un usuario
   */
  async getUserInjuries(userId) {
    try {
      const { data, error } = await InjuryModel.getUserInjuries(userId);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener lesiones activas
   */
  async getActiveInjuries(userId) {
    try {
      const { data, error } = await InjuryModel.getActiveInjuries(userId);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener lesión por ID
   */
  async getInjuryById(injuryId) {
    try {
      const { data, error } = await InjuryModel.findById(injuryId);
      
      if (error || !data) {
        return { success: false, error: 'Lesión no encontrada' };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Crear nueva lesión
   */
  async createInjury(userId, injuryData) {
    try {
      const newInjury = {
        usuario_id: userId,
        ...injuryData
      };

      const { data, error } = await InjuryModel.create(newInjury);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: 'Lesión registrada exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Actualizar lesión
   */
  async updateInjury(injuryId, injuryData) {
    try {
      const { data, error } = await InjuryModel.update(injuryId, injuryData);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: 'Lesión actualizada exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Eliminar lesión
   */
  async deleteInjury(injuryId) {
    try {
      const { error } = await InjuryModel.delete(injuryId);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true,
        message: 'Lesión eliminada exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Cambiar estado de lesión
   */
  async updateInjuryStatus(injuryId, estado) {
    try {
      const validStates = ['activa', 'en_recuperacion', 'curada'];
      
      if (!validStates.includes(estado)) {
        return { 
          success: false, 
          error: 'Estado inválido. Debe ser: activa, en_recuperacion o curada' 
        };
      }

      const { data, error } = await InjuryModel.updateStatus(injuryId, estado);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: `Lesión marcada como ${estado}` 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener lesiones por parte del cuerpo
   */
  async getInjuriesByBodyPart(userId, parteCuerpo) {
    try {
      const { data, error } = await InjuryModel.getByBodyPart(userId, parteCuerpo);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
