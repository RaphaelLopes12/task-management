const express = require('express');
const http = require('http');
const connectDB = require('./config/db');
const cors = require('cors');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
io.on('connection', (socket) => {
    console.log('Novo cliente conectado:', socket.id);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// Middleware para adicionar o Socket.IO à requisição
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Rotas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/projects/:projectId/tasks', require('./routes/taskRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));