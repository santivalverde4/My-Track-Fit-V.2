import { FoodModel, NutritionLogModel, NutritionGoalsModel } from '../models/nutrition.model.js';
import { MetricsModel } from '../models/statistics.model.js';

// Mapeo de tipo de comida del frontend (inglés) a la base de datos (español)
const mapMealTypeToDb = (type) => {
  const typeMap = {
    'breakfast': 'desayuno',
    'lunch': 'almuerzo',
    'dinner': 'cena',
    'snack': 'merienda'
  };
  return typeMap[type] || 'merienda';
};

// Mapeo de tipo de comida de la base de datos (español) al frontend (inglés)
const mapMealTypeToFrontend = (tipo_comida) => {
  const typeMap = {
    'desayuno': 'breakfast',
    'almuerzo': 'lunch',
    'cena': 'dinner',
    'merienda': 'snack'
  };
  return typeMap[tipo_comida] || 'snack';
};

// Helper para transformar datos de snake_case a camelCase
const transformNutritionLogToFrontend = (log) => {
  if (!log) return null;
  
  return {
    id: log.id,
    type: mapMealTypeToFrontend(log.tipo_comida),
    name: log.nombre_alimento,
    calories: log.calorias,
    protein: log.proteinas,
    carbs: log.carbohidratos,
    fat: log.grasas,
    portion: log.cantidad_gramos,
    notes: log.notas,
    date: log.fecha,
    createdAt: log.created_at
  };
};

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

      // Transformar datos a camelCase/inglés
      const transformedData = data ? data.map(transformNutritionLogToFrontend) : [];

      return { success: true, data: transformedData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener datos completos del día (logs de nutrición + métricas con agua)
   */
  async getTodayData(userId, fecha) {
    try {
      // Obtener logs de nutrición
      const { data: nutritionLogs, error: nutritionError } = await NutritionLogModel.getUserLogsByDate(userId, fecha);
      
      if (nutritionError) {
        return { success: false, error: nutritionError.message };
      }

      // Obtener métricas del día (incluye vasos de agua)
      const { data: metrics, error: metricsError } = await MetricsModel.getUserMetricsByDate(userId, fecha);
      
      // Si no hay métricas aún, devolver 0 vasos de agua
      const waterGlasses = metrics ? metrics.vasos_agua || 0 : 0;

      // Transformar logs de nutrición a camelCase/inglés
      const transformedLogs = nutritionLogs ? nutritionLogs.map(transformNutritionLogToFrontend) : [];

      return { 
        success: true, 
        data: {
          meals: transformedLogs,
          water: waterGlasses,
          metrics: metrics
        }
      };
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
      // Transformar campos del frontend (camelCase/inglés) a base de datos (snake_case/español)
      const logData = {
        usuario_id: userId,
        fecha: nutritionData.fecha || nutritionData.date,
        tipo_comida: mapMealTypeToDb(nutritionData.type),
        nombre_alimento: nutritionData.name,
        cantidad_gramos: parseFloat(nutritionData.portion) || null, // Convertir a número
        calorias: parseFloat(nutritionData.calories) || 0,
        proteinas: parseFloat(nutritionData.protein) || 0,
        carbohidratos: parseFloat(nutritionData.carbs) || 0,
        grasas: parseFloat(nutritionData.fat) || 0,
        notas: nutritionData.notes,
        alimento_id: nutritionData.foodId // Si viene de la base de alimentos
      };

      const { data, error } = await NutritionLogModel.create(logData);
      
      if (error) {
        return { success: false, error: error.message };
      }

      // Transformar datos de respuesta a camelCase/inglés
      const transformedData = transformNutritionLogToFrontend(data);

      return { 
        success: true, 
        data: transformedData,
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
  },

  /**
   * Actualizar consumo de agua
   */
  async updateWaterIntake(userId, fecha, vasosAgua) {
    try {
      // Usar upsert para crear o actualizar las métricas del día
      const { data, error } = await MetricsModel.upsertByDate(
        userId, 
        fecha, 
        { vasos_agua: vasosAgua }
      );

      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: 'Consumo de agua actualizado exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
