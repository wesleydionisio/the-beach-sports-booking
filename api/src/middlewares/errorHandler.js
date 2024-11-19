// src/middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Não defina headers adicionais a menos que necessário
  // Evite definir 'Authorization' aqui a menos que seja intencional

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor.',
  });
};

module.exports = errorHandler;