// src/models/Booking.js

const mongoose = require('mongoose');

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
    required: true,
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
    duracao_meses: {
      type: Number,
      required: function() {
        return this.is_recorrente;
      }
    },
    dia_semana: {
      type: Number,
      required: function() {
        return this.is_recorrente;
      }
    },
    data_inicio: {
      type: Date,
      required: function() {
        return this.is_recorrente;
      }
    },
    data_fim: {
      type: Date,
      required: function() {
        return this.is_recorrente;
      }
    },
    horarios: [{
      data: Date,
      horario_inicio: String,
      horario_fim: String,
      status: String,
      valor: Number,
      booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
      }
    }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);