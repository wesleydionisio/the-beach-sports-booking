// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();

// Importar o middleware de validação
const validateRequest = require('../middlewares/validateRequest');

// Importar os esquemas de validação
const { userRegisterSchema, userLoginSchema } = require('../validations/userSchemas');

// Importar os controladores de autenticação
const { register, login } = require('../controllers/authController');

// Importar o authMiddleware e userController
const authMiddleware = require('../middlewares/authMiddleware');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

// Rota para registro de usuários com validação
router.post('/register', validateRequest(userRegisterSchema), register);

// Rota para login com validação
router.post('/login', validateRequest(userLoginSchema), login);

// Rota para obter o perfil do usuário autenticado
router.get('/me', authMiddleware, getUserProfile);

// Rota para atualizar o perfil do usuário autenticado
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;