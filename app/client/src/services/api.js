import axios from 'axios';

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
      
      switch (status) {
        case 401:
          // Token expirado o inválido
          localStorage.removeItem('authToken');
          window.location.href = '/login';
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
      if (response.token) {
        localStorage.setItem('authToken', response.token);
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
      
      // Guardar token
      if (response.token) {
        localStorage.setItem('authToken', response.token);
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
      const response = await api.get('/api/user/profile');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar perfil
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/user/profile', profileData);
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
      // Mock data simple - solo nombres de rutinas
      const mockRoutines = {
        success: true,
        routines: [
          {
            id: 1,
            name: "Rutina 1"
          },
          {
            id: 2,
            name: "Rutina 2"
          }
        ]
      };

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockRoutines;
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

// Servicios de entrenamientos
export const workoutService = {
  // Obtener entrenamientos de una rutina específica
  getWorkoutsByRoutine: async (routineId) => {
    try {
      // Mock data - entrenamientos por rutina
      const mockWorkouts = {
        success: true,
        routineId: routineId,
        routineName: routineId === 1 ? "Rutina 1" : "Rutina 2",
        workouts: [
          {
            id: 1,
            name: "Entrenamiento 1"
          },
          {
            id: 2,
            name: "Entrenamiento 2"
          },
          {
            id: 3,
            name: "Entrenamiento 3"
          },
          {
            id: 4,
            name: "Entrenamiento 4"
          }
        ]
      };

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return mockWorkouts;
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

  // Eliminar entrenamiento
  deleteWorkout: async (routineId, workoutId) => {
    try {
      const response = await api.delete(`/api/routines/${routineId}/workouts/${workoutId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default api;