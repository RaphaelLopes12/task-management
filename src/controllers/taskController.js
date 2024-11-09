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
    const { projectId, taskId } = req.params;
    const { text } = req.body;

    try {
        const task = await Task.findOne({ _id: taskId, project: projectId });

        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        const comment = {
            text,
            user: req.user._id,
        };

        task.comments.push(comment);
        await task.save();

        res.status(201).json({ message: 'Comentário adicionado com sucesso', comment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getComments = async (req, res) => {
    const { projectId, taskId } = req.params;

    try {
        const task = await Task.findOne({ _id: taskId, project: projectId }).populate('comments.user', 'name email');

        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        res.json(task.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.editComment = async (req, res) => {
    const { projectId, taskId, commentId } = req.params;
    const { text } = req.body;

    try {
        const task = await Task.findOne({ _id: taskId, project: projectId });

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

        res.json({ message: 'Comentário atualizado com sucesso', comment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};