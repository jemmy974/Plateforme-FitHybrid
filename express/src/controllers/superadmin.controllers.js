import users from '../data/model/users.model.js';
import Salle from '../data/model/Salle.model.js';
import programme from '../data/model/programme.model.js';
import exercice from '../data/model/exercice.model.js';
import reservation from '../data/model/reservation.model.js';
import produit from '../data/model/produit.model.js';
import categorieProduit from '../data/model/categorieProduit.model.js';
import '../data/model/relation.model.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

const userAttributes = ['id', 'nom', 'prenom', 'email', 'role', 'niveau', 'createdAt', 'updatedAt'];

const niveauByRole = {
    super_admin: 3,
    admin: 2,
    client: 0
};

const formatUser = (user) => {
    const data = user.toJSON ? user.toJSON() : user;
    return {
        ...data,
        actif: (data.niveau || 0) >= 0
    };
};

const buildUserPayload = ({ nom, prenom, email, mdp, role }) => ({
    nom,
    prenom,
    email,
    mdp,
    role,
    niveau: niveauByRole[role] || 0,
    datedn: new Date(),
    poids: 0,
    photo: '',
    genre: 'Homme',
    addresse: '',
    numero: ''
});

export const getStats = async (req, res) => {
    try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const [
            totalSalles,
            totalUsers,
            totalAdmins,
            totalClients,
            totalProducts,
            totalProgrammes,
            totalVideos,
            totalReservations,
            newUsersThisMonth,
            reservations
        ] = await Promise.all([
            Salle.count(),
            users.count(),
            users.count({ where: { role: 'admin' } }),
            users.count({ where: { role: 'client' } }),
            produit.count(),
            programme.count(),
            exercice.count(),
            reservation.count(),
            users.count({ where: { createdAt: { [Op.gte]: startOfMonth } } }),
            reservation.findAll({ attributes: ['montant_total'] })
        ]);

        const totalRevenue = reservations.reduce((sum, item) => sum + (Number(item.montant_total) || 0), 0);

        res.status(200).json({
            success: true,
            data: {
                totalSalles,
                totalUsers,
                totalAdmins,
                totalClients,
                totalProducts,
                totalProgrammes,
                totalVideos,
                totalReservations,
                totalCommandes: totalReservations,
                totalRevenue,
                newUsersThisMonth
            }
        });
    } catch (error) {
        console.error('Erreur getStats:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await users.findAll({
            attributes: userAttributes,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ success: true, data: allUsers.map(formatUser) });
    } catch (error) {
        console.error('Erreur getAllUsers:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAdmins = async (req, res) => {
    try {
        const admins = await users.findAll({
            where: { role: ['admin', 'super_admin'] },
            attributes: userAttributes,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ success: true, data: admins.map(formatUser) });
    } catch (error) {
        console.error('Erreur getAdmins:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getClients = async (req, res) => {
    try {
        const clients = await users.findAll({
            where: { role: 'client' },
            attributes: userAttributes,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ success: true, data: clients.map(formatUser) });
    } catch (error) {
        console.error('Erreur getClients:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { nom, prenom, email, mdp } = req.body;
        const role = req.body.role === 'client' ? 'client' : 'admin';

        if (!nom || !prenom || !email || !mdp) {
            return res.status(400).json({ success: false, message: 'Tous les champs sont requis' });
        }

        const existingUser = await users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Cet email est déjà utilisé' });
        }

        const hashedPassword = await bcrypt.hash(mdp, 10);
        const createdUser = await users.create(buildUserPayload({
            nom,
            prenom,
            email,
            mdp: hashedPassword,
            role
        }));

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            data: {
                id: createdUser.id,
                nom: createdUser.nom,
                prenom: createdUser.prenom,
                email: createdUser.email,
                role: createdUser.role,
                niveau: createdUser.niveau,
                actif: true
            }
        });
    } catch (error) {
        console.error('Erreur createUser:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createAdmin = (req, res) => createUser({ ...req, body: { ...req.body, role: 'admin' } }, res);
export const createClient = (req, res) => createUser({ ...req, body: { ...req.body, role: 'client' } }, res);

export const updateUser = async (req, res) => {
    try {
        const user = await users.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        if (user.role === 'super_admin') {
            return res.status(403).json({ success: false, message: 'Impossible de modifier le Super Administrateur' });
        }

        const allowedFields = ['nom', 'prenom', 'email', 'role'];
        const payload = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) payload[field] = req.body[field];
        });
        if (payload.role) payload.niveau = niveauByRole[payload.role] || 0;

        await user.update(payload);
        res.status(200).json({ success: true, message: 'Utilisateur mis à jour', data: formatUser(user) });
    } catch (error) {
        console.error('Erreur updateUser:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const validRoles = ['super_admin', 'admin', 'client'];

        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: 'Rôle invalide' });
        }

        const user = await users.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        if (user.role === 'super_admin' && role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Impossible de modifier le rôle du Super Administrateur' });
        }

        await user.update({ role, niveau: niveauByRole[role] });
        res.status(200).json({ success: true, message: 'Rôle mis à jour avec succès', data: formatUser(user) });
    } catch (error) {
        console.error('Erreur updateUserRole:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleUserStatus = async (req, res) => {
    try {
        const user = await users.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        if (user.role === 'super_admin') {
            return res.status(403).json({ success: false, message: 'Impossible de désactiver le Super Administrateur' });
        }

        const actif = req.body.actif !== false;
        await user.update({ niveau: actif ? niveauByRole[user.role] : -1 });
        res.status(200).json({ success: true, message: 'Statut mis à jour', data: formatUser(user) });
    } catch (error) {
        console.error('Erreur toggleUserStatus:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const resetUserPassword = async (req, res) => {
    try {
        const { nouveau_mdp } = req.body;
        if (!nouveau_mdp || nouveau_mdp.length < 6) {
            return res.status(400).json({ success: false, message: 'Le mot de passe doit contenir au moins 6 caractères' });
        }

        const user = await users.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        await user.update({ mdp: await bcrypt.hash(nouveau_mdp, 10) });
        res.status(200).json({ success: true, message: 'Mot de passe réinitialisé' });
    } catch (error) {
        console.error('Erreur resetUserPassword:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await users.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        if (user.role === 'super_admin') {
            return res.status(403).json({ success: false, message: 'Impossible de supprimer le Super Administrateur' });
        }

        await user.destroy();
        res.status(200).json({ success: true, message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.error('Erreur deleteUser:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await produit.findAll({
            include: [{ model: categorieProduit, as: 'categorie' }],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: products.map((item) => ({
                ...item.toJSON(),
                verifie: item.statut === 'actif'
            }))
        });
    } catch (error) {
        console.error('Erreur getAllProducts:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyProduct = async (req, res) => {
    try {
        const item = await produit.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Produit introuvable' });
        }

        await item.update({ statut: req.body.verifie ? 'actif' : 'inactif' });
        res.status(200).json({ success: true, message: 'Produit mis à jour', data: item });
    } catch (error) {
        console.error('Erreur verifyProduct:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const item = await produit.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Produit introuvable' });
        }

        await item.destroy();
        res.status(200).json({ success: true, message: 'Produit supprimé avec succès' });
    } catch (error) {
        console.error('Erreur deleteProduct:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProgrammes = async (req, res) => {
    try {
        const programmes = await programme.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json({ success: true, data: programmes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getVideos = async (req, res) => {
    try {
        const videos = await exercice.findAll({
            where: { video: { [Op.ne]: null } },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, data: videos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteProgrammeContent = async (req, res) => {
    try {
        const item = await programme.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Programme introuvable' });
        }
        await item.destroy();
        res.status(200).json({ success: true, message: 'Programme supprimé' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteVideoContent = async (req, res) => {
    try {
        const item = await exercice.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Vidéo introuvable' });
        }
        await item.destroy();
        res.status(200).json({ success: true, message: 'Vidéo supprimée' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSettings = async (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            plateforme: 'HybridFit',
            roles: [
                { role: 'super_admin', niveau: 3, permissions: ['all'] },
                { role: 'admin', niveau: 2, permissions: ['manage_products', 'manage_programmes'] },
                { role: 'client', niveau: 0, permissions: ['shop', 'view_programmes'] }
            ]
        }
    });
};
