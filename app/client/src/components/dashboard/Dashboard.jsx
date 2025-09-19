import { useState } from 'react';
import BottomNavigation from '../navigation/BottomNavigation';
import ProfileSettings from './ProfileSettings';
import Wellness from './Wellness';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('workouts');

  const renderContent = () => {
    switch (activeSection) {
      case 'workouts':
        return (
          <div className="dashboard-content">
            <h2>Entrenamientos</h2>
            <p>Aquí irá el contenido de entrenamientos...</p>
          </div>
        );
      case 'wellness':
        return <Wellness />;
        
      case 'help':
        return (
          <div className="dashboard-content">
            <h2>Smart Trainer</h2>
            <p>Aquí irá tu entrenador personal inteligente...</p>
          </div>
        );
      case 'profile':
        return <ProfileSettings />;
      default:
        return (
          <div className="dashboard-content">
            <h2>Bienvenido a My Track-Fit</h2>
            <p>Selecciona una opción del menú inferior para comenzar.</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">My Track-Fit</h1>
          <div className="user-info">
            <span className="welcome-text">¡Hola, Usuario!</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main" role="main">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
    </div>
  );
};

export default Dashboard;