import { MetricsModel, UserFilesModel } from '../models/statistics.model.js';

export const StatisticsService = {
  /**
   * Obtener métricas por fecha
   */
  async getMetricsByDate(userId, fecha) {
    try {
      const { data, error } = await MetricsModel.getUserMetricsByDate(userId, fecha);
      
      if (error && error.code !== 'PGRST116') {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener métricas por rango de fechas
   */
  async getMetricsByDateRange(userId, fechaInicio, fechaFin) {
    try {
      const { data, error } = await MetricsModel.getUserMetricsByDateRange(
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
   * Crear o actualizar métricas del día
   */
  async saveMetrics(userId, fecha, metricsData) {
    try {
      const { data, error } = await MetricsModel.upsertByDate(userId, fecha, metricsData);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: 'Métricas guardadas exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener últimas N métricas
   */
  async getLastMetrics(userId, limit = 30) {
    try {
      const { data, error } = await MetricsModel.getLastNMetrics(userId, limit);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener resumen estadístico
   */
  async getStatsSummary(userId, days = 30) {
    try {
      const { data, error } = await MetricsModel.getLastNMetrics(userId, days);
      
      if (error) {
        return { success: false, error: error.message };
      }

      if (!data || data.length === 0) {
        return { 
          success: true, 
          data: {
            count: 0,
            averages: null
          }
        };
      }

      // Calcular promedios
      const summary = data.reduce((acc, metric) => {
        if (metric.peso) {
          acc.totalPeso += parseFloat(metric.peso);
          acc.countPeso++;
        }
        if (metric.horas_sueno) {
          acc.totalSueno += parseFloat(metric.horas_sueno);
          acc.countSueno++;
        }
        return acc;
      }, { 
        totalPeso: 0, 
        countPeso: 0, 
        totalSueno: 0, 
        countSueno: 0 
      });

      return {
        success: true,
        data: {
          count: data.length,
          averages: {
            peso: summary.countPeso > 0 
              ? (summary.totalPeso / summary.countPeso).toFixed(2) 
              : null,
            horas_sueno: summary.countSueno > 0 
              ? (summary.totalSueno / summary.countSueno).toFixed(2) 
              : null
          },
          latest: data[0] || null
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener estadísticas generales para el dashboard
   */
  async getStatistics(userId, timeRange) {
    try {
      const days = timeRange === '30d' ? 30 : 7;
      const { data, error } = await MetricsModel.getLastNMetrics(userId, days);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener progreso de peso en el tiempo
   */
  async getWeightProgress(userId, days = 30) {
    try {
      const { data, error } = await MetricsModel.getLastNMetrics(userId, days);
      
      if (error) {
        return { success: false, error: error.message };
      }

      const weightData = data
        .filter(m => m.peso)
        .map(m => ({
          fecha: m.fecha,
          peso: parseFloat(m.peso)
        }))
        .reverse();

      return { success: true, data: weightData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener actividad semanal de entrenamientos
   */
  async getWeeklyActivity(userId, weeks = 4) {
    try {
      const days = weeks * 7;
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - days);
      const fechaFin = new Date();

      const { data: workouts, error } = await MetricsModel.getUserWorkouts(
        userId,
        fechaInicio.toISOString().split('T')[0],
        fechaFin.toISOString().split('T')[0]
      );
      
      if (error) {
        return { success: false, error: error.message };
      }

      // Agrupar por semana
      const weeklyData = {};
      workouts.forEach(workout => {
        const date = new Date(workout.fecha);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];

        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = {
            semana: weekKey,
            entrenamientos: 0,
            duracion: 0
          };
        }

        weeklyData[weekKey].entrenamientos++;
        weeklyData[weekKey].duracion += workout.duracion || 0;
      });

      return { success: true, data: Object.values(weeklyData) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener ejercicios más realizados
   */
  async getTopExercises(userId, limit = 5, days = 30) {
    try {
      const { data, error } = await MetricsModel.getTopExercises(userId, limit, days);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener distribución de ejercicios por grupo muscular
   */
  async getExerciseDistribution(userId, days = 30) {
    try {
      const { data, error } = await MetricsModel.getExerciseDistribution(userId, days);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener distribución de macronutrientes semanal
   */
  async getWeeklyMacros(userId, weeks = 4) {
    try {
      const days = weeks * 7;
      const { data, error } = await MetricsModel.getWeeklyNutrition(userId, days);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener calorías semanales (consumidas vs quemadas)
   */
  async getWeeklyCalories(userId, weeks = 4) {
    try {
      const days = weeks * 7;
      const { data, error } = await MetricsModel.getWeeklyCalories(userId, days);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener métricas de bienestar (energía, estrés, sueño)
   */
  async getWellnessMetrics(userId, days = 7) {
    try {
      const { data, error } = await MetricsModel.getLastNMetrics(userId, days);
      
      if (error) {
        return { success: false, error: error.message };
      }

      const wellnessData = data
        .filter(m => m.nivel_energia || m.nivel_estres || m.horas_sueno)
        .map(m => ({
          fecha: m.fecha,
          energia: m.nivel_energia || 0,
          estres: m.nivel_estres || 0,
          sueno: parseFloat(m.horas_sueno) || 0
        }))
        .reverse();

      return { success: true, data: wellnessData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export const UserFilesService = {
  /**
   * Obtener archivos de usuario
   */
  async getUserFiles(userId) {
    try {
      const { data, error } = await UserFilesModel.getUserFiles(userId);
      
      if (error && error.code !== 'PGRST116') {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Actualizar archivo específico
   */
  async updateUserFile(userId, fileType, fileData) {
    try {
      const validFileTypes = [
        'ArchivoBody',
        'ArchivoRutina',
        'ArchivoEjercicio',
        'archivonutricion',
        'archivolesiones',
        'archivoestadisticas',
        'archivoia'
      ];

      if (!validFileTypes.includes(fileType)) {
        return { 
          success: false, 
          error: 'Tipo de archivo inválido' 
        };
      }

      const { data, error } = await UserFilesModel.updateFile(userId, fileType, fileData);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: 'Archivo actualizado exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
