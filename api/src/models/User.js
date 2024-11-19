// src/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [3, 'Nome deve ter pelo menos 3 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido']
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'A senha deve ter pelo menos 6 caracteres']
  },
  telefone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
    unique: true,
    trim: true,
    match: [/^\(\d{2}\)\s\d\s\d{4}-\d{4}$/, 'Formato de telefone inválido']
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
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
    console.log('Comparando senhas:');
    console.log('Senha fornecida (hash):', await bcrypt.hash(candidatePassword, 10));
    console.log('Senha armazenada:', this.senha);
    
    const isMatch = await bcrypt.compare(candidatePassword, this.senha);
    console.log('Resultado da comparação:', isMatch);
    
    return isMatch;
  } catch (error) {
    console.error('Erro ao comparar senhas:', error);
    throw error;
  }
};

module.exports = mongoose.model('User', UserSchema);