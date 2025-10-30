import { supabase } from '../config/supabase.js';

export const InjuryModel = {
  /**
   * Obtener todas las lesiones de un usuario
   */
  async getUserInjuries(userId) {
    const { data, error } = await supabase
      .from('lesionestemporales')
      .select('*')
      .eq('usuario_id', userId)
      .order('fecha_lesion', { ascending: false });
    
    return { data, error };
  },

  /**
   * Obtener lesiones activas de un usuario
   */
  async getActiveInjuries(userId) {
    const { data, error } = await supabase
      .from('lesionestemporales')
      .select('*')
      .eq('usuario_id', userId)
      .eq('estado', 'activa')
      .order('fecha_lesion', { ascending: false });
    
    return { data, error };
  },

  /**
   * Obtener lesión por ID
   */
  async findById(id) {
    const { data, error } = await supabase
      .from('lesionestemporales')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  /**
   * Crear nueva lesión
   */
  async create(injuryData) {
    const { data, error } = await supabase
      .from('lesionestemporales')
      .insert([injuryData])
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Actualizar lesión
   */
  async update(id, injuryData) {
    const updatedData = {
      ...injuryData,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('lesionestemporales')
      .update(updatedData)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Eliminar lesión
   */
  async delete(id) {
    const { data, error } = await supabase
      .from('lesionestemporales')
      .delete()
      .eq('id', id);
    
    return { data, error };
  },

  /**
   * Cambiar estado de lesión
   */
  async updateStatus(id, estado) {
    const { data, error } = await supabase
      .from('lesionestemporales')
      .update({ 
        estado,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Obtener lesiones por parte del cuerpo
   */
  async getByBodyPart(userId, parteCuerpo) {
    const { data, error } = await supabase
      .from('lesionestemporales')
      .select('*')
      .eq('usuario_id', userId)
      .eq('parte_cuerpo', parteCuerpo)
      .order('fecha_lesion', { ascending: false });
    
    return { data, error };
  }
};
