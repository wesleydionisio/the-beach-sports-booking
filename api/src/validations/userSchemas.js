const Joi = require('joi');

// Validação para o registro de usuário
const userRegisterSchema = Joi.object({
  nome: Joi.string().required().messages({
    'any.required': 'O campo "nome" é obrigatório.',
    'string.empty': 'O campo "nome" não pode estar vazio.',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'O campo "email" é obrigatório.',
    'string.email': 'O campo "email" deve ser um e-mail válido.',
  }),
  telefone: Joi.string().optional().messages({
    'string.empty': 'O campo "telefone" não pode estar vazio.',
  }),
  senha: Joi.string().min(6).required().messages({
    'any.required': 'O campo "senha" é obrigatório.',
    'string.min': 'O campo "senha" deve ter no mínimo 6 caracteres.',
  }),
});

module.exports = { userRegisterSchema };