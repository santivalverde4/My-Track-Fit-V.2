import { supabase } from '../config/supabase.js';

export const MetricsModel = {
  /**
   * Obtener métricas diarias de un usuario por fecha
   */
  async getUserMetricsByDate(userId, fecha) {
    const { data, error } = await supabase
      .from('MetricasDiarias')
      .select('*')
      .eq('usuario_id', userId)
      .eq('fecha', fecha)
      .single();
    
    return { data, error };
  },

  /**
   * Obtener métricas de un rango de fechas
   */
  async getUserMetricsByDateRange(userId, fechaInicio, fechaFin) {
    const { data, error } = await supabase
      .from('MetricasDiarias')
      .select('*')
      .eq('usuario_id', userId)
      .gte('fecha', fechaInicio)
      .lte('fecha', fechaFin)
      .order('fecha', { ascending: false });
    
    return { data, error };
  },

  /**
   * Crear métricas diarias
   */
  async create(metricsData) {
    const { data, error } = await supabase
      .from('MetricasDiarias')
      .insert([metricsData])
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Actualizar métricas diarias
   */
  async update(id, metricsData) {
    const { data, error } = await supabase
      .from('MetricasDiarias')
      .update(metricsData)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Actualizar o crear métricas diarias (upsert)
   */
  async upsertByDate(userId, fecha, metricsData) {
    const { data, error } = await supabase
      .from('MetricasDiarias')
      .upsert({
        usuario_id: userId,
        fecha,
        ...metricsData
      }, {
        onConflict: 'usuario_id,fecha'
      })
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Eliminar métricas diarias
   */
  async delete(id) {
    const { data, error } = await supabase
      .from('MetricasDiarias')
      .delete()
      .eq('id', id);
    
    return { data, error };
  },

  /**
   * Obtener últimas N métricas del usuario
   */
  async getLastNMetrics(userId, limit = 30) {
    const { data, error } = await supabase
      .from('MetricasDiarias')
      .select('*')
      .eq('usuario_id', userId)
      .order('fecha', { ascending: false })
      .limit(limit);
    
    return { data, error };
  }
};

export const UserFilesModel = {
  /**
   * Obtener archivos de usuario
   */
  async getUserFiles(userId) {
    const { data, error } = await supabase
      .from('ArchivosUsuario')
      .select('*')
      .eq('idcliente', userId)
      .single();
    
    return { data, error };
  },

  /**
   * Crear archivos de usuario
   */
  async create(userId) {
    const { data, error } = await supabase
      .from('ArchivosUsuario')
      .insert([{
        idcliente: userId,
        ArchivoBody: {},
        ArchivoRutina: {},
        ArchivoEjercicio: {},
        archivonutricion: {},
        archivolesiones: {},
        archivoestadisticas: {},
        archivoia: {}
      }])
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Actualizar archivo específico
   */
  async updateFile(userId, fileType, fileData) {
    const updateData = {};
    updateData[fileType] = fileData;

    const { data, error } = await supabase
      .from('ArchivosUsuario')
      .update(updateData)
      .eq('idcliente', userId)
      .select()
      .single();
    
    return { data, error };
  },

  /**
   * Eliminar archivos de usuario
   */
  async delete(userId) {
    const { data, error } = await supabase
      .from('ArchivosUsuario')
      .delete()
      .eq('idcliente', userId);
    
    return { data, error };
  }
};
