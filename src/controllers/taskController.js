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
