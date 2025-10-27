import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import exerciseRoutes from './routes/exercise.routes.js';
import routineRoutes from './routes/routine.routes.js';
import nutritionRoutes from './routes/nutrition.routes.js';
import injuryRoutes from './routes/injury.routes.js';
import statisticsRoutes from './routes/statistics.routes.js';

// Cargar variables de entorno
dotenv.config();

// Crear instancia de Express
const app = express();

// Configuración del puerto
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rutas principales
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'My Track Fit API v2.0',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      exercises: '/api/exercises',
      routines: '/api/routines',
      nutrition: '/api/nutrition',
      injuries: '/api/injuries',
      statistics: '/api/statistics'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Registrar rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/injuries', injuryRoutes);
app.use('/api/statistics', statisticsRoutes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Servidor iniciado correctamente`);
  console.log(`📍 Puerto: ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📊 Supabase URL: ${process.env.SUPABASE_URL}`);
  console.log('='.repeat(50));
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

export default app;
