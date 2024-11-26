const express = require('express');
const router = express.Router();
const businessConfigController = require('../controllers/businessConfigController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rota pública
router.get('/', businessConfigController.getBusinessConfig);

// Rotas administrativas
router.use(authMiddleware);
router.use(adminMiddleware);
router.put('/', businessConfigController.updateBusinessConfig);

module.exports = router;