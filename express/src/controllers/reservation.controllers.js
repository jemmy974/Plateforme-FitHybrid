import expressAsyncHandler from 'express-async-handler';
import { getPanier, ajouterAuPanier, retirerDuPanier, modifierQuantite, validerPanier } from '../services/panier.service.js';

export const voirPanier = expressAsyncHandler(async (req, res) => {
    const panier = await getPanier(req.params.userId);
    res.json({ success: true, data: panier });
});

export const ajouter = expressAsyncHandler(async (req, res) => {
    const { userId, produitId } = req.params;
    const { quantite } = req.body;
    
    const result = await ajouterAuPanier(userId, produitId, quantite || 1);
    res.json({ success: true, message: "Produit ajouté au panier", data: result });
});

export const retirer = expressAsyncHandler(async (req, res) => {
    const { userId, produitId } = req.params;
    await retirerDuPanier(userId, produitId);
    res.json({ success: true, message: "Produit retiré du panier" });
});

export const modifier = expressAsyncHandler(async (req, res) => {
    const { userId, produitId } = req.params;
    const { quantite } = req.body;
    
    const result = await modifierQuantite(userId, produitId, quantite);
    res.json({ success: true, message: "Quantité modifiée", data: result });
});

// export const valider = expressAsyncHandler(async (req, res) => {
//     const { userId } = req.params;
//     const commande = await validerPanier(userId, req.body);
//     res.json({ success: true, message: "Commande validée !", data: commande });
// });

export const valider = expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    console.log('📥 Validation du panier pour l\'utilisateur:', userId);
    console.log('📥 Données reçues:', req.body);

    try {
        const commande = await validerPanier(userId, req.body);
        
        res.status(200).json({
            success: true,
            message: "Commande validée avec succès !",
            data: commande
        });
    } catch (error) {
        console.error('❌ Erreur validation:', error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});