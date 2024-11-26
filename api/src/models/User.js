// src/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: true,
    select: false
  },
  telefone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
    validate: {
      validator: function(v) {
        // Aceita apenas números, com 10 ou 11 dígitos
        return /^[1-9]{2}[0-9]{8,9}$/.test(v);
      },
      message: props => `${props.value} não é um telefone válido! Use apenas números (DDD + número)`
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Middleware para criptografar a senha antes de salvar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar senhas
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    const user = await this.model('User').findOne({ _id: this._id }).select('+senha');
    if (!user || !user.senha) {
      throw new Error('Senha não encontrada');
    }
    return await bcrypt.compare(candidatePassword, user.senha);
  } catch (error) {
    console.error('Erro ao comparar senhas:', error);
    throw error;
  }
};

module.exports = mongoose.model('User', UserSchema);