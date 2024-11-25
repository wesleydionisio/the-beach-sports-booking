// src/models/Booking.js

const mongoose = require('mongoose');

const RecorrenciaSchema = new mongoose.Schema({
  horarios: [{
    data: Date,
    horario_inicio: String,
    horario_fim: String,
    status: {
      type: String,
      enum: ['confirmado', 'cancelado', 'pendente'],
      default: 'confirmado'
    }
  }]
});

const BookingSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quadra_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  horario_inicio: {
    type: String,
    required: true,
  },
  horario_fim: {
    type: String,
    required: true,
  },
  esporte: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
    required: true,
  },
  metodo_pagamento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod',
    required: true,
  },
  status: {
    type: String,
    enum: ['pendente', 'confirmada', 'cancelada'],
    default: 'pendente',
  },
  total: {
    type: Number,
    required: [true, 'O valor total é obrigatório'],
    min: [0, 'O valor total não pode ser negativo']
  },
  pague_no_local: {
    type: Boolean,
    default: false,
  },
  is_recorrente: {
    type: Boolean,
    default: false
  },
  recorrencia_pai_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  },
  recorrencia: {
    type: RecorrenciaSchema,
    default: { horarios: [] }
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);