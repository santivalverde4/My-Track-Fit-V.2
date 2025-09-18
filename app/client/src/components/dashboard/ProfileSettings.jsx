import React from 'react';

const ProfileSettings = () => {
  return (
    <div className="dashboard-content">
      <h2>Configuración de Perfil</h2>
      <p>Aquí irá la configuración del perfil de usuario...</p>
      <div style={{ 
        padding: '2rem', 
        background: '#f8fafc', 
        borderRadius: '8px', 
        border: '1px solid #e2e8f0',
        textAlign: 'center',
        color: '#718096'
      }}>
        <h3>🚧 En Desarrollo</h3>
        <p>Esta sección estará disponible pronto con funcionalidades para:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>• Editar información personal</li>
          <li>• Cambiar contraseña</li>
          <li>• Configuración de notificaciones</li>
          <li>• Preferencias de entrenamiento</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileSettings;