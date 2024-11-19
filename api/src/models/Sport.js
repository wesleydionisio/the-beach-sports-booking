const mongoose = require('mongoose');

const SportSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Sport', SportSchema);