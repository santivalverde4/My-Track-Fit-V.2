import { useState } from 'react';
import BottomNavigation from '../navigation/BottomNavigation';
import ProfileSettings from './ProfileSettings';
import Wellness from './Wellness';
import SmartTrainer from './SmartTrainer';
import SmartTrainer from './SmartTrainer';
import ProfileSettings from './ProfileSettings';
import Routines from './Routines';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('workouts');

  const renderContent = () => {
    switch (activeSection) {
      case 'workouts':
        return <Routines />;
      case 'wellness':
        return <Wellness />;
        
      case 'help':
        return <SmartTrainer />;
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