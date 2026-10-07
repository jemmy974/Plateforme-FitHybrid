import express, { Router } from 'express';
const commande = Router();
import {
    getAllCommandes,
    getCommandeById,
    updateStatut,
    deleteCommande,
    getCommandesByUser,
    getStatistiques
} from '../controllers/commande.controllers.js';
import { requireRole, verifyToken } from '../middlewares/auth.middleware.js';

// ✅ Route publique pour les utilisateurs (doit être AVANT les middlewares admin)
commande.get('/user/:userId', verifyToken, getCommandesByUser);

// ✅ Routes protégées (admin seulement - niveau 2+)
commande.use(verifyToken);
commande.use(requireRole(2));

// Routes principales
commande.get('/commande', getAllCommandes);
commande.get('/statistiques', getStatistiques);
commande.get('/:id', getCommandeById);
commande.patch('/:id/statut', updateStatut);
commande.delete('/:id', deleteCommande);

export default commande;