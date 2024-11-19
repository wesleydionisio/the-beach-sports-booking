const Joi = require('joi');

const bookingSchema = Joi.object({
  data: Joi.date().required().messages({
    'any.required': 'O campo "data" é obrigatório.',
    'date.base': 'O campo "data" deve ser uma data válida.',
  }),
  horario_inicio: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
    'any.required': 'O campo "horario_inicio" é obrigatório.',
    'string.pattern.base': 'O campo "horario_inicio" deve estar no formato HH:mm.',
  }),
  horario_fim: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
    'any.required': 'O campo "horario_fim" é obrigatório.',
    'string.pattern.base': 'O campo "horario_fim" deve estar no formato HH:mm.',
  }),
  quadra_id: Joi.string().length(24).required().messages({
    'any.required': 'O campo "quadra_id" é obrigatório.',
    'string.length': 'O campo "quadra_id" deve ter 24 caracteres.',
  }),
  usuario_id: Joi.string().length(24).required().messages({
    'any.required': 'O campo "usuario_id" é obrigatório.',
    'string.length': 'O campo "usuario_id" deve ter 24 caracteres.',
  }),
});

module.exports = { bookingSchema };