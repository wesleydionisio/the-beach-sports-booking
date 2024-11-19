const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courtRoutes = require('./routes/courtRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentMethodRoutes = require('./routes/paymentMethodRoutes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware para JSON
app.use(express.json());

// Conectar ao banco de dados
connectDB();

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);

// Middleware de erro global
app.use(errorHandler);

// Rota padrão
app.get('/', (req, res) => res.send('API em funcionamento!'));

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));