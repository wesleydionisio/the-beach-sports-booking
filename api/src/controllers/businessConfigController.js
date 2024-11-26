const BusinessConfig = require('../models/BusinessConfig');

// Buscar configurações
exports.getBusinessConfig = async (req, res) => {
  try {
    let config = await BusinessConfig.findOne();
    
    if (!config) {
      config = await BusinessConfig.create({
        nome: 'Beach Sports',
        telefone: '(00) 0000-0000',
        endereco: 'Endereço Padrão',
        horario_abertura: '06:00',
        horario_fechamento: '22:00',
        valor_hora_padrao: 120,
        valor_hora_nobre: 150,
        percentual_hora_nobre: 25,
        min_time_before_booking: 60,
        horarios_nobres: ['18:00', '19:00', '20:00']
      });
    }

    res.json({
      success: true,
      config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar configurações',
      error: error.message
    });
  }
};

// Atualizar configurações
exports.updateBusinessConfig = async (req, res) => {
  try {
    const config = await BusinessConfig.findOneAndUpdate(
      {}, // filtro vazio pois só teremos uma config
      req.body,
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Configurações atualizadas com sucesso',
      config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar configurações',
      error: error.message
    });
  }
}; 