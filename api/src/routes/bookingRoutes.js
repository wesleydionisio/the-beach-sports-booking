// src/routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas protegidas
router.use(authMiddleware);
router.post('/', bookingController.createBooking);
router.get('/check', bookingController.checkTimeSlots);
router.post('/check-recorrencia', bookingController.checkRecorrencia);

// Adicionar esta nova rota
router.get('/:id', bookingController.getBookingById);

module.exports = router;