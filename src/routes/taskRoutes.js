const express = require('express');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true }); // Para aceitar projectId na URL

// Rota para criar uma nova tarefa
router.post('/', protect, createTask);

// Rota para listar todas as tarefas de um projeto
router.get('/', protect, getTasks);

// Rota para atualizar uma tarefa específica
router.put('/:id', protect, updateTask);

// Rota para excluir uma tarefa específica
router.delete('/:id', protect, deleteTask);

module.exports = router;
