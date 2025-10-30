import { RoutineModel, WorkoutModel, ExerciseInstanceModel } from '../models/routine.model.js';

export const RoutineService = {
  /**
   * Obtener todas las rutinas de un usuario
   */
  async getUserRoutines(userId) {
    try {
      const { data, error } = await RoutineModel.getUserRoutines(userId);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener rutina completa por ID
   */
  async getRoutineById(routineId) {
    try {
      const { data, error } = await RoutineModel.getById(routineId);
      
      if (error || !data) {
        return { success: false, error: 'Rutina no encontrada' };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Crear nueva rutina
   */
  async createRoutine(userId, routineData) {
    try {
      const newRoutine = {
        usuario_id: userId,
        ...routineData
      };

      const { data, error } = await RoutineModel.create(newRoutine);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: 'Rutina creada exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Actualizar rutina
   */
  async updateRoutine(routineId, routineData) {
    try {
      const { data, error } = await RoutineModel.update(routineId, routineData);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: 'Rutina actualizada exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Eliminar rutina
   */
  async deleteRoutine(routineId) {
    try {
      const { error } = await RoutineModel.delete(routineId);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true,
        message: 'Rutina eliminada exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Activar/desactivar rutina
   */
  async toggleRoutineActive(routineId, activa) {
    try {
      const { data, error } = await RoutineModel.toggleActive(routineId, activa);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: `Rutina ${activa ? 'activada' : 'desactivada'} exitosamente` 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export const WorkoutService = {
  /**
   * Obtener entrenamientos de una rutina
   */
  async getWorkoutsByRoutineId(routineId) {
    try {
      const { data, error } = await WorkoutModel.getByRoutineId(routineId);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Crear nuevo entrenamiento
   */
  async createWorkout(workoutData) {
    try {
      const { data, error } = await WorkoutModel.create(workoutData);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: 'Entrenamiento creado exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Actualizar entrenamiento
   */
  async updateWorkout(workoutId, workoutData) {
    try {
      const { data, error } = await WorkoutModel.update(workoutId, workoutData);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: 'Entrenamiento actualizado exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Eliminar entrenamiento
   */
  async deleteWorkout(workoutId) {
    try {
      const { error } = await WorkoutModel.delete(workoutId);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true,
        message: 'Entrenamiento eliminado exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export const ExerciseInstanceService = {
  /**
   * Obtener ejercicios de un entrenamiento
   */
  async getExercisesByWorkoutId(workoutId) {
    try {
      const { data, error } = await ExerciseInstanceModel.getByWorkoutId(workoutId);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data: data || []
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Agregar ejercicios a un entrenamiento
   */
  async addExercisesToWorkout(workoutId, exercises) {
    try {
      // Preparar datos con el ID del entrenamiento
      const instancesData = exercises.map((ex, index) => ({
        entrenamiento_id: workoutId,
        exercise_id: ex.exercise_id,
        series: ex.series,
        repeticiones: ex.repeticiones,
        peso: ex.peso,
        descanso: ex.descanso,
        notas: ex.notas,
        orden: ex.orden || index + 1
      }));

      const { data, error } = await ExerciseInstanceModel.createBulk(instancesData);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: 'Ejercicios agregados exitosamente' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Actualizar instancia de ejercicio
   */
  async updateExerciseInstance(instanceId, instanceData) {
    try {
      const { data, error } = await ExerciseInstanceModel.update(instanceId, instanceData);
      
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
   * Eliminar instancia de ejercicio
   */
  async deleteExerciseInstance(instanceId) {
    try {
      const { error } = await ExerciseInstanceModel.delete(instanceId);
      
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
