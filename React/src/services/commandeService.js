import api from './api';

export const commandeService = {
    // Récupérer toutes les commandes
    getAll: async () => {
        const response = await api.get('/commandes/commande');
        return response.data;
    },

     // ✅ Récupérer les commandes d'un utilisateur
    getByUser: async (userId) => {
        const response = await api.get(`/commandes/user/${userId}`);
        return response.data.data || response.data || [];
    },

    // Récupérer une commande par ID
    getById: async (id) => {
        const response = await api.get(`/commandes/${id}`);
        return response.data;
    },

    // Mettre à jour le statut
    updateStatus: async (id, statut) => {
        const response = await api.patch(`/commandes/${id}/statut`, { statut });
        return response.data;
    },

    // Supprimer une commande
    delete: async (id) => {
        const response = await api.delete(`/commandes/${id}`);
        return response.data;
    }
};