import axios from 'axios';

/**
 * API SERVICE - MyTrackFit v2.0
 * 
 * Servicios disponibles:
 * 
 * 1. authService - Autenticación y sesión
 *    - register, login, logout, isAuthenticated, getToken, verifyToken
 * 
 * 2. userService - Gestión de perfil
 *    - getProfile, updateProfile, updateUsername, updatePassword, deleteAccount
 * 
 * 3. routineService - Rutinas de entrenamiento
 *    - getRoutines, createRoutine, getRoutine, updateRoutine, deleteRoutine
 *    - addExercise, updateExercise, deleteExercise, markAsUsed
 * 
 * 4. workoutService - Entrenamientos
 *    - getWorkoutsByRoutine, createWorkout, deleteWorkout
 * 
 * 5. exerciseService - Ejercicios
 *    - getExercisesByWorkout, createExercise, deleteExercise
 * 
 * 6. injuryService - Gestión de lesiones
 *    - getInjuries, createInjury, updateInjury, updateInjuryStatus, deleteInjury, getInjury
 * 
 * 7. nutritionService - Nutrición y alimentación
 *    - getTodayMeals, getMealsByDate, addMeal, updateMeal, deleteMeal
 *    - getNutritionGoals, updateNutritionGoals, updateWaterIntake
 *    - getDailySummary, searchFoods
 * 
 * 8. statisticsService - Estadísticas y análisis
 *    - getStatistics, getWeightProgress, getWeeklyActivity
 *    - getTopExercises, getExerciseDistribution
 *    - getWeeklyMacros, getWeeklyCalories, getWellnessMetrics
 *    - getOverviewSummary
 * 
 * 9. dailyMetricsService - Métricas diarias
 *    - getTodayMetrics, getMetricsByDate, updateDailyMetrics
 *    - updateWeight, updateEnergyLevel, updateStressLevel
 *    - updateSleepHours, updateWaterGlasses
 * 
 * 10. apiService - Utilidades generales
 *     - ping
 */

// Configuración base de axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Manejo de errores globales
    if (error.response) {
      // Error del servidor
      const { status, data } = error.response;
      
      console.log('Error Response Status:', status);
      console.log(' Error Response Data:', data);
      
      switch (status) {
        case 401:
          // Token expirado o inválido
          break;
        case 403:
          console.error('Acceso denegado');
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 500:
          console.error('Error interno del servidor');
          break;
        default:
          console.error('Error:', data.message || 'Error desconocido');
      }
      
      return Promise.reject(data || error.response);
    } else if (error.request) {
      // Error de red
      console.error('Error de red:', error.message);
      return Promise.reject({
        message: 'Error de conexión. Verifica tu conexión a internet.',
        code: 'NETWORK_ERROR'
      });
    } else {
      // Error de configuración
      console.error('Error de configuración:', error.message);
      return Promise.reject(error);
    }
  }
);

