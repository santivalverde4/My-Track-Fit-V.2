import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import '../../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setRememberMe(checked);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Limpiar error del campo cuando el usuario empiece a escribir
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    // Validación del nombre de usuario
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    // Validación de la contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    return newErrors;
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      // Enfocar el primer campo con error para accesibilidad
      const firstErrorField = Object.keys(formErrors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    setIsLoading(true);
    setErrors({}); // Limpiar errores previos
    
    try {
      // Preparar datos para el backend
      const loginData = {
        username: formData.username.trim(),
        password: formData.password,
        rememberMe: rememberMe
      };

      // Llamar al servicio de login
      const response = await authService.login(loginData);
      
      // Login exitoso
      console.log('Usuario autenticado:', response);
      
      // Mostrar mensaje de éxito
      alert('¡Inicio de sesión exitoso!');
      
      // Redirigir al dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error en el login:', error);
      
      // Manejar diferentes tipos de errores
      if (error.code === 'NETWORK_ERROR') {
        setErrors({ 
          submit: 'Error de conexión. Verifica que el servidor esté funcionando.' 
        });
      } else if (error.status === 401) {
        setErrors({ 
          submit: 'Usuario o contraseña incorrectos. Verifica tus credenciales.' 
        });
      } else if (error.message) {
        setErrors({ submit: error.message });
      } else if (error.errors) {
        // Errores de validación del backend
        setErrors(error.errors);
      } else {
        setErrors({ 
          submit: 'Error al iniciar sesión. Inténtalo de nuevo.' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header accesible */}
        <header className="auth-header">
          <h1 className="auth-title">Iniciar Sesión</h1>
          <p className="auth-subtitle">
            Bienvenido de vuelta a My Track-Fit
          </p>
        </header>

        {/* Formulario accesible */}
        <form 
          onSubmit={handleSubmit} 
          className="auth-form"
          noValidate
          aria-label="Formulario de inicio de sesión"
        >
          {/* Error general */}
          {errors.submit && (
            <div 
              className="error-message global-error" 
              role="alert"
              aria-live="polite"
            >
              {errors.submit}
            </div>
          )}

          {/* Campo Nombre de Usuario */}
          <div className="form-group">
            <label 
              htmlFor="username" 
              className="form-label"
            >
              Nombre de Usuario *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="Ingresa tu nombre de usuario"
              aria-required="true"
              aria-invalid={errors.username ? 'true' : 'false'}
              aria-describedby={errors.username ? 'username-error' : 'username-help'}
              autoComplete="username"
              autoFocus
            />
            <div id="username-help" className="form-help">
              El mismo nombre de usuario que usaste para registrarte.
            </div>
            {errors.username && (
              <div 
                id="username-error" 
                className="error-message" 
                role="alert"
                aria-live="polite"
              >
                {errors.username}
              </div>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="form-group">
            <label 
              htmlFor="password" 
              className="form-label"
            >
              Contraseña *
            </label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Ingresa tu contraseña"
                aria-required="true"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                tabIndex="0"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <div 
                id="password-error" 
                className="error-message" 
                role="alert"
                aria-live="polite"
              >
                {errors.password}
              </div>
            )}
          </div>

          {/* Opciones adicionales */}
          <div className="form-options">
            {/* Recordar sesión */}
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={rememberMe}
                onChange={handleChange}
                className="form-checkbox"
              />
              <label 
                htmlFor="rememberMe" 
                className="checkbox-label"
              >
                Recordar sesión
              </label>
            </div>

            {/* Olvidé mi contraseña */}
            <a 
              href="http://localhost:5000/forgot-password" 
              className="forgot-password-link"
              aria-label="Recuperar contraseña olvidada"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            className="auth-button primary"
            disabled={isLoading}
            aria-describedby="submit-help"
          >
            {isLoading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loading-spinner">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          <div id="submit-help" className="form-help">
            Asegúrate de que tu información sea correcta antes de continuar.
          </div>
        </form>

        {/* Footer con link a registro */}
        <footer className="auth-footer">
          <p>
            ¿No tienes cuenta?{' '}
            <Link 
              to="/signup" 
              className="auth-link"
              aria-label="Ir a la página de registro"
            >
              Crear Cuenta
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;