const express = require('express');
const {
    createProject,
    getProjects,
    addCollaborator,
    removeCollaborator,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, createProject);

router.get('/', protect, getProjects);

router.put('/:projectId', protect, updateProject);

router.delete('/:projectId', protect, deleteProject);

router.post('/:projectId/collaborators', protect, addCollaborator);

router.delete('/:projectId/collaborators', protect, removeCollaborator);

module.exports = router;
