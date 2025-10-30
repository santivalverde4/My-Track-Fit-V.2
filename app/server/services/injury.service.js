import { InjuryModel } from '../models/injury.model.js';

// Mapeo de estados del frontend (inglés) a la base de datos (español)
const mapStatusToDb = (status) => {
  const statusMap = {
    'active': 'activa',
    'recovering': 'en_recuperacion',
    'healed': 'curada'
  };
  return statusMap[status] || 'activa'; // Default a 'activa'
};

// Mapeo de estados de la base de datos (español) al frontend (inglés)
const mapStatusToFrontend = (estado) => {
  const statusMap = {
    'activa': 'active',
    'en_recuperacion': 'recovering',
    'curada': 'healed'
  };
  return statusMap[estado] || 'active';
};

// Mapeo de severidad del frontend (inglés) a la base de datos (español)
const mapSeverityToDb = (severity) => {
  const severityMap = {
    'mild': 'leve',
    'moderate': 'moderada',
    'severe': 'severa'
  };
  return severityMap[severity] || 'leve'; // Default a 'leve'
};

// Mapeo de severidad de la base de datos (español) al frontend (inglés)
const mapSeverityToFrontend = (severidad) => {
  const severityMap = {
    'leve': 'mild',
    'moderada': 'moderate',
    'severa': 'severe'
  };
  return severityMap[severidad] || 'mild';
};

// Helper para transformar datos de snake_case a camelCase
const transformInjuryToFrontend = (injury) => {
  if (!injury) return null;
  
  return {
    id: injury.id,
    name: injury.nombre_lesion,
    bodyPart: injury.parte_cuerpo,
    severity: mapSeverityToFrontend(injury.severidad), // Convertir severidad a inglés
    dateOccurred: injury.fecha_lesion, // Usar dateOccurred para el frontend
    description: injury.descripcion,
    status: mapStatusToFrontend(injury.estado), // Convertir estado a inglés
    estimatedRecoveryTime: injury.tiempo_estimado_recuperacion,
    notes: injury.notas,
    createdAt: injury.created_at,
    updatedAt: injury.updated_at
  };
};

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

      // Transformar datos a camelCase
      const transformedData = data ? data.map(transformInjuryToFrontend) : [];

      return { success: true, data: transformedData };
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

      // Transformar datos a camelCase
      const transformedData = data ? data.map(transformInjuryToFrontend) : [];

      return { success: true, data: transformedData };
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

      // Transformar datos a camelCase
      const transformedData = transformInjuryToFrontend(data);

      return { success: true, data: transformedData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Crear nueva lesión
   */
  async createInjury(userId, injuryData) {
    try {
      // Transformar campos camelCase a snake_case
      const newInjury = {
        usuario_id: userId,
        nombre_lesion: injuryData.name,
        parte_cuerpo: injuryData.bodyPart,
        severidad: mapSeverityToDb(injuryData.severity), // Mapear severidad de inglés a español
        fecha_lesion: injuryData.dateOccurred || injuryData.date, // Aceptar ambos nombres
        descripcion: injuryData.description,
        estado: mapStatusToDb(injuryData.status), // Mapear estado de inglés a español
        tiempo_estimado_recuperacion: injuryData.estimatedRecoveryTime,
        notas: injuryData.notes
      };

      const { data, error } = await InjuryModel.create(newInjury);
      
      if (error) {
        return { success: false, error: error.message };
      }

      // Transformar datos de respuesta a camelCase
      const transformedData = transformInjuryToFrontend(data);

      return { 
        success: true, 
        data: transformedData,
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
      // Transformar campos camelCase a snake_case
      const updateData = {};
      
      if (injuryData.name !== undefined) updateData.nombre_lesion = injuryData.name;
      if (injuryData.bodyPart !== undefined) updateData.parte_cuerpo = injuryData.bodyPart;
      if (injuryData.severity !== undefined) updateData.severidad = mapSeverityToDb(injuryData.severity); // Mapear severidad
      if (injuryData.dateOccurred !== undefined) updateData.fecha_lesion = injuryData.dateOccurred;
      if (injuryData.date !== undefined) updateData.fecha_lesion = injuryData.date; // Fallback
      if (injuryData.description !== undefined) updateData.descripcion = injuryData.description;
      if (injuryData.status !== undefined) updateData.estado = mapStatusToDb(injuryData.status); // Mapear estado
      if (injuryData.estimatedRecoveryTime !== undefined) updateData.tiempo_estimado_recuperacion = injuryData.estimatedRecoveryTime;
      if (injuryData.notes !== undefined) updateData.notas = injuryData.notes;

      const { data, error } = await InjuryModel.update(injuryId, updateData);
      
      if (error) {
        return { success: false, error: error.message };
      }

      // Transformar datos de respuesta a camelCase
      const transformedData = transformInjuryToFrontend(data);

      return { 
        success: true, 
        data: transformedData,
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
  async updateInjuryStatus(injuryId, status) {
    try {
      // Transformar status de inglés a español
      const estado = mapStatusToDb(status);
      
      const validStates = ['activa', 'en_recuperacion', 'curada'];
      
      if (!validStates.includes(estado)) {
        return { 
          success: false, 
          error: 'Estado inválido. Debe ser: active, recovering o healed' 
        };
      }

      const { data, error } = await InjuryModel.updateStatus(injuryId, estado);
      
      if (error) {
        return { success: false, error: error.message };
      }

      // Transformar la respuesta de vuelta a camelCase con valores en inglés
      const transformedData = transformInjuryToFrontend(data);

      return { 
        success: true, 
        data: transformedData,
        message: `Estado actualizado a ${status}` 
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
