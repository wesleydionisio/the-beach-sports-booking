// src/routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota protegida para obter reservas do usuário
router.get('/user', authMiddleware, bookingController.getUserBookings);

// Outras rotas
router.post('/', authMiddleware, bookingController.createBooking);
router.put('/:id/cancel', authMiddleware, bookingController.cancelBooking);
router.get('/:quadraId/reserved-times', bookingController.getReservedTimes);

// Adicionar esta rota para obter detalhes de uma reserva específica
router.get('/:id', authMiddleware, bookingController.getBookingById);

// Rota para cancelar uma reserva
router.put('/:id/cancel', authMiddleware, bookingController.cancelBooking);

module.exports = router;