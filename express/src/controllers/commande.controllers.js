// import Reservation from '../model/reservation.model.js';
// import ReservationDetail from '../model/reservationDetail.model.js';
// import Produit from '../model/produit.model.js';
// import User from '../model/user.model.js';
import { Op } from 'sequelize';
import reservation from '../data/model/reservation.model.js';
import reservationDetail from '../data/model/reservationDetail.model.js';
import produit from '../data/model/produit.model.js';
import users from '../data/model/users.model.js';

// Récupérer toutes les commandes
export const getAllCommandes = async (req, res) => {
    try {
        const commandes = await reservation.findAll({
            include: [
                {
                    model: users,
                    as: 'user',
                    attributes: ['id', 'nom', 'prenom', 'email', 'numero']
                },
                {
                    model: reservationDetail,
                    as: 'details',
                    include: [{
                        model: produit,
                        as: 'produit',
                        attributes: ['id', 'nom', 'prix', 'image']
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: commandes
        });
    } catch (error) {
        console.error('❌ Erreur:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Mettre à jour le statut
export const updateStatut = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;

        const commande = await reservation.findByPk(id);
        if (!commande) {
            return res.status(404).json({
                success: false,
                message: 'Commande non trouvée'
            });
        }

        await commande.update({ statut });

        res.status(200).json({
            success: true,
            message: 'Statut mis à jour',
            data: commande
        });
    } catch (error) {
        console.error('❌ Erreur:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Supprimer une commande
export const deleteCommande = async (req, res) => {
    try {
        const { id } = req.params;

        const commande = await reservation.findByPk(id);
        if (!commande) {
            return res.status(404).json({
                success: false,
                message: 'Commande non trouvée'
            });
        }

        // Supprimer les détails
        await reservationDetail.destroy({
            where: { reservation_id: id }
        });

        // Supprimer la commande
        await commande.destroy();

        res.status(200).json({
            success: true,
            message: 'Commande supprimée'
        });
    } catch (error) {
        console.error('❌ Erreur:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

    
};

export const getCommandeById = async (req, res) => {
    try {
        const { id } = req.params;

        const commande = await reservation.findByPk(id, {
            include: [
                {
                    model: users,
                    as: 'user',
                    attributes: ['id', 'nom', 'prenom', 'email', 'numero']
                },
                {
                    model: reservationDetail,
                    as: 'details',
                    include: [{
                        model: produit,
                        as: 'produit',
                        attributes: ['id', 'nom', 'prix', 'image']
                    }]
                }
            ]
        });

        if (!commande) {
            return res.status(404).json({
                success: false,
                message: 'Commande non trouvée'
            });
        }

        res.status(200).json({
            success: true,
            data: commande
        });
    } catch (error) {
        console.error('❌ Erreur getCommandeById:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// ✅ Récupérer les commandes d'un utilisateur
export const getCommandesByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const commandes = await reservation.findAll({
            where: {
                user_id: userId,
                statut: {
                    [Op.not]: 'en_attente'
                }
            },
            include: [
                {
                    model: users,
                    as: 'user',
                    attributes: ['id', 'nom', 'prenom', 'email']
                },
                {
                    model: reservationDetail,
                    as: 'details',
                    include: [{
                        model: produit,
                        as: 'produit',
                        attributes: ['id', 'nom', 'prix', 'image']
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: commandes
        });
    } catch (error) {
        console.error('❌ Erreur getCommandesByUser:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getStatistiques = async (req, res) => {
    try {
        const total = await reservation.count({
            where: {
                statut: {
                    [Op.not]: 'en_attente'
                }
            }
        });

        const pending = await reservation.count({
            where: { statut: 'pending' }
        });

        const processing = await reservation.count({
            where: { statut: 'processing' }
        });

        const completed = await reservation.count({
            where: { statut: 'completed' }
        });

        const totalAmount = await reservation.sum('montant_total', {
            where: {
                statut: {
                    [Op.not]: 'panier'
                }
            }
        });

        // Commandes par jour (7 derniers jours)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyOrders = await Reservation.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: {
                createdAt: {
                    [Op.gte]: sevenDaysAgo
                },
                statut: {
                    [Op.not]: 'panier'
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
            raw: true
        });

        res.status(200).json({
            success: true,
            data: {
                total,
                pending,
                processing,
                completed,
                totalAmount: totalAmount || 0,
                dailyOrders
            }
        });
    } catch (error) {
        console.error('❌ Erreur getStatistiques:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
