import { useState, useEffect, useRef } from 'react';
import { nutritionService } from '../../services/api';
import '../../styles/GlobalStyles.css';
import '../../styles/WellnessComponents.css';

const NutritionManagement = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('today');
  const [todayMeals, setTodayMeals] = useState([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [loading, setLoading] = useState(false);
  const addMealFormRef = useRef(null); // Referencia al formulario
  
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
    { value: 'breakfast', label: 'Desayuno', icon: 'bi-sunrise' },
    { value: 'lunch', label: 'Almuerzo', icon: 'bi-sun' },
    { value: 'dinner', label: 'Cena', icon: 'bi-moon' },
    { value: 'snack', label: 'Merienda', icon: 'bi-cup-hot' }
  ];

  const commonFoods = [
    { name: 'Pechuga de Pollo (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: 'Arroz Blanco (1 taza)', calories: 205, protein: 4.3, carbs: 45, fat: 0.4 },
    { name: 'Aguacate (½ unidad)', calories: 160, protein: 2, carbs: 8.5, fat: 15 },
    { name: 'Huevo (1 unidad)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
    { name: 'Plátano (1 unidad)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
    { name: 'Avena (½ taza)', calories: 150, protein: 5, carbs: 27, fat: 3 }
  ];

  useEffect(() => {
    loadTodayMeals();
    loadNutritionGoals();
  }, []);

  useEffect(() => {
    calculateDailyTotals();
  }, [todayMeals]);

  const loadNutritionGoals = async () => {
    try {
      const response = await nutritionService.getNutritionGoals();
      if (response.goals) {
        setNutritionGoals(response.goals);
      }
    } catch (error) {
      console.error('Error al cargar objetivos:', error);
      // Usar valores por defecto si falla
    }
  };

  const loadTodayMeals = async () => {
    setLoading(true);
    try {
      const response = await nutritionService.getTodayMeals();
      
      // El backend ahora devuelve { data: { meals, water, metrics } }
      if (response.data) {
        setTodayMeals(response.data.meals || []);
        
        // Actualizar vasos de agua si vienen en la respuesta
        if (response.data.water !== undefined) {
          setDailyTotals(prev => ({ ...prev, water: response.data.water }));
        }
      } else {
        // Fallback por si viene en formato antiguo
        setTodayMeals(response.meals || []);
        if (response.totals) {
          setDailyTotals(response.totals);
        }
      }
    } catch (error) {
      console.error('Error al cargar comidas:', error);
      setTodayMeals([]);
    } finally {
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
    
    setDailyTotals({ ...totals, water: dailyTotals.water });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMealForm(prev => ({ ...prev, [name]: value }));
  };

  const handleQuickAdd = (food) => {
    setMealForm(prev => ({
      ...prev,
      name: food.name,
      calories: food.calories.toString(),
      protein: food.protein.toString(),
      carbs: food.carbs.toString(),
      fat: food.fat.toString()
    }));
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const mealData = {
        type: mealForm.type,
        name: mealForm.name,
        calories: parseFloat(mealForm.calories) || 0,
        protein: parseFloat(mealForm.protein) || 0,
        carbs: parseFloat(mealForm.carbs) || 0,
        fat: parseFloat(mealForm.fat) || 0,
        portion: mealForm.portion,
        notes: mealForm.notes,
        fecha: new Date().toISOString().split('T')[0]
      };

      const response = await nutritionService.addMeal(mealData);
      
      // Agregar la nueva comida a la lista
      setTodayMeals(prev => [...prev, response.data]);
      
      // Resetear formulario
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
      console.log('Comida registrada exitosamente');
    } catch (error) {
      console.error('Error al agregar comida:', error);
      // Fallback: agregar localmente si falla la API
      const newMeal = {
        id: Date.now(),
        type: mealForm.type,
        name: mealForm.name,
        calories: parseFloat(mealForm.calories) || 0,
        protein: parseFloat(mealForm.protein) || 0,
        carbs: parseFloat(mealForm.carbs) || 0,
        fat: parseFloat(mealForm.fat) || 0,
        portion: mealForm.portion,
        notes: mealForm.notes,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      
      setTodayMeals(prev => [...prev, newMeal]);
      setMealForm({
        type: 'breakfast', name: '', calories: '', protein: '',
        carbs: '', fat: '', portion: '', notes: ''
      });
      setShowAddMeal(false);
    } finally {
      setLoading(false);
    }
  };

  const deleteMeal = async (mealId) => {
    if (!window.confirm('¿Eliminar esta comida del registro?')) return;
    
    try {
      await nutritionService.deleteMeal(mealId);
      
      // Remover del estado
      setTodayMeals(prev => prev.filter(meal => meal.id !== mealId));
      console.log('Comida eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar comida:', error);
      // Eliminar localmente aunque falle la API
      setTodayMeals(prev => prev.filter(meal => meal.id !== mealId));
    }
  };

  const addWaterGlass = async () => {
    const newTotal = Math.min(dailyTotals.water + 1, 15);
    
    try {
      await nutritionService.updateWaterIntake(newTotal);
      setDailyTotals(prev => ({ ...prev, water: newTotal }));
    } catch (error) {
      console.error('Error al actualizar agua:', error);
      // Actualizar localmente aunque falle
      setDailyTotals(prev => ({ ...prev, water: newTotal }));
    }
  };

  const removeWaterGlass = async () => {
    if (dailyTotals.water <= 0) return;
    
    const newTotal = Math.max(dailyTotals.water - 1, 0);
    
    try {
      await nutritionService.updateWaterIntake(newTotal);
      setDailyTotals(prev => ({ ...prev, water: newTotal }));
    } catch (error) {
      console.error('Error al actualizar agua:', error);
      // Actualizar localmente aunque falle
      setDailyTotals(prev => ({ ...prev, water: newTotal }));
    }
  };

  const handleAddMealClick = () => {
    setShowAddMeal(true);
    // Esperar un momento para que el DOM se actualice y luego hacer scroll
    setTimeout(() => {
      if (addMealFormRef.current) {
        addMealFormRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  const getProgressPercentage = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getMealIcon = (type) => {
    const meal = mealTypes.find(m => m.value === type);
    return meal ? meal.icon : 'bi-egg-fried';
  };

  return (
    <div className="nutrition-management">
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
            <i className="bi bi-egg-fried"></i>
            Nutrición
          </h2>
          <button
            onClick={() => showAddMeal ? setShowAddMeal(false) : handleAddMealClick()}
            className="btn btn-success btn-icon"
            aria-label="Agregar comida"
          >
            <i className={showAddMeal ? "bi bi-x-lg" : "bi bi-plus-lg"}></i>
          </button>
        </div>
        <p className="header-subtitle">
          Registra tus comidas y monitorea tu nutrición diaria
        </p>
      </header>

      {/* Resumen nutricional del día */}
      <div className="nutrition-summary">
        <h3>
          <i className="bi bi-calendar-day"></i>
          Resumen de Hoy
        </h3>
        
        <div className="macro-grid">
          <div className="macro-card calories">
            <div className="macro-icon">
              <i className="bi bi-fire"></i>
            </div>
            <div className="macro-info">
              <span className="macro-label">Calorías</span>
              <div className="macro-progress">
                <div 
                  className="macro-bar"
                  style={{ width: `${getProgressPercentage(dailyTotals.calories, nutritionGoals.calories)}%` }}
                />
              </div>
              <span className="macro-values">
                {dailyTotals.calories} / {nutritionGoals.calories} kcal
              </span>
            </div>
          </div>

          <div className="macro-card protein">
            <div className="macro-icon">
              <i className="bi bi-egg"></i>
            </div>
            <div className="macro-info">
              <span className="macro-label">Proteínas</span>
              <div className="macro-progress">
                <div 
                  className="macro-bar"
                  style={{ width: `${getProgressPercentage(dailyTotals.protein, nutritionGoals.protein)}%` }}
                />
              </div>
              <span className="macro-values">
                {dailyTotals.protein}g / {nutritionGoals.protein}g
              </span>
            </div>
          </div>

          <div className="macro-card carbs">
            <div className="macro-icon">
              <i className="bi bi-bowl-food"></i>
            </div>
            <div className="macro-info">
              <span className="macro-label">Carbohidratos</span>
              <div className="macro-progress">
                <div 
                  className="macro-bar"
                  style={{ width: `${getProgressPercentage(dailyTotals.carbs, nutritionGoals.carbs)}%` }}
                />
              </div>
              <span className="macro-values">
                {dailyTotals.carbs}g / {nutritionGoals.carbs}g
              </span>
            </div>
          </div>

          <div className="macro-card fats">
            <div className="macro-icon">
              <i className="bi bi-droplet"></i>
            </div>
            <div className="macro-info">
              <span className="macro-label">Grasas</span>
              <div className="macro-progress">
                <div 
                  className="macro-bar"
                  style={{ width: `${getProgressPercentage(dailyTotals.fat, nutritionGoals.fat)}%` }}
                />
              </div>
              <span className="macro-values">
                {dailyTotals.fat}g / {nutritionGoals.fat}g
              </span>
            </div>
          </div>
        </div>

        {/* Contador de agua */}
        <div className="water-tracker">
          <div className="water-header">
            <i className="bi bi-droplet-fill"></i>
            <span>Hidratación</span>
            <span className="water-count">{dailyTotals.water} / {nutritionGoals.water} vasos</span>
          </div>
          <div className="water-glasses">
            {[...Array(nutritionGoals.water)].map((_, i) => (
              <div
                key={i}
                className={`water-glass ${i < dailyTotals.water ? 'filled' : ''}`}
              >
                <i className="bi bi-droplet-fill"></i>
              </div>
            ))}
          </div>
          <div className="btn-group justify-center">
            <button 
              onClick={removeWaterGlass} 
              className="btn btn-danger btn-sm" 
              disabled={dailyTotals.water === 0}
              aria-label="Quitar un vaso de agua"
            >
              <i className="bi bi-dash-circle"></i>
            </button>
            <button 
              onClick={addWaterGlass} 
              className="btn btn-primary btn-sm" 
              disabled={dailyTotals.water >= nutritionGoals.water}
              aria-label="Agregar un vaso de agua"
            >
              <i className="bi bi-plus-circle"></i>
              Agregar Vaso
            </button>
          </div>
        </div>
      </div>

      {/* Formulario para agregar comida */}
      {showAddMeal && (
        <div className="add-meal-form" ref={addMealFormRef}>
          <h3>
            <i className="bi bi-plus-circle"></i>
            Registrar Comida
          </h3>
          
          {/* Accesos rápidos */}
          <div className="quick-add-section">
            <h4>
              <i className="bi bi-lightning"></i>
              Alimentos Comunes
            </h4>
            <div className="quick-food-grid">
              {commonFoods.map((food, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuickAdd(food)}
                  className="btn btn-outline-secondary btn-sm"
                >
                  <i className="bi bi-plus-circle"></i>
                  {food.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddMeal} className="meal-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type" className="form-label">
                  Tipo de comida
                </label>
                <select
                  id="type"
                  name="type"
                  className="form-input"
                  value={mealForm.type}
                  onChange={handleInputChange}
                >
                  {mealTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Nombre del alimento <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={mealForm.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Pechuga de pollo con arroz"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="calories" className="form-label">
                  <i className="bi bi-fire"></i>
                  Calorías (kcal)
                </label>
                <input
                  type="number"
                  id="calories"
                  name="calories"
                  className="form-input"
                  value={mealForm.calories}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="protein" className="form-label">
                  <i className="bi bi-egg"></i>
                  Proteínas (g)
                </label>
                <input
                  type="number"
                  id="protein"
                  name="protein"
                  className="form-input"
                  value={mealForm.protein}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="carbs" className="form-label">
                  <i className="bi bi-bowl-food"></i>
                  Carbohidratos (g)
                </label>
                <input
                  type="number"
                  id="carbs"
                  name="carbs"
                  className="form-input"
                  value={mealForm.carbs}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fat" className="form-label">
                  <i className="bi bi-droplet"></i>
                  Grasas (g)
                </label>
                <input
                  type="number"
                  id="fat"
                  name="fat"
                  className="form-input"
                  value={mealForm.fat}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="portion" className="form-label">
                Porción (gramos)
              </label>
              <input
                type="number"
                id="portion"
                name="portion"
                className="form-input"
                value={mealForm.portion}
                onChange={handleInputChange}
                placeholder="Ej: 100, 200, 250"
                min="0"
                step="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Notas adicionales
              </label>
              <textarea
                id="notes"
                name="notes"
                className="form-input"
                value={mealForm.notes}
                onChange={handleInputChange}
                placeholder="Información adicional..."
                rows="2"
              />
            </div>

            <div className="btn-group justify-end">
              <button
                type="button"
                onClick={() => setShowAddMeal(false)}
                className="btn btn-danger"
              >
                <i className="bi bi-x-circle"></i>
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-success"
              >
                <i className="bi bi-check-circle"></i>
                Registrar Comida
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de comidas del día */}
      <div className="meals-list">
        <h3>
          <i className="bi bi-list-ul"></i>
          Comidas de Hoy
        </h3>
        
        {todayMeals.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-egg-fried"></i>
            <p>No has registrado comidas hoy</p>
            <button onClick={() => setShowAddMeal(true)} className="btn btn-primary">
              <i className="bi bi-plus-circle"></i>
              Agregar Primera Comida
            </button>
          </div>
        ) : (
          todayMeals.map(meal => (
            <div key={meal.id} className="meal-card">
              <div className="meal-header">
                <div className="meal-type-badge">
                  <i className={getMealIcon(meal.type)}></i>
                  <span>{mealTypes.find(t => t.value === meal.type)?.label}</span>
                </div>
                <span className="meal-time">
                  <i className="bi bi-clock"></i>
                  {meal.time}
                </span>
                <button
                  onClick={() => deleteMeal(meal.id)}
                  className="btn btn-danger btn-icon btn-sm"
                  aria-label="Eliminar comida"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>

              <h4 className="meal-name">{meal.name}</h4>
              
              {meal.portion && (
                <p className="meal-portion">
                  <i className="bi bi-cup"></i>
                  {meal.portion}
                </p>
              )}

              <div className="meal-macros">
                <div className="macro-item">
                  <i className="bi bi-fire"></i>
                  <span>{meal.calories} kcal</span>
                </div>
                <div className="macro-item">
                  <i className="bi bi-egg"></i>
                  <span>{meal.protein}g P</span>
                </div>
                <div className="macro-item">
                  <i className="bi bi-bowl-food"></i>
                  <span>{meal.carbs}g C</span>
                </div>
                <div className="macro-item">
                  <i className="bi bi-droplet"></i>
                  <span>{meal.fat}g G</span>
                </div>
              </div>

              {meal.notes && (
                <p className="meal-notes">
                  <i className="bi bi-sticky"></i>
                  {meal.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NutritionManagement;
