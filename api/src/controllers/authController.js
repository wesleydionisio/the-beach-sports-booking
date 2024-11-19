// src/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userRegisterSchema, userLoginSchema } = require('../validations/userSchemas');

/**
 * Função para registrar um novo usuário.
 */
const register = async (req, res) => {
  try {
    // Log detalhado dos dados recebidos
    console.group('Debug - Registro de Usuário');
    console.log('Dados validados recebidos:', req.body);

    const { nome, email, senha, telefone } = req.body;

    // Verificar usuário existente
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { telefone: telefone }
      ]
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'email' : 'telefone';
      console.log(`${field} já cadastrado:`, existingUser[field]);
      console.groupEnd();
      return res.status(400).json({
        success: false,
        message: `Este ${field} já está cadastrado`
      });
    }

    // Criar novo usuário
    const user = new User({
      nome: nome.trim(),
      email: email.toLowerCase().trim(),
      senha,
      telefone: telefone.trim()
    });

    console.log('Tentando salvar usuário:', {
      nome: user.nome,
      email: user.email,
      telefone: user.telefone
    });

    await user.save();
    console.log('Usuário salvo com sucesso:', user._id);

    // Gerar token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '24h' }
    );

    console.groupEnd();
    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    console.groupEnd();
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Este ${field} já está em uso`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao registrar usuário',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Função para logar um usuário.
 */
const login = async (req, res) => {
  try {
    console.log('Dados recebidos:', req.body); // Log dos dados recebidos

    // Validar os dados de entrada
    const { error } = userLoginSchema.validate(req.body);
    if (error) {
      console.log('Erro de validação:', error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, senha } = req.body;

    // Verificar se o usuário existe
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('Usuário encontrado:', user ? 'Sim' : 'Não'); // Log do resultado da busca

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Verificar a senha
    const isMatch = await user.comparePassword(senha);
    console.log('Senha corresponde:', isMatch ? 'Sim' : 'Não'); // Log do resultado da comparação

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Gerar token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '24h' }
    );

    // Log do sucesso
    console.log('Login bem-sucedido para:', user.email);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Erro detalhado no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  register,
  login,
};