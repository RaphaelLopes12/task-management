const Task = require('../models/task');

exports.createTask = async (req, res) => {
    const { title, description } = req.body;
    const { projectId } = req.params;

    try {
        const task = await Task.create({
            title,
            description,
            project: projectId,
        });

        req.io.emit('newTask', {
            projectId,
            task,
            message: `Nova tarefa criada: ${task.title}`
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTasks = async (req, res) => {
    const { projectId } = req.params;

    try {
        const tasks = await Task.find({ project: projectId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(
            id,
            { title, description, status },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        res.json({ message: 'Tarefa excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addComment = async (req, res) => {
    const { taskId } = req.params;
    const { text } = req.body;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        const comment = {
            text,
            user: req.user._id,
        };

        task.comments.push(comment);
        await task.save();

        const populatedTask = await Task.findById(taskId).populate('comments.user', 'name');
        const savedComment = populatedTask.comments[populatedTask.comments.length - 1];

        req.io.emit('newComment', {
            taskId: task._id,
            comment: savedComment,
            message: `Novo comentário na tarefa ${task.title}`
        });

        res.status(200).json(savedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getComments = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findById(taskId).populate('comments.user', 'name email');

        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        res.json(task.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.editComment = async (req, res) => {
    const { taskId, commentId } = req.params;
    const { text } = req.body;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        const comment = task.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comentário não encontrado' });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Você não tem permissão para editar este comentário' });
        }

        comment.text = text || comment.text;
        await task.save();

        const populatedTask = await Task.findById(taskId).populate('comments.user', 'name');
        const updatedComment = populatedTask.comments.id(commentId);

        req.io.emit('editComment', {
            taskId: task._id,
            comment: updatedComment,
            message: `Comentário atualizado na tarefa ${task.title}`
        });

        res.json({ message: 'Comentário atualizado com sucesso', comment: updatedComment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    const { taskId, commentId } = req.params;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        const comment = task.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comentário não encontrado' });
        }

        task.comments.pull(commentId);
        await task.save();

        req.io.emit('deleteComment', {
            taskId: task._id,
            comment,
            message: `Comentário removido da tarefa ${task.title}`
        });

        res.json({ message: 'Comentário excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
