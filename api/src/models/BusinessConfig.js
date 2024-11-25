const mongoose = require('mongoose');

const BusinessConfigSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: { type: String, required: true },
  endereco: { type: String, required: true },
  horario_abertura: { type: String, required: true }, // formato HH:mm
  horario_fechamento: { type: String, required: true }, // formato HH:mm
  valor_hora_padrao: { type: Number, required: true, default: 120 },
  valor_hora_nobre: { type: Number, required: true, default: 150 },
  percentual_hora_nobre: { type: Number, required: true, default: 25 }, // 25% a mais
  min_time_before_booking: { 
    type: Number, 
    required: true, 
    default: 60 // 60 minutos (1 hora)
  },
  horarios_nobres: [String]
}, { timestamps: true });

module.exports = mongoose.model('BusinessConfig', BusinessConfigSchema);