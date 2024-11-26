const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rotas públicas (sem autenticação)
router.get('/available-slots', bookingController.getReservedTimes); // Primeiro as rotas sem parâmetros
router.get('/check', bookingController.checkTimeSlots);
router.get('/:id/public', bookingController.getBookingPublic);

// Rotas protegidas (com autenticação)
router.use(authMiddleware);

// Rotas de usuário comum
router.get('/minhas-reservas', bookingController.getUserBookings);
router.post('/', bookingController.createBooking);
router.post('/:id/cancel', bookingController.cancelBooking);

// Rotas de recorrência
router.post('/recorrencia/preview', bookingController.previewRecorrencia);
router.post('/recorrencia/confirmar', bookingController.confirmarRecorrencia);

// Rotas administrativas
router.use(adminMiddleware);
router.get('/:id', bookingController.getBookingById);
router.patch('/:id', bookingController.updateBooking);

module.exports = router;