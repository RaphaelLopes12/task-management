const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Gera um token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Registro de usuário
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Verifica se o usuário já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Usuário já registrado' });
        }

        // Cria novo usuário
        const user = await User.create({ name, email, password });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login de usuário
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verifica se o usuário existe
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Credenciais inválidas' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};