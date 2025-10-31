import { supabase } from '../config/supabase.js';

export const FoodModel = {
  /**
   * Obtener todos los alimentos base
   */
  async getAll() {
    const { data, error } = await supabase
      .from('alimentosbase')
      .select('*')
      .order('nombre');
    
    return { data, error };
  },

  /**
   * Obtener alimentos por categoría
   */
  async getByCategory(categoria) {
    const { data, error } = await supabase
      .from('alimentosbase')
      .select('*')
      .eq('categoria', categoria)
      .order('nombre');
    
    return { data, error };
  },

  /**
   * Buscar alimentos por nombre
   */
  async searchByName(searchTerm) {
    const { data, error } = await supabase
      .from('alimentosbase')
      .select('*')
      .ilike('nombre', `%${searchTerm}%`)
      .order('nombre');
    
    return { data, error };
  },

  /**
   * Crear nuevo alimento
   */
  async create(foodData) {
    const { data, error } = await supabase
      .from('alimentosbase')
      .insert([foodData])
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Actualizar alimento
   */
  async update(id, foodData) {
    const { data, error } = await supabase
      .from('alimentosbase')
      .update(foodData)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Eliminar alimento
   */
  async delete(id) {
    const { data, error } = await supabase
      .from('alimentosbase')
      .delete()
      .eq('id', id);
    
    return { data, error };
  }
};

export const NutritionLogModel = {
  /**
   * Obtener registros nutricionales de un usuario por fecha
   */
  async getUserLogsByDate(userId, fecha) {
    const { data, error } = await supabase
      .from('nutriciontemporal')
      .select('*')
      .eq('usuario_id', userId)
      .eq('fecha', fecha)
      .order('created_at');
    
    return { data, error };
  },

  /**
   * Obtener registros nutricionales de un rango de fechas
   */
  async getUserLogsByDateRange(userId, fechaInicio, fechaFin) {
    const { data, error } = await supabase
      .from('nutriciontemporal')
      .select('*')
      .eq('usuario_id', userId)
      .gte('fecha', fechaInicio)
      .lte('fecha', fechaFin)
      .order('fecha', { ascending: false });
    
    return { data, error };
  },

  /**
   * Crear registro nutricional
   */
  async create(nutritionData) {
    const { data, error } = await supabase
      .from('nutriciontemporal')
      .insert([nutritionData])
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Actualizar registro nutricional
   */
  async update(id, nutritionData) {
    const { data, error } = await supabase
      .from('nutriciontemporal')
      .update(nutritionData)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Eliminar registro nutricional
   */
  async delete(id) {
    const { data, error } = await supabase
      .from('nutriciontemporal')
      .delete()
      .eq('id', id);
    
    return { data, error };
  },

  /**
   * Obtener resumen nutricional del día
   */
  async getDailySummary(userId, fecha) {
    const { data, error } = await supabase
      .from('nutriciontemporal')
      .select('calorias, proteinas, carbohidratos, grasas')
      .eq('usuario_id', userId)
      .eq('fecha', fecha);
    
    if (error) return { data: null, error };

    // Calcular totales
    const summary = data.reduce((acc, curr) => ({
      calorias: acc.calorias + (parseFloat(curr.calorias) || 0),
      proteinas: acc.proteinas + (parseFloat(curr.proteinas) || 0),
      carbohidratos: acc.carbohidratos + (parseFloat(curr.carbohidratos) || 0),
      grasas: acc.grasas + (parseFloat(curr.grasas) || 0)
    }), { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });

    return { data: summary, error: null };
  }
};

export const NutritionGoalsModel = {
  /**
   * Obtener objetivos nutricionales del usuario
   */
  async getUserGoals(userId) {
    const { data, error } = await supabase
      .from('objetivosnutricionales')
      .select('*')
      .eq('usuario_id', userId)
      .single();
    
    return { data, error };
  },

  /**
   * Crear objetivos nutricionales
   */
  async create(goalsData) {
    const { data, error } = await supabase
      .from('objetivosnutricionales')
      .insert([goalsData])
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Actualizar objetivos nutricionales
   */
  async update(userId, goalsData) {
    const updatedData = {
      ...goalsData,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('objetivosnutricionales')
      .update(updatedData)
      .eq('usuario_id', userId)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Eliminar objetivos nutricionales
   */
  async delete(userId) {
    const { data, error } = await supabase
      .from('objetivosnutricionales')
      .delete()
      .eq('usuario_id', userId);
    
    return { data, error };
  }
};
