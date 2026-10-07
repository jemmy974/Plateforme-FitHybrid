import api from './api';

export const exerciceService = {
    // Récupérer tous les exercices
    getAll: async () => {
        const response = await api.get('/exercice/getE');
        return response.data;
    },

    // Créer avec fichier (FormData)
    createEx: async (formData) => {
        const response = await api.post('/exercice/uploadV', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateWithFile: async (id, formData) => {
        const response = await api.put(`/exercice/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // ✅ Supprimer un exercice
    delete: async (id) => {
        const response = await api.delete(`/exercice/${id}`);
        return response.data;
    },

    // Pour les cas sans fichier
    update: async (id, data) => {
        const response = await api.put(`/exercice/${id}`, data);
        return response.data;
    }
};