// Servicios de autenticación
export const authService = {
  // Registro de usuario
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      
      // Si el registro es exitoso y devuelve un token
      const token = response.token || response.data?.token;
      
      if (token) {
        localStorage.setItem('authToken', token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Inicio de sesión
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      
      console.log(' Respuesta completa del login:', response);
      
      // Guardar token (puede estar en response.token o response.data.token)
      const token = response.token || response.data?.token;
      
      if (token) {
        localStorage.setItem('authToken', token);
        console.log(' Token guardado en localStorage');
      } else {
        console.error(' No se encontró token en la respuesta:', response);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Obtener token actual
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Verificar token con el servidor
  verifyToken: async () => {
    try {
      const response = await api.get('/api/auth/verify');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Servicios de usuario
export const userService = {
  // Obtener perfil del usuario
  getProfile: async () => {
    try {
      const response = await api.get('/api/auth/profile');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar perfil
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/auth/profile', profileData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar nombre de usuario
  updateUsername: async (usernameData) => {
    try {
      const response = await api.put('/api/auth/profile', usernameData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cambiar contraseña
  updatePassword: async (passwordData) => {
    try {
      const response = await api.put('/api/auth/profile', passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar cuenta
  deleteAccount: async (confirmationData) => {
    try {
      const response = await api.delete('/api/auth/profile', {
        data: confirmationData
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Servicios generales
export const apiService = {
  // Test de conectividad
  ping: async () => {
    try {
      const response = await api.get('/api/ping');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Servicios de rutinas
export const routineService = {
  // Obtener todas las rutinas
  getRoutines: async () => {
    try {
      const response = await api.get('/api/routines');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Crear nueva rutina
  createRoutine: async (routineData) => {
    try {
      const response = await api.post('/api/routines', routineData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener rutina específica
  getRoutine: async (routineId) => {
    try {
      const response = await api.get(`/api/routines/${routineId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar rutina
  updateRoutine: async (routineId, routineData) => {
    try {
      const response = await api.put(`/api/routines/${routineId}`, routineData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar rutina
  deleteRoutine: async (routineId) => {
    try {
      const response = await api.delete(`/api/routines/${routineId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Agregar ejercicio a rutina
  addExercise: async (routineId, exerciseData) => {
    try {
      const response = await api.post(`/api/routines/${routineId}/exercises`, exerciseData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar ejercicio
  updateExercise: async (routineId, exerciseId, exerciseData) => {
    try {
      const response = await api.put(`/api/routines/${routineId}/exercises/${exerciseId}`, exerciseData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar ejercicio
  deleteExercise: async (routineId, exerciseId) => {
    try {
      const response = await api.delete(`/api/routines/${routineId}/exercises/${exerciseId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Marcar rutina como usada
  markAsUsed: async (routineId) => {
    try {
      const response = await api.post(`/api/routines/${routineId}/use`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Servicios de lesiones
export const injuryService = {
  // Obtener todas las lesiones del usuario
  getInjuries: async () => {
    try {
      const response = await api.get('/api/injuries');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Crear nueva lesión
  createInjury: async (injuryData) => {
    try {
      const response = await api.post('/api/injuries', injuryData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar lesión
  updateInjury: async (injuryId, injuryData) => {
    try {
      const response = await api.put(`/api/injuries/${injuryId}`, injuryData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar estado de lesión
  updateInjuryStatus: async (injuryId, status) => {
    try {
      const response = await api.patch(`/api/injuries/${injuryId}/status`, { status });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar lesión
  deleteInjury: async (injuryId) => {
    try {
      const response = await api.delete(`/api/injuries/${injuryId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener lesión específica
  getInjury: async (injuryId) => {
    try {
      const response = await api.get(`/api/injuries/${injuryId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Servicios de nutrición
export const nutritionService = {
  // Obtener comidas del día actual
  getTodayMeals: async () => {
    try {
      const response = await api.get('/api/nutrition/today');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener comidas por fecha (método anterior - deprecated)
  getMealsByDate: async (date) => {
    try {
      const response = await api.get(`/api/nutrition/date/${date}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener logs de nutrición por fecha (usa query parameter)
  getNutritionLogsByDate: async (date) => {
    try {
      const response = await api.get(`/api/nutrition/logs?fecha=${date}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Agregar comida
  addMeal: async (mealData) => {
    try {
      const response = await api.post('/api/nutrition/logs', mealData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar comida
  updateMeal: async (mealId, mealData) => {
    try {
      const response = await api.put(`/api/nutrition/logs/${mealId}`, mealData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar comida
  deleteMeal: async (mealId) => {
    try {
      const response = await api.delete(`/api/nutrition/logs/${mealId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener objetivos nutricionales del usuario
  getNutritionGoals: async () => {
    try {
      const response = await api.get('/api/nutrition/goals');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar objetivos nutricionales
  updateNutritionGoals: async (goalsData) => {
    try {
      const response = await api.put('/api/nutrition/goals', goalsData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Registrar vasos de agua
  updateWaterIntake: async (glasses) => {
    try {
      const response = await api.post('/api/nutrition/water', { glasses });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener resumen nutricional diario
  getDailySummary: async (date) => {
    try {
      const response = await api.get(`/api/nutrition/summary/${date}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Buscar alimentos
  searchFoods: async (query) => {
    try {
      const response = await api.get(`/api/nutrition/foods/search?q=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Servicios de estadísticas
export const statisticsService = {
  // Obtener todas las estadísticas del usuario
  getStatistics: async (timeRange = '7days') => {
    try {
      const response = await api.get(`/api/statistics?timeRange=${timeRange}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener progreso de peso
  getWeightProgress: async (timeRange = '7days') => {
    try {
      const response = await api.get(`/api/statistics/weight?timeRange=${timeRange}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener actividad semanal
  getWeeklyActivity: async () => {
    try {
      const response = await api.get('/api/statistics/weekly-activity');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener top ejercicios por volumen
  getTopExercises: async (limit = 5) => {
    try {
      const response = await api.get(`/api/statistics/exercises/top?limit=${limit}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener distribución de ejercicios por categoría
  getExerciseDistribution: async () => {
    try {
      const response = await api.get('/api/statistics/exercises/distribution');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener macros semanales
  getWeeklyMacros: async () => {
    try {
      const response = await api.get('/api/statistics/nutrition/macros/weekly');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener calorías semanales
  getWeeklyCalories: async () => {
    try {
      const response = await api.get('/api/statistics/nutrition/calories/weekly');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener métricas de bienestar
  getWellnessMetrics: async (timeRange = '7days') => {
    try {
      const response = await api.get(`/api/statistics/wellness?timeRange=${timeRange}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener resumen general (cards)
  getOverviewSummary: async () => {
    try {
      const response = await api.get('/api/statistics/overview');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Servicios de métricas diarias
export const dailyMetricsService = {
  // Obtener métricas del día actual
  getTodayMetrics: async () => {
    try {
      const response = await api.get('/api/metrics/today');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener métricas por fecha
  getMetricsByDate: async (date) => {
    try {
      const response = await api.get(`/api/metrics/date/${date}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Registrar/actualizar métricas diarias
  updateDailyMetrics: async (metricsData) => {
    try {
      const response = await api.post('/api/metrics/daily', metricsData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar peso
  updateWeight: async (weight, date = null) => {
    try {
      const response = await api.post('/api/metrics/weight', { weight, date });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar nivel de energía
  updateEnergyLevel: async (energyLevel, date = null) => {
    try {
      const response = await api.post('/api/metrics/energy', { energyLevel, date });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar nivel de estrés
  updateStressLevel: async (stressLevel, date = null) => {
    try {
      const response = await api.post('/api/metrics/stress', { stressLevel, date });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar horas de sueño
  updateSleepHours: async (hours, date = null) => {
    try {
      const response = await api.post('/api/metrics/sleep', { hours, date });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar vasos de agua
  updateWaterGlasses: async (glasses, date = null) => {
    try {
      const response = await api.post('/api/metrics/water', { glasses, date });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Servicios de entrenamientos
export const workoutService = {
  // Obtener entrenamientos de una rutina específica
  getWorkoutsByRoutine: async (routineId) => {
    try {
      const response = await api.get(`/api/routines/${routineId}/workouts`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Crear nuevo entrenamiento
  createWorkout: async (routineId, workoutData) => {
    try {
      const response = await api.post(`/api/routines/${routineId}/workouts`, workoutData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar entrenamiento
  updateWorkout: async (workoutId, workoutData) => {
    try {
      const response = await api.put(`/api/routines/workouts/${workoutId}`, workoutData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar entrenamiento
  deleteWorkout: async (routineId, workoutId) => {
    try {
      const response = await api.delete(`/api/routines/workouts/${workoutId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Servicios de ejercicios
export const exerciseService = {
  // Obtener todos los ejercicios de la biblioteca
  getAllExercises: async () => {
    try {
      const response = await api.get('/api/exercises');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Crear ejercicio en la biblioteca
  createExerciseInLibrary: async (exerciseData) => {
    try {
      const response = await api.post('/api/exercises', exerciseData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Buscar ejercicios
  searchExercises: async (query) => {
    try {
      const response = await api.get(`/api/exercises/search?q=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener ejercicios de un entrenamiento específico
  getExercisesByWorkout: async (routineId, workoutId) => {
    try {
      const response = await api.get(`/api/routines/workouts/${workoutId}/exercises`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Crear nuevo ejercicio
  createExercise: async (routineId, workoutId, exerciseData) => {
    try {
      const response = await api.post(`/api/routines/workouts/${workoutId}/exercises`, exerciseData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar ejercicio
  deleteExercise: async (routineId, workoutId, exerciseId) => {
    try {
      const response = await api.delete(`/api/routines/exercises/${exerciseId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar ejercicio (instance)
  updateExercise: async (exerciseId, exerciseData) => {
    try {
      console.log('API Service - Actualizando ejercicio:', exerciseId, exerciseData);
      const response = await api.put(`/api/routines/exercises/${exerciseId}`, exerciseData);
      console.log('API Service - Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('API Service - Error en updateExercise:', error);
      throw error;
    }
  }
};

// Servicios de SmartTrainer (IA)
export const smarttrainerService = {
  chat: async (message, conversationHistory = []) => {
    try {
      const response = await api.post('/api/smarttrainer/chat', {
        message,
        conversationHistory
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  generateWorkout: async (userProfile) => {
    try {
      const response = await api.post('/api/smarttrainer/generate-workout', userProfile);
      return response;
    } catch (error) {
      throw error;
    }
  },

  generateNutrition: async (userProfile) => {
    try {
      const response = await api.post('/api/smarttrainer/generate-nutrition', userProfile);
      return response;
    } catch (error) {
      throw error;
    }
  },

  analyzeExercise: async (exerciseName) => {
    try {
      const response = await api.post('/api/smarttrainer/analyze-exercise', { exerciseName });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getInjuryAdvice: async (injuryType, description) => {
    try {
      const response = await api.post('/api/smarttrainer/injury-advice', {
        injuryType,
        description
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default api;
