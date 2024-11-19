// src/middlewares/validateRequest.js

const Joi = require('joi');

/**
 * Middleware para validar a requisição com base no esquema fornecido.
 * @param {Joi.ObjectSchema} schema - Esquema de validação do Joi.
 * @returns Middleware do Express.
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const options = {
      abortEarly: false, // Mostrar todos os erros
      allowUnknown: true, // Permitir chaves desconhecidas
      stripUnknown: true // Remover chaves desconhecidas
    };

    const { error, value } = schema.validate(req.body, options);

    if (error) {
      const errorDetails = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validação falhou.',
        errors: errorDetails,
      });
    }

    req.body = value;
    next();
  };
};

module.exports = validateRequest;