const Joi = require('joi');

// Validação para o registro de usuário
const userRegisterSchema = Joi.object({
  nome: Joi.string()
    .required()
    .trim()
    .min(3)
    .messages({
      'any.required': 'Nome é obrigatório',
      'string.empty': 'Nome não pode estar vazio',
      'string.min': 'Nome deve ter pelo menos 3 caracteres'
    }),
    
  email: Joi.string()
    .required()
    .email()
    .lowercase()
    .trim()
    .messages({
      'any.required': 'Email é obrigatório',
      'string.email': 'Email inválido',
      'string.empty': 'Email não pode estar vazio'
    }),
    
  senha: Joi.string()
    .required()
    .min(6)
    .messages({
      'any.required': 'Senha é obrigatória',
      'string.min': 'Senha deve ter pelo menos 6 caracteres',
      'string.empty': 'Senha não pode estar vazia'
    }),
    
  telefone: Joi.string()
    .required()
    .pattern(/^\(\d{2}\)\s\d\s\d{4}-\d{4}$/)
    .trim()
    .options({ convert: true })
    .messages({
      'any.required': 'Telefone é obrigatório',
      'string.empty': 'Telefone não pode estar vazio',
      'string.pattern.base': 'Telefone deve estar no formato (99) 9 9999-9999'
    })
}).options({
  stripUnknown: true,
  abortEarly: false
});

// Validação para o login de usuário
const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'O campo "email" é obrigatório',
    'string.email': 'Email inválido',
    'string.empty': 'O campo "email" não pode estar vazio'
  }),
  senha: Joi.string().required().messages({
    'any.required': 'O campo "senha" é obrigatório',
    'string.empty': 'O campo "senha" não pode estar vazio'
  })
});

module.exports = {
  userRegisterSchema,
  userLoginSchema
};