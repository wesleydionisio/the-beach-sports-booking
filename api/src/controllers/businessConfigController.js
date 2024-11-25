const BusinessConfig = require('../models/BusinessConfig');

exports.getConfig = async (req, res) => {
  try {
    let config = await BusinessConfig.findOne();
    
    if (!config) {
      // Criar configuração padrão se não existir
      config = await BusinessConfig.create({
        nome: 'Nome da Empresa',
        telefone: '(00) 0000-0000',
        endereco: 'Endereço padrão',
        horario_abertura: '08:00',
        horario_fechamento: '22:00',
        valor_hora_padrao: 120,
        valor_hora_nobre: 150,
        percentual_hora_nobre: 25,
        min_time_before_booking: 60 // 1 hora
      });
    }

    res.status(200).json(config);
  } catch (err) {
    console.error('Erro ao buscar configurações:', err);
    res.status(500).json({ 
      message: 'Erro ao buscar configurações.',
      error: err.message 
    });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const config = await BusinessConfig.findOneAndUpdate(
      {}, // atualiza o primeiro documento
      req.body,
      { new: true, upsert: true }
    );

    res.status(200).json(config);
  } catch (err) {
    res.status(500).json({ 
      message: 'Erro ao atualizar configurações.',
      error: err.message 
    });
  }
}; 