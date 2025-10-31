import { useState, useEffect } from 'react';
import { exerciseService } from '../../services/api';
import '../../styles/Exercises.css';

const Exercises = ({ routineId, workoutId, workoutName, onBack }) => {
  // Estados principales
  const [exercises, setExercises] = useState([]);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Estados para la biblioteca de ejercicios
  const [availableExercises, setAvailableExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  // Estados para el submenú de edición de ejercicio
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseSets, setExerciseSets] = useState([
    { weight: '', reps: '', difficulty: 5 }
  ]);

  // Estado para nuevo ejercicio
  const [newExercise, setNewExercise] = useState({
    exercise_id: '',
    series: 3,
    repeticiones: 10,
    peso: 0,
    descanso: 60,
    notas: ''
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
      setExercises(response.data || []);
    } catch (error) {
      console.error('Error cargando ejercicios:', error);
      setErrors({ general: 'Error al cargar los ejercicios' });
    } finally {
      setLoading(false);
    }
  };

  // Cargar biblioteca de ejercicios
  const loadExerciseLibrary = async () => {
    try {
      setLoadingLibrary(true);
      const response = await exerciseService.getAllExercises();
      setAvailableExercises(response.data || []);
    } catch (error) {
      console.error('Error cargando biblioteca:', error);
    } finally {
      setLoadingLibrary(false);
    }
  };

  // Buscar ejercicios en la biblioteca
  const handleSearchExercises = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadExerciseLibrary();
      return;
    }

    try {
      setLoadingLibrary(true);
      const response = await exerciseService.searchExercises(query);
      setAvailableExercises(response.data || []);
    } catch (error) {
      console.error('Error buscando ejercicios:', error);
    } finally {
      setLoadingLibrary(false);
    }
  };

  // Abrir modal y cargar biblioteca
  const handleOpenAddModal = () => {
    setShowAddExerciseModal(true);
    loadExerciseLibrary();
  };

  // Seleccionar ejercicio de la biblioteca
  const handleSelectExercise = (exercise) => {
    setNewExercise({
      ...newExercise,
      exercise_id: exercise.id
    });
  };

  // Manejar creación de ejercicio
  const handleCreateExercise = async (e) => {
    e.preventDefault();
    
    // Validar que se haya seleccionado un ejercicio
    if (!newExercise.exercise_id) {
      setErrors({ general: 'Debes seleccionar un ejercicio' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const exerciseData = {
        exercises: [{
          exercise_id: newExercise.exercise_id,
          series: 3,
          repeticiones: 10,
          peso: 0,
          descanso: 60,
          notas: '',
          orden: 1
        }]
      };

      await exerciseService.createExercise(routineId, workoutId, exerciseData);
      
      alert('Ejercicio agregado exitosamente');
      setNewExercise({
        exercise_id: '',
        series: 3,
        repeticiones: 10,
        peso: 0,
        descanso: 60,
        notas: ''
      });
      setSearchQuery('');
      setShowAddExerciseModal(false);
      
      // Recargar ejercicios
      await loadExercises();
      
    } catch (error) {
      setErrors({ general: error.message || 'Error al crear el ejercicio' });
    } finally {
      setLoading(false);
    }
  };

  // Manejar eliminación de ejercicio del entrenamiento
  const handleDeleteExercise = async () => {
    if (!selectedExercise) return;
    
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar "${selectedExercise.exercises?.name || 'este ejercicio'}" del entrenamiento?`
    );
    
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await exerciseService.deleteExercise(routineId, workoutId, selectedExercise.id);
      
      alert('Ejercicio eliminado exitosamente');
      setShowEditExerciseModal(false);
      setSelectedExercise(null);
      
      // Recargar ejercicios
      await loadExercises();
    } catch (error) {
      setErrors({ general: error.message || 'Error al eliminar el ejercicio' });
    } finally {
      setLoading(false);
    }
  };

  // Manejar click en ejercicio para abrir submenú de edición
  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    // Cargar sets existentes del ejercicio desde notas (JSON) o inicializar con uno vacío
    let existingSets = [{ weight: '', reps: '', difficulty: 5 }];
    
    if (exercise.notas) {
      try {
        const parsedSets = JSON.parse(exercise.notas);
        if (Array.isArray(parsedSets) && parsedSets.length > 0) {
          existingSets = parsedSets;
        }
      } catch (error) {
        console.error('Error parseando sets guardados:', error);
      }
    }
    
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
      // Preparar los datos del ejercicio actualizado
      const exerciseData = {
        series: exerciseSets.length,
        repeticiones: exerciseSets[0]?.reps || 10,
        peso: exerciseSets[0]?.weight || 0,
        descanso: 60,
        notas: JSON.stringify(exerciseSets) // Guardamos todos los sets como JSON en notas
      };

      console.log('Guardando sets para ejercicio:', selectedExercise.id, exerciseData);
      const response = await exerciseService.updateExercise(selectedExercise.id, exerciseData);
      console.log('Respuesta del servidor:', response);
      
      alert('Sets del ejercicio actualizados exitosamente');
      setShowEditExerciseModal(false);
      setSelectedExercise(null);
      
      // Recargar ejercicios para mostrar cambios
      await loadExercises();
      
    } catch (error) {
      console.error('Error al actualizar sets:', error);
      setErrors({ general: error.message || 'Error al actualizar el ejercicio' });
      alert('Error al actualizar el ejercicio: ' + (error.message || 'Error desconocido'));
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
              className="btn btn-secondary btn-icon"
              onClick={onBack}
              aria-label="Volver a entrenamientos"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <button
              className="btn btn-success btn-icon btn-add"
              onClick={handleOpenAddModal}
              aria-label="Agregar nuevo ejercicio"
              title="Crear nuevo ejercicio"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              className="btn btn-primary btn-lg"
              onClick={handleOpenAddModal}
            >
              Agregar Mi Primer Ejercicio
            </button>
          </div>
        ) : (
          exercises.map(exercise => {
            return (
              <div 
                key={exercise.id} 
                className="exercise-card"
              >
                <div onClick={() => handleExerciseClick(exercise)} style={{ flex: 1, cursor: 'pointer' }}>
                  <h3 className="exercise-name">
                    {exercise.exercises?.name || exercise.exercises?.nombre || exercise.exercise_name || exercise.nombre || exercise.name || 'Ejercicio sin nombre'}
                  </h3>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExercise(exercise);
                    handleDeleteExercise();
                  }}
                  aria-label="Eliminar ejercicio"
                  title="Eliminar ejercicio"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Agregar Ejercicio desde Biblioteca */}
      {showAddExerciseModal && (
        <div className="modal-overlay" onClick={() => setShowAddExerciseModal(false)}>
          <div 
            className="modal-content modal-library" 
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title-agregar-ejercicio"
          >
            <div className="modal-header">
              <h3 id="modal-title-agregar-ejercicio">Biblioteca de Ejercicios</h3>
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

            <div className="modal-body">
              {/* Buscador */}
              <div className="search-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar ejercicios..."
                  value={searchQuery}
                  onChange={(e) => handleSearchExercises(e.target.value)}
                />
              </div>

              {/* Lista de ejercicios */}
              <div className="exercise-library-list">
                {loadingLibrary ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Cargando ejercicios...</p>
                  </div>
                ) : availableExercises.length === 0 ? (
                  <div className="empty-state">
                    <p>No se encontraron ejercicios</p>
                  </div>
                ) : (
                  availableExercises.map(exercise => (
                    <div
                      key={exercise.id}
                      className={`library-exercise-card ${newExercise.exercise_id === exercise.id ? 'selected' : ''}`}
                      onClick={() => handleSelectExercise(exercise)}
                    >
                      <div className="exercise-info">
                        <h4>{exercise.nombre || exercise.name}</h4>
                      </div>
                      {newExercise.exercise_id === exercise.id && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Botones de acción */}
              {errors.general && (
                <div className="error-message global-error" role="alert">
                  {errors.general}
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddExerciseModal(false);
                    setNewExercise({
                      exercise_id: '',
                      series: 3,
                      repeticiones: 10,
                      peso: 0,
                      descanso: 60,
                      notas: ''
                    });
                    setSearchQuery('');
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleCreateExercise}
                  disabled={loading || !newExercise.exercise_id}
                >
                  {loading ? 'Agregando...' : 'Agregar al Entrenamiento'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Ejercicio */}
      {showEditExerciseModal && selectedExercise && (
        <div className="modal-overlay" onClick={() => setShowEditExerciseModal(false)}>
          <div 
            className="modal-content exercise-modal" 
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title-editar-ejercicio"
          >
            <div className="modal-header">
              <h3 id="modal-title-editar-ejercicio">
                Editar Sets - {selectedExercise.exercises?.name || selectedExercise.exercises?.nombre || selectedExercise.exercise_name || selectedExercise.nombre || selectedExercise.name || 'Ejercicio'}
              </h3>
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
                          className="btn btn-danger btn-sm"
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
                  className="btn btn-primary"
                  onClick={addNewSet}
                >
                  + Agregar Set
                </button>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditExerciseModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
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