const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas do dashboard precisam de autenticação
router.use(authMiddleware);

// Rota para buscar métricas do dashboard
router.get('/metrics', dashboardController.getDashboardMetrics);

module.exports = router; 