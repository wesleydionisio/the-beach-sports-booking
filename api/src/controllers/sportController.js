const Sport = require('../models/Sport');

exports.getSports = async (req, res) => {
  try {
    const sports = await Sport.find()
      .sort('displayOrder')
      .select('nome icon active displayOrder');

    res.status(200).json({
      success: true,
      data: sports
    });
  } catch (error) {
    console.error('Erro ao buscar esportes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar esportes'
    });
  }
};

exports.createSport = async (req, res) => {
  try {
    const sport = await Sport.create(req.body);
    res.status(201).json({
      success: true,
      data: sport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar esporte'
    });
  }
};

exports.updateSport = async (req, res) => {
  try {
    const sport = await Sport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: 'Esporte não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: sport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar esporte'
    });
  }
};

exports.deleteSport = async (req, res) => {
  try {
    const sport = await Sport.findByIdAndDelete(req.params.id);

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: 'Esporte não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: sport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir esporte'
    });
  }
}; 