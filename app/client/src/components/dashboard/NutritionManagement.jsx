import { useState, useEffect } from 'react';

const NutritionManagement = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('today');
  const [todayMeals, setTodayMeals] = useState([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nutritionGoals, setNutritionGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
    water: 8
  });
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0
  });

  const [mealForm, setMealForm] = useState({
    type: 'breakfast',
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    portion: '',
    notes: ''
  });

  const mealTypes = [
    { value: 'breakfast', label: 'Desayuno'},
    { value: 'lunch', label: 'Almuerzo'  },
    { value: 'dinner', label: 'Cena'  },
    { value: 'snack', label: 'Merienda'  }
  ];

  const commonFoods = [
    { name: 'Pechuga de Pollo (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: 'Arroz Blanco (1 taza)', calories: 205, protein: 4.3, carbs: 45, fat: 0.4 },
    { name: 'Huevo (1 unidad)', calories: 70, protein: 6, carbs: 0.6, fat: 5 },
    { name: 'Plátano (1 mediano)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
    { name: 'Avena (1 taza)', calories: 307, protein: 10.7, carbs: 54.8, fat: 5.3 },
    { name: 'Salmón (100g)', calories: 208, protein: 20, carbs: 0, fat: 13 }
  ];

  useEffect(() => {
    loadTodayMeals();
  }, []);

  useEffect(() => {
    calculateDailyTotals();
  }, [todayMeals]);

  const loadTodayMeals = async () => {
    setLoading(true);
    try {
      // Simular datos de ejemplo
      setTimeout(() => {
        const mockMeals = [
          {
            id: 1,
            type: 'breakfast',
            name: 'Avena con Frutas',
            calories: 350,
            protein: 12,
            carbs: 65,
            fat: 8,
            portion: '1 tazón',
            time: '08:00',
            notes: 'Con plátano y fresas'
          },
          {
            id: 2,
            type: 'lunch',
            name: 'Pollo con Arroz',
            calories: 520,
            protein: 45,
            carbs: 55,
            fat: 12,
            portion: '1 plato',
            time: '13:30',
            notes: 'Con ensalada verde'
          },
          {
            id: 3,
            type: 'snack',
            name: 'Yogur Griego',
            calories: 150,
            protein: 15,
            carbs: 12,
            fat: 5,
            portion: '1 vaso',
            time: '16:00',
            notes: 'Con nueces'
          }
        ];
        setTodayMeals(mockMeals);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error loading meals:', error);
      setLoading(false);
    }
  };

  const calculateDailyTotals = () => {
    const totals = todayMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    // Simular vasos de agua consumidos
    totals.water = 6;
    setDailyTotals(totals);
  };

  const handleMealFormChange = (e) => {
    const { name, value } = e.target;
    setMealForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fillFromCommonFood = (food) => {
    setMealForm(prev => ({
      ...prev,
      name: food.name,
      calories: food.calories.toString(),
      protein: food.protein.toString(),
      carbs: food.carbs.toString(),
      fat: food.fat.toString(),
      portion: '1 porción'
    }));
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      setTimeout(() => {
        const newMeal = {
          id: Date.now(),
          ...mealForm,
          calories: parseFloat(mealForm.calories) || 0,
          protein: parseFloat(mealForm.protein) || 0,
          carbs: parseFloat(mealForm.carbs) || 0,
          fat: parseFloat(mealForm.fat) || 0,
          time: new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };

        setTodayMeals(prev => [...prev, newMeal]);
        setMealForm({
          type: 'breakfast',
          name: '',
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          portion: '',
          notes: ''
        });
        setShowAddMeal(false);
        setLoading(false);
      }, 600);
    } catch (error) {
      console.error('Error adding meal:', error);
      setLoading(false);
    }
  };

  const getProgressPercentage = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressColor = (current, goal) => {
    const percentage = (current / goal) * 100;
    if (percentage < 50) return '#ef4444';
    if (percentage < 80) return '#f59e0b';
    if (percentage <= 100) return '#22c55e';
    return '#3b82f6';
  };

  const deleteMeal = (mealId) => {
    setTodayMeals(prev => prev.filter(meal => meal.id !== mealId));
  };

  const updateWaterIntake = (change) => {
    setDailyTotals(prev => ({
      ...prev,
      water: Math.max(0, Math.min(prev.water + change, 15))
    }));
  };

  const renderTodayTab = () => (
    <div className="nutrition-today">
      {/* Progress Cards */}
      <div className="progress-cards">
        <div className="progress-card calories">
          <div className="progress-header">
            <span className="progress-icon"></span>
            <div>
              <h4>Calorías</h4>
              <p>{dailyTotals.calories} / {nutritionGoals.calories} kcal</p>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${getProgressPercentage(dailyTotals.calories, nutritionGoals.calories)}%`,
                backgroundColor: getProgressColor(dailyTotals.calories, nutritionGoals.calories)
              }}
            />
          </div>
        </div>

        <div className="progress-card protein">
          <div className="progress-header">
            <span className="progress-icon"></span>
            <div>
              <h4>Proteína</h4>
              <p>{dailyTotals.protein}g / {nutritionGoals.protein}g</p>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${getProgressPercentage(dailyTotals.protein, nutritionGoals.protein)}%`,
                backgroundColor: getProgressColor(dailyTotals.protein, nutritionGoals.protein)
              }}
            />
          </div>
        </div>

        <div className="progress-card carbs">
          <div className="progress-header">
            <span className="progress-icon"></span>
            <div>
              <h4>Carbohidratos</h4>
              <p>{dailyTotals.carbs}g / {nutritionGoals.carbs}g</p>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${getProgressPercentage(dailyTotals.carbs, nutritionGoals.carbs)}%`,
                backgroundColor: getProgressColor(dailyTotals.carbs, nutritionGoals.carbs)
              }}
            />
          </div>
        </div>

        <div className="progress-card fat">
          <div className="progress-header">
            <span className="progress-icon"></span>
            <div>
              <h4>Grasas</h4>
              <p>{dailyTotals.fat}g / {nutritionGoals.fat}g</p>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${getProgressPercentage(dailyTotals.fat, nutritionGoals.fat)}%`,
                backgroundColor: getProgressColor(dailyTotals.fat, nutritionGoals.fat)
              }}
            />
          </div>
        </div>
      </div>

      {/* Water Intake */}
      <div className="water-tracker">
        <div className="water-header">
          <h4> Hidratación</h4>
          <p>{dailyTotals.water} / {nutritionGoals.water} vasos</p>
        </div>
        
        <div className="water-actions">
          <button 
            onClick={() => updateWaterIntake(-1)}
            className="water-button minus"
            disabled={dailyTotals.water <= 0}
          >
            -
          </button>
          <button 
            onClick={() => updateWaterIntake(1)}
            className="water-button plus"
            disabled={dailyTotals.water >= 15}
          >
            +
          </button>
        </div>
      </div>
      <br></br>

      {/* Add Meal Button */}
      <button 
        onClick={() => setShowAddMeal(true)}
        className="add-meal-button"
        disabled={loading}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14m7-7H5"/>
        </svg>
        Agregar Comida
      </button>

      {/* Meals List */}
      <div className="meals-section">
        <h4>Comidas de Hoy</h4>
        {todayMeals.length === 0 ? (
          <div className="empty-meals">
            <span className="empty-icon"></span>
            <p>No has registrado comidas hoy</p>
          </div>
        ) : (
          <div className="meals-list">
            {mealTypes.map(mealType => {
              const mealsOfType = todayMeals.filter(meal => meal.type === mealType.value);
              return (
                <div key={mealType.value} className="meal-section">
                  <h5 className="meal-type-title">
                    {mealType.icon} {mealType.label}
                  </h5>
                  {mealsOfType.length === 0 ? (
                    <p className="no-meals">No hay comidas registradas</p>
                  ) : (
                    <div className="meal-items">
                      {mealsOfType.map(meal => (
                        <div key={meal.id} className="meal-item">
                          <div className="meal-info">
                            <div className="meal-main">
                              <h6>{meal.name}</h6>
                              <span className="meal-time">{meal.time}</span>
                            </div>
                            <div className="meal-macros">
                              <span>{meal.calories} kcal</span>
                              <span>P: {meal.protein}g</span>
                              <span>C: {meal.carbs}g</span>
                              <span>G: {meal.fat}g</span>
                            </div>
                            {meal.portion && (
                              <p className="meal-portion">Porción: {meal.portion}</p>
                            )}
                            {meal.notes && (
                              <p className="meal-notes">{meal.notes}</p>
                            )}
                          </div>
                          <button
                            onClick={() => deleteMeal(meal.id)}
                            className="delete-meal-button"
                            aria-label={`Eliminar ${meal.name}`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3,6 5,6 21,6"/>
                              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderGoalsTab = () => (
    <div className="nutrition-goals">
      <h4>Objetivos Nutricionales</h4>
      <div className="goals-form">
        <div className="goal-item">
          <label>Calorías diarias</label>
          <div className="goal-input">
            <input 
              type="number" 
              value={nutritionGoals.calories}
              onChange={(e) => setNutritionGoals(prev => ({
                ...prev, 
                calories: parseInt(e.target.value) || 0
              }))}
            />
            <span>kcal</span>
          </div>
        </div>
        <div className="goal-item">
          <label>Proteína</label>
          <div className="goal-input">
            <input 
              type="number" 
              value={nutritionGoals.protein}
              onChange={(e) => setNutritionGoals(prev => ({
                ...prev, 
                protein: parseInt(e.target.value) || 0
              }))}
            />
            <span>g</span>
          </div>
        </div>
        <div className="goal-item">
          <label>Carbohidratos</label>
          <div className="goal-input">
            <input 
              type="number" 
              value={nutritionGoals.carbs}
              onChange={(e) => setNutritionGoals(prev => ({
                ...prev, 
                carbs: parseInt(e.target.value) || 0
              }))}
            />
            <span>g</span>
          </div>
        </div>
        <div className="goal-item">
          <label>Grasas</label>
          <div className="goal-input">
            <input 
              type="number" 
              value={nutritionGoals.fat}
              onChange={(e) => setNutritionGoals(prev => ({
                ...prev, 
                fat: parseInt(e.target.value) || 0
              }))}
            />
            <span>g</span>
          </div>
        </div>
        <div className="goal-item">
          <label>Vasos de agua</label>
          <div className="goal-input">
            <input 
              type="number" 
              value={nutritionGoals.water}
              onChange={(e) => setNutritionGoals(prev => ({
                ...prev, 
                water: parseInt(e.target.value) || 0
              }))}
            />
            <span>vasos</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="nutrition-management">
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
          <h2>Gestión de Nutrición</h2>
          <p>Controla tu alimentación y alcanza tus objetivos</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="nutrition-tabs">
        <button 
          onClick={() => setActiveTab('today')}
          className={`tab-button ${activeTab === 'today' ? 'active' : ''}`}
        >
          Hoy
        </button>
        <button 
          onClick={() => setActiveTab('goals')}
          className={`tab-button ${activeTab === 'goals' ? 'active' : ''}`}
        >
          Objetivos
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'today' && renderTodayTab()}
        {activeTab === 'goals' && renderGoalsTab()}
      </div>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="modal-overlay" onClick={() => setShowAddMeal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Agregar Comida</h4>
              <button 
                onClick={() => setShowAddMeal(false)}
                className="modal-close"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddMeal} className="meal-form">
              <div className="form-group">
                <label htmlFor="mealType">Tipo de Comida</label>
                <select
                  id="mealType"
                  name="type"
                  value={mealForm.type}
                  onChange={handleMealFormChange}
                  className="form-input"
                >
                  {mealTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="common-foods">
                <label>Alimentos Comunes:</label>
                <div className="food-buttons">
                  {commonFoods.map((food, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => fillFromCommonFood(food)}
                      className="food-button"
                    >
                      {food.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="mealName">Nombre del Alimento</label>
                <input
                  type="text"
                  id="mealName"
                  name="name"
                  value={mealForm.name}
                  onChange={handleMealFormChange}
                  className="form-input"
                  placeholder="Ej: Ensalada César"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="calories">Calorías</label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    value={mealForm.calories}
                    onChange={handleMealFormChange}
                    className="form-input"
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="portion">Porción</label>
                  <input
                    type="text"
                    id="portion"
                    name="portion"
                    value={mealForm.portion}
                    onChange={handleMealFormChange}
                    className="form-input"
                    placeholder="1 plato, 100g..."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="protein">Proteína (g)</label>
                  <input
                    type="number"
                    id="protein"
                    name="protein"
                    value={mealForm.protein}
                    onChange={handleMealFormChange}
                    className="form-input"
                    placeholder="0"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="carbs">Carbohidratos (g)</label>
                  <input
                    type="number"
                    id="carbs"
                    name="carbs"
                    value={mealForm.carbs}
                    onChange={handleMealFormChange}
                    className="form-input"
                    placeholder="0"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fat">Grasas (g)</label>
                  <input
                    type="number"
                    id="fat"
                    name="fat"
                    value={mealForm.fat}
                    onChange={handleMealFormChange}
                    className="form-input"
                    placeholder="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notas</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={mealForm.notes}
                  onChange={handleMealFormChange}
                  className="form-input"
                  rows="2"
                  placeholder="Ingredientes extras, método de cocción..."
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowAddMeal(false)}
                  className="form-button secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="form-button primary"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionManagement;