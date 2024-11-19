const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const PaymentMethod = require('../models/PaymentMethod');

async function updateBookings() {
  try {
    await mongoose.connect('mongodb://localhost:27017/agendamentos');
    
    // Buscar o método de pagamento padrão (você precisa ter pelo menos um cadastrado)
    const defaultPaymentMethod = await PaymentMethod.findOne();
    
    if (!defaultPaymentMethod) {
      throw new Error('Nenhum método de pagamento encontrado');
    }

    // Atualizar todas as reservas
    const result = await Booking.updateMany(
      {
        $or: [
          { metodo_pagamento: { $exists: false } },
          { total: { $exists: false } },
          { pague_no_local: { $exists: false } }
        ]
      },
      {
        $set: {
          metodo_pagamento: defaultPaymentMethod._id,
          total: 100, // Valor padrão, ajuste conforme necessário
          pague_no_local: false,
          status: 'pendente' // Caso não exista
        }
      }
    );

    console.log(`Reservas atualizadas: ${result.modifiedCount}`);
  } catch (error) {
    console.error('Erro ao atualizar reservas:', error);
  } finally {
    await mongoose.connection.close();
  }
}

updateBookings(); 