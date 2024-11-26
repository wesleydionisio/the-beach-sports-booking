const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para criar pagamento
router.post('/create', authMiddleware, PaymentController.createPayment.bind(PaymentController));

// Rota do webhook
router.post('/webhook', PaymentController.handleWebhook.bind(PaymentController));

// Rota para verificar status
router.get('/status/:paymentId', authMiddleware, PaymentController.getPaymentStatus.bind(PaymentController));

module.exports = router; 