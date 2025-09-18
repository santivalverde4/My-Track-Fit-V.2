import { useState, useEffect } from 'react';
import { exerciseService } from '../../services/api';
import '../../styles/Exercises.css';

const Exercises = ({ routineId, workoutId, workoutName, onBack }) => {
  // Estados principales
  const [exercises, setExercises] = useState([]);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Estados para el submenú de edición de ejercicio
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseSets, setExerciseSets] = useState([
    { weight: '', reps: '', difficulty: 5 }
  ]);

  // Estado para nuevo ejercicio
  const [newExercise, setNewExercise] = useState({
    name: ''
  });

  // Cargar ejercicios al montar el componente
  useEffect(() => {
    if (routineId && workoutId) {
      loadExercises();
    }
  }, [routineId, workoutId]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const response = await exerciseService.getExercisesByWorkout(routineId, workoutId);
      setExercises(response.exercises || []);
    } catch (error) {
      console.error('Error cargando ejercicios:', error);
      setErrors({ general: 'Error al cargar los ejercicios' });
    } finally {
      setLoading(false);
    }
  };

  // Manejar creación de ejercicio
  const handleCreateExercise = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateExercise();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const exerciseData = {
        name: newExercise.name.trim()
      };

      await exerciseService.createExercise(routineId, workoutId, exerciseData);
      
      alert('Ejercicio agregado exitosamente');
      setNewExercise({ name: '' });
      setShowAddExerciseModal(false);
      
      // Recargar ejercicios
      await loadExercises();
      
    } catch (error) {
      setErrors({ general: error.message || 'Error al crear el ejercicio' });
    } finally {
      setLoading(false);
    }
  };

  // Validación para nuevo ejercicio
  const validateExercise = () => {
    const newErrors = {};
    
    if (!newExercise.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (newExercise.name.trim().length < 3) {
      newErrors.name = 'Debe tener al menos 3 caracteres';
    }
    
    return newErrors;
  };

  // Manejar click en ejercicio para abrir submenú de edición
  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    // Cargar sets existentes del ejercicio o inicializar con uno vacío
    const existingSets = exercise.sets || [{ weight: '', reps: '', difficulty: 5 }];
    setExerciseSets(existingSets);
    setShowEditExerciseModal(true);
  };

  // Agregar nuevo set
  const addNewSet = () => {
    setExerciseSets([...exerciseSets, { weight: '', reps: '', difficulty: 5 }]);
  };

  // Eliminar set específico
  const removeSet = (index) => {
    if (exerciseSets.length > 1) {
      const newSets = exerciseSets.filter((_, i) => i !== index);
      setExerciseSets(newSets);
    }
  };

  // Actualizar datos de un set específico
  const updateSet = (index, field, value) => {
    const newSets = [...exerciseSets];
    newSets[index] = {
      ...newSets[index],
      [field]: field === 'difficulty' ? parseInt(value) : value
    };
    setExerciseSets(newSets);
  };

  // Manejar actualización de sets del ejercicio
  const handleUpdateExerciseSets = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateExerciseSets();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Aquí se actualizarían los sets del ejercicio
      console.log('Updating exercise sets:', {
        exerciseId: selectedExercise.id,
        sets: exerciseSets
      });
      
      alert('Sets del ejercicio actualizados exitosamente');
      setShowEditExerciseModal(false);
      setSelectedExercise(null);
      
      // Recargar ejercicios para mostrar cambios
      await loadExercises();
      
    } catch (error) {
      setErrors({ general: error.message || 'Error al actualizar el ejercicio' });
    } finally {
      setLoading(false);
    }
  };

  // Validación para sets del ejercicio
  const validateExerciseSets = () => {
    const newErrors = {};
    
    exerciseSets.forEach((set, index) => {
      if (set.weight && (isNaN(set.weight) || set.weight < 0)) {
        newErrors[`weight-${index}`] = 'El peso debe ser un número positivo';
      }
      
      if (set.reps && (isNaN(set.reps) || set.reps < 1 || set.reps > 100)) {
        newErrors[`reps-${index}`] = 'Las repeticiones deben estar entre 1 y 100';
      }
      
      if (set.difficulty < 1 || set.difficulty > 10) {
        newErrors[`difficulty-${index}`] = 'La dificultad debe estar entre 1 y 10';
      }
    });
    
    return newErrors;
  };

  return (
    <div className="exercises-container">
      {/* Header con título y botones */}
      <div className="exercises-header">
        <div className="header-title">
          <h2>Ejercicios - {workoutName}</h2>
          <div className="header-buttons">
            <button 
              className="back-btn"
              onClick={onBack}
              aria-label="Volver a entrenamientos"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <button
              className="add-exercise-btn"
              onClick={() => setShowAddExerciseModal(true)}
              aria-label="Agregar nuevo ejercicio"
              title="Crear nuevo ejercicio"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
        <p className="header-description">
          Ejercicios del entrenamiento "{workoutName}". Toca un ejercicio para ver y editarlo.
        </p>
      </div>

      {/* Lista de ejercicios */}
      <div className="exercises-list">
        {loading && exercises.length === 0 ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando ejercicios...</p>
          </div>
        ) : exercises.length === 0 ? (
          <div className="empty-state">
            <h3>No hay ejercicios agregados</h3>
            <p>Comienza agregando tu primer ejercicio a este entrenamiento</p>
            <button
              className="create-first-exercise-btn"
              onClick={() => setShowAddExerciseModal(true)}
            >
              Agregar Mi Primer Ejercicio
            </button>
          </div>
        ) : (
          exercises.map(exercise => (
            <div 
              key={exercise.id} 
              className="exercise-card"
              onClick={() => handleExerciseClick(exercise)}
            >
              <h3 className="exercise-name">{exercise.name}</h3>
            </div>
          ))
        )}
      </div>

      {/* Modal Crear Ejercicio */}
      {showAddExerciseModal && (
        <div className="modal-overlay" onClick={() => setShowAddExerciseModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Agregar Nuevo Ejercicio</h3>
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

            <form onSubmit={handleCreateExercise} className="modal-form">
              {errors.general && (
                <div className="error-message global-error" role="alert">
                  {errors.general}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="exerciseName" className="form-label">
                  Nombre del Ejercicio
                </label>
                <input
                  type="text"
                  id="exerciseName"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                  placeholder="Ej: Press de Banca, Sentadillas"
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
                  className="modal-btn secondary"
                  onClick={() => setShowAddExerciseModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modal-btn primary"
                  disabled={loading}
                >
                  {loading ? 'Agregando...' : 'Agregar Ejercicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Ejercicio */}
      {showEditExerciseModal && selectedExercise && (
        <div className="modal-overlay" onClick={() => setShowEditExerciseModal(false)}>
          <div className="modal-content exercise-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Sets - {selectedExercise.name}</h3>
              <button
                className="modal-close"
                onClick={() => setShowEditExerciseModal(false)}
                aria-label="Cerrar modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateExerciseSets} className="modal-form">
              {errors.general && (
                <div className="error-message global-error" role="alert">
                  {errors.general}
                </div>
              )}

              <div className="sets-container">
                {exerciseSets.map((set, index) => (
                  <div key={index} className="set-item">
                    <div className="set-header">
                      <h4>Set {index + 1}</h4>
                      {exerciseSets.length > 1 && (
                        <button
                          type="button"
                          className="remove-set-btn"
                          onClick={() => removeSet(index)}
                          aria-label={`Eliminar set ${index + 1}`}
                        >
                          ×
                        </button>
                      )}
                    </div>
                    
                    <div className="set-inputs">
                      <div className="form-group">
                        <label htmlFor={`weight-${index}`} className="form-label">
                          Peso (kg)
                        </label>
                        <input
                          type="number"
                          id={`weight-${index}`}
                          className={`form-input ${errors[`weight-${index}`] ? 'error' : ''}`}
                          value={set.weight}
                          onChange={(e) => updateSet(index, 'weight', e.target.value)}
                          step="0.5"
                          min="0"
                          placeholder="0"
                          aria-describedby={errors[`weight-${index}`] ? `weight-error-${index}` : undefined}
                        />
                        {errors[`weight-${index}`] && (
                          <span id={`weight-error-${index}`} className="error-message" role="alert">
                            {errors[`weight-${index}`]}
                          </span>
                        )}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor={`reps-${index}`} className="form-label">
                          Repeticiones
                        </label>
                        <input
                          type="number"
                          id={`reps-${index}`}
                          className={`form-input ${errors[`reps-${index}`] ? 'error' : ''}`}
                          value={set.reps}
                          onChange={(e) => updateSet(index, 'reps', e.target.value)}
                          min="1"
                          max="100"
                          placeholder="0"
                          aria-describedby={errors[`reps-${index}`] ? `reps-error-${index}` : undefined}
                        />
                        {errors[`reps-${index}`] && (
                          <span id={`reps-error-${index}`} className="error-message" role="alert">
                            {errors[`reps-${index}`]}
                          </span>
                        )}
                      </div>
                      
                      <div className="form-group difficulty-group">
                        <label htmlFor={`difficulty-${index}`} className="form-label">
                          Dificultad (1-10): {set.difficulty}
                        </label>
                        <input
                          type="range"
                          id={`difficulty-${index}`}
                          className={`form-range difficulty-slider ${errors[`difficulty-${index}`] ? 'error' : ''}`}
                          min="1"
                          max="10"
                          value={set.difficulty}
                          onChange={(e) => updateSet(index, 'difficulty', parseInt(e.target.value))}
                          aria-describedby={errors[`difficulty-${index}`] ? `difficulty-error-${index}` : undefined}
                        />
                        <div className="difficulty-scale">
                          <span>1 (Fácil)</span>
                          <span>10 (Difícil)</span>
                        </div>
                        {errors[`difficulty-${index}`] && (
                          <span id={`difficulty-error-${index}`} className="error-message" role="alert">
                            {errors[`difficulty-${index}`]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="sets-actions">
                <button
                  type="button"
                  className="add-set-btn"
                  onClick={addNewSet}
                >
                  + Agregar Set
                </button>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn secondary"
                  onClick={() => setShowEditExerciseModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modal-btn primary"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Sets'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercises;