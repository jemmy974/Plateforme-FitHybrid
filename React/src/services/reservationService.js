import api from './api.js';

export const reservationService = {
  getCart: async (userId) => {
    const response = await api.get(`/reservation/${userId}`);
    return response.data?.data || response.data;
  },

  addToCart: async (userId, produitId, quantite = 1) => {
    const response = await api.post(`/reservation/${userId}/ajouter/${produitId}`, { quantite });
    return response.data;
  },

  removeFromCart: async (userId, produitId) => {
    const response = await api.delete(`/reservation/${userId}/retirer/${produitId}`);
    return response.data;
  },

  validateCart: async (userId, data) => {
    const response = await api.post(`/reservation/${userId}/valider`, data);
    return response.data;
  },
};
