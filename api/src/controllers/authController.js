// src/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Função para registrar um novo usuário.
 */
const register = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    // Verificar se o usuário já existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Usuário já existe com este e-mail.',
      });
    }

    // Criar uma nova instância de usuário
    user = new User({
      nome,
      email,
      senha,
    });

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    user.senha = await bcrypt.hash(senha, salt);

    // Salvar o usuário no banco de dados
    await user.save();

    // Gerar um token JWT
    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', {
      expiresIn: '1h', // Token expira em 1 hora
    });

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso.',
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor ao registrar usuário.',
    });
  }
};

/**
 * Função para logar um usuário.
 */
const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Credenciais inválidas.',
      });
    }

    // Verificar a senha
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Credenciais inválidas.',
      });
    }

    // Gerar um token JWT
    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', {
      expiresIn: '1h', // Token expira em 1 hora
    });

    res.status(200).json({
      success: true,
      message: 'Login bem-sucedido.',
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor ao fazer login.',
    });
  }
};

module.exports = {
  register,
  login,
};