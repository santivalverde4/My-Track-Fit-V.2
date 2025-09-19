import { useState, useEffect } from 'react';

const UserStatistics = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7days');
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    overview: {
      totalWorkouts: 24,
      totalHours: 36,
      avgCaloriesBurned: 425,
      currentStreak: 7,
      longestStreak: 14,
      favoriteExercise: 'Running'
    },
    fitness: {
      workoutsThisWeek: 5,
      workoutsLastWeek: 4,
      caloriesBurnedWeek: 2125,
      avgWorkoutDuration: 45,
      strengthWorkouts: 12,
      cardioWorkouts: 12,
      flexibilityWorkouts: 8
    },
    wellness: {
      avgSleep: 7.5,
      waterIntakeAvg: 7.2,
      stressLevel: 3.8,
      energyLevel: 7.8,
      moodScore: 8.2,
      injuryDays: 3
    },
    nutrition: {
      avgCalories: 1920,
      avgProtein: 142,
      avgCarbs: 235,
      avgFat: 68,
      mealsLogged: 156,
      targetDaysReached: 18
    }
  });

  const [chartData, setChartData] = useState({
    workouts: [
      { day: 'Lun: ', value: 1 },
      { day: 'Mar: ', value: 1 },
      { day: 'Mié: ', value: 0 },
      { day: 'Jue: ', value: 1 },
      { day: 'Vie: ', value: 1 },
      { day: 'Sáb: ', value: 1 },
      { day: 'Dom: ', value: 0 }
    ],
    calories: [
      { day: 'Lun: ', burned: 450, consumed: 1850 },
      { day: 'Mar: ', burned: 380, consumed: 1920 },
      { day: 'Mié: ', burned: 250, consumed: 2100 },
      { day: 'Jue: ', burned: 520, consumed: 1800 },
      { day: 'Vie: ', burned: 410, consumed: 1950 },
      { day: 'Sáb: ', burned: 380, consumed: 2200 },
      { day: 'Dom: ', burned: 200, consumed: 2050 }
    ],
    weight: [
      { week: 'Sem 1: ', value: 75.2 },
      { week: 'Sem 2: ', value: 74.8 },
      { week: 'Sem 3: ', value: 74.5 },
      { week: 'Sem 4: ', value: 74.1 }
    ]
  });

  useEffect(() => {
    loadStatistics();
  }, [timeRange]);

  const loadStatistics = async () => {
    setLoading(true);
    // Simular carga de datos basada en el rango de tiempo
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const renderOverviewTab = () => (
    <div className="stats-overview">
      {/* Quick Stats Cards */}
      <div className="quick-stats">
        <div className="stat-card primary">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h4>{statistics.overview.currentStreak}</h4>
            <p>Días consecutivos</p>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h4>{statistics.overview.totalWorkouts}</h4>
            <p>Entrenamientos totales</p>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h4>{statistics.overview.totalHours}h</h4>
            <p>Horas entrenadas</p>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h4>{statistics.overview.avgCaloriesBurned}</h4>
            <p>Kcal promedio</p>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="progress-section">
        <h4>Progreso Semanal</h4>
        <div className="progress-items">
          <div className="progress-item">
            <div className="progress-header">
              <span>Entrenamientos </span>
              <span>{statistics.fitness.workoutsThisWeek}/5</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(statistics.fitness.workoutsThisWeek / 5) * 100}%`,
                  backgroundColor: '#22c55e'
                }}
              />
            </div>
          </div>
          <div className="progress-item">
            <div className="progress-header">
              <span>Calorías quemadas </span>
              <span>{statistics.fitness.caloriesBurnedWeek}/2500</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(statistics.fitness.caloriesBurnedWeek / 2500) * 100}%`,
                  backgroundColor: '#f59e0b'
                }}
              />
            </div>
          </div>
          <div className="progress-item">
            <div className="progress-header">
              <span>Hidratación promedio </span>
              <span>{statistics.wellness.waterIntakeAvg}/8 vasos</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(statistics.wellness.waterIntakeAvg / 8) * 100}%`,
                  backgroundColor: '#3b82f6'
                }}
              />
            </div>
          </div>
        </div>
        <br></br>
      </div>

      {/* Activity Chart */}
      <div className="chart-section">
        <h4>Actividad de la Semana</h4>
    
        <div className="activity-chart">
          {chartData.workouts.map((day, index) => (
            <div key={index} className="chart-bar">
              <span className="bar-label">{day.day} </span>
              <span className="bar-value">{day.value} entrenamiento(s)</span>
              <div 
                className="bar"
                style={{ 
                  height: `${Math.max(day.value * 40, 4)}px`,
                  backgroundColor: day.value > 0 ? '#22c55e' : '#e5e7eb'
                }}
              />
            <br></br>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="achievements-section">
        <h4>Logros Recientes</h4>
        <div className="achievements-list">
          <div className="achievement-item">
            <span className="achievement-date">Hoy</span>
            <span className="achievement-icon"></span>
            <div>
              <h5>Semana Perfecta</h5>
              <p>Completaste 5 entrenamientos esta semana</p>
            </div>
            
          </div>
          <div className="achievement-item">
            <span className="achievement-date">Hoy</span>
            <span className="achievement-icon"></span>
            <div>
              <h5>Racha de 7 días</h5>
              <p>¡Excelente consistencia!</p>
            </div>
            
          </div>
          <div className="achievement-item">
            <span className="achievement-date">Ayer</span>
            <span className="achievement-icon"></span>
            <div>
              <h5>Hidratación Perfecta</h5>
              <p>8 vasos de agua por 3 días seguidos</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );

  const renderFitnessTab = () => (
    <div className="stats-fitness">
      <div className="fitness-metrics">
        <div className="metric-card">
          <h5>Entrenamientos</h5>
          <div className="metric-comparison">
            <span className="current-week"> Esta semana:  {statistics.fitness.workoutsThisWeek}</span>
            <span className="last-week"> Semana pasada:  {statistics.fitness.workoutsLastWeek}</span>
            <span className={`change ${statistics.fitness.workoutsThisWeek > statistics.fitness.workoutsLastWeek ? 'positive' : 'negative'}`}>
              {statistics.fitness.workoutsThisWeek >  statistics.fitness.workoutsLastWeek ? ' ↗ ' : ' ↘ '}
              {Math.abs(statistics.fitness.workoutsThisWeek - statistics.fitness.workoutsLastWeek)}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <h5>Duración promedio</h5>
          <div className="metric-value">
            {formatDuration(statistics.fitness.avgWorkoutDuration)}
          </div>
        </div>

        <div className="metric-card">
          <h5>Calorías quemadas</h5>
          <div className="metric-value">
            {statistics.fitness.caloriesBurnedWeek} kcal
          </div>
        </div>
      </div>

      <div className="workout-types">
        <h4>Distribución de Entrenamientos</h4>
        <div className="workout-distribution">
          <div className="workout-type">
            <div className="type-header">
              <span className="type-icon"></span>
              <span>Fuerza </span>
              <span className="type-count">{statistics.fitness.strengthWorkouts}</span>
            </div>
            <div className="type-bar">
              <div 
                className="type-fill strength"
                style={{ 
                  width: `${(statistics.fitness.strengthWorkouts / statistics.overview.totalWorkouts) * 100}%`
                }}
              />
            </div>
          </div>
          <div className="workout-type">
            <div className="type-header">
              <span className="type-icon"></span>
              <span>Cardio </span>
              <span className="type-count">{statistics.fitness.cardioWorkouts}</span>
            </div>
            <div className="type-bar">
              <div 
                className="type-fill cardio"
                style={{ 
                  width: `${(statistics.fitness.cardioWorkouts / statistics.overview.totalWorkouts) * 100}%`
                }}
              />
            </div>
          </div>
          <div className="workout-type">
            <div className="type-header">
              <span className="type-icon"></span>
              <span>Flexibilidad </span>
              <span className="type-count">{statistics.fitness.flexibilityWorkouts}</span>
            </div>
            <div className="type-bar">
              <div 
                className="type-fill flexibility"
                style={{ 
                  width: `${(statistics.fitness.flexibilityWorkouts / statistics.overview.totalWorkouts) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="calories-chart">
        <h4>Calorías: Quemadas vs Consumidas</h4>
        <div className="calories-bars">
          {chartData.calories.map((day, index) => (
            <div key={index} className="calorie-day">
              <div className="calorie-bars-container">
                <div 
                  className="calorie-bar burned"
                  style={{ height: `${(day.burned / 600) * 100}px` }}
                  title={`Quemadas: ${day.burned} kcal`}
                />
                <div 
                  className="calorie-bar consumed"
                  style={{ height: `${(day.consumed / 2500) * 100}px` }}
                  title={`Consumidas: ${day.consumed} kcal`}
                />
              </div>
              <span className="calorie-day-label">{day.day}</span>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color burned"></div>
            <span>Quemadas</span>
          </div>
          <div className="legend-item">
            <div className="legend-color consumed"></div>
            <span>Consumidas</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWellnessTab = () => (
    <div className="stats-wellness">
      <div className="wellness-metrics">
        <div className="wellness-card">
          <div className="wellness-icon"></div>
          <div className="wellness-content">
            <h5>Sueño promedio</h5>
            <p className="wellness-value">{statistics.wellness.avgSleep}h</p>
            <p className="wellness-status good">Excelente</p>
          </div>
        </div>

        <div className="wellness-card">
          <div className="wellness-icon"></div>
          <div className="wellness-content">
            <h5>Hidratación</h5>
            <p className="wellness-value">{statistics.wellness.waterIntakeAvg}/8 vasos</p>
            <p className="wellness-status good">Buena</p>
          </div>
        </div>

        <div className="wellness-card">
          <div className="wellness-icon"></div>
          <div className="wellness-content">
            <h5>Nivel de estrés</h5>
            <p className="wellness-value">{statistics.wellness.stressLevel}/10</p>
            <p className="wellness-status moderate">Moderado</p>
          </div>
        </div>

        <div className="wellness-card">
          <div className="wellness-icon"></div>
          <div className="wellness-content">
            <h5>Energía</h5>
            <p className="wellness-value">{statistics.wellness.energyLevel}/10</p>
            <p className="wellness-status good">Alta</p>
          </div>
        </div>

        <div className="wellness-card">
          <div className="wellness-icon"></div>
          <div className="wellness-content">
            <h5>Estado de ánimo</h5>
            <p className="wellness-value">{statistics.wellness.moodScore}/10</p>
            <p className="wellness-status excellent">Excelente</p>
          </div>
        </div>

        <div className="wellness-card">
          <div className="wellness-icon"></div>
          <div className="wellness-content">
            <h5>Días con lesiones</h5>
            <p className="wellness-value">{statistics.wellness.injuryDays}</p>
            <p className="wellness-status good">Pocos</p>
          </div>
        </div>
      </div>

    </div>
  );

  const renderNutritionTab = () => (
    <div className="stats-nutrition">
      <div className="nutrition-summary">
        <div className="summary-card">
          <h5>Promedio diario</h5>
          <div className="nutrition-values">
            <div className="nutrition-item">
              <span className="nutrition-icon"></span>
              <span>{statistics.nutrition.avgCalories} kcal</span>
            </div>
            <div className="nutrition-item">
              <span className="nutrition-icon"></span>
              <span>{statistics.nutrition.avgProtein}g proteína</span>
            </div>
            <div className="nutrition-item">
              <span className="nutrition-icon"></span>
              <span>{statistics.nutrition.avgCarbs}g carbohidratos</span>
            </div>
            <div className="nutrition-item">
              <span className="nutrition-icon"></span>
              <span>{statistics.nutrition.avgFat}g grasas</span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <h5>Registro de comidas</h5>
          <div className="registration-stats">
            <div className="stat-row">
              <span>Comidas registradas</span>
              <span className="stat-value">{statistics.nutrition.mealsLogged}</span>
            </div>
            <div className="stat-row">
              <span>Días con objetivos cumplidos</span>
              <span className="stat-value">{statistics.nutrition.targetDaysReached}/30</span>
            </div>
            <div className="stat-row">
              <span>Tasa de cumplimiento</span>
              <span className="stat-value">
                {Math.round((statistics.nutrition.targetDaysReached / 30) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="nutrition-breakdown">
        <h4>Distribución de Macronutrientes</h4>
        <div className="macro-chart">
          <div className="macro-item protein">
            <div className="macro-bar" style={{ width: '30%' }}></div>
            <span className="macro-label">Proteína (30%)</span>
          </div>
          <div className="macro-item carbs">
            <div className="macro-bar" style={{ width: '45%' }}></div>
            <span className="macro-label">Carbohidratos (45%)</span>
          </div>
          <div className="macro-item fat">
            <div className="macro-bar" style={{ width: '25%' }}></div>
            <span className="macro-label">Grasas (25%)</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="user-statistics">
      {/* Header */}
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
          <h2>Estadísticas y Progreso</h2>
          <p>Analiza tu rendimiento y progreso a lo largo del tiempo</p>
        </div>
      </header>

      {/* Time Range Selector */}
      <div className="time-controls">
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="time-selector"
        >
          <option value="7days">Últimos 7 días</option>
          <option value="30days">Últimos 30 días</option>
          <option value="90days">Últimos 3 meses</option>
          <option value="1year">Último año</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="stats-tabs">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
        >
          Resumen
        </button>
        <button 
          onClick={() => setActiveTab('fitness')}
          className={`tab-button ${activeTab === 'fitness' ? 'active' : ''}`}
        >
          Fitness
        </button>
        <button 
          onClick={() => setActiveTab('wellness')}
          className={`tab-button ${activeTab === 'wellness' ? 'active' : ''}`}
        >
          Bienestar
        </button>
        <button 
          onClick={() => setActiveTab('nutrition')}
          className={`tab-button ${activeTab === 'nutrition' ? 'active' : ''}`}
        >
          Nutrición
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {loading ? (
          <div className="loading-stats">
            <p>Cargando estadísticas...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'fitness' && renderFitnessTab()}
            {activeTab === 'wellness' && renderWellnessTab()}
            {activeTab === 'nutrition' && renderNutritionTab()}
          </>
        )}
      </div>
    </div>
  );
};

export default UserStatistics;