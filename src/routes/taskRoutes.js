const express = require('express');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    addComment,
    getComments,
    editComment,
    deleteComment
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router.post('/', protect, createTask);

router.get('/', protect, getTasks);

router.put('/:id', protect, updateTask);

router.delete('/:id', protect, deleteTask);

router.post('/:taskId/comments', protect, addComment);

router.get('/:taskId/comments', protect, getComments);

router.put('/:taskId/comments/:commentId', protect, editComment);

router.delete('/:taskId/comments/:commentId', protect, deleteComment);

module.exports = router;
