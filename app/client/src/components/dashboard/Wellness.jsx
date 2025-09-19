import { useState } from 'react';
import InjuryManagement from './InjuryManagement';
import NutritionManagement from './NutritionManagement';
import UserStatistics from './UserStatistics';
import '../../styles/Wellness.css';

const Wellness = () => {
  const [activeWellnessSection, setActiveWellnessSection] = useState('overview');

  const wellnessSections = [
    {
      id: 'injuries',
      title: 'Manejo de Lesiones',
      description: 'Registra y monitorea lesiones, ejercicios de rehabilitación',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"/>
          <path d="M12 5L8 9l4 4 4-4z"/>
        </svg>
      ),
      color: 'danger'
    },
    {
      id: 'nutrition',
      title: 'Nutrición',
      description: 'Planifica comidas, registra alimentos y controla calorías',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 0 0-9.95 9h1.87a8 8 0 0 1 16.16 0h1.87A10 10 0 0 0 12 2z"/>
          <path d="M19.93 11a10 10 0 0 1-8 8.96"/>
          <path d="M5 11A10 10 0 0 0 13 19.96"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
      color: 'success'
    },
    {
      id: 'statistics',
      title: 'Estadísticas',
      description: 'Visualiza tu progreso, métricas y análisis detallados',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      ),
      color: 'info'
    }
  ];

  const renderContent = () => {
    switch (activeWellnessSection) {
      case 'injuries':
        return <InjuryManagement onBack={() => setActiveWellnessSection('overview')} />;
      case 'nutrition':
        return <NutritionManagement onBack={() => setActiveWellnessSection('overview')} />;
      case 'statistics':
        return <UserStatistics onBack={() => setActiveWellnessSection('overview')} />;
      case 'overview':
      default:
        return (
          <div className="wellness-overview">
            <header className="wellness-header">
              <h2>Centro de Bienestar</h2>
              <p>Gestiona tu salud integral: lesiones, nutrición y progreso</p>
            </header>

            <div className="wellness-grid">
              {wellnessSections.map((section) => (
                <button
                  key={section.id}
                  className={`wellness-card ${section.color}`}
                  onClick={() => setActiveWellnessSection(section.id)}
                  aria-label={`Acceder a ${section.title}`}
                >
                  <div className="wellness-card-icon">
                    {section.icon}
                  </div>
                  <div className="wellness-card-content">
                    <h3>{section.title}</h3>
                    <p>{section.description}</p>
                  </div>
                  <div className="wellness-card-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            <div className="wellness-summary">
              <h3>Resumen de Hoy</h3>
              <div className="summary-cards">
                <div className="summary-card">
                  <span className="summary-icon">🍎</span>
                  <div>
                    <p className="summary-value">1,847</p>
                    <p className="summary-label">Calorías consumidas</p>
                  </div>
                </div>
                <div className="summary-card">
                  <span className="summary-icon">💧</span>
                  <div>
                    <p className="summary-value">6/8</p>
                    <p className="summary-label">Vasos de agua</p>
                  </div>
                </div>
                <div className="summary-card">
                  <span className="summary-icon">😴</span>
                  <div>
                    <p className="summary-value">7.5h</p>
                    <p className="summary-label">Horas de sueño</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="wellness-container">
      {renderContent()}
    </div>
  );
};

export default Wellness;