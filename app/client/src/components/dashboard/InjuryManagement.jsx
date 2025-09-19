import { useState, useEffect } from 'react';

const InjuryManagement = ({ onBack }) => {
  const [injuries, setInjuries] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    severity: 'mild',
    bodyPart: '',
    dateOccurred: '',
    description: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});

  const injuryTypes = [
    'Distensión muscular',
    'Esguince',
    'Tendinitis',
    'Fractura por estrés',
    'Bursitis',
    'Lesión articular',
    'Contusión',
    'Otro'
  ];

  const bodyParts = [
    'Hombro', 'Brazo', 'Codo', 'Muñeca', 'Espalda alta',
    'Espalda baja', 'Pecho', 'Abdomen', 'Cadera',
    'Muslo', 'Rodilla', 'Pantorrilla', 'Tobillo', 'Pie'
  ];

  const severityLevels = [
    { value: 'mild', label: 'Leve', color: '#16a34a' },
    { value: 'moderate', label: 'Moderada', color: '#ea580c' },
    { value: 'severe', label: 'Severa', color: '#dc2626' }
  ];

  // Cargar lesiones al montar el componente
  useEffect(() => {
    loadInjuries();
  }, []);

  const loadInjuries = async () => {
    setLoading(true);
    try {
      // Simular datos de ejemplo
      setTimeout(() => {
        const mockInjuries = [
          {
            id: 1,
            name: 'Tendinitis Aquiles',
            type: 'Tendinitis',
            severity: 'moderate',
            bodyPart: 'Tobillo',
            dateOccurred: '2024-01-15',
            description: 'Dolor en tendón de Aquiles después de correr',
            status: 'recovering',
            recoveryDays: 14
          },
          {
            id: 2,
            name: 'Distensión Isquiotibial',
            type: 'Distensión muscular',
            severity: 'mild',
            bodyPart: 'Muslo',
            dateOccurred: '2024-01-20',
            description: 'Molestia leve en parte posterior del muslo',
            status: 'active',
            recoveryDays: 7
          }
        ];
        setInjuries(mockInjuries);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading injuries:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la lesión es requerido';
    }
    
    if (!formData.type) {
      newErrors.type = 'Selecciona el tipo de lesión';
    }
    
    if (!formData.bodyPart) {
      newErrors.bodyPart = 'Selecciona la parte del cuerpo afectada';
    }
    
    if (!formData.dateOccurred) {
      newErrors.dateOccurred = 'Indica cuándo ocurrió la lesión';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    
    try {
      // Simular creación de lesión
      setTimeout(() => {
        const newInjury = {
          id: Date.now(),
          ...formData,
          recoveryDays: Math.floor(Math.random() * 21) + 7
        };
        
        setInjuries(prev => [newInjury, ...prev]);
        setFormData({
          name: '',
          type: '',
          severity: 'mild',
          bodyPart: '',
          dateOccurred: '',
          description: '',
          status: 'active'
        });
        setShowAddForm(false);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error creating injury:', error);
      setLoading(false);
    }
  };

  const updateInjuryStatus = (injuryId, newStatus) => {
    setInjuries(prev => 
      prev.map(injury => 
        injury.id === injuryId 
          ? { ...injury, status: newStatus }
          : injury
      )
    );
  };

  const getSeverityColor = (severity) => {
    const level = severityLevels.find(l => l.value === severity);
    return level ? level.color : '#6b7280';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return '';
      case 'recovering':
        return '';
      case 'healed':
        return '';
      default:
        return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'recovering':
        return 'En Recuperación';
      case 'healed':
        return 'Curada';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="injury-management">
      {/* Header con botón de regreso */}
      <header className="section-header">
        <button 
          onClick={onBack}
          className="back-button"
          aria-label="Volver al centro de bienestar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5m7-7l-7 7 7 7"/>
          </svg>
          Volver
        </button>
        <div>
          <h2>Manejo de Lesiones</h2>
          <p>Registra y monitorea tus lesiones para una recuperación óptima</p>
        </div>
      </header>

      {/* Botón para agregar nueva lesión */}
      <div className="section-actions">
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-button primary"
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14m7-7H5"/>
          </svg>
          {showAddForm ? 'Cancelar' : 'Registrar Lesión'}
        </button>
      </div>

      {/* Formulario para agregar lesión */}
      {showAddForm && (
        <div className="add-injury-form">
          <h3>Nueva Lesión</h3>
          <form onSubmit={handleSubmit} className="injury-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Nombre de la Lesión *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Ej: Tendinitis de rodilla"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <div id="name-error" className="error-message" role="alert">
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="type" className="form-label">
                  Tipo de Lesión *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`form-input ${errors.type ? 'error' : ''}`}
                  aria-describedby={errors.type ? 'type-error' : undefined}
                >
                  <option value="">Selecciona el tipo</option>
                  {injuryTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && (
                  <div id="type-error" className="error-message" role="alert">
                    {errors.type}
                  </div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bodyPart" className="form-label">
                  Parte del Cuerpo *
                </label>
                <select
                  id="bodyPart"
                  name="bodyPart"
                  value={formData.bodyPart}
                  onChange={handleInputChange}
                  className={`form-input ${errors.bodyPart ? 'error' : ''}`}
                  aria-describedby={errors.bodyPart ? 'bodyPart-error' : undefined}
                >
                  <option value="">Selecciona la zona</option>
                  {bodyParts.map(part => (
                    <option key={part} value={part}>{part}</option>
                  ))}
                </select>
                {errors.bodyPart && (
                  <div id="bodyPart-error" className="error-message" role="alert">
                    {errors.bodyPart}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="severity" className="form-label">
                  Severidad
                </label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  {severityLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="dateOccurred" className="form-label">
                Fecha de Ocurrencia *
              </label>
              <input
                type="date"
                id="dateOccurred"
                name="dateOccurred"
                value={formData.dateOccurred}
                onChange={handleInputChange}
                className={`form-input ${errors.dateOccurred ? 'error' : ''}`}
                max={new Date().toISOString().split('T')[0]}
                aria-describedby={errors.dateOccurred ? 'dateOccurred-error' : undefined}
              />
              {errors.dateOccurred && (
                <div id="dateOccurred-error" className="error-message" role="alert">
                  {errors.dateOccurred}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-input"
                rows="3"
                placeholder="Describe los síntomas, causa, tratamiento..."
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="form-button secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="form-button primary"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Lesión'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de lesiones */}
      <div className="injuries-list">
        <h3>Mis Lesiones ({injuries.length})</h3>
        
        {loading && injuries.length === 0 ? (
          <div className="loading-state">
            <p>Cargando lesiones...</p>
          </div>
        ) : injuries.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"/>
            </svg>
            <h4>No hay lesiones registradas</h4>
            <p>¡Excelente! Mantente así con entrenamientos seguros.</p>
          </div>
        ) : (
          <div className="injuries-grid">
            {injuries.map(injury => (
              <div key={injury.id} className="injury-card">
                <div className="injury-header">
                  <div className="injury-title">
                    <h4>{injury.name}</h4>
                    <span className="injury-type">{injury.type}</span>
                  </div>
                  <div className="injury-status">
                    <span className="status-icon">{getStatusIcon(injury.status)}</span>
                    <span className="status-text">{getStatusLabel(injury.status)}</span>
                  </div>
                </div>

                <div className="injury-details">
                  <div className="detail-item">
                    <span className="detail-label">Zona afectada:</span>
                    <span className="detail-value">{injury.bodyPart}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Severidad:</span>
                    <span 
                      className="severity-badge"
                      style={{ color: getSeverityColor(injury.severity) }}
                    >
                      {severityLevels.find(s => s.value === injury.severity)?.label}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Fecha:</span>
                    <span className="detail-value">
                      {new Date(injury.dateOccurred).toLocaleDateString()}
                    </span>
                  </div>
                  {injury.recoveryDays && (
                    <div className="detail-item">
                      <span className="detail-label">Tiempo estimado:</span>
                      <span className="detail-value">{injury.recoveryDays} días</span>
                    </div>
                  )}
                </div>

                {injury.description && (
                  <div className="injury-description">
                    <p>{injury.description}</p>
                  </div>
                )}

                <div className="injury-actions">
                  <select
                    value={injury.status}
                    onChange={(e) => updateInjuryStatus(injury.id, e.target.value)}
                    className="status-select"
                    aria-label={`Cambiar estado de ${injury.name}`}
                  >
                    <option value="active">Activa</option>
                    <option value="recovering">En Recuperación</option>
                    <option value="healed">Curada</option>
                  </select>
                </div>
                <br></br>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InjuryManagement;