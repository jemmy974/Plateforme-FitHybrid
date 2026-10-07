// import Salle from '../models/Salle.jsx';
// import User from '../models/user.model.js';
import Salle from "../data/model/Salle.model.js";
import users from "../data/model/users.model.js";
import "../data/model/relation.model.js";

// ✅ 1. Liste des salles
export const getAllSalles = async (req, res) => {
    try {
        const salles = await Salle.findAll({
            include: [{
                model: users,
                as: 'admin',
                attributes: ['id', 'nom', 'prenom', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, data: salles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ 2. Ajouter une salle
export const createSalle = async (req, res) => {
    try {
        const data = req.body;
        
        // Vérifier si l'email existe déjà
        const existing = await Salle.findOne({ where: { email: data.email } });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Cette salle existe déjà' });
        }

        const salle = await Salle.create({
            nom: data.nom,
            adresse: data.adresse,
            telephone: data.telephone,
            email: data.email,
            description: data.description,
            logo: data.logo || null,
            statut: 'actif',
            admin_id: data.admin_id || null,
            date_abonnement: data.date_abonnement || null,
            date_expiration: data.date_expiration || null
        });

        res.status(201).json({ success: true, message: 'Salle ajoutée avec succès', data: salle });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ 3. Modifier une salle
export const updateSalle = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const salle = await Salle.findByPk(id);
        if (!salle) {
            return res.status(404).json({ success: false, message: 'Salle non trouvée' });
        }

        await salle.update(data);
        res.status(200).json({ success: true, message: 'Salle mise à jour', data: salle });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ 4. Désactiver/Supprimer une salle
export const toggleSalleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body; // 'actif', 'inactif', 'suspendu'

        const salle = await Salle.findByPk(id);
        if (!salle) {
            return res.status(404).json({ success: false, message: 'Salle non trouvée' });
        }

        await salle.update({ statut });
        res.status(200).json({ success: true, message: `Statut changé en ${statut}`, data: salle });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ 5. Supprimer définitivement une salle
export const deleteSalle = async (req, res) => {
    try {
        const { id } = req.params;
        const salle = await Salle.findByPk(id);
        if (!salle) {
            return res.status(404).json({ success: false, message: 'Salle non trouvée' });
        }
        await salle.destroy();
        res.status(200).json({ success: true, message: 'Salle supprimée' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Consulter les détails d'une salle
export const getSalleById = async (req, res) => {
    try {
        const salle = await Salle.findByPk(req.params.id, {
            include: [{
                model: users,
                as: 'admin',
                attributes: ['id', 'nom', 'prenom', 'email']
            }]
        });

        if (!salle) {
            return res.status(404).json({ success: false, message: 'Salle non trouvée' });
        }

        res.status(200).json({ success: true, data: salle });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
