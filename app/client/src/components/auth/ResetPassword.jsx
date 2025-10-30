import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';

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

  useEffect(() => {
    // Verificar si el token es válido
    const checkToken = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/check-reset-token/${token}`);
        const data = await response.json();
        setIsValidToken(data.valid);
      } catch (error) {
        setIsValidToken(false);
      }
    };

    checkToken();
  }, [token]);

  const validatePassword = (password) => {
    // Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;
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
      setError('❌ La contraseña es requerida');
      return;
    }

    if (formData.password !== formData.password2) {
      setError('❌ Las contraseñas no coinciden');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('❌ La contraseña no cumple con los requisitos mínimos');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: formData.password })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError('❌ ' + (data.error || 'Error al cambiar la contraseña'));
      }
    } catch (error) {
      setError('❌ Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Token inválido o expirado
  if (isValidToken === false) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '5rem', marginBottom: '24px' }}>❌</div>
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
            animation: 'checkmark 0.6s ease-in-out'
          }}>
            ✅
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
        <div className="auth-header">
          <div className="auth-logo">🔒</div>
          <h1 className="auth-title">Nueva Contraseña</h1>
          <p className="auth-subtitle">Crea una contraseña segura</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="auth-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password2" className="form-label">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="password2"
              name="password2"
              className="auth-input"
              placeholder="••••••••"
              value={formData.password2}
              onChange={handleChange}
              required
            />
          </div>

          <div className="password-requirements">
            <strong>La contraseña debe contener:</strong>
            <ul>
              <li>Mínimo 8 caracteres</li>
              <li>Una letra mayúscula</li>
              <li>Una letra minúscula</li>
              <li>Un número</li>
              <li>Un carácter especial (@$!%*?&._-)</li>
            </ul>
          </div>

          {error && (
            <div className="auth-message error" style={{ animation: 'shake 0.3s' }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-button primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Cambiando...
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
