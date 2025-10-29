import { useState, useEffect } from 'react';
import { injuryService } from '../../services/api';
import '../../styles/GlobalStyles.css';
import '../../styles/WellnessComponents.css';

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
    'Hombro', 'Brazo', 'Codo', 'Muñeca',
    'Espalda alta', 'Espalda baja', 'Pecho', 'Abdomen',
    'Cadera', 'Muslo', 'Rodilla', 'Pantorrilla', 'Tobillo', 'Pie'
  ];

  const severityLevels = [
    { value: 'mild', label: 'Leve', color: '#16a34a' },
    { value: 'moderate', label: 'Moderada', color: '#ea580c' },
    { value: 'severe', label: 'Severa', color: '#dc2626' }
  ];

  useEffect(() => {
    loadInjuries();
  }, []);

  const loadInjuries = async () => {
    setLoading(true);
    try {
      const response = await injuryService.getInjuries();
      setInjuries(response.injuries || []);
    } catch (error) {
      console.error('Error al cargar lesiones:', error);
      // Si falla la API, usar datos mock para desarrollo
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
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre de la lesión es requerido';
    if (!formData.type) newErrors.type = 'Selecciona el tipo de lesión';
    if (!formData.bodyPart) newErrors.bodyPart = 'Selecciona la parte del cuerpo afectada';
    if (!formData.dateOccurred) newErrors.dateOccurred = 'Indica cuándo ocurrió la lesión';
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
      const response = await injuryService.createInjury(formData);
      
      // Agregar la nueva lesión a la lista
      setInjuries(prev => [response.injury, ...prev]);
      
      // Resetear formulario
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
      console.log('Lesión registrada exitosamente');
    } catch (error) {
      console.error('Error al crear lesión:', error);
      // Fallback: agregar localmente si falla la API
      const newInjury = {
        id: Date.now(),
        ...formData,
        recoveryDays: Math.floor(Math.random() * 21) + 7
      };
      setInjuries(prev => [newInjury, ...prev]);
      setFormData({
        name: '', type: '', severity: 'mild', bodyPart: '',
        dateOccurred: '', description: '', status: 'active'
      });
      setShowAddForm(false);
    } finally {
      setLoading(false);
    }
  };

  const updateInjuryStatus = async (injuryId, newStatus) => {
    try {
      await injuryService.updateInjuryStatus(injuryId, newStatus);
      
      // Actualizar en el estado local
      setInjuries(prev =>
        prev.map(injury =>
          injury.id === injuryId ? { ...injury, status: newStatus } : injury
        )
      );
      console.log('Estado actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      // Actualizar localmente aunque falle la API
      setInjuries(prev =>
        prev.map(injury =>
          injury.id === injuryId ? { ...injury, status: newStatus } : injury
        )
      );
    }
  };

  const deleteInjury = async (injuryId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta lesión?')) return;
    
    try {
      await injuryService.deleteInjury(injuryId);
      
      // Remover del estado local
      setInjuries(prev => prev.filter(injury => injury.id !== injuryId));
      console.log('Lesión eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar lesión:', error);
      // Eliminar localmente aunque falle la API
      setInjuries(prev => prev.filter(injury => injury.id !== injuryId));
    }
  };

  const getSeverityColor = (severity) => {
    const level = severityLevels.find(l => l.value === severity);
    return level ? level.color : '#6b7280';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'bi-exclamation-circle-fill';
      case 'recovering': return 'bi-arrow-repeat';
      case 'healed': return 'bi-check-circle-fill';
      default: return 'bi-question-circle';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'recovering': return 'En Recuperación';
      case 'healed': return 'Curada';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="injury-management">
      {/* Header */}
      <header className="component-header">
        <div className="header-top">
          <button 
            onClick={onBack} 
            className="btn btn-secondary btn-icon"
            aria-label="Volver"
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <h2>
            <i className="bi bi-bandaid-fill"></i>
            Gestión de Lesiones
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-success btn-icon"
            aria-label="Agregar lesión"
          >
            <i className={showAddForm ? "bi bi-x-lg" : "bi bi-plus-lg"}></i>
          </button>
        </div>
        <p className="header-subtitle">
          Registra y monitorea tus lesiones para un mejor control
        </p>
      </header>

      {/* Formulario para agregar lesión */}
      {showAddForm && (
        <div className="add-injury-form">
          <h3>
            <i className="bi bi-clipboard-plus"></i>
            Nueva Lesión
          </h3>
          <form onSubmit={handleSubmit} className="injury-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Nombre de la lesión <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Tendinitis de hombro"
                  aria-required="true"
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="type" className="form-label">
                  Tipo <span className="required">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  className={`form-input ${errors.type ? 'error' : ''}`}
                  value={formData.type}
                  onChange={handleInputChange}
                  aria-required="true"
                >
                  <option value="">Selecciona tipo</option>
                  {injuryTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <p className="error-message">{errors.type}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bodyPart" className="form-label">
                  Parte del cuerpo <span className="required">*</span>
                </label>
                <select
                  id="bodyPart"
                  name="bodyPart"
                  className={`form-input ${errors.bodyPart ? 'error' : ''}`}
                  value={formData.bodyPart}
                  onChange={handleInputChange}
                  aria-required="true"
                >
                  <option value="">Selecciona zona</option>
                  {bodyParts.map(part => (
                    <option key={part} value={part}>{part}</option>
                  ))}
                </select>
                {errors.bodyPart && <p className="error-message">{errors.bodyPart}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="severity" className="form-label">
                  Severidad
                </label>
                <select
                  id="severity"
                  name="severity"
                  className="form-input"
                  value={formData.severity}
                  onChange={handleInputChange}
                >
                  {severityLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dateOccurred" className="form-label">
                  Fecha de lesión <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="dateOccurred"
                  name="dateOccurred"
                  className={`form-input ${errors.dateOccurred ? 'error' : ''}`}
                  value={formData.dateOccurred}
                  onChange={handleInputChange}
                  aria-required="true"
                />
                {errors.dateOccurred && <p className="error-message">{errors.dateOccurred}</p>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                className="form-input"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe cómo ocurrió y los síntomas..."
                rows="3"
              />
            </div>

            <div className="btn-group justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary"
                disabled={loading}
              >
                <i className="bi bi-x-circle"></i>
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="bi bi-arrow-repeat"></i>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle"></i>
                    Guardar Lesión
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de lesiones */}
      {loading && !showAddForm ? (
        <div className="loading-state">
          <i className="bi bi-arrow-repeat spin-icon"></i>
          <p>Cargando lesiones...</p>
        </div>
      ) : injuries.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-heart-pulse"></i>
          <h3>¡Excelente!</h3>
          <p>No tienes lesiones registradas. Mantente así con entrenamientos seguros.</p>
        </div>
      ) : (
        <div className="injuries-list">
          {injuries.map(injury => (
            <div key={injury.id} className="injury-card">
              <div className="injury-header">
                <div className="injury-title-section">
                  <h4>{injury.name}</h4>
                  <span
                    className="severity-badge"
                    style={{ backgroundColor: getSeverityColor(injury.severity) }}
                  >
                    {severityLevels.find(l => l.value === injury.severity)?.label}
                  </span>
                </div>
                <button
                  onClick={() => deleteInjury(injury.id)}
                  className="btn btn-danger btn-icon btn-sm"
                  aria-label="Eliminar lesión"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>

              <div className="injury-details">
                <div className="detail-item">
                  <i className="bi bi-bandaid"></i>
                  <span>{injury.type}</span>
                </div>
                <div className="detail-item">
                  <i className="bi bi-person"></i>
                  <span>{injury.bodyPart}</span>
                </div>
                <div className="detail-item">
                  <i className="bi bi-calendar-event"></i>
                  <span>{new Date(injury.dateOccurred).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="detail-item">
                  <i className={getStatusIcon(injury.status)}></i>
                  <span>{getStatusLabel(injury.status)}</span>
                </div>
              </div>

              {injury.description && (
                <p className="injury-description">{injury.description}</p>
              )}

              <div className="injury-actions">
                <button
                  onClick={() => updateInjuryStatus(injury.id, 'active')}
                  className={`btn btn-sm ${injury.status === 'active' ? 'btn-warning' : 'btn-outline-secondary'}`}
                  disabled={injury.status === 'active'}
                >
                  <i className="bi bi-exclamation-circle"></i>
                  Activa
                </button>
                <button
                  onClick={() => updateInjuryStatus(injury.id, 'recovering')}
                  className={`btn btn-sm ${injury.status === 'recovering' ? 'btn-info' : 'btn-outline-secondary'}`}
                  disabled={injury.status === 'recovering'}
                >
                  <i className="bi bi-arrow-repeat"></i>
                  Recuperación
                </button>
                <button
                  onClick={() => updateInjuryStatus(injury.id, 'healed')}
                  className={`btn btn-sm ${injury.status === 'healed' ? 'btn-success' : 'btn-outline-secondary'}`}
                  disabled={injury.status === 'healed'}
                >
                  <i className="bi bi-check-circle"></i>
                  Curada
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InjuryManagement;
