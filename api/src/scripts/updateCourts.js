const mongoose = require('mongoose');
const Court = require('../models/Court');

async function updateCourts() {
  try {
    await mongoose.connect('mongodb://localhost:27017/agendamentos');
    
    // Atualizar todas as quadras
    const result = await Court.updateMany(
      { preco_por_hora: { $exists: false } },
      { 
        $set: { 
          preco_por_hora: 100 // Valor padrão, ajuste conforme necessário
        }
      }
    );

    console.log(`Quadras atualizadas: ${result.modifiedCount}`);
  } catch (error) {
    console.error('Erro ao atualizar quadras:', error);
  } finally {
    await mongoose.connection.close();
  }
}

updateCourts(); 