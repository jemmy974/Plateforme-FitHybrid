import api from './api';

export const categorieService = {
    getAll: async () => {
        const response = await api.get('/categorie/categ');
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/categorie/CCate', data);
        return response.data;
    },
};