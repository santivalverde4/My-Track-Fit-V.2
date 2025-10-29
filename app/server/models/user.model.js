import { supabase } from '../config/supabase.js';

export const UserModel = {
  /**
   * Buscar usuario por username
   */
  async findByUsername(username) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    return { data, error };
  },

  /**
   * Buscar usuario por ID
   */
  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  /**
   * Buscar usuario por email
   */
  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('correo', email)
      .single();
    
    return { data, error };
  },

  /**
   * Crear nuevo usuario
   */
  async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Actualizar usuario
   */
  async update(id, userData) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Eliminar usuario
   */
  async delete(id) {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    return { data, error };
  },

  /**
   * Confirmar cuenta de usuario
   */
  async confirmUser(id) {
    const { data, error } = await supabase
      .from('users')
      .update({ confirmed: true })
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }
};
