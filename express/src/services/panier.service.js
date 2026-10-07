import { reservation, reservationDetail, produit } from "../data/model/index.model.js";
import { v4 as uuidv4 } from 'uuid';



// Obtenir le panier actuel de l'utilisateur
export const getPanier = async (userId) => {
    let panier = await reservation.findOne({
        where: { user_id: userId, statut: 'en_attente' },
        include: [
            {
                model: reservationDetail,
                as: 'details',
                include: [
                    { model: produit, as: 'produit' }
                ]
            }
        ]
    });

    // Si pas de panier, en créer un
    if (!panier) {
        panier = await reservation.create({
            user_id: userId,
            reference: `PAN-${uuidv4().slice(0, 8)}`,
            statut: 'en_attente',
            date_reservation: new Date(),
            dateRetrait: null,
            typeLivraison: 'retrait_salle',
            montant_total: 0
        });
    }

    return panier;
};

export const ajouterAuPanier = async (userId, produitId, quantite = 1) => {
    const panier = await getPanier(userId);
    const produitTrouve = await produit.findByPk(produitId);
    
    if (!produitTrouve) throw new Error("Produit non trouvé");
    if (produitTrouve.stock < quantite) throw new Error("Stock insuffisant");
    
    let detail = await reservationDetail.findOne({
        where: { reservation_id: panier.id, produit_id: produitId }
    });
    
    if (detail) {
        await detail.update({ quantite: detail.quantite + quantite });
    } else {
        detail = await reservationDetail.create({
            reservation_id: panier.id,
            produit_id: produitId,
            quantite: quantite,
            prix_unitaire: produitTrouve.prix
        });
    }
    
    await recalculerMontantTotal(panier.id);
    return detail;
};

// Retirer du panier
export const retirerDuPanier = async (userId, produitId) => {
    const panier = await getPanier(userId);
    
    await reservationDetail.destroy({
        where: { reservation_id: panier.id, produit_id: produitId }
    });
    
    await recalculerMontantTotal(panier.id);
    return true;
};

// Modifier la quantité
export const modifierQuantite = async (userId, produitId, quantite) => {
    if (quantite <= 0) {
        return await retirerDuPanier(userId, produitId);
    }
    
    const panier = await getPanier(userId);
    const produit = await produit.findByPk(produitId);
    
    if (produit.stock < quantite) throw new Error("Stock insuffisant");
    
    const detail = await reservationDetail.findOne({
        where: { reservation_id: panier.id, produit_id: produitId }
    });
    
    if (!detail) throw new Error("Produit non trouvé dans le panier");
    
    await detail.update({ quantite: quantite });
    await recalculerMontantTotal(panier.id);
    
    return detail;
};

// Recalculer le montant total
const recalculerMontantTotal = async (reservationId) => {
    const details = await reservationDetail.findAll({
        where: { reservation_id: reservationId }
    });
    
    const total = details.reduce((sum, item) => {
        return sum + (item.prix_unitaire * item.quantite);
    }, 0);
    
    await reservation.update(
        { montant_total: total },
        { where: { id: reservationId } }
    );
};

// export const validerPanier = async (userId, data) => {
//     const panier = await getPanier(userId);
//     const details = await reservationDetail.findAll({
//         where: { reservation_id: panier.id },
//         include: [{ model: produit}]
//     });
    
//     if (details.length === 0) {
//         throw new Error("Panier vide");
//     }
    
//     // Vérifier le stock
//     for (const detail of details) {
//         if (detail.produit.stock < detail.quantite) {
//             throw new Error(`Stock insuffisant pour ${detail.produit.nomP}`);
//         }
//     }
    
//     // Mettre à jour la réservation
//     await panier.update({
//         dateRetrait: data.date_retrait,
//         typeLivraison: data.type_livraison || 'retrait_salle',
//         adresse_livraison: data.adresse_livraison,
//         statut: 'confirmee',
//         // notes: data.notes
//     });
    
//     // Diminuer le stock
//     for (const detail of details) {
//         await detail.produit.update({
//             stock: detail.produit.stock - detail.quantite
//         });
//     }
    
//     return panier;
// };

export const validerPanier = async (userId, data) => {
    // 1. Récupérer le panier
    const panier = await getPanier(userId);

    // 2. Récupérer les détails du panier
    const details = await reservationDetail.findAll({
        where: { reservation_id: panier.id },
        include: [{
            model: produit,
            as: 'produit'
        }]
    });

    // 3. Vérifier que le panier n'est pas vide
    if (details.length === 0) {
        throw new Error("Panier vide");
    }

    // 4. Vérifier le stock pour chaque produit
    for (const detail of details) {
        if (!detail.produit) {
            throw new Error(`Produit non trouvé pour l'ID ${detail.produit_id}`);
        }
        if (detail.produit.stock < detail.quantite) {
            throw new Error(`Stock insuffisant pour ${detail.produit.nom || detail.produit.nomP}`);
        }
    }

    // 5. Mettre à jour la réservation
    await panier.update({
        dateRetrait: data.date_retrait || data.dateRetrait || null,
        typeLivraison: data.type_livraison || data.typereservation || 'retrait_salle',
        adresse_livraison: data.adresse_livraison || data.addresseLivraison || null,
        montant_total: details.reduce((sum, d) => sum + (d.quantite * d.prix_unitaire), 0),
        statut: 'confirmee'
    });

    // 6. Diminuer le stock
    for (const detail of details) {
        await detail.produit.update({
            stock: detail.produit.stock - detail.quantite
        });
    }

    // 7. Recharger le panier avec les détails
    const panierComplet = await reservation.findByPk(panier.id, {
        include: [{
            model: reservationDetail,
            as: 'details',
            include: [{
                model: produit,
                as: 'produit'
            }]
        }]
    });

    return panierComplet;
};