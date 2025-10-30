import { useState, useEffect } from 'react';
import { routineService, exerciseService } from '../../services/api';
import Workouts from './Workouts';
import '../../styles/Routines.css';

const Routines = () => {
  // Estados principales
  const [routines, setRoutines] = useState([]);
  const [showAddRoutineModal, setShowAddRoutineModal] = useState(false);
  const [showExerciseLibraryModal, setShowExerciseLibraryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [allExercises, setAllExercises] = useState([]); // Lista de todos los ejercicios existentes
  
  // Estado para navegación a entrenamientos
  const [currentView, setCurrentView] = useState('routines'); // 'routines' | 'workouts'
  const [selectedRoutineForWorkouts, setSelectedRoutineForWorkouts] = useState(null);

  // Estados para nuevo rutina (solo campos que existen en BD)
  const [newRoutine, setNewRoutine] = useState({
    nombre: '',
    descripcion: ''
  });

  // Estados para nuevo ejercicio en biblioteca
  const [newExercise, setNewExercise] = useState({
    name: '',
    descripcion: '',
    categoria: ''
  });

  // Cargar rutinas y ejercicios al montar el componente
  useEffect(() => {
    loadRoutines();
    loadExercises();
  }, []);

  const loadRoutines = async () => {
    try {
      setLoading(true);
      const response = await routineService.getRoutines();
      console.log('📋 Response completa:', response);
      console.log('📋 Rutinas:', response.data);
      setRoutines(response.data || []);
    } catch (error) {
      console.error('Error cargando rutinas:', error);
      setErrors({ general: 'Error al cargar las rutinas' });
    } finally {
      setLoading(false);
    }
  };

  const loadExercises = async () => {
    try {
      const response = await exerciseService.getAllExercises();
      console.log('💪 Ejercicios cargados:', response.data);
      setAllExercises(response.data || []);
    } catch (error) {
      console.error('Error cargando ejercicios:', error);
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
      const routineData = {
        nombre: newRoutine.nombre.trim(),
        descripcion: newRoutine.descripcion.trim() || `Rutina de entrenamiento: ${newRoutine.nombre}`
      };

      const response = await routineService.createRoutine(routineData);
      
      alert('Rutina creada exitosamente');
      setNewRoutine({ 
        nombre: '',
        descripcion: ''
      });
      setShowAddRoutineModal(false);
      
      // Recargar rutinas
      await loadRoutines();
      
    } catch (error) {
      setErrors({ general: error.message || 'Error al crear la rutina' });
    } finally {
      setLoading(false);
    }
  };

  // Manejar eliminación de rutina
  const handleDeleteRoutine = async (routineId, routineName, e) => {
    // Prevenir que se abra la rutina al hacer clic en eliminar
    e.stopPropagation();
    
    const confirmDelete = window.confirm(
      `¿Estás seguro que deseas eliminar la rutina "${routineName}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmDelete) return;

    setLoading(true);
    setErrors({});

    try {
      await routineService.deleteRoutine(routineId);
      alert('Rutina eliminada exitosamente');
      
      // Recargar rutinas
      await loadRoutines();
      
    } catch (error) {
      console.error('Error eliminando rutina:', error);
      setErrors({ general: error.message || 'Error al eliminar la rutina' });
      alert('Error al eliminar la rutina. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Validaciones para nueva rutina (simplificado)
  const validateRoutine = () => {
    const newErrors = {};
    
    if (!newRoutine.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (newRoutine.nombre.trim().length < 3) {
      newErrors.nombre = 'Debe tener al menos 3 caracteres';
    }
    
    return newErrors;
  };

  // Funciones de navegación
  const handleRoutineClick = (routine) => {
    setSelectedRoutineForWorkouts(routine);
    setCurrentView('workouts');
  };

  const handleBackToRoutines = () => {
    setCurrentView('routines');
    setSelectedRoutineForWorkouts(null);
  };

  // Manejar creación de ejercicio en biblioteca
  const handleCreateExercise = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validaciones
    const newErrors = validateExercise();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const exerciseData = {
        name: newExercise.name.trim(),
        descripcion: newExercise.descripcion.trim(),
        categoria: newExercise.categoria.trim()
      };

      await exerciseService.createExerciseInLibrary(exerciseData);
      
      // Recargar la lista de ejercicios después de crear uno nuevo
      await loadExercises();
      
      alert('Ejercicio creado exitosamente');
      setNewExercise({
        name: '',
        descripcion: '',
        categoria: ''
      });
      setShowExerciseLibraryModal(false);
    } catch (error) {
      setErrors({ general: error.message || 'Error al crear el ejercicio' });
    } finally {
      setLoading(false);
    }
  };

  const validateExercise = () => {
    const newErrors = {};
    
    if (!newExercise.name.trim()) {
      newErrors.name = 'El nombre del ejercicio es requerido';
    } else {
      // Verificar si ya existe un ejercicio con exactamente el mismo nombre
      const exerciseExists = allExercises.some(
        exercise => exercise.name.toLowerCase() === newExercise.name.trim().toLowerCase()
      );
      
      if (exerciseExists) {
        newErrors.name = 'Ya existe un ejercicio con este nombre';
      }
    }
    
    if (!newExercise.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    }
    
    return newErrors;
  };

  // Renderizado condicional según la vista actual
  if (currentView === 'workouts' && selectedRoutineForWorkouts) {
    return (
      <Workouts 
        routineId={selectedRoutineForWorkouts.id}
        routineName={selectedRoutineForWorkouts.nombre}
        onBack={handleBackToRoutines}
      />
    );
  }

  return (
    <div className="routines-container">
      {/* Header con título y botón agregar */}
      <div className="routines-header">
        <div className="header-title">
          <h2>Rutinas</h2>
          <div className="header-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowExerciseLibraryModal(true)}
              aria-label="Crear Ejercicios"
              title="Crear Ejercicios"
              style={{ 
                padding: '0.75rem 1.75rem', 
                whiteSpace: 'nowrap',
                fontSize: '0.95rem',
                minWidth: 'fit-content'
              }}
            >
              Crear ejercicios
            </button>
            <button
              className="btn btn-success btn-icon"
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
        </div>
        <p className="header-description">
          Crea y gestiona tus rutinas de entrenamiento personalizadas
        </p>
      </div>

      {/* Lista de rutinas */}
      <div 
        className="routines-list"
        role={routines.length > 0 ? "list" : undefined}
        aria-label={routines.length > 0 ? `${routines.length} rutinas disponibles` : undefined}
      >
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
              className="btn btn-primary btn-lg"
              onClick={() => setShowAddRoutineModal(true)}
            >
              Crear Mi Primera Rutina
            </button>
          </div>
        ) : (
          routines.map(routine => (
            <div 
              key={routine.id} 
              className="routine-card"
              onClick={() => handleRoutineClick(routine)}
              role="listitem"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleRoutineClick(routine);
                }
              }}
              aria-label={`Rutina ${routine.nombre}`}
            >
              <h3 className="routine-name">{routine.nombre}</h3>
              <button
                className="btn-delete-routine"
                onClick={(e) => handleDeleteRoutine(routine.id, routine.nombre, e)}
                aria-label={`Eliminar rutina ${routine.nombre}`}
                title="Eliminar rutina"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal Crear Rutina */}
      {showAddRoutineModal && (
        <div className="modal-overlay" onClick={() => setShowAddRoutineModal(false)}>
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title-crear-rutina"
          >
            <div className="modal-header">
              <h3 id="modal-title-crear-rutina">Crear Nueva Rutina</h3>
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
                  value={newRoutine.nombre}
                  onChange={(e) => setNewRoutine({...newRoutine, nombre: e.target.value})}
                  className={`form-input ${errors.nombre ? 'error' : ''}`}
                  placeholder="Ej: Rutina de Fuerza, Cardio Matutino..."
                  aria-required="true"
                  autoFocus
                />
                {errors.nombre && (
                  <div className="error-message" role="alert">{errors.nombre}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="routineDescription" className="form-label">
                  Descripción
                </label>
                <textarea
                  id="routineDescription"
                  value={newRoutine.descripcion}
                  onChange={(e) => setNewRoutine({...newRoutine, descripcion: e.target.value})}
                  className="form-input"
                  placeholder="Describe tu rutina..."
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddRoutineModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? 'Creando...' : 'Crear Rutina'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Biblioteca de Ejercicios */}
      {showExerciseLibraryModal && (
        <div className="modal-overlay" onClick={() => setShowExerciseLibraryModal(false)}>
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <h3>Crear Nuevo Ejercicio</h3>
              <button
                className="modal-close"
                onClick={() => setShowExerciseLibraryModal(false)}
                aria-label="Cerrar modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleCreateExercise} className="modal-form">
                {errors.general && (
                  <div className="error-message global-error">
                    {errors.general}
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
                    onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Ej: Press de Banca, Sentadillas..."
                    autoFocus
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="exerciseDescription" className="form-label">
                    Descripción
                  </label>
                  <textarea
                    id="exerciseDescription"
                    value={newExercise.descripcion}
                    onChange={(e) => setNewExercise({...newExercise, descripcion: e.target.value})}
                    className="form-input"
                    placeholder="Describe el ejercicio..."
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="categoria" className="form-label">
                    Categoría *
                  </label>
                  <select
                    id="categoria"
                    value={newExercise.categoria}
                    onChange={(e) => setNewExercise({...newExercise, categoria: e.target.value})}
                    className={`form-input ${errors.categoria ? 'error' : ''}`}
                  >
                    <option value="">Selecciona una categoría...</option>
                    <option value="Espalda">Espalda</option>
                    <option value="Biceps">Bíceps</option>
                    <option value="Triceps">Tríceps</option>
                    <option value="Pecho">Pecho</option>
                    <option value="Abdominales">Abdominales</option>
                    <option value="Gluteos">Glúteos</option>
                    <option value="Cuádriceps">Cuádriceps</option>
                    <option value="Isquiotibiales">Isquiotibiales</option>
                    <option value="Pantorillas">Pantorillas</option>
                  </select>
                  {errors.categoria && (
                    <span className="error-message">{errors.categoria}</span>
                  )}
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowExerciseLibraryModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? 'Creando...' : 'Crear Ejercicio'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Routines;