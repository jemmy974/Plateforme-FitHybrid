import api from './api';

export const userService = {
    // ✅ Récupérer tous les utilisateurs
    getAll: async () => {
        const response = await api.get('/user/users');
        return response.data;
    },

    // ✅ Récupérer un utilisateur par ID
    getById: async (id) => {
        const response = await api.get(`/user/${id}`);
        return response.data;
    },

    // ✅ Mettre à jour le statut
    updateStatus: async (id, status) => {
        const response = await api.patch(`/user/${id}/status`, { status });
        return response.data;
    },

    // ✅ Mettre à jour le rôle
    updateRole: async (id, role) => {
        const response = await api.patch(`/user/${id}/role`, { role });
        return response.data;
    },

    // ✅ Supprimer un utilisateur
    delete: async (id) => {
        const response = await api.delete(`/user/${id}`);
        return response.data;
    },

    // ✅ Créer un utilisateur (admin)
    create: async (data) => {
        const response = await api.post('/users', data);
        return response.data;
    }
};