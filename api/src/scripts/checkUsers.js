const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Conectado ao MongoDB');

    const users = await User.find().select('+senha');
    console.log(`\nTotal de usuários: ${users.length}`);

    for (const user of users) {
      console.log(`\nVerificando usuário: ${user.email}`);
      console.log('Tem senha?', !!user.senha);
      
      if (!user.senha) {
        console.log('⚠️ Usuário sem senha!');
        // Aqui você pode adicionar lógica para corrigir o usuário
      }
    }

    console.log('\nVerificação concluída!');
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

checkUsers(); 