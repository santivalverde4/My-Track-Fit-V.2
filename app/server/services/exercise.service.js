import { ExerciseModel } from '../models/exercise.model.js';

export const ExerciseService = {
  /**
   * Obtener todos los ejercicios
   */
  async getAllExercises() {
    try {
      const { data, error } = await ExerciseModel.getAll();
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener ejercicios por categoría
   */
  async getExercisesByCategory(categoria) {
    try {
      const { data, error } = await ExerciseModel.getByCategory(categoria);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Buscar ejercicios
   */
  async searchExercises(searchTerm) {
    try {
      const { data, error } = await ExerciseModel.searchByName(searchTerm);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener ejercicio por ID
   */
  async getExerciseById(id) {
    try {
      const { data, error } = await ExerciseModel.findById(id);
      
      if (error || !data) {
        return { success: false, error: 'Ejercicio no encontrado' };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Crear nuevo ejercicio
   */
  async createExercise(exerciseData) {
    try {
      const { data, error } = await ExerciseModel.create(exerciseData);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: 'Ejercicio creado exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Actualizar ejercicio
   */
  async updateExercise(id, exerciseData) {
    try {
      const { data, error } = await ExerciseModel.update(id, exerciseData);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: 'Ejercicio actualizado exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Eliminar ejercicio
   */
  async deleteExercise(id) {
    try {
      const { error } = await ExerciseModel.delete(id);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true,
        message: 'Ejercicio eliminado exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
