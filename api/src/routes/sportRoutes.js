const express = require('express');
const router = express.Router();
const sportController = require('../controllers/sportController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rotas públicas
router.get('/', sportController.getSports);

// Rotas administrativas
router.use(authMiddleware);
router.use(adminMiddleware);
router.post('/', sportController.createSport);
router.put('/:id', sportController.updateSport);
router.delete('/:id', sportController.deleteSport);

module.exports = router;