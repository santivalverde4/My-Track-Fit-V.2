import { useState, useEffect } from 'react';
import { routineService } from '../../services/api';
import '../../styles/Routines.css';

const Routines = () => {
  // Estados principales
  const [routines, setRoutines] = useState([]);
  const [showAddRoutineModal, setShowAddRoutineModal] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Estados para nuevo rutina (simplificado - solo nombre)
  const [newRoutine, setNewRoutine] = useState({
    name: ''
  });

  // Estados para nuevo ejercicio
  const [newExercise, setNewExercise] = useState({
    name: '',
    description: '',
    sets: 3,
    reps: 12,
    weight: 0,
    restTime: 60,
    notes: ''
  });

  // Cargar rutinas al montar el componente
  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    try {
      setLoading(true);
      const response = await routineService.getRoutines();
      setRoutines(response.routines || []);
    } catch (error) {
      console.error('Error cargando rutinas:', error);
      setErrors({ general: 'Error al cargar las rutinas' });
    } finally {
      setLoading(false);
    }
  };

  // Manejar creación de rutina
  const handleCreateRoutine = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateRoutine();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Rutina con valores por defecto
      const routineData = {
        name: newRoutine.name.trim(),
        description: `Rutina de entrenamiento: ${newRoutine.name}`,
        difficulty: 'intermedio',
        estimatedTime: 30,
        category: 'fuerza'
      };

      const response = await routineService.createRoutine(routineData);
      
      alert('Rutina creada exitosamente');
      setNewRoutine({ name: '' });
      setShowAddRoutineModal(false);
      
      // Recargar rutinas
      await loadRoutines();
      
    } catch (error) {
      setErrors({ general: error.message || 'Error al crear la rutina' });
    } finally {
      setLoading(false);
    }
  };

  // Validaciones para nueva rutina (simplificado)
  const validateRoutine = () => {
    const newErrors = {};
    
    if (!newRoutine.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (newRoutine.name.trim().length < 3) {
      newErrors.name = 'Debe tener al menos 3 caracteres';
    }
    
    return newErrors;
  };

  // Manejar agregar ejercicio
  const handleAddExercise = async (e) => {
    e.preventDefault();
    
    if (!selectedRoutine) {
      setErrors({ exercise: 'Selecciona una rutina primero' });
      return;
    }

    const validationErrors = validateExercise();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await routineService.addExercise(selectedRoutine.id, newExercise);
      
      alert('Ejercicio agregado exitosamente');
      setNewExercise({
        name: '',
        description: '',
        sets: 3,
        reps: 12,
        weight: 0,
        restTime: 60,
        notes: ''
      });
      setShowAddExerciseModal(false);
      setSelectedRoutine(null);
      
      // Recargar rutinas
      await loadRoutines();
      
    } catch (error) {
      setErrors({ exercise: error.message || 'Error al agregar el ejercicio' });
    } finally {
      setLoading(false);
    }
  };

  const validateExercise = () => {
    const errors = {};
    if (!newExercise.name.trim()) {
      errors.exerciseName = 'El nombre del ejercicio es requerido';
    }
    if (newExercise.sets < 1 || newExercise.sets > 10) {
      errors.sets = 'Las series deben estar entre 1 y 10';
    }
    if (newExercise.reps < 1 || newExercise.reps > 100) {
      errors.reps = 'Las repeticiones deben estar entre 1 y 100';
    }
    if (newExercise.restTime < 0 || newExercise.restTime > 600) {
      errors.restTime = 'El descanso debe estar entre 0 y 600 segundos';
    }
    return errors;
  };

  // Funciones auxiliares
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? mins + 'm' : ''}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'principiante': return 'var(--success-color, #48bb78)';
      case 'intermedio': return 'var(--warning-color, #ed8936)';
      case 'avanzado': return 'var(--error-color, #e53e3e)';
      default: return 'var(--text-secondary, #718096)';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'fuerza':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6.5 6.5h11v11h-11z"/>
            <path d="M6 2h12v4H6z"/>
            <path d="M6 18h12v4H6z"/>
          </svg>
        );
      case 'cardio':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        );
      case 'flexibilidad':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        );
    }
  };

  return (
    <div className="routines-container">
      {/* Header con título y botón agregar */}
      <div className="routines-header">
        <div className="header-title">
          <h2>Rutinas</h2>
          <button
            className="add-routine-btn"
            onClick={() => setShowAddRoutineModal(true)}
            aria-label="Agregar nueva rutina"
            title="Crear nueva rutina"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
        <p className="header-description">
          Crea y gestiona tus rutinas de entrenamiento personalizadas
        </p>
      </div>

      {/* Botón agregar ejercicios */}
      <div className="action-buttons">
        <button
          className="add-exercise-btn"
          onClick={() => setShowAddExerciseModal(true)}
          disabled={routines.length === 0}
          title={routines.length === 0 ? 'Crea una rutina primero' : 'Agregar ejercicio a rutina'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Agregar Ejercicios
        </button>
      </div>

      {/* Lista de rutinas */}
      <div className="routines-list">
        {loading && routines.length === 0 ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando rutinas...</p>
          </div>
        ) : routines.length === 0 ? (
          <div className="empty-state">
            <h3>No tienes rutinas creadas</h3>
            <p>Comienza creando tu primera rutina de entrenamiento</p>
            <button
              className="create-first-routine-btn"
              onClick={() => setShowAddRoutineModal(true)}
            >
              Crear Mi Primera Rutina
            </button>
          </div>
        ) : (
          routines.map(routine => (
            <div key={routine.id} className="routine-card">
              <div className="routine-header">
                <div className="routine-title-section">
                  <div className="routine-category">
                    {getCategoryIcon(routine.category)}
                    <span className="category-text">{routine.category}</span>
                  </div>
                  <h3 className="routine-name">{routine.name}</h3>
                  <p className="routine-description">{routine.description}</p>
                </div>
                <div className="routine-metadata">
                  <div className="metadata-item">
                    <span className="metadata-label">Dificultad:</span>
                    <span 
                      className="difficulty-badge"
                      style={{ color: getDifficultyColor(routine.difficulty) }}
                    >
                      {routine.difficulty}
                    </span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Duración:</span>
                    <span className="metadata-value">{formatTime(routine.estimatedTime)}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Ejercicios:</span>
                    <span className="metadata-value">{routine.exercises.length}</span>
                  </div>
                </div>
              </div>

              {routine.exercises.length > 0 && (
                <div className="exercises-preview">
                  <h4>Ejercicios:</h4>
                  <div className="exercises-list">
                    {routine.exercises.map(exercise => (
                      <div key={exercise.id} className="exercise-item">
                        <div className="exercise-info">
                          <span className="exercise-name">{exercise.name}</span>
                          <span className="exercise-details">
                            {exercise.sets} series × {exercise.reps} reps
                            {exercise.weight > 0 && ` × ${exercise.weight}kg`}
                          </span>
                        </div>
                        {exercise.notes && (
                          <div className="exercise-notes">
                            <small>{exercise.notes}</small>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="routine-actions">
                <button className="action-btn secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Editar
                </button>
                <button 
                  className="action-btn primary"
                  onClick={() => {
                    setSelectedRoutine(routine);
                    setShowAddExerciseModal(true);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                  Agregar Ejercicio
                </button>
                <button className="action-btn success">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                  Iniciar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Crear Rutina */}
      {showAddRoutineModal && (
        <div className="modal-overlay" onClick={() => setShowAddRoutineModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Crear Nueva Rutina</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddRoutineModal(false)}
                aria-label="Cerrar modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateRoutine} className="modal-form">
              {errors.general && (
                <div className="error-message global-error" role="alert">
                  {errors.general}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="routineName" className="form-label">
                  Nombre de la Rutina *
                </label>
                <input
                  type="text"
                  id="routineName"
                  value={newRoutine.name}
                  onChange={(e) => setNewRoutine({ name: e.target.value })}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Ej: Rutina de Fuerza, Cardio Matutino..."
                  aria-required="true"
                  autoFocus
                />
                {errors.name && (
                  <div className="error-message" role="alert">{errors.name}</div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn secondary"
                  onClick={() => setShowAddRoutineModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modal-btn primary"
                  disabled={loading}
                >
                  {loading ? 'Creando...' : 'Crear Rutina'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Agregar Ejercicio */}
      {showAddExerciseModal && (
        <div className="modal-overlay" onClick={() => setShowAddExerciseModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Agregar Ejercicio
                {selectedRoutine && (
                  <span className="modal-subtitle">a "{selectedRoutine.name}"</span>
                )}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowAddExerciseModal(false)}
                aria-label="Cerrar modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddExercise} className="modal-form">
              {errors.exercise && (
                <div className="error-message global-error" role="alert">
                  {errors.exercise}
                </div>
              )}

              {!selectedRoutine && (
                <div className="form-group">
                  <label htmlFor="selectRoutine" className="form-label">
                    Seleccionar Rutina *
                  </label>
                  <select
                    id="selectRoutine"
                    onChange={(e) => {
                      const routine = routines.find(r => r.id === parseInt(e.target.value));
                      setSelectedRoutine(routine || null);
                    }}
                    className="form-input"
                    aria-required="true"
                  >
                    <option value="">Selecciona una rutina...</option>
                    {routines.map(routine => (
                      <option key={routine.id} value={routine.id}>
                        {routine.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="exerciseName" className="form-label">
                  Nombre del Ejercicio *
                </label>
                <input
                  type="text"
                  id="exerciseName"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                  className={`form-input ${errors.exerciseName ? 'error' : ''}`}
                  placeholder="Ej: Sentadillas, Press de banca, Flexiones..."
                  aria-required="true"
                />
                {errors.exerciseName && (
                  <div className="error-message" role="alert">{errors.exerciseName}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="exerciseDescription" className="form-label">
                  Descripción o Técnica
                </label>
                <textarea
                  id="exerciseDescription"
                  value={newExercise.description}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, description: e.target.value }))}
                  className="form-input"
                  placeholder="Describe la técnica correcta del ejercicio..."
                  rows="2"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="sets" className="form-label">
                    Series
                  </label>
                  <input
                    type="number"
                    id="sets"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, sets: parseInt(e.target.value) || 1 }))}
                    className={`form-input ${errors.sets ? 'error' : ''}`}
                    min="1"
                    max="10"
                  />
                  {errors.sets && (
                    <div className="error-message" role="alert">{errors.sets}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="reps" className="form-label">
                    Repeticiones
                  </label>
                  <input
                    type="number"
                    id="reps"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, reps: parseInt(e.target.value) || 1 }))}
                    className={`form-input ${errors.reps ? 'error' : ''}`}
                    min="1"
                    max="100"
                  />
                  {errors.reps && (
                    <div className="error-message" role="alert">{errors.reps}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="weight" className="form-label">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    value={newExercise.weight}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                    className="form-input"
                    min="0"
                    step="0.5"
                    placeholder="0 = Peso corporal"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="restTime" className="form-label">
                    Descanso (seg)
                  </label>
                  <input
                    type="number"
                    id="restTime"
                    value={newExercise.restTime}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, restTime: parseInt(e.target.value) || 60 }))}
                    className={`form-input ${errors.restTime ? 'error' : ''}`}
                    min="0"
                    max="600"
                  />
                  {errors.restTime && (
                    <div className="error-message" role="alert">{errors.restTime}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes" className="form-label">
                  Notas Adicionales
                </label>
                <textarea
                  id="notes"
                  value={newExercise.notes}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, notes: e.target.value }))}
                  className="form-input"
                  placeholder="Consejos, modificaciones, observaciones..."
                  rows="2"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn secondary"
                  onClick={() => setShowAddExerciseModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modal-btn primary"
                  disabled={loading || !selectedRoutine}
                >
                  {loading ? 'Agregando...' : 'Agregar Ejercicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Routines;