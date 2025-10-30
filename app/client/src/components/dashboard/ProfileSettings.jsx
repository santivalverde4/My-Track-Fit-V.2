import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdWarning } from 'react-icons/md';
import { userService, authService } from '../../services/api';
import '../../styles/ProfileSettings.css';

const ProfileSettings = () => {
  const navigate = useNavigate();
  
  // Estados para cambio de username
  const [usernameData, setUsernameData] = useState({
    currentUsername: '', // Se cargará del backend
    newUsername: ''
  });
  
  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Estados para borrar cuenta
  const [deleteData, setDeleteData] = useState({
    confirmPassword: '',
    confirmText: ''
  });
  
  // Estados de UI
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    delete: false
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Validaciones para cambio de username
  const validateUsername = () => {
    const newErrors = {};
    
    if (!usernameData.newUsername.trim()) {
      newErrors.newUsername = 'El nuevo nombre de usuario es requerido';
    } else if (usernameData.newUsername.length < 3) {
      newErrors.newUsername = 'Debe tener al menos 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(usernameData.newUsername)) {
      newErrors.newUsername = 'Solo letras, números y guiones bajos';
    } else if (usernameData.newUsername === usernameData.currentUsername) {
      newErrors.newUsername = 'El nuevo usuario debe ser diferente al actual';
    }
    
    return newErrors;
  };

  // Validaciones para cambio de contraseña
  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Ingresa tu contraseña actual';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Debe tener al menos 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Debe contener mayúscula, minúscula y número';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma la nueva contraseña';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña debe ser diferente a la actual';
    }
    
    return newErrors;
  };

  // Validaciones para borrar cuenta
  const validateDelete = () => {
    const newErrors = {};
    
    if (!deleteData.confirmPassword) {
      newErrors.confirmPassword = 'Ingresa tu contraseña para confirmar';
    }
    
    if (deleteData.confirmText !== 'BORRAR MI CUENTA') {
      newErrors.confirmText = 'Debes escribir exactamente "BORRAR MI CUENTA"';
    }
    
    return newErrors;
  };

  // Manejar cambios en inputs
  const handleUsernameChange = (e) => {
    const { name, value } = e.target;
    setUsernameData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDeleteChange = (e) => {
    const { name, value } = e.target;
    setDeleteData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Toggle mostrar contraseñas
  const togglePassword = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Cambiar username
  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateUsername();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(prev => ({ ...prev, username: true }));
    setErrors({});

    try {
      await userService.updateUsername({
        newUsername: usernameData.newUsername.trim()
      });
      
      alert('Nombre de usuario actualizado exitosamente');
      setUsernameData(prev => ({ 
        ...prev, 
        currentUsername: prev.newUsername,
        newUsername: '' 
      }));
    } catch (error) {
      setErrors({ username: error.message || 'Error al actualizar el usuario' });
    } finally {
      setLoading(prev => ({ ...prev, username: false }));
    }
  };

  // Cambiar contraseña
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validatePassword();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(prev => ({ ...prev, password: true }));
    setErrors({});

    try {
      await userService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      alert('Contraseña actualizada exitosamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setErrors({ password: error.message || 'Error al actualizar la contraseña' });
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    const confirmLogout = window.confirm('¿Estás seguro que deseas cerrar sesión?');
    
    if (confirmLogout) {
      authService.logout();
      navigate('/login');
    }
  };

  // Borrar cuenta
  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateDelete();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const confirmDelete = window.confirm(
      'ATENCIÓN: Esta acción NO se puede deshacer.\n\n' +
      'Se eliminará permanentemente:\n' +
      '• Tu cuenta y perfil\n' +
      '• Todos tus entrenamientos\n' +
      '• Todo tu progreso\n' +
      '• Toda tu información\n\n' +
      '¿Estás completamente seguro?'
    );

    if (!confirmDelete) return;

    setLoading(prev => ({ ...prev, delete: true }));
    setErrors({});

    try {
      await userService.deleteAccount({
        password: deleteData.confirmPassword
      });
      
      alert('Cuenta eliminada exitosamente');
      authService.logout();
      navigate('/login');
    } catch (error) {
      setErrors({ delete: error.message || 'Error al eliminar la cuenta' });
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  return (
    <div className="profile-settings">
      <div className="settings-header">
        <h2>Configuración de Cuenta</h2>
        <p>Gestiona tu información personal y configuración de seguridad</p>
      </div>

      {/* Botón de Cerrar Sesión */}
      <div className="logout-section">
        <button 
          onClick={handleLogout} 
          className="btn btn-danger btn-lg"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar Sesión
        </button>
      </div>

      <div className="settings-sections">
        {/* Sección: Cambiar nombre de usuario */}
        <section className="settings-section">
          <div className="section-header">
            <h3>Cambiar Nombre de Usuario</h3>
            <p>Actualiza tu nombre de usuario para iniciar sesión</p>
          </div>

          <form onSubmit={handleUsernameSubmit} className="settings-form">
            {errors.username && (
              <div className="error-message global-error" role="alert">
                {errors.username}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="currentUsername" className="form-label">
                Usuario Actual
              </label>
              <input
                type="text"
                id="currentUsername"
                value={usernameData.currentUsername || 'usuario_actual'}
                className="form-input"
                disabled
                aria-describedby="current-username-help"
              />
              <div id="current-username-help" className="form-help">
                Este es tu nombre de usuario actual
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="newUsername" className="form-label">
                Nuevo Nombre de Usuario *
              </label>
              <input
                type="text"
                id="newUsername"
                name="newUsername"
                value={usernameData.newUsername}
                onChange={handleUsernameChange}
                className={`form-input ${errors.newUsername ? 'error' : ''}`}
                placeholder="Ingresa tu nuevo usuario"
                aria-required="true"
                aria-invalid={errors.newUsername ? 'true' : 'false'}
                aria-describedby={errors.newUsername ? 'username-error' : 'username-help'}
                autoComplete="username"
              />
              <div id="username-help" className="form-help">
                Mínimo 3 caracteres. Solo letras, números y guiones bajos.
              </div>
              {errors.newUsername && (
                <div id="username-error" className="error-message" role="alert">
                  {errors.newUsername}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading.username}
            >
              {loading.username ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loading-spinner">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Actualizando...
                </>
              ) : (
                'Actualizar Usuario'
              )}
            </button>
          </form>
        </section>

        {/* Sección: Cambiar contraseña */}
        <section className="settings-section">
          <div className="section-header">
            <h3>Cambiar Contraseña</h3>
            <p>Actualiza tu contraseña para mayor seguridad</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="settings-form">
            {errors.password && (
              <div className="error-message global-error" role="alert">
                {errors.password}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="currentPassword" className="form-label">
                Contraseña Actual *
              </label>
              <div className="password-container">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                  placeholder="Ingresa tu contraseña actual"
                  aria-required="true"
                  aria-invalid={errors.currentPassword ? 'true' : 'false'}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePassword('current')}
                  aria-label={showPasswords.current ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPasswords.current ? (
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
              {errors.currentPassword && (
                <div className="error-message" role="alert">
                  {errors.currentPassword}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                Nueva Contraseña *
              </label>
              <div className="password-container">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`form-input ${errors.newPassword ? 'error' : ''}`}
                  placeholder="Crea una nueva contraseña segura"
                  aria-required="true"
                  aria-invalid={errors.newPassword ? 'true' : 'false'}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePassword('new')}
                  aria-label={showPasswords.new ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPasswords.new ? (
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
              <div className="form-help">
                Mínimo 6 caracteres con mayúscula, minúscula y número.
              </div>
              {errors.newPassword && (
                <div className="error-message" role="alert">
                  {errors.newPassword}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar Nueva Contraseña *
              </label>
              <div className="password-container">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Repite tu nueva contraseña"
                  aria-required="true"
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePassword('confirm')}
                  aria-label={showPasswords.confirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPasswords.confirm ? (
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
                <div className="error-message" role="alert">
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading.password}
            >
              {loading.password ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loading-spinner">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Actualizando...
                </>
              ) : (
                'Actualizar Contraseña'
              )}
            </button>
          </form>
        </section>

        {/* Sección: Borrar cuenta */}
        <section className="settings-section danger-section">
          <div className="section-header">
            <h3>Zona Peligrosa</h3>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MdWarning size={20} /> Las acciones aquí son irreversibles
            </p>
          </div>

          {!showDeleteConfirm ? (
            <div className="danger-info">
              <div className="warning-box">
                <h4>Borrar Cuenta Permanentemente</h4>
                <p>
                  Esta acción eliminará permanentemente tu cuenta y todos tus datos. 
                  No podrás recuperar tu información una vez confirmado.
                </p>
                <ul>
                  <li>Se eliminarán todos tus entrenamientos</li>
                  <li>Se perderá todo tu progreso</li>
                  <li>No podrás usar el mismo usuario nuevamente</li>
                  <li>Esta acción NO se puede deshacer</li>
                </ul>
              </div>
              
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Proceder a Borrar Cuenta
              </button>
            </div>
          ) : (
            <form onSubmit={handleDeleteSubmit} className="settings-form danger-form">
              {errors.delete && (
                <div className="error-message global-error" role="alert">
                  {errors.delete}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="deletePassword" className="form-label">
                  Confirma tu Contraseña *
                </label>
                <div className="password-container">
                  <input
                    type={showPasswords.delete ? 'text' : 'password'}
                    id="deletePassword"
                    name="confirmPassword"
                    value={deleteData.confirmPassword}
                    onChange={handleDeleteChange}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Ingresa tu contraseña actual"
                    aria-required="true"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePassword('delete')}
                    aria-label={showPasswords.delete ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPasswords.delete ? (
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
                  <div className="error-message" role="alert">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmText" className="form-label">
                  Escribe "BORRAR MI CUENTA" para confirmar *
                </label>
                <input
                  type="text"
                  id="confirmText"
                  name="confirmText"
                  value={deleteData.confirmText}
                  onChange={handleDeleteChange}
                  className={`form-input ${errors.confirmText ? 'error' : ''}`}
                  placeholder="BORRAR MI CUENTA"
                  aria-required="true"
                />
                <div className="form-help">
                  Debes escribir exactamente: BORRAR MI CUENTA
                </div>
                {errors.confirmText && (
                  <div className="error-message" role="alert">
                    {errors.confirmText}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteData({ confirmPassword: '', confirmText: '' });
                    setErrors({});
                  }}
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={loading.delete}
                >
                  {loading.delete ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loading-spinner">
                        <path d="M21 12a9 9 0 11-6.219-8.56"/>
                      </svg>
                      Eliminando...
                    </>
                  ) : (
                    'Borrar Cuenta Permanentemente'
                  )}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfileSettings;