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

export default api;