const express = require('express');
const router = express.Router();

// Rota para métricas do dashboard
router.get('/metrics', async (req, res) => {
  try {
    // Dados mockados para teste
    const metrics = {
      schedules: {
        today: 15,
        pending: 8,
        confirmed: 25,
        canceled: 3
      },
      users: {
        total: 150,
        newToday: 5
      },
      payments: {
        pending: 12,
        totalValue: 1500.00
      },
      slots: {
        available: 18,
        total: 32
      }
    };

    return res.json(metrics);
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar métricas' });
  }
});

module.exports = router; 