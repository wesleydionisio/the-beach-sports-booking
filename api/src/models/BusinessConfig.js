const mongoose = require('mongoose');

const BusinessConfigSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: { type: String, required: true },
  endereco: { type: String, required: true },
  horario_abertura: { type: String, required: true }, // formato HH:mm
  horario_fechamento: { type: String, required: true } // formato HH:mm
});

module.exports = mongoose.model('BusinessConfig', BusinessConfigSchema);