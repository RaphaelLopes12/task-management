const express = require('express');
const {
    createProject,
    getProjects,
    addCollaborator,
    removeCollaborator } = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rota para criar um novo projeto
router.post('/', protect, createProject);

// Rota para listar os projetos do usuário logado
router.get('/', protect, getProjects);

// Nova rota para adicionar colaborador a um projeto
router.post('/:projectId/collaborators', protect, addCollaborator);

// Nova rota para remover colaborador de um projeto
router.delete('/:projectId/collaborators', protect, removeCollaborator);

module.exports = router;
