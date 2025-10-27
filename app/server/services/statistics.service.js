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
