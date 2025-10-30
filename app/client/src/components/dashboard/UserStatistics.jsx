import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { injuryService, statisticsService, nutritionService } from '../../services/api';
import '../../styles/GlobalStyles.css';
import '../../styles/WellnessComponents.css';

const UserStatistics = ({ onBack }) => {
  const [timeRange, setTimeRange] = useState('7');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({ 
    injuries: [], 
    nutrition: [], 
    workouts: [] 
  });
  const [summary, setSummary] = useState({
    totalInjuries: 0,
    avgCalories: 0,
    totalWorkouts: 0
  });

  useEffect(() => { 
    loadStatistics(); 
  }, [timeRange]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const days = parseInt(timeRange);
      
      // Calcular fecha límite (hace N días)
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Final del día de hoy
      const cutoffDate = new Date(today);
      cutoffDate.setDate(today.getDate() - days);
      cutoffDate.setHours(0, 0, 0, 0); // Inicio del día límite
      
      // Cargar lesiones
      const injuriesResponse = await injuryService.getInjuries();
      const injuries = injuriesResponse.data || [];
      
      // Filtrar solo lesiones dentro del rango de días
      const filteredInjuries = injuries.filter(injury => {
        const injuryDate = new Date(injury.dateOccurred || injury.date);
        return injuryDate >= cutoffDate && injuryDate <= today;
      });
      
      // Agrupar por fecha
      const injuriesByDate = {};
      filteredInjuries.forEach(injury => {
        const date = injury.dateOccurred || injury.date;
        if (date) {
          const dateObj = new Date(date);
          const dateKey = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
          if (!injuriesByDate[dateKey]) {
            injuriesByDate[dateKey] = {
              dateObj: dateObj,
              count: 0
            };
          }
          injuriesByDate[dateKey].count++;
        }
      });
      
      // Convertir a array y ordenar cronológicamente (más antiguo primero para el gráfico)
      const injuriesChartData = Object.entries(injuriesByDate)
        .map(([dateKey, data]) => ({
          fecha: data.dateObj.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
          cantidad: data.count,
          sortDate: new Date(dateKey)
        }))
        .sort((a, b) => a.sortDate - b.sortDate) // Ascendente (antiguo → reciente)
        .map(({ fecha, cantidad }) => ({ fecha, cantidad }));

      // Cargar calorías desde las comidas diarias
      let nutritionData = [];
      try {
        // Generar fechas para los últimos N días
        const today = new Date();
        const caloriasPorDia = {};
        
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          try {
            // Usar el endpoint correcto: /api/nutrition/logs?fecha=YYYY-MM-DD
            const mealsResponse = await nutritionService.getNutritionLogsByDate(dateStr);
            console.log(`Comidas del ${dateStr}:`, mealsResponse);
            
            if (mealsResponse.success && mealsResponse.data && mealsResponse.data.length > 0) {
              const totalCalorias = mealsResponse.data.reduce((sum, meal) => {
                return sum + (meal.calories || 0);
              }, 0);
              
              if (totalCalorias > 0) {
                caloriasPorDia[dateStr] = totalCalorias;
              }
            }
          } catch (err) {
            console.log(`No hay datos para ${dateStr}`);
          }
        }
        
        // Convertir a array para el gráfico
        nutritionData = Object.entries(caloriasPorDia).map(([fecha, calorias]) => {
          // Crear fecha local para evitar problemas de zona horaria
          const [year, month, day] = fecha.split('-').map(Number);
          const dateObj = new Date(year, month - 1, day); // month es 0-indexed
          
          return {
            fecha: dateObj.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
            calorias: Math.round(calorias)
          };
        });
        
        console.log('Datos de nutrición procesados:', nutritionData);
      } catch (error) {
        console.error('Error cargando calorías:', error);
      }

      // Cargar entrenamientos
      // NOTA: Temporalmente deshabilitado - la tabla entrenamientos no tiene campo 'fecha'
      // Necesitamos crear una tabla de historial de entrenamientos completados
      let workoutsData = [];
      /*
      try {
        const weeksToShow = Math.ceil(days / 7);
        const activityResponse = await statisticsService.getWeeklyActivity();
        console.log('Actividad response:', activityResponse);
        
        if (activityResponse.success && activityResponse.data && activityResponse.data.length > 0) {
          workoutsData = activityResponse.data
            .map(item => ({
              dia: item.semana ? new Date(item.semana).toLocaleDateString('es-ES', { weekday: 'short' }) : 'N/A',
              entrenamientos: item.entrenamientos || item.count || 0
            }))
            .filter(item => item.entrenamientos >= 0)
            .slice(0, weeksToShow);
        }
      } catch (error) {
        console.error('Error entrenamientos:', error);
      }
      */

      const totalInjuries = injuriesChartData.reduce((sum, item) => sum + item.cantidad, 0);
      const avgCalories = nutritionData.length > 0
        ? Math.round(nutritionData.reduce((sum, item) => sum + item.calorias, 0) / nutritionData.length)
        : 0;
      const totalWorkouts = 0; // workoutsData.reduce((sum, item) => sum + item.entrenamientos, 0);

      setChartData({ injuries: injuriesChartData, nutrition: nutritionData, workouts: workoutsData });
      setSummary({ totalInjuries, avgCalories, totalWorkouts });

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: 'var(--bg-secondary)',
      paddingBottom: '100px'
    }}>
      {/* Header Responsive */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '12px 16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <button onClick={onBack} className="btn btn-secondary btn-icon btn-sm">
            <i className="bi bi-arrow-left"></i>
          </button>
          
          <h2 style={{
            margin: 0,
            fontSize: 'clamp(16px, 4vw, 20px)',
            fontWeight: '600',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            <i className="bi bi-graph-up-arrow" style={{ flexShrink: 0 }}></i>
            <span>Estadísticas</span>
          </h2>
          
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ 
              flexShrink: 0,
              minWidth: '90px',
              padding: '6px 10px',
              fontSize: '14px',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              cursor: 'pointer'
            }}
          >
            <option value="7">7 días</option>
            <option value="14">14 días</option>
            <option value="30">30 días</option>
          </select>
        </div>
      </header>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      ) : (
        <div style={{ 
          padding: '16px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Gráfico de Lesiones */}
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'clamp(12px, 3vw, 20px)',
            marginBottom: '16px',
            border: '1px solid var(--border-light)'
          }}>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '12px',
              fontSize: 'clamp(16px, 3.5vw, 18px)',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <i className="bi bi-bandaid-fill" style={{ color: '#ef4444', fontSize: '20px' }}></i> 
              <span>Lesiones Registradas</span>
            </h3>
            {chartData.injuries.length > 0 ? (
              <div style={{ width: '100%', height: 'clamp(200px, 40vw, 280px)' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.injuries} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="fecha" stroke="var(--text-secondary)" style={{ fontSize: 'clamp(10px, 2vw, 12px)' }} />
                    <YAxis stroke="var(--text-secondary)" allowDecimals={false} style={{ fontSize: 'clamp(10px, 2vw, 12px)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)' }} />
                    <Bar dataKey="cantidad" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <i className="bi bi-clipboard-data" style={{ fontSize: '48px', marginBottom: '10px', display: 'block' }}></i>
                <p style={{ margin: 0, fontSize: '14px' }}>No hay lesiones registradas</p>
              </div>
            )}
          </div>

          {/* Gráfico de Calorías */}
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'clamp(12px, 3vw, 20px)',
            marginBottom: '16px',
            border: '1px solid var(--border-light)'
          }}>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '12px',
              fontSize: 'clamp(16px, 3.5vw, 18px)',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <i className="bi bi-egg-fried" style={{ color: '#10b981', fontSize: '20px' }}></i> 
              <span>Calorías Diarias</span>
            </h3>
            {chartData.nutrition.length > 0 ? (
              <div style={{ width: '100%', height: 'clamp(200px, 40vw, 280px)' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.nutrition} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="fecha" stroke="var(--text-secondary)" style={{ fontSize: 'clamp(10px, 2vw, 12px)' }} />
                    <YAxis stroke="var(--text-secondary)" style={{ fontSize: 'clamp(10px, 2vw, 12px)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)' }} />
                    <Line type="monotone" dataKey="calorias" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <i className="bi bi-clipboard-data" style={{ fontSize: '48px', marginBottom: '10px', display: 'block' }}></i>
                <p style={{ margin: 0, fontSize: '14px' }}>No hay datos de nutrición</p>
              </div>
            )}
          </div>

          {/* Gráfico de Entrenamientos - Temporalmente oculto */}
          {false && (
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'clamp(12px, 3vw, 20px)',
              marginBottom: '16px',
              border: '1px solid var(--border-light)'
            }}>
              <h3 style={{ 
                color: 'var(--text-primary)', 
                marginBottom: '12px',
                fontSize: 'clamp(16px, 3.5vw, 18px)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="bi bi-activity" style={{ color: '#3b82f6', fontSize: '20px' }}></i> 
                <span>Entrenamientos Semanales</span>
              </h3>
              {chartData.workouts.length > 0 ? (
                <div style={{ width: '100%', height: 'clamp(200px, 40vw, 280px)' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.workouts} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                      <XAxis dataKey="dia" stroke="var(--text-secondary)" style={{ fontSize: 'clamp(10px, 2vw, 12px)' }} />
                      <YAxis stroke="var(--text-secondary)" allowDecimals={false} style={{ fontSize: 'clamp(10px, 2vw, 12px)' }} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)' }} />
                      <Bar dataKey="entrenamientos" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  <i className="bi bi-clipboard-data" style={{ fontSize: '48px', marginBottom: '10px', display: 'block' }}></i>
                  <p style={{ margin: 0, fontSize: '14px' }}>No hay entrenamientos registrados</p>
                </div>
              )}
            </div>
          )}

          {/* Tarjetas de Resumen Responsive */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
            gap: '12px'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'clamp(12px, 3vw, 16px)',
              textAlign: 'center',
              border: '1px solid var(--border-light)'
            }}>
              <i className="bi bi-bandaid-fill" style={{ fontSize: 'clamp(24px, 6vw, 32px)', color: '#ef4444', marginBottom: '8px', display: 'block' }}></i>
              <h4 style={{ color: 'var(--text-muted)', fontSize: 'clamp(11px, 2.5vw, 14px)', marginBottom: '4px', fontWeight: '500', margin: '0 0 4px 0' }}>Total Lesiones</h4>
              <p style={{ color: 'var(--text-primary)', fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 'bold', margin: 0 }}>
                {summary.totalInjuries}
              </p>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--border-radius-lg)',
              padding: 'clamp(12px, 3vw, 16px)',
              textAlign: 'center',
              border: '1px solid var(--border-light)'
            }}>
              <i className="bi bi-fire" style={{ fontSize: 'clamp(24px, 6vw, 32px)', color: '#10b981', marginBottom: '8px', display: 'block' }}></i>
              <h4 style={{ color: 'var(--text-muted)', fontSize: 'clamp(11px, 2.5vw, 14px)', marginBottom: '4px', fontWeight: '500', margin: '0 0 4px 0' }}>Cal. Promedio</h4>
              <p style={{ color: 'var(--text-primary)', fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 'bold', margin: 0 }}>
                {summary.avgCalories}
              </p>
            </div>

            {/* Tarjeta de entrenamientos oculta temporalmente */}
            {false && (
              <div style={{
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--border-radius-lg)',
                padding: 'clamp(12px, 3vw, 16px)',
                textAlign: 'center',
                border: '1px solid var(--border-light)'
              }}>
                <i className="bi bi-trophy-fill" style={{ fontSize: 'clamp(24px, 6vw, 32px)', color: '#3b82f6', marginBottom: '8px', display: 'block' }}></i>
                <h4 style={{ color: 'var(--text-muted)', fontSize: 'clamp(11px, 2.5vw, 14px)', marginBottom: '4px', fontWeight: '500', margin: '0 0 4px 0' }}>Entrenamientos</h4>
                <p style={{ color: 'var(--text-primary)', fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 'bold', margin: 0 }}>
                  {summary.totalWorkouts}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatistics;
