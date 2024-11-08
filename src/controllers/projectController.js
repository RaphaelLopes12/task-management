const Project = require('../models/project');

// Criação de um novo projeto
exports.createProject = async (req, res) => {
    const { title, description } = req.body;

    try {
        const project = await Project.create({
            title,
            description,
            user: req.user._id, // usuário logado (extraído do middleware)
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Listar todos os projetos do usuário logado
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
