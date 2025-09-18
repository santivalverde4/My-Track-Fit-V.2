const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ message: 'Servidor de My Track-Fit V.2 funcionando!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('Servidor iniciado exitosamente!');
  console.log(`Puerto: ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
});