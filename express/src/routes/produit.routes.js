import { Router } from 'express';
import {
  createProduit,
  deleteProduit,
  getAllProduits,
  getCategories,
  getNouveauxArrivages,
  getPopularProduits,
  getProduitById,
  getProduitsByCategorie,
  getRecommandations,
  updateProduit,
} from '../controllers/produit.controllers.js';
import { requireRole, verifyToken } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.js';

const produitRoutes = Router();

console.log('[produit.routes] Initialisation des routes produits');

produitRoutes.get('/categories', getCategories);
produitRoutes.get('/nouveaux', getNouveauxArrivages);
produitRoutes.get('/populaires', getPopularProduits);
produitRoutes.get('/recommandations/:objectif_id', getRecommandations);
produitRoutes.get('/categorie/:categorie_id', getProduitsByCategorie);
produitRoutes.get('/prod', getAllProduits);
produitRoutes.get('/:id', getProduitById);
produitRoutes.post('/createP', upload.single('image'), createProduit);
produitRoutes.put('/:id', verifyToken, requireRole(2), upload.single('image'), updateProduit);
produitRoutes.delete('/:id', verifyToken,requireRole(2),deleteProduit);

export default produitRoutes;
