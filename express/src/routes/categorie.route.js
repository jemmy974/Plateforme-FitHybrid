import { Router } from "express";
import {
    getAllCategories,
    getCategorieById,
    createCategorie,
    updateCategorie,
    deleteCategorie
} from '../controllers/categorie.controllers.js';


const categorie = Router()
// ✅ Routes publiques (tout le monde peut voir les catégories)
categorie.get('/categ', getAllCategories);
categorie.get('/:id', getCategorieById);

// ✅ Routes admin (seul l'admin peut créer/modifier/supprimer)
categorie.post('/CCate', createCategorie);
categorie.put('/:id', updateCategorie);
categorie.delete('/:id', deleteCategorie);

export default categorie;