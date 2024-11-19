require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function updateExistingUsers() {
  try {
    console.log('Iniciando conexão com o MongoDB...');
    
    // Use a URI do seu .env
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agendamentos';
    
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado ao MongoDB com sucesso');

    // Primeiro, vamos verificar quantos usuários precisam ser atualizados
    const usersWithoutPhone = await User.countDocuments({ telefone: { $exists: false } });
    console.log(`Encontrados ${usersWithoutPhone} usuários sem telefone`);

    // Atualizar todos os usuários que não têm telefone
    const result = await User.updateMany(
      { telefone: { $exists: false } },
      { 
        $set: { 
          telefone: '(00) 0 0000-0000',  // Telefone padrão
          updatedAt: new Date() 
        } 
      }
    );
    
    console.log(`Atualizados ${result.modifiedCount} usuários`);
    
  } catch (error) {
    console.error('Erro ao atualizar usuários:', error);
  } finally {
    console.log('Finalizando conexão...');
    await mongoose.disconnect();
    console.log('Conexão finalizada');
    process.exit(0);
  }
}

// Executar a função
console.log('Iniciando script de atualização...');
updateExistingUsers(); 