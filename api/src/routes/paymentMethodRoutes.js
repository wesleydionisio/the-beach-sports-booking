const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/', paymentMethodController.getPaymentMethods);

// Rotas protegidas
router.use(authMiddleware);
router.post('/', paymentMethodController.createPaymentMethod);
router.put('/:id', paymentMethodController.updatePaymentMethod);
router.delete('/:id', paymentMethodController.deletePaymentMethod);

module.exports = router; 