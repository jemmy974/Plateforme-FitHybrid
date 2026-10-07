import api from './api';

console.log('[produitService] Initialisation du service produits');

export const produitService = {
    getAll: async (params = {}) => {
        console.log('[produitService] getAll params:', params);
        const response = await api.get('/produits/prod', { params });
        return response.data;
    },

    getById: async (id) => {
        console.log('[produitService] getById id:', id);
        const response = await api.get(`/produits/${id}`);
        return response.data;
    },

    getNouveauxArrivages: async () => {
        console.log('[produitService] getNouveauxArrivages');
        const response = await api.get('/produits/nouveaux');
        return response.data;
    },

    getMostPopular: async () => {
        console.log('[produitService] getMostPopular');
        const response = await api.get('/produits/populaires');
        return response.data;
    },

    getRecommandations: async (objectif_id) => {
        console.log('[produitService] getRecommandations objectif_id:', objectif_id);
        const response = await api.get(`/produits/recommandations/${objectif_id}`);
        return response.data;
    },

    getByCategorie: async (categorie_id) => {
        console.log('[produitService] getByCategorie categorie_id:', categorie_id);
        const response = await api.get(`/produits/categorie/${categorie_id}`);
        return response.data;
    },

    getCategories: async () => {
        console.log('[produitService] getCategories');
        const response = await api.get('/produits/categories');
        return response.data;
    },

    // create: async (data) => {
    //     console.log('[produitService] create payload:', data);
    //     const response = await api.post('/produits/createP', data);
    //     return response.data;
    // },
    create: async (formData) => {
        console.log('[produitService] create with FormData');
        const response = await api.post('/produits/createP', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // update: async (id, data) => {
    //     console.log('[produitService] update id:', id, 'payload:', data);
    //     const response = await api.put(`/produits/${id}`, data);
    //     return response.data;
    // },

    update: async (id, formData) => {
    console.log('[produitService] update id:', id);
    const response = await api.put(`/produits/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
},

    delete: async (id) => {
        console.log('[produitService] delete id:', id);
        const response = await api.delete(`/produits/${id}`);
        return response.data;
    }
};