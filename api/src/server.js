// server.js

require('dotenv').config(); // Carrega variáveis de ambiente do .env
const express = require('express');
const connectDB = require('./config/database'); // Configuração do banco de dados
const authRoutes = require('./routes/authRoutes'); // Rotas de autenticação
const userRoutes = require('./routes/userRoutes'); // Rotas de usuários
const courtRoutes = require('./routes/courtRoutes'); // Rotas de quadras
const bookingRoutes = require('./routes/bookingRoutes'); // Rotas de agendamentos
const paymentMethodRoutes = require('./routes/paymentMethodRoutes'); // Rotas de métodos de pagamento
const errorHandler = require('./middlewares/errorHandler'); // Middleware para erros
const cors = require('cors');
const businessConfigRoutes = require('./routes/businessConfigRoutes');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const app = express();

// Middleware para analisar requisições JSON
app.use(express.json());

// Configuração explícita para permitir o frontend
app.use(cors({
  origin: 'http://localhost:3001', // URL do frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));

// Conectar ao banco de dados
connectDB();

// Rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/business-config', businessConfigRoutes);

// Middleware de erros (deve estar após as rotas)
app.use(errorHandler);

// Adicione este middleware para logs
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Body:', req.body);
  next();
});

// Adicione este middleware para debug de rotas
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Body:`, req.body);
  next();
});

// Rota padrão para testar o servidor
app.get('/', (req, res) => {
  res.send('API em funcionamento!');
});

// Middleware de erro para debug
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Erro interno do servidor',
    error: err.message 
  });
});

// Adicione um endpoint de health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Inicializar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});