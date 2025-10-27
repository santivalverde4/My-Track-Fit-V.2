import { supabase } from '../config/supabase.js';

export const RoutineModel = {
  /**
   * Obtener todas las rutinas de un usuario
   */
  async getUserRoutines(userId) {
    const { data, error } = await supabase
      .from('rutinas')
      .select('*')
      .eq('usuario_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  /**
   * Obtener rutina por ID con sus entrenamientos y ejercicios
   */
  async getById(id) {
    const { data, error } = await supabase
      .from('rutinas')
      .select(`
        *,
        entrenamientos (
          *,
          exercise_instances (
            *,
            exercises (*)
          )
        )
      `)
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  /**
   * Crear nueva rutina
   */
  async create(routineData) {
    const { data, error } = await supabase
      .from('rutinas')
      .insert([routineData])
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Actualizar rutina
   */
  async update(id, routineData) {
    const { data, error } = await supabase
      .from('rutinas')
      .update(routineData)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Eliminar rutina
   */
  async delete(id) {
    const { data, error } = await supabase
      .from('rutinas')
      .delete()
      .eq('id', id);
    
    return { data, error };
  },

  /**
   * Activar/desactivar rutina
   */
  async toggleActive(id, activa) {
    const { data, error } = await supabase
      .from('rutinas')
      .update({ activa })
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }
};

export const WorkoutModel = {
  /**
   * Obtener entrenamientos de una rutina
   */
  async getByRoutineId(rutinaId) {
    const { data, error } = await supabase
      .from('entrenamientos')
      .select(`
        *,
        exercise_instances (
          *,
          exercises (*)
        )
      `)
      .eq('rutina_id', rutinaId)
      .order('orden');
    
    return { data, error };
  },

  /**
   * Crear nuevo entrenamiento
   */
  async create(workoutData) {
    const { data, error } = await supabase
      .from('entrenamientos')
      .insert([workoutData])
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Actualizar entrenamiento
   */
  async update(id, workoutData) {
    const { data, error } = await supabase
      .from('entrenamientos')
      .update(workoutData)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Eliminar entrenamiento
   */
  async delete(id) {
    const { data, error } = await supabase
      .from('entrenamientos')
      .delete()
      .eq('id', id);
    
    return { data, error };
  }
};

export const ExerciseInstanceModel = {
  /**
   * Obtener instancias de ejercicios de un entrenamiento
   */
  async getByWorkoutId(entrenamientoId) {
    const { data, error } = await supabase
      .from('exercise_instances')
      .select(`
        *,
        exercises (*)
      `)
      .eq('entrenamiento_id', entrenamientoId)
      .order('orden');
    
    return { data, error };
  },

  /**
   * Crear nueva instancia de ejercicio
   */
  async create(instanceData) {
    const { data, error } = await supabase
      .from('exercise_instances')
      .insert([instanceData])
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Crear múltiples instancias de ejercicios
   */
  async createBulk(instancesData) {
    const { data, error } = await supabase
      .from('exercise_instances')
      .insert(instancesData)
      .select();
    
    return { data, error };
  },

  /**
   * Actualizar instancia de ejercicio
   */
  async update(id, instanceData) {
    const { data, error } = await supabase
      .from('exercise_instances')
      .update(instanceData)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Eliminar instancia de ejercicio
   */
  async delete(id) {
    const { data, error } = await supabase
      .from('exercise_instances')
      .delete()
      .eq('id', id);
    
    return { data, error };
  }
};
