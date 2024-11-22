const express = require('express');
const router = express.Router();
const sportController = require('../controllers/sportController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/', sportController.getSports);

// Rotas protegidas
router.use(authMiddleware);
router.post('/', sportController.createSport);
router.put('/:id', sportController.updateSport);
router.delete('/:id', sportController.deleteSport);

module.exports = router; 