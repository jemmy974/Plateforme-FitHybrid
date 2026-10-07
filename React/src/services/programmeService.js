import api from './api';

export const programmeService = {
    // Récupérer tous les programmes
    getAll: async () => {
        const response = await api.get('programme/Gprogramme');
        return response.data;
    },

    getByObjectif: async (objectif_id) => {
        const response = await api.get(`/programme/${objectif_id}`);
        return response.data;
    },
    // Récupérer un programme
    getById: async (id) => {
        const response = await api.get(`/programme/${id}`);
        return response.data;
    },

    // Créer un programme
    createP: async (data) => {
        const response = await api.post('/programme/create', data);
        return response.data;
    },

    // Mettre à jour
    update: async (id, data) => {
        const response = await api.put(`/programme/maj/${id}`, data);
        return response.data;
    },

    // Supprimer
    delete: async (id) => {
        const response = await api.delete(`/programme/delete/${id}`);
        return response.data;
    }
};