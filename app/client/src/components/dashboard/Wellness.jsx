import { useState } from 'react';
import InjuryManagement from './InjuryManagement';
import NutritionManagement from './NutritionManagement';
import UserStatistics from './UserStatistics';
import '../../styles/GlobalStyles.css';
import '../../styles/Wellness.css';

const Wellness = () => {
  const [activeWellnessSection, setActiveWellnessSection] = useState('overview');

  const wellnessSections = [
    {
      id: 'injuries',
      title: 'Manejo de Lesiones',
      description: 'Registra y monitorea lesiones, ejercicios de rehabilitación',
      icon: <i className="bi bi-bandaid-fill" style={{ fontSize: '2rem' }}></i>,
      color: 'danger'
    },
    {
      id: 'nutrition',
      title: 'Nutrición',
      description: 'Planifica comidas, registra alimentos y controla calorías',
      icon: <i className="bi bi-egg-fried" style={{ fontSize: '2rem' }}></i>,
      color: 'success'
    },
    {
      id: 'statistics',
      title: 'Estadísticas',
      description: 'Visualiza tu progreso, métricas y análisis detallados',
      icon: <i className="bi bi-graph-up-arrow" style={{ fontSize: '2rem' }}></i>,
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
          <>
            <header className="wellness-header">
              <h2>
                <i className="bi bi-heart-pulse-fill"></i> Bienestar
              </h2>
              <p className="header-subtitle">
                Gestiona tu salud integral: nutrición, lesiones y estadísticas
              </p>
            </header>

            <div className="wellness-grid">
              {wellnessSections.map((section) => (
                <div
                  key={section.id}
                  className={`wellness-card ${section.color}`}
                  onClick={() => setActiveWellnessSection(section.id)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveWellnessSection(section.id);
                    }
                  }}
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
                    <i className="bi bi-chevron-right" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                </div>
              ))}
            </div>

            <div className="wellness-summary">
              <h3>
                <i className="bi bi-calendar-day"></i> Resumen de Hoy
              </h3>
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="summary-icon">
                    <i className="bi bi-egg-fried" style={{ color: '#059669' }}></i>
                  </div>
                  <div>
                    <div className="summary-value">1,847</div>
                    <div className="summary-label">Calorías consumidas</div>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon">
                    <i className="bi bi-droplet-fill" style={{ color: '#0891b2' }}></i>
                  </div>
                  <div>
                    <div className="summary-value">6/8</div>
                    <div className="summary-label">Vasos de agua</div>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon">
                    <i className="bi bi-moon-stars-fill" style={{ color: '#6366f1' }}></i>
                  </div>
                  <div>
                    <div className="summary-value">7.5h</div>
                    <div className="summary-label">Horas de sueño</div>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon">
                    <i className="bi bi-fire" style={{ color: '#f97316' }}></i>
                  </div>
                  <div>
                    <div className="summary-value">450</div>
                    <div className="summary-label">Kcal quemadas</div>
                  </div>
                </div>
              </div>
            </div>
          </>
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
