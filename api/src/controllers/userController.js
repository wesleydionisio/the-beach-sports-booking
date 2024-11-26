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
  try {
    const { nome, email, telefone } = req.body;
    
    console.log('📱 Dados recebidos para atualização:', { nome, email, telefone });

    // Validar telefone antes de atualizar
    if (telefone && !/^[1-9]{2}[0-9]{8,9}$/.test(telefone)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de telefone inválido. Use apenas números (DDD + número)'
      });
    }

    // Verificar email duplicado
    if (email) {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: req.user.id } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email já está em uso'
        });
      }
    }

    // Atualizar usuário
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        nome, 
        email: email?.toLowerCase(), 
        telefone 
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-senha');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    console.log('✅ Perfil atualizado com sucesso:', updatedUser);

    res.status(200).json({
      success: true,
      user: updatedUser
    });
    
  } catch (error) {
    console.error('❌ Erro ao atualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao atualizar perfil'
    });
  }
};