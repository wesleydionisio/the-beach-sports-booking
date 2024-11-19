const mongoose = require('mongoose');
const PaymentMethod = require('../models/PaymentMethod');
const Booking = require('../models/Booking');
require('dotenv').config();

const initialPaymentMethods = [
  {
    label: 'Dinheiro',
    icon: '/assets/icons/money.svg',
    displayOrder: 1
  },
  {
    label: 'Cartão de Crédito',
    icon: '/assets/icons/credit-card.svg',
    displayOrder: 2
  },
  {
    label: 'Cartão de Débito',
    icon: '/assets/icons/debit-card.svg',
    displayOrder: 3
  },
  {
    label: 'PIX',
    icon: '/assets/icons/pix.svg',
    displayOrder: 4
  },
  {
    label: 'Pagamento no Local',
    icon: '/assets/icons/local-payment.svg',
    displayOrder: 5
  }
];

async function migrate() {
  try {
    // Conectar ao banco de dados
    await mongoose.connect(process.env.DB_URI);
    console.log('Conectado ao MongoDB');

    // Criar métodos de pagamento
    const createdMethods = await PaymentMethod.insertMany(initialPaymentMethods);
    console.log('Métodos de pagamento criados:', createdMethods);

    // Criar mapeamento dos métodos antigos para os novos IDs
    const paymentMethodMap = {
      'Dinheiro': createdMethods.find(m => m.label === 'Dinheiro')._id,
      'Cartão de Crédito': createdMethods.find(m => m.label === 'Cartão de Crédito')._id,
      'Pix': createdMethods.find(m => m.label === 'PIX')._id,
      'pagamento_no_ato': createdMethods.find(m => m.label === 'Pagamento no Local')._id
    };

    // Atualizar reservas existentes
    const bookings = await Booking.find({});
    
    for (const booking of bookings) {
      const newPaymentMethodId = paymentMethodMap[booking.pagamento];
      if (newPaymentMethodId) {
        booking.pagamento = newPaymentMethodId;
        await booking.save();
        console.log(`Reserva ${booking._id} atualizada com sucesso`);
      } else {
        console.log(`Método de pagamento não mapeado para reserva ${booking._id}: ${booking.pagamento}`);
      }
    }

    console.log('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a migração:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  }
}

migrate(); 