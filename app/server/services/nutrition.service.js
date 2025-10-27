import { FoodModel, NutritionLogModel, NutritionGoalsModel } from '../models/nutrition.model.js';

export const NutritionService = {
  /**
   * Obtener alimentos
   */
  async getAllFoods() {
    try {
      const { data, error } = await FoodModel.getAll();
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Buscar alimentos
   */
  async searchFoods(searchTerm) {
    try {
      const { data, error } = await FoodModel.searchByName(searchTerm);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Crear alimento
   */
  async createFood(foodData) {
    try {
      const { data, error } = await FoodModel.create(foodData);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: 'Alimento creado exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener registros nutricionales por fecha
   */
  async getNutritionLogsByDate(userId, fecha) {
    try {
      const { data, error } = await NutritionLogModel.getUserLogsByDate(userId, fecha);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener registros nutricionales por rango de fechas
   */
  async getNutritionLogsByDateRange(userId, fechaInicio, fechaFin) {
    try {
      const { data, error } = await NutritionLogModel.getUserLogsByDateRange(
        userId, 
        fechaInicio, 
        fechaFin
      );
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Crear registro nutricional
   */
  async createNutritionLog(userId, nutritionData) {
    try {
      const logData = {
        usuario_id: userId,
        ...nutritionData
      };

      const { data, error } = await NutritionLogModel.create(logData);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: 'Registro nutricional creado exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Actualizar registro nutricional
   */
  async updateNutritionLog(logId, nutritionData) {
    try {
      const { data, error } = await NutritionLogModel.update(logId, nutritionData);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: 'Registro nutricional actualizado exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Eliminar registro nutricional
   */
  async deleteNutritionLog(logId) {
    try {
      const { error } = await NutritionLogModel.delete(logId);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true,
        message: 'Registro nutricional eliminado exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener resumen nutricional del día
   */
  async getDailySummary(userId, fecha) {
    try {
      const { data, error } = await NutritionLogModel.getDailySummary(userId, fecha);
      
      if (error) {
        return { success: false, error: error.message };
      }

      // Obtener también los objetivos
      const { data: goals } = await NutritionGoalsModel.getUserGoals(userId);

      return { 
        success: true, 
        data: {
          consumed: data,
          goals: goals || null
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener objetivos nutricionales
   */
  async getNutritionGoals(userId) {
    try {
      const { data, error } = await NutritionGoalsModel.getUserGoals(userId);
      
      if (error && error.code !== 'PGRST116') { // PGRST116 es "no rows returned"
        return { success: false, error: error.message };
      }

      return { success: true, data: data || null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Crear o actualizar objetivos nutricionales
   */
  async setNutritionGoals(userId, goalsData) {
    try {
      // Verificar si ya existen objetivos
      const { data: existingGoals } = await NutritionGoalsModel.getUserGoals(userId);

      let result;
      if (existingGoals) {
        result = await NutritionGoalsModel.update(userId, goalsData);
      } else {
        result = await NutritionGoalsModel.create({
          usuario_id: userId,
          ...goalsData
        });
      }

      if (result.error) {
        return { success: false, error: result.error.message };
      }

      return { 
        success: true, 
        data: result.data,
        message: 'Objetivos nutricionales actualizados exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
