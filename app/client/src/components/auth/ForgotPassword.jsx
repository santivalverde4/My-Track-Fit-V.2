import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdLock, MdCheckCircle, MdError } from 'react-icons/md';
import '../../styles/Auth.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Por favor ingresa un email válido' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log(' Enviando solicitud de recuperación para:', email);
      console.log(' API URL:', `${API_BASE_URL}/api/auth/request-password-reset`);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      console.log(' Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(' Response data:', data);

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: data.message + ' Revisa tu correo electrónico.' 
        });
        setEmail('');
      } else {
        setMessage({ 
          type: 'error', 
          text: (data.error || 'Error al enviar el correo') 
        });
      }
    } catch (error) {
      console.error('Error completo:', error);
      setMessage({ 
        type: 'error', 
        text: `✗ Error de conexión con el servidor. Verifica que el backend esté corriendo en http://localhost:5000` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <MdLock size={48} />
          </div>
          <h1 className="auth-title">Recuperar Contraseña</h1>
          <p className="auth-subtitle">Ingresa tu correo electrónico</p>
        </div>

        <p className="subtitle" style={{ textAlign: 'center', color: '#64748b', marginBottom: '30px', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Te enviaremos un enlace a tu correo electrónico para que puedas restablecer tu contraseña de forma segura.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate aria-label="Formulario de recuperación de contraseña">
          {/* Campo Correo Electrónico */}
          <div className="form-group">
            <label 
              htmlFor="email" 
              className="form-label"
            >
              Correo Electrónico *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="tu@email.com"
              aria-required="true"
              aria-describedby="email-help"
              autoComplete="email"
              autoFocus
            />
            <div id="email-help" className="form-help">
              Ingresa el correo electrónico asociado a tu cuenta.
            </div>
          </div>

          {message.text && (
            <div 
              className={`auth-message ${message.type}`}
              role="alert"
              aria-live="polite"
            >
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-button primary"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Enviando...
              </>
            ) : (
              'Enviar Enlace de Recuperación'
            )}
          </button>

          <div className="auth-footer">
            <Link to="/login" className="auth-link">
              ← Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
