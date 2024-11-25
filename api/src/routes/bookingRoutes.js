// src/routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/check', bookingController.checkTimeSlots);

// Rotas protegidas
router.use(authMiddleware);

// Rotas de agendamento normal
router.post('/', bookingController.createBooking);
router.get('/:id', bookingController.getBookingById);
router.post('/:id/cancel', bookingController.cancelBooking);
router.patch('/:id', bookingController.updateBooking);

// Rotas de recorrência
router.post('/recorrencia/preview', authMiddleware, bookingController.previewRecorrencia);
router.post('/recorrencia/confirmar', authMiddleware, bookingController.confirmarRecorrencia);

module.exports = router;