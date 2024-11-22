const mongoose = require('mongoose');

const SportSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
    default: 'default-sport.svg',
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
    default: 999,
  }
}, { timestamps: true });

module.exports = mongoose.model('Sport', SportSchema);