// src/controllers/userController.js

const User = require('../models/User');

// Função para obter o perfil do usuário autenticado
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-senha'); // Excluir a senha
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Erro ao obter perfil do usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.',
    });
  }
};

// Função para atualizar o perfil do usuário autenticado
exports.updateUserProfile = async (req, res) => {
  const { nome, email, telefone } = req.body;

  try {
    // Verificar se o email já está em uso por outro usuário
    if (email) {
      const existingUser = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'O email já está em uso por outro usuário.',
        });
      }
    }

    // Encontrar o usuário e atualizar os campos permitidos
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { nome, email: email ? email.toLowerCase() : undefined, telefone },
      { new: true, runValidators: true, context: 'query' }
    ).select('-senha');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.',
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.',
    });
  }
};