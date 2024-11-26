import api from '../api';

export const dashboardService = {
  getMetrics: async () => {
    try {
      const response = await api.get('/api/admin/dashboard/metrics');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      return {
        schedules: { today: 0, pending: 0, confirmed: 0, canceled: 0 },
        users: { total: 0, newToday: 0 },
        payments: { pending: 0, totalValue: 0 },
        slots: { available: 0, total: 0 }
      };
    }
  }
};

export default dashboardService; 