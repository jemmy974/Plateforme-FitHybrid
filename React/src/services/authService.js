import api from "./api";

const authService = {
    // Login
    login: async (email, mdp) => {
        try {
            const response = await api.post('/user/login', { email, mdp });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Erreur de connexion' };
        }
    },

    // Inscription
    register: async (userData) => {
        try {
            const response = await api.post('/user/create', userData);
            return response.data;
        } catch (error) {
            throw error.response.data; 
        }
        throw {message:'Impossible de contacter le serveur'}
    },

    // Déconnexion
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    // Vérifier si l'utilisateur est connecté
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Récupérer l'utilisateur courant
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Vérifier le token
    verifyToken: async () => {
        try {
            const response = await api.get('/auth/verify');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Token invalide' };
        }
    },

    // ✅ Ajouter cette méthode
registerWithPhoto: async (formData) => {
    const response = await api.post('/auth/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}
}

export default authService;