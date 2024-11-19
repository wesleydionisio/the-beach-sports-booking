const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
  label: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  icon: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        // Aceita caminhos relativos do app ou URLs completas
        return /^(\/assets\/icons\/|https?:\/\/).+\.(svg|png|jpg|jpeg)$/i.test(v);
      },
      message: 'Formato de ícone inválido. Use um caminho relativo (/assets/icons/) ou URL válida'
    }
  },
  active: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);