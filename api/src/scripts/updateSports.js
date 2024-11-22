const mongoose = require('mongoose');
const Sport = require('../models/Sport');

// Mapeamento de esportes para seus respectivos ícones
const SPORTS_ICONS = {
  'Futebol': 'football.svg',
  'Basquete': 'basketball.svg',
  'Vôlei': 'volei.svg',
  'Tênis': 'tennis.svg',
  'Beach Tennis': 'beach-tennis.svg',
  'Futevôlei': 'futvolei.svg',
  // Adicione mais esportes conforme necessário
};

// Ordem de exibição padrão
const DISPLAY_ORDER = {
  'Futebol': 1,
  'Basquete': 2,
  'Vôlei': 3,
  'Tênis': 4,
  'Beach Tennis': 5,
  'Futevôlei': 6,
  // Adicione mais esportes conforme necessário
};

async function updateSports() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect('mongodb://localhost:27017/agendamentos');
    console.log('Conectado ao MongoDB');

    // Buscar todos os esportes
    const sports = await Sport.find({});
    console.log(`Encontrados ${sports.length} esportes para atualizar`);

    // Atualizar cada esporte
    for (const sport of sports) {
      const icon = SPORTS_ICONS[sport.nome] || 'default-sport.svg';
      const displayOrder = DISPLAY_ORDER[sport.nome] || 999;

      await Sport.findByIdAndUpdate(sport._id, {
        $set: {
          icon: icon,
          active: true,
          displayOrder: displayOrder
        }
      }, { new: true });

      console.log(`Atualizado: ${sport.nome} - Ícone: ${icon} - Ordem: ${displayOrder}`);
    }

    console.log('Atualização concluída!');
    
  } catch (error) {
    console.error('Erro durante a atualização:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  }
}

// Executar o script
updateSports();