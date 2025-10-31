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
    console.log('🔍 Buscando usuario con email:', email);
    
    // Primero intentar buscar usuario activo
    const { data: activeUser, error: activeError } = await supabase
      .from('users')
      .select('*')
      .ilike('correo', email)
      .eq('activo', true)
      .limit(1)
      .single();
    
    if (activeUser && !activeError) {
      console.log('📊 Usuario activo encontrado');
      return { data: activeUser, error: null };
    }
    
    // Si no hay usuario activo, buscar cualquier usuario con ese email
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .ilike('correo', email)
      .limit(1);
    
    const user = users && users.length > 0 ? users[0] : null;
    console.log('📊 Resultado búsqueda:', { data: user ? 'encontrado' : 'no encontrado', activo: user?.activo });
    
    return { data: user, error: user ? null : error };
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
