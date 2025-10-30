import { useState, useEffect } from 'react';
import { workoutService } from '../../services/api';
import Exercises from './Exercises';
import '../../styles/Workouts.css';

const Workouts = ({ routineId, routineName, onBack }) => {
  // Estados principales
  const [workouts, setWorkouts] = useState([]);
  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Estado para navegación a ejercicios
  const [currentView, setCurrentView] = useState('workouts'); // 'workouts' | 'exercises'
  const [selectedWorkoutForExercises, setSelectedWorkoutForExercises] = useState(null);

  // Estado para nuevo entrenamiento
  const [newWorkout, setNewWorkout] = useState({
    name: ''
  });

  // Cargar entrenamientos al montar el componente
  useEffect(() => {
    if (routineId) {
      loadWorkouts();
    }
  }, [routineId]);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const response = await workoutService.getWorkoutsByRoutine(routineId);
      setWorkouts(response.workouts || []);
    } catch (error) {
      console.error('Error cargando entrenamientos:', error);
      setErrors({ general: 'Error al cargar los entrenamientos' });
    } finally {
      setLoading(false);
    }
  };

  // Manejar creación de entrenamiento
  const handleCreateWorkout = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateWorkout();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const workoutData = {
        name: newWorkout.name.trim()
      };

      await workoutService.createWorkout(routineId, workoutData);
      
      alert('Entrenamiento creado exitosamente');
      setNewWorkout({ name: '' });
      setShowAddWorkoutModal(false);
      
      // Recargar entrenamientos
      await loadWorkouts();
      
    } catch (error) {
      setErrors({ general: error.message || 'Error al crear el entrenamiento' });
    } finally {
      setLoading(false);
    }
  };

  // Validación para nuevo entrenamiento
  const validateWorkout = () => {
    const newErrors = {};
    
    if (!newWorkout.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (newWorkout.name.trim().length < 3) {
      newErrors.name = 'Debe tener al menos 3 caracteres';
    }
    
    return newErrors;
  };

  // Manejar click en entrenamiento
  const handleWorkoutClick = (workout) => {
    setSelectedWorkoutForExercises(workout);
    setCurrentView('exercises');
  };

  // Funciones de navegación
  const handleBackToWorkouts = () => {
    setCurrentView('workouts');
    setSelectedWorkoutForExercises(null);
  };

  // Renderizado condicional según la vista actual
  if (currentView === 'exercises' && selectedWorkoutForExercises) {
    return (
      <Exercises 
        routineId={routineId}
        workoutId={selectedWorkoutForExercises.id}
        workoutName={selectedWorkoutForExercises.name}
        onBack={handleBackToWorkouts}
      />
    );
  }

  return (
    <div className="workouts-container">
      {/* Header con título y botones */}
      <div className="workouts-header">
        <div className="header-title">
          <h2>Entrenamientos - {routineName}</h2>
          <div className="header-buttons">
            <button 
              className="back-btn"
              onClick={onBack}
              aria-label="Volver a rutinas"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <button
              className="add-workout-btn"
              onClick={() => setShowAddWorkoutModal(true)}
              aria-label="Agregar nuevo entrenamiento"
              title="Crear nuevo entrenamiento"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
        <p className="header-description">
          Entrenamientos de la rutina "{routineName}"
        </p>
      </div>

      {/* Lista de entrenamientos */}
      <div className="workouts-list">
        {loading && workouts.length === 0 ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando entrenamientos...</p>
          </div>
        ) : workouts.length === 0 ? (
          <div className="empty-state">
            <h3>No hay entrenamientos creados</h3>
            <p>Comienza creando tu primer entrenamiento para esta rutina</p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setShowAddWorkoutModal(true)}
            >
              Crear Mi Primer Entrenamiento
            </button>
          </div>
        ) : (
          workouts.map(workout => (
            <div 
              key={workout.id} 
              className="workout-card"
              onClick={() => handleWorkoutClick(workout)}
            >
              <h3 className="workout-name">{workout.name}</h3>
            </div>
          ))
        )}
      </div>

      {/* Modal Crear Entrenamiento */}
      {showAddWorkoutModal && (
        <div className="modal-overlay" onClick={() => setShowAddWorkoutModal(false)}>
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title-crear-entrenamiento"
          >
            <div className="modal-header">
              <h3 id="modal-title-crear-entrenamiento">Crear Nuevo Entrenamiento</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddWorkoutModal(false)}
                aria-label="Cerrar modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateWorkout} className="modal-form">
              {errors.general && (
                <div className="error-message global-error" role="alert">
                  {errors.general}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="workoutName" className="form-label">
                  Nombre del Entrenamiento
                </label>
                <input
                  type="text"
                  id="workoutName"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})}
                  placeholder="Ej: Día 1 - Pecho y Tríceps"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <span id="name-error" className="error-message" role="alert">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddWorkoutModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? 'Creando...' : 'Crear Entrenamiento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workouts;