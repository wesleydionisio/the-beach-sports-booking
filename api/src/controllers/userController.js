// src/controllers/userController.js

const User = require('../models/User');
const Booking = require('../models/Booking');

// Função para obter o perfil do usuário autenticado
const getUserProfile = async (req, res) => {
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
const updateUserProfile = async (req, res) => {
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

// Listar usuários com contagem de agendamentos
const listUsers = async (req, res) => {
  try {
    // Buscar usuários
    const users = await User.find()
      .select('-senha')
      .sort({ createdAt: -1 });

    // Buscar contagem de agendamentos para cada usuário
    const usersWithBookings = await Promise.all(
      users.map(async (user) => {
        const bookingsCount = await Booking.countDocuments({
          usuario_id: user._id,
          status: { $ne: 'cancelada' }
        });

        return {
          ...user.toObject(),
          totalAgendamentos: bookingsCount
        };
      })
    );

    res.json({
      success: true,
      users: usersWithBookings
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuários'
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { nome, email, telefone, role },
      { new: true, runValidators: true }
    ).select('-senha');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar usuário'
    });
  }
};

const deleteUser = async (req, res) => {
    // lógica para deletar usuário
};

// Exportar todas as funções
module.exports = {
    getUserProfile,
    updateUserProfile,
    listUsers,
    updateUser,
    deleteUser
};