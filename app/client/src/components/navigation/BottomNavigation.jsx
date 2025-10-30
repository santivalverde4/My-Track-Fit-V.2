import { useState } from 'react';
import { RiRobot2Line } from 'react-icons/ri';
import { CgGym } from 'react-icons/cg';
import { MdOutlineHealthAndSafety } from 'react-icons/md';
import '../../styles/Navigation.css';

const BottomNavigation = ({ activeSection, onSectionChange }) => {
  const [focusedItem, setFocusedItem] = useState(null);

  const navigationItems = [
    {
      id: 'workouts',
      label: 'Rutinas',
      icon: (isActive) => (
        <CgGym className={`nav-icon ${isActive ? 'active' : ''}`} size={24} />
      ),
      ariaLabel: 'Ir a rutinas de entrenamiento'
    },
    {
      id: 'wellness',
      label: 'Bienestar',
      icon: (isActive) => (
        <MdOutlineHealthAndSafety className={`nav-icon ${isActive ? 'active' : ''}`} size={24} />
      ),
      ariaLabel: 'Ir a bienestar'
    },
    {
      id: 'help',
      label: 'Smart Trainer',
      icon: (isActive) => (
        <RiRobot2Line className={`nav-icon ${isActive ? 'active' : ''}`} size={24} />
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