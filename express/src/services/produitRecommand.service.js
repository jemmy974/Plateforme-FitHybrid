
import { Sequelize } from "sequelize";
import { produit, categorieProduit,users,objectifs } from "../data/model/index.model.js";

export const getProduitsByObjectif = async (userId) => {
    try {
        // Récupérer l'utilisateur avec son objectif
        const user = await users.findByPk(userId, {
            include: [{
                model: objectifs,
            }]
        });

        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }

        if (!user.objectif_id) {
            return {
                success: false,
                message: "L'utilisateur n'a pas d'objectif défini",
                produits: []
            };
        }

        // Récupérer les produits recommandés pour cet objectif
        const produits = await produit.findAll({
            where: {
                objectif_id: user.objectif_id,
                stock: { [Sequelize.Op.gt]: 0 }
            },
            include: [
                {
                    model: categorieProduit,
                },
                {
                    model: objectifs,
                    as: 'objectif',
                    attributes: ['id', 'nom']
                }
            ],
            order: [['prix']]
        });

        return {
            success: true,
            data: {
                utilisateur: {
                    id: user.id,
                    nom: user.nom,
                    prenom: user.prenom
                },
                objectif: user.objectif,
                produits_recommandes: produits,
                nombre_produits: produits.length
            }
        };

    } catch (error) {
        console.error("Erreur:", error);
        throw error;
    }
};

// 3. Top produits recommandés (Apoitra eny amin voloany)
export const getTopProduitsRecommandes = async (limit = 10) => {
    const produits = await produit.findAll({
        where: {
            stock: { [Sequelize.Op.gt]: 0 },
            objectif_id: { [Sequelize.Op.not]: null }
        },
        include: [
            { model: categorieProduit },
            { model: objectifs, as: 'objectif' }
        ],
        order: [['createdAt', 'DESC']],
        limit: limit
    });
    
    return produits;
};

// 4. Vérifier si un produit est adapté à l'objectif de l'utilisateur
export const isProduitAdapte = async (userId, produitId) => {
    const user = await users.findByPk(userId);
    const produit = await produit.findByPk(produitId);
    
    if (!user || !produit) return false;
    
    return produit.objectif_id === user.objectif_id;
};