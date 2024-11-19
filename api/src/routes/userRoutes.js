// src/routes/userRoutes.js

const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Rota para obter o perfil do usuário
router.get('/profile', authMiddleware, userController.getUserProfile);

// Rota para atualizar o perfil do usuário
router.put('/profile', authMiddleware, userController.updateUserProfile);

// Outras rotas relacionadas a usuários...

module.exports = router;