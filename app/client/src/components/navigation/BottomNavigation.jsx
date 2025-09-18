import { useState } from 'react';
import '../../styles/Navigation.css';

const BottomNavigation = ({ activeSection, onSectionChange }) => {
  const [focusedItem, setFocusedItem] = useState(null);

  const navigationItems = [
    {
      id: 'workouts',
      label: 'Rutinas',
      icon: (isActive) => (
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`nav-icon ${isActive ? 'active' : ''}`}
        >
          <path d="M6.5 6.5h11"/>
          <path d="M6.5 17.5h11"/>
          <path d="M9.5 6.5L8 12l1.5 5.5"/>
          <path d="M14.5 6.5L16 12l-1.5 5.5"/>
        </svg>
      ),
      ariaLabel: 'Ir a rutinas de entrenamiento'
    },
    {
      id: 'wellness',
      label: 'Bienestar',
      icon: (isActive) => (
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`nav-icon ${isActive ? 'active' : ''}`}
        >
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
      ),
      ariaLabel: 'Ir a bienestar'
    },
    {
      id: 'help',
      label: 'Smart Trainer',
      icon: (isActive) => (
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`nav-icon ${isActive ? 'active' : ''}`}
        >
          <rect x="7" y="3" width="10" height="12" rx="2"/>
          <circle cx="9.5" cy="7.5" r="1"/>
          <circle cx="14.5" cy="7.5" r="1"/>
          <path d="M10 11h4"/>
          <rect x="5" y="8" width="2" height="3" rx="1"/>
          <rect x="17" y="8" width="2" height="3" rx="1"/>
          <path d="M8 15v3"/>
          <path d="M16 15v3"/>
          <path d="M6 18h3"/>
          <path d="M15 18h3"/>
          <circle cx="12" cy="3" r="1"/>
          <path d="M12 2v1"/>
        </svg>
      ),
      ariaLabel: 'Ir a Smart Trainer'
    },
    {
      id: 'profile',
      label: 'Cuenta',
      icon: (isActive) => (
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`nav-icon ${isActive ? 'active' : ''}`}
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      ariaLabel: 'Ir a editar cuenta'
    }
  ];

  const handleItemClick = (itemId) => {
    onSectionChange(itemId);
  };

  const handleKeyDown = (e, itemId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleItemClick(itemId);
    }
  };

  return (
    <nav 
      className="bottom-navigation" 
      role="navigation" 
      aria-label="Navegación principal"
    >
      <div className="nav-container">
        {navigationItems.map((item) => {
          const isActive = activeSection === item.id;
          const isFocused = focusedItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              onFocus={() => setFocusedItem(item.id)}
              onBlur={() => setFocusedItem(null)}
              className={`nav-item ${isActive ? 'active' : ''} ${isFocused ? 'focused' : ''}`}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              type="button"
            >
              <div className="nav-icon-container">
                {item.icon(isActive)}
              </div>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;