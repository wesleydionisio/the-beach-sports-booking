const mongoose = require('mongoose');
require('dotenv').config();
const Sport = require('../models/Sport');

const sportsData = [
  { nome: 'Futebol de areia' },
  { nome: 'Beach tennis' },
  { nome: 'Volei de areia' }

];

const seedSports = async () => {
  try {
    // Conecte ao banco de dados
    await mongoose.connect(process.env.DB_URI);
    console.log('Conectado ao banco de dados.');

    // Inserir esportes
    await Sport.insertMany(sportsData);
    console.log('Esportes criados com sucesso.');

    // Fechar conexão
    mongoose.connection.close();
  } catch (err) {
    console.error('Erro ao criar esportes:', err.message);
  }
};

seedSports();