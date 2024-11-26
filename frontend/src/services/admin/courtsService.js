import api from '../api';

export const courtsService = {
  getAllCourts: async () => {
    try {
      const response = await api.get('/api/admin/courts');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar quadras:', error);
      throw error;
    }
  },

  getCourtById: async (id) => {
    try {
      const response = await api.get(`/api/courts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar quadra:', error);
      throw error;
    }
  },

  updateCourt: async (id, courtData) => {
    try {
      const response = await api.put(`/api/courts/${id}`, courtData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar quadra:', error);
      throw error;
    }
  }
}; 