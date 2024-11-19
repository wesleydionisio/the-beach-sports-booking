const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.endsWith('.svg');
      },
      message: props => `${props.value} deve ser um arquivo SVG!`
    }
  },
  active: {
    type: Boolean,
    default: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);