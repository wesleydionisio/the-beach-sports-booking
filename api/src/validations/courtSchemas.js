const Joi = require('joi');

const courtSchema = Joi.object({
  nome: Joi.string().required().messages({
    'any.required': 'O campo "nome" é obrigatório.',
    'string.empty': 'O campo "nome" não pode estar vazio.',
  }),
  descricao: Joi.string().optional(),
  foto_principal: Joi.string().uri().optional().messages({
    'string.uri': 'O campo "foto_principal" deve ser uma URL válida.',
  }),
  galeria: Joi.array().items(Joi.string().uri()).optional(),
  duracao_padrao: Joi.number().integer().positive().required().messages({
    'any.required': 'O campo "duracao_padrao" é obrigatório.',
    'number.positive': 'O campo "duracao_padrao" deve ser um número positivo.',
  }),
  esportes_permitidos: Joi.array().items(Joi.string().length(24)).optional(), // IDs MongoDB
});

module.exports = { courtSchema };