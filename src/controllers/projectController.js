const Project = require('../models/project');
const User = require('../models/user');

exports.createProject = async (req, res) => {
    const { title, description } = req.body;

    try {
        const project = await Project.create({
            title,
            description,
            user: req.user._id,
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProject = async (req, res) => {
    const { projectId } = req.params;
    const { title, description } = req.body;

    try {
        const project = await Project.findById(projectId);

        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Apenas o dono do projeto pode editá-lo' });
        }

        project.title = title || project.title;
        project.description = description || project.description;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);

        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Apenas o dono do projeto pode excluí-lo' });
        }

        await project.remove();
        res.json({ message: 'Projeto excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addCollaborator = async (req, res) => {
    const { projectId } = req.params;
    const { collaboratorEmail } = req.body;

    try {
        const collaborator = await User.findOne({ email: collaboratorEmail });
        if (!collaborator) {
            return res.status(404).json({ message: 'Colaborador não encontrado' });
        }

        const project = await Project.findById(projectId);

        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Apenas o dono do projeto pode adicionar colaboradores' });
        }

        if (!project.collaborators.includes(collaborator._id)) {
            project.collaborators.push(collaborator._id);
            await project.save();
            res.json({ message: 'Colaborador adicionado com sucesso' });
        } else {
            res.status(400).json({ message: 'Colaborador já está no projeto' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeCollaborator = async (req, res) => {
    const { projectId } = req.params;
    const { collaboratorId } = req.body;

    try {
        const project = await Project.findById(projectId);

        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Apenas o dono do projeto pode remover colaboradores' });
        }

        project.collaborators = project.collaborators.filter(
            (id) => id.toString() !== collaboratorId
        );
        await project.save();

        res.json({ message: 'Colaborador removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};