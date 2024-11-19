const mongoose = require('mongoose');

const CourtSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  foto_principal: { type: String },
  galeria: [{ type: String }],
  duracao_padrao: { type: Number, required: true },
  esportes_permitidos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sport' }],
  preco_por_hora: { type: Number, required: true },
  horarios_reservados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
});

module.exports = mongoose.model('Court', CourtSchema);