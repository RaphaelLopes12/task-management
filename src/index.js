const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Conecta ao Banco de Dados
connectDB();

// Middleware
app.use(express.json());

// Rotas
app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));