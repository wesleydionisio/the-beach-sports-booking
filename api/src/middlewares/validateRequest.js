// src/middlewares/validateRequest.js

const Joi = require('joi');

/**
 * Middleware para validar a requisição com base no esquema fornecido.
 * @param {Joi.ObjectSchema} schema - Esquema de validação do Joi.
 * @returns Middleware do Express.
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    console.group('Validação de Requisição');
    console.log('Dados recebidos:', req.body);
    
    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    };

    const { error, value } = schema.validate(req.body, options);
    
    if (error) {
      console.log('Erro de validação:', {
        details: error.details,
        value: value
      });
      console.groupEnd();
      
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        details: error.details
      });
    }

    console.log('Dados validados:', value);
    console.groupEnd();

    req.body = value;
    next();
  };
};

module.exports = validateRequest;