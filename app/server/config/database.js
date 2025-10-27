import { supabase } from './supabase.js';

/**
 * Función helper para manejar errores de Supabase
 */
export const handleSupabaseError = (error, customMessage = 'Database error') => {
  console.error(`${customMessage}:`, error);
  return {
    success: false,
    error: error.message || customMessage
  };
};

/**
 * Función helper para manejar respuestas exitosas de Supabase
 */
export const handleSupabaseSuccess = (data, message = 'Operation successful') => {
  return {
    success: true,
    data,
    message
  };
};

export { supabase };
