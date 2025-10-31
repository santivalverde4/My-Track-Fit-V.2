import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdLock, MdCheckCircle, MdError, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import '../../styles/Auth.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    password2: ''
  });
  const [isValidToken, setIsValidToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Verificar si el token es válido
    const checkToken = async () => {
      try {
        console.log(' Verificando token:', token);
        const response = await fetch(`${API_BASE_URL}/api/auth/check-reset-token/${token}`);
        const data = await response.json();
        console.log(' Token válido:', data.valid);
        setIsValidToken(data.valid);
      } catch (error) {
        console.error(' Error verificando token:', error);
        setIsValidToken(false);
      }
    };

    checkToken();
  }, [token]);

  const validatePassword = (password) => {
    // Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.password) {
      setError('La contraseña es requerida');
      return;
    }

    if (formData.password !== formData.password2) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('La contraseña no cumple con los requisitos mínimos');
      return;
    }

    setIsLoading(true);

    try {
      console.log(' Restableciendo contraseña con token:', token);
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: formData.password })
      });

      const data = await response.json();
      console.log(' Response:', data);

      if (data.success) {
        setSuccess(true);
        console.log(' Contraseña restablecida, redirigiendo...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError((data.error || 'Error al cambiar la contraseña'));
      }
    } catch (error) {
      console.error(' Error:', error);
      setError('Error de conexión con el servidor. Verifica que el backend esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Token inválido o expirado
  if (isValidToken === false) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '5rem', marginBottom: '24px', color: '#dc2626' }}>
            <MdError size={80} />
          </div>
          <h2 style={{ color: '#dc2626', marginBottom: '16px', fontSize: '1.8rem', fontWeight: 700 }}>
            Enlace Inválido o Expirado
          </h2>
          <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '1rem', marginBottom: '32px' }}>
            El enlace de recuperación no es válido o ya fue utilizado. Por favor, solicita un nuevo enlace.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="auth-button primary"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // Contraseña cambiada exitosamente
  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ 
            fontSize: '5rem', 
            marginBottom: '24px',
            color: '#10b981',
            animation: 'checkmark 0.6s ease-in-out'
          }}>
            <MdCheckCircle size={80} />
          </div>
          <h2 style={{ color: '#10b981', marginBottom: '16px', fontSize: '1.8rem', fontWeight: 700 }}>
            ¡Contraseña Actualizada!
          </h2>
          <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '1rem', marginBottom: '32px' }}>
            Tu contraseña ha sido cambiada exitosamente.<br />Ya puedes iniciar sesión con tu nueva contraseña.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="auth-button primary"
          >
            Ir a Iniciar Sesión
          </button>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '16px' }}>
            Redirigiendo en 3 segundos...
          </p>
        </div>
      </div>
    );
  }

  // Cargando...
  if (isValidToken === null) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '20px', color: '#64748b' }}>Verificando enlace...</p>
        </div>
      </div>
    );
  }

  // Formulario de cambio de contraseña
  return (
    <div className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-logo">
            <MdLock size={48} />
          </div>
          <h1 className="auth-title">Nueva Contraseña</h1>
          <p className="auth-subtitle">Crea una contraseña segura para tu cuenta</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Campo Nueva Contraseña */}
          <div className="form-group">
            <label 
              htmlFor="password" 
              className="form-label"
            >
              Nueva Contraseña *
            </label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${error && !formData.password ? 'error' : ''}`}
                placeholder="Crea una contraseña segura"
                aria-required="true"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby="password-help"
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
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="form-group">
            <label 
              htmlFor="password2" 
              className="form-label"
            >
              Confirmar Contraseña *
            </label>
            <div className="password-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="password2"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                className={`form-input ${error && formData.password !== formData.password2 ? 'error' : ''}`}
                placeholder="Repite tu contraseña"
                aria-required="true"
                aria-invalid={error ? 'true' : 'false'}
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
          </div>

          {/* Mensaje de error */}
          {error && (
            <div 
              className="error-message global-error" 
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          {/* Botón de envío */}
          <button 
            type="submit" 
            className="auth-button primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loading-spinner">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                <span>Cambiando contraseña...</span>
              </>
            ) : (
              'Cambiar Contraseña'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
