import { supabase } from '../config/supabase.js';

export const ExerciseModel = {
  /**
   * Obtener todos los ejercicios
   */
  async getAll() {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name');
    
    return { data, error };
  },

  /**
   * Obtener ejercicios por categoría
   */
  async getByCategory(categoria) {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('categoria', categoria)
      .order('name');
    
    return { data, error };
  },

  /**
   * Obtener ejercicio por ID
   */
  async findById(id) {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  /**
   * Crear nuevo ejercicio
   */
  async create(exerciseData) {
    const { data, error } = await supabase
      .from('exercises')
      .insert([exerciseData])
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Actualizar ejercicio
   */
  async update(id, exerciseData) {
    const { data, error } = await supabase
      .from('exercises')
      .update(exerciseData)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Eliminar ejercicio
   */
  async delete(id) {
    const { data, error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id);
    
    return { data, error };
  },

  /**
   * Buscar ejercicios por nombre
   */
  async searchByName(searchTerm) {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('name');
    
    return { data, error };
  }
};
