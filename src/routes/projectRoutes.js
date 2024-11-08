const express = require('express');
const { createProject, getProjects } = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rota para criar um novo projeto
router.post('/', protect, createProject);

// Rota para listar os projetos do usuário logado
router.get('/', protect, getProjects);

module.exports = router;
