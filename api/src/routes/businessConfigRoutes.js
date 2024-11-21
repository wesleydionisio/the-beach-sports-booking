const express = require('express');
const router = express.Router();
const businessConfigController = require('../controllers/businessConfigController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/', businessConfigController.getConfig);

// Rotas protegidas (requer autenticação)
router.put('/', authMiddleware, businessConfigController.updateConfig);

module.exports = router; 