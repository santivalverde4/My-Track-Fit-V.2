import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { statisticsService } from '../../services/api';
import '../../styles/GlobalStyles.css';
import '../../styles/WellnessComponents.css';

const UserStatistics = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7days');
  const [loading, setLoading] = useState(false);

  const [chartData, setChartData] = useState({
    // Progreso de peso corporal (MetricasDiarias.peso)
    weightProgress: [],
    // Entrenamientos por día (Entrenamientos + Instancias_Ejercicios)
    workoutsWeek: [],
    // Volumen total por ejercicio (Instancias_Ejercicios)
    topExercises: [],
    // Distribución por categoría (Ejercicios.categoria)
    exerciseDistribution: [],
    // Macros diarios (NutricionTemporal)
    macrosWeek: [],
    // Calorías consumidas vs quemadas
    caloriesWeek: [],
    // Métricas de bienestar (MetricasDiarias)
    wellnessMetrics: []
  });

  useEffect(() => {
    loadStatistics();
  }, [timeRange]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const response = await statisticsService.getStatistics(timeRange);
      
      if (response.charts) {
        setChartData({
          weightProgress: response.charts.weightProgress || chartData.weightProgress,
          workoutsWeek: response.charts.workoutsWeek || chartData.workoutsWeek,
          topExercises: response.charts.topExercises || chartData.topExercises,
          exerciseDistribution: response.charts.exerciseDistribution || chartData.exerciseDistribution,
          macrosWeek: response.charts.macrosWeek || chartData.macrosWeek,
          caloriesWeek: response.charts.caloriesWeek || chartData.caloriesWeek,
          wellnessMetrics: response.charts.wellnessMetrics || chartData.wellnessMetrics
        });
      }
      
      console.log('Estadísticas cargadas exitosamente');
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverviewTab = () => (
    <div className="stats-overview">
      {/* Gráfico de progreso de peso */}
      <div className="chart-section">
        <h3>
          <i className="bi bi-graph-up"></i>
          Progreso de Peso Corporal
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData.weightProgress}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis dataKey="fecha" stroke="#cbd5e0" />
            <YAxis stroke="#cbd5e0" domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568', borderRadius: '8px' }}
              labelStyle={{ color: '#f7fafc' }}
            />
            <Line 
              type="monotone" 
              dataKey="peso" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de actividad semanal */}
      <div className="chart-section">
        <h3>
          <i className="bi bi-calendar-week"></i>
          Actividad Semanal
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData.workoutsWeek}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis dataKey="dia" stroke="#cbd5e0" />
            <YAxis stroke="#cbd5e0" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568', borderRadius: '8px' }}
              labelStyle={{ color: '#f7fafc' }}
            />
            <Legend />
            <Bar dataKey="entrenamientos" fill="#10b981" name="Entrenamientos" />
            <Bar dataKey="ejercicios" fill="#3b82f6" name="Ejercicios" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderFitnessTab = () => (
    <div className="stats-fitness">
      {/* Gráfico de Top 5 Ejercicios por Volumen */}
      <div className="chart-section">
        <h4>
          <i className="bi bi-trophy-fill"></i>
          Top 5 Ejercicios por Volumen Total (kg)
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.topExercises} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis type="number" stroke="#cbd5e0" />
            <YAxis type="category" dataKey="nombre" stroke="#cbd5e0" width={120} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568', borderRadius: '8px' }}
              labelStyle={{ color: '#f7fafc' }}
              formatter={(value) => [`${value} kg`, 'Volumen']}
            />
            <Bar dataKey="volumen" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Distribución por Categoría */}
      <div className="chart-section">
        <h4>
          <i className="bi bi-diagram-3-fill"></i>
          Distribución por Categoría
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData.exerciseDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.exerciseDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568', borderRadius: '8px' }}
              labelStyle={{ color: '#f7fafc' }}
              formatter={(value) => [`${value}%`, 'Porcentaje']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderNutritionTab = () => (
    <div className="stats-nutrition">
      {/* Gráfico de Macros Diarios */}
      <div className="chart-section">
        <h4>
          <i className="bi bi-bar-chart-line-fill"></i>
          Macros Diarios (gramos)
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.macrosWeek}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis dataKey="dia" stroke="#cbd5e0" />
            <YAxis stroke="#cbd5e0" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568', borderRadius: '8px' }}
              labelStyle={{ color: '#f7fafc' }}
            />
            <Legend />
            <Bar dataKey="proteinas" fill="#ef4444" name="Proteínas" />
            <Bar dataKey="carbohidratos" fill="#f59e0b" name="Carbohidratos" />
            <Bar dataKey="grasas" fill="#8b5cf6" name="Grasas" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Calorías Consumidas vs Quemadas */}
      <div className="chart-section">
        <h4>
          <i className="bi bi-fire"></i>
          Calorías: Consumidas vs Quemadas
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData.caloriesWeek}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis dataKey="dia" stroke="#cbd5e0" />
            <YAxis stroke="#cbd5e0" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568', borderRadius: '8px' }}
              labelStyle={{ color: '#f7fafc' }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="consumidas" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.6}
              name="Consumidas"
            />
            <Area 
              type="monotone" 
              dataKey="quemadas" 
              stroke="#ef4444" 
              fill="#ef4444" 
              fillOpacity={0.6}
              name="Quemadas"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="user-statistics">
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
            <i className="bi bi-graph-up-arrow"></i>
            Estadísticas
          </h2>
          <div className="header-actions">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-range-select"
            >
              <option value="7days">Última semana</option>
              <option value="30days">Último mes</option>
              <option value="90days">Últimos 3 meses</option>
              <option value="year">Este año</option>
            </select>
          </div>
        </div>
        <p className="header-subtitle">
          Visualiza tu progreso y rendimiento
        </p>
      </header>

      {/* Tabs de navegación */}
      <div className="stats-tabs">
        <button
          className={`stats-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="bi bi-speedometer2"></i>
          General
        </button>
        <button
          className={`stats-tab ${activeTab === 'fitness' ? 'active' : ''}`}
          onClick={() => setActiveTab('fitness')}
        >
          <i className="bi bi-bicycle"></i>
          Fitness
        </button>
        <button
          className={`stats-tab ${activeTab === 'nutrition' ? 'active' : ''}`}
          onClick={() => setActiveTab('nutrition')}
        >
          <i className="bi bi-egg-fried"></i>
          Nutrición
        </button>
      </div>

      {/* Contenido según tab activo */}
      <div className="stats-content">
        {loading ? (
          <div className="loading-state">
            <i className="bi bi-arrow-repeat spin-icon"></i>
            <p>Cargando estadísticas...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'fitness' && renderFitnessTab()}
            {activeTab === 'nutrition' && renderNutritionTab()}
          </>
        )}
      </div>
    </div>
  );
};

export default UserStatistics;
