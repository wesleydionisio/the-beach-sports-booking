const express = require('express');
const router = express.Router();

// Controller para métricas do dashboard
router.get('/metrics', async (req, res) => {
  try {
    // Dados mockados para teste inicial
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

    res.json(metrics);
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    res.status(500).json({ error: 'Erro interno ao buscar métricas' });
  }
});

module.exports = router; 