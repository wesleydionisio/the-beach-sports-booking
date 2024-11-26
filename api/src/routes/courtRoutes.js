const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courtController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rotas públicas
router.get('/', courtController.getCourts);
router.get('/:id', courtController.getCourtById);
router.get('/:id/reserved-times', courtController.getReservedTimes);
router.get('/:quadraId/horarios-nobres', courtController.getHorariosNobres);

// Rotas administrativas
router.use(authMiddleware);
router.use(adminMiddleware);
router.post('/', courtController.createCourt);
router.put('/:id', courtController.updateCourt);
router.delete('/:id', courtController.deleteCourt);

module.exports = router;