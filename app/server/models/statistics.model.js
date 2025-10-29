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
  },

  /**
   * Obtener entrenamientos del usuario por rango de fechas
   */
  async getUserWorkouts(userId, fechaInicio, fechaFin) {
    const { data, error } = await supabase
      .from('Entrenamientos')
      .select('id, fecha, duracion, notas')
      .eq('usuario_id', userId)
      .gte('fecha', fechaInicio)
      .lte('fecha', fechaFin)
      .order('fecha', { ascending: false });
    
    return { data, error };
  },

  /**
   * Obtener ejercicios más realizados
   */
  async getTopExercises(userId, limit = 5, days = 30) {
    try {
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - days);
      const fechaInicioStr = fechaInicio.toISOString().split('T')[0];

      // 1. Obtener entrenamientos del usuario en el rango de fechas
      const { data: entrenamientos, error: errorEnt } = await supabase
        .from('Entrenamientos')
        .select('id')
        .eq('usuario_id', userId)
        .gte('fecha', fechaInicioStr);

      if (errorEnt) return { data: null, error: errorEnt };
      if (!entrenamientos || entrenamientos.length === 0) {
        return { data: [], error: null };
      }

      const entrenamientoIds = entrenamientos.map(e => e.id);

      // 2. Obtener instancias de ejercicios con los datos del ejercicio
      const { data: instancias, error: errorInst } = await supabase
        .from('Instancias_Ejercicios')
        .select('ejercicio_id, entrenamiento_id, Ejercicios(nombre)')
        .in('entrenamiento_id', entrenamientoIds);

      if (errorInst) return { data: null, error: errorInst };
      if (!instancias || instancias.length === 0) {
        return { data: [], error: null };
      }

      // 3. Agrupar y contar en JavaScript
      const ejerciciosMap = new Map();
      
      instancias.forEach(inst => {
        const ejercicioNombre = inst.Ejercicios?.nombre;
        if (!ejercicioNombre) return;

        if (!ejerciciosMap.has(ejercicioNombre)) {
          ejerciciosMap.set(ejercicioNombre, {
            nombre: ejercicioNombre,
            entrenamientosSet: new Set(),
            total_series: 0
          });
        }

        const ejercicio = ejerciciosMap.get(ejercicioNombre);
        ejercicio.entrenamientosSet.add(inst.entrenamiento_id);
        ejercicio.total_series++;
      });

      // 4. Convertir a array y ordenar
      const resultado = Array.from(ejerciciosMap.values())
        .map(e => ({
          nombre: e.nombre,
          veces: e.entrenamientosSet.size,
          total_series: e.total_series
        }))
        .sort((a, b) => {
          if (b.veces !== a.veces) return b.veces - a.veces;
          return b.total_series - a.total_series;
        })
        .slice(0, limit);

      return { data: resultado, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Obtener distribución de ejercicios por grupo muscular
   */
  async getExerciseDistribution(userId, days = 30) {
    try {
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - days);
      const fechaInicioStr = fechaInicio.toISOString().split('T')[0];

      // 1. Obtener entrenamientos del usuario
      const { data: entrenamientos, error: errorEnt } = await supabase
        .from('Entrenamientos')
        .select('id')
        .eq('usuario_id', userId)
        .gte('fecha', fechaInicioStr);

      if (errorEnt) return { data: null, error: errorEnt };
      if (!entrenamientos || entrenamientos.length === 0) {
        return { data: [], error: null };
      }

      const entrenamientoIds = entrenamientos.map(e => e.id);

      // 2. Obtener instancias con grupo muscular
      const { data: instancias, error: errorInst } = await supabase
        .from('Instancias_Ejercicios')
        .select('Ejercicios(grupo_muscular)')
        .in('entrenamiento_id', entrenamientoIds);

      if (errorInst) return { data: null, error: errorInst };
      if (!instancias || instancias.length === 0) {
        return { data: [], error: null };
      }

      // 3. Agrupar por grupo muscular
      const gruposMap = new Map();
      
      instancias.forEach(inst => {
        const grupo = inst.Ejercicios?.grupo_muscular;
        if (!grupo) return;

        gruposMap.set(grupo, (gruposMap.get(grupo) || 0) + 1);
      });

      // 4. Convertir a array y ordenar
      const resultado = Array.from(gruposMap.entries())
        .map(([grupo, cantidad]) => ({ grupo, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad);

      return { data: resultado, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Obtener nutrición semanal (macronutrientes)
   */
  async getWeeklyNutrition(userId, days = 28) {
    try {
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - days);
      const fechaInicioStr = fechaInicio.toISOString().split('T')[0];

      // 1. Obtener nutrición temporal del usuario con alimentos
      const { data: nutricion, error } = await supabase
        .from('NutricionTemporal')
        .select('fecha, cantidad, AlimentosBee(proteinas, carbohidratos, grasas)')
        .eq('usuario_id', userId)
        .gte('fecha', fechaInicioStr)
        .order('fecha', { ascending: false });

      if (error) return { data: null, error };
      if (!nutricion || nutricion.length === 0) {
        return { data: [], error: null };
      }

      // 2. Agrupar por semana y sumar macros
      const semanasMap = new Map();
      
      nutricion.forEach(registro => {
        const fecha = new Date(registro.fecha);
        // Obtener el lunes de la semana
        const diaSemana = fecha.getDay();
        const diff = fecha.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1);
        const lunes = new Date(fecha.setDate(diff));
        const semanaKey = lunes.toISOString().split('T')[0];

        if (!semanasMap.has(semanaKey)) {
          semanasMap.set(semanaKey, {
            semana: semanaKey,
            proteinas: 0,
            carbohidratos: 0,
            grasas: 0
          });
        }

        const semana = semanasMap.get(semanaKey);
        const alimento = registro.AlimentosBee;
        if (alimento) {
          const factor = registro.cantidad / 100;
          semana.proteinas += (alimento.proteinas || 0) * factor;
          semana.carbohidratos += (alimento.carbohidratos || 0) * factor;
          semana.grasas += (alimento.grasas || 0) * factor;
        }
      });

      // 3. Convertir a array y redondear
      const resultado = Array.from(semanasMap.values())
        .map(s => ({
          semana: s.semana,
          proteinas: Math.round(s.proteinas * 10) / 10,
          carbohidratos: Math.round(s.carbohidratos * 10) / 10,
          grasas: Math.round(s.grasas * 10) / 10
        }))
        .sort((a, b) => b.semana.localeCompare(a.semana));

      return { data: resultado, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Obtener calorías semanales
   */
  async getWeeklyCalories(userId, days = 28) {
    try {
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - days);
      const fechaInicioStr = fechaInicio.toISOString().split('T')[0];

      // 1. Obtener calorías consumidas
      const { data: nutricion, error: errorNut } = await supabase
        .from('NutricionTemporal')
        .select('fecha, cantidad, AlimentosBee(calorias)')
        .eq('usuario_id', userId)
        .gte('fecha', fechaInicioStr);

      // 2. Obtener calorías quemadas
      const { data: metricas, error: errorMet } = await supabase
        .from('MetricasDiarias')
        .select('fecha, calorias_quemadas')
        .eq('usuario_id', userId)
        .gte('fecha', fechaInicioStr);

      if (errorNut && errorMet) {
        return { data: null, error: errorNut || errorMet };
      }

      // 3. Procesar calorías consumidas por semana
      const semanasMap = new Map();
      
      if (nutricion && nutricion.length > 0) {
        nutricion.forEach(registro => {
          const fecha = new Date(registro.fecha);
          const diaSemana = fecha.getDay();
          const diff = fecha.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1);
          const lunes = new Date(fecha.setDate(diff));
          const semanaKey = lunes.toISOString().split('T')[0];

          if (!semanasMap.has(semanaKey)) {
            semanasMap.set(semanaKey, {
              semana: semanaKey,
              consumidas: 0,
              quemadas: 0
            });
          }

          const semana = semanasMap.get(semanaKey);
          const alimento = registro.AlimentosBee;
          if (alimento && alimento.calorias) {
            semana.consumidas += (alimento.calorias * registro.cantidad / 100);
          }
        });
      }

      // 4. Procesar calorías quemadas por semana
      if (metricas && metricas.length > 0) {
        metricas.forEach(metrica => {
          const fecha = new Date(metrica.fecha);
          const diaSemana = fecha.getDay();
          const diff = fecha.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1);
          const lunes = new Date(fecha.setDate(diff));
          const semanaKey = lunes.toISOString().split('T')[0];

          if (!semanasMap.has(semanaKey)) {
            semanasMap.set(semanaKey, {
              semana: semanaKey,
              consumidas: 0,
              quemadas: 0
            });
          }

          const semana = semanasMap.get(semanaKey);
          semana.quemadas += (metrica.calorias_quemadas || 0);
        });
      }

      // 5. Convertir a array y redondear
      const resultado = Array.from(semanasMap.values())
        .map(s => ({
          semana: s.semana,
          consumidas: Math.round(s.consumidas),
          quemadas: Math.round(s.quemadas)
        }))
        .sort((a, b) => b.semana.localeCompare(a.semana));

      return { data: resultado, error: null };
    } catch (error) {
      return { data: null, error };
    }
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
