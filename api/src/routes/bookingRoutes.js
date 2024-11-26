// src/routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/check', bookingController.checkTimeSlots);

// Rotas protegidas
router.use(authMiddleware);

// IMPORTANTE: Colocar rotas específicas antes das rotas com parâmetros
router.get('/minhas-reservas', bookingController.getUserBookings); // Mudamos o path para evitar conflito

// Rotas de recorrência
router.post('/recorrencia/preview', bookingController.previewRecorrencia);
router.post('/recorrencia/confirmar', bookingController.confirmarRecorrencia);

// Rotas com parâmetros devem vir por último
router.post('/', bookingController.createBooking);
router.get('/:id', bookingController.getBookingById);
router.post('/:id/cancel', bookingController.cancelBooking);
router.patch('/:id', bookingController.updateBooking);

module.exports = router;