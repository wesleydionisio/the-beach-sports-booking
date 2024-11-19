// src/schemas/userSchemas.js

const Joi = require('joi');

const userRegisterSchema = Joi.object({
  nome: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
  // Adicione outros campos conforme necessário
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
});

module.exports = {
  userRegisterSchema,
  userLoginSchema,
};