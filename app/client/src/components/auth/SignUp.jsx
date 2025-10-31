import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import '../../styles/Auth.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
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
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    // Validación del nombre de usuario
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 5) {
      newErrors.username = 'El nombre de usuario debe tener al menos 5 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Solo se permiten letras, números y guiones bajos';
    }

    // Validación del email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido. Debe tener formato correo@ejemplo.com';
    }

    // Validación de la contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Debe contener al menos una letra minúscula';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Debe contener al menos una letra mayúscula';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Debe contener al menos un número';
    } else if (!/(?=.*[@$!%*?&#])/.test(formData.password)) {
      newErrors.password = 'Debe contener al menos un carácter especial (@$!%*?&#)';
    }

    // Validación de confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
      const registrationData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      };

      // Llamar al servicio de registro
      const response = await authService.register(registrationData);
      
      // Registro exitoso
      console.log('Registro iniciado:', response);
      
      // Mostrar mensaje de éxito
      alert('¡Revisa tu correo electrónico! Te hemos enviado un link para confirmar tu cuenta.');
      
      // Redirigir al login
      navigate('/login');
      
    } catch (error) {
      console.error('Error en el registro:', error);
      
      // Manejar diferentes tipos de errores con mensajes específicos
      if (error.code === 'NETWORK_ERROR') {
        setErrors({ 
          submit: 'Error de conexión. Verifica que el servidor esté funcionando.' 
        });
      } else if (error.error) {
        // Error específico del backend (ej: "El usuario ya existe", "El email ya está registrado")
        setErrors({ submit: error.error });
      } else if (error.message) {
        // Error con mensaje general
        setErrors({ submit: error.message });
      } else if (error.errors) {
        // Errores de validación múltiples del backend
        setErrors(error.errors);
      } else {
        setErrors({ 
          submit: 'Error al crear la cuenta. Inténtalo de nuevo.' 
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
          <h1 className="auth-title">Crear Cuenta</h1>
          <p className="auth-subtitle">
            Únete a My Track-Fit y comienza tu viaje fitness
          </p>
        </header>

        {/* Formulario accesible */}
        <form 
          onSubmit={handleSubmit} 
          className="auth-form"
          noValidate
          aria-label="Formulario de registro"
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
              placeholder="Ej: juan_perez"
              aria-required="true"
              aria-invalid={errors.username ? 'true' : 'false'}
              aria-describedby={errors.username ? 'username-error' : 'username-help'}
              autoComplete="username"
            />
            <div id="username-help" className="form-help">
              Mínimo 5 caracteres. Solo letras, números y guiones bajos.
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

          {/* Campo Email */}
          <div className="form-group">
            <label 
              htmlFor="email" 
              className="form-label"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="correo@ejemplo.com"
              aria-required="true"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : 'email-help'}
              autoComplete="email"
            />
            <div id="email-help" className="form-help">
              Recibirás un link de confirmación. Revisa tu bandeja de entrada.
            </div>
            {errors.email && (
              <div 
                id="email-error" 
                className="error-message" 
                role="alert"
                aria-live="polite"
              >
                {errors.email}
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
                placeholder="Crea una contraseña segura"
                aria-required="true"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : 'password-help'}
                autoComplete="new-password"
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
            <div id="password-help" className="form-help">
              Mínimo 8 caracteres con mayúscula, minúscula, número y carácter especial (@$!%*?&#).
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

          {/* Campo Confirmar Contraseña */}
          <div className="form-group">
            <label 
              htmlFor="confirmPassword" 
              className="form-label"
            >
              Confirmar Contraseña *
            </label>
            <div className="password-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Repite tu contraseña"
                aria-required="true"
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                tabIndex="0"
              >
                {showConfirmPassword ? (
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
            {errors.confirmPassword && (
              <div 
                id="confirm-password-error" 
                className="error-message" 
                role="alert"
                aria-live="polite"
              >
                {errors.confirmPassword}
              </div>
            )}
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
                <span>Creando cuenta...</span>
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>

          <div id="submit-help" className="form-help">
            Al crear una cuenta, aceptas nuestros términos y condiciones.
          </div>
        </form>

        {/* Footer con link a login */}
        <footer className="auth-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link 
              to="/login" 
              className="auth-link"
              aria-label="Ir a la página de inicio de sesión"
            >
              Inicia Sesión
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SignUp;