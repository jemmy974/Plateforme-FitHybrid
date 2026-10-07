import expressAsyncHandler from 'express-async-handler';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import produit from '../data/model/produit.model.js';
import categorieProduit from '../data/model/categorieProduit.model.js';

console.log('[produit.controllers] Initialisation du contrôleur produits');

const validateProduit = (data) => {
  const errors = [];

  if (!data.nom || !String(data.nom).trim()) {
    errors.push('Le nom du produit est requis');
  }

  const prix = Number(data.prix);
  if (!data.prix || Number.isNaN(prix) || prix <= 0) {
    errors.push('Le prix doit être supérieur à 0');
  }

  const stock = Number(data.stock);
  if (data.stock === undefined || data.stock === null || Number.isNaN(stock) || stock < 0) {
    errors.push('Le stock ne peut pas être négatif');
  }

  return errors;
};

export const getAllProduits = expressAsyncHandler(async (req, res) => {
  console.log('[produit.controllers] getAllProduits called with query:', req.query);

  const { categorie_id, search, page = 1, limit = 20, popular, nouveau, disponible } = req.query;
  const where = {};

  if (categorie_id) where.categorie_id = categorie_id;
  if (disponible === 'true') where.stock = { [Op.gt]: 0 };
  if (popular === 'true') where.popularite = { [Op.gte]: 1 };
  if (nouveau === 'true') where.est_nouveau = true;

  if (search) {
    where[Op.or] = [
      { nom: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }

  const offset = (Number(page) - 1) * Number(limit);

  const produits = await produit.findAndCountAll({
    where,
    include: [{ model: categorieProduit, as: 'categorie' }],
    order: [['created_at', 'DESC']],
    limit: Number(limit),
    offset,
  });

  res.status(200).json({
    success: true,
    data: produits.rows,
    total: produits.count,
    page: Number(page),
    limit: Number(limit),
  });
});

export const getProduitById = expressAsyncHandler(async (req, res) => {
  console.log('[produit.controllers] getProduitById called for id:', req.params.id);

  const item = await produit.findByPk(req.params.id, {
    include: [{ model: categorieProduit, as: 'categorie' }],
  });

  if (!item) {
    return res.status(404).json({ success: false, message: 'Produit introuvable' });
  }

  res.status(200).json({ success: true, data: item });
});

export const getNouveauxArrivages = expressAsyncHandler(async (req, res) => {
  console.log('[produit.controllers] getNouveauxArrivages called');

  const produits = await produit.findAll({
    where: { est_nouveau: true, stock: { [Op.gt]: 0 } },
    include: [{ model: categorieProduit, as: 'categorie' }],
    order: [['created_at', 'DESC']],
    limit: 8,
  });

  res.status(200).json({ success: true, data: produits });
});

export const getPopularProduits = expressAsyncHandler(async (req, res) => {
  console.log('[produit.controllers] getPopularProduits called');

  const produits = await produit.findAll({
    where: { popularite: { [Op.gte]: 1 }, stock: { [Op.gt]: 0 } },
    include: [{ model: categorieProduit, as: 'categorie' }],
    order: [['popularite', 'DESC'], ['created_at', 'DESC']],
    limit: 8,
  });

  res.status(200).json({ success: true, data: produits });
});

export const getRecommandations = expressAsyncHandler(async (req, res) => {
  console.log('[produit.controllers] getRecommandations called for objectif_id:', req.params.objectif_id);

  const objectif_id = req.params.objectif_id;
  const produits = await produit.findAll({
    where: { objectif_id, stock: { [Op.gt]: 0 } },
    include: [{ model: categorieProduit, as: 'categorie' }],
    order: [['prix', 'ASC']],
    limit: 8,
  });

  res.status(200).json({ success: true, data: produits });
});

export const getProduitsByCategorie = expressAsyncHandler(async (req, res) => {
  console.log('[produit.controllers] getProduitsByCategorie called for categorie_id:', req.params.categorie_id);

  const produits = await produit.findAll({
    where: { categorie_id: req.params.categorie_id, stock: { [Op.gt]: 0 } },
    include: [{ model: categorieProduit, as: 'categorie' }],
    order: [['created_at', 'DESC']],
  });

  res.status(200).json({ success: true, data: produits });
});

export const getCategories = expressAsyncHandler(async (req, res) => {
  console.log('[produit.controllers] getCategories called');

  const categories = await categorieProduit.findAll({
    order: [['nomCat', 'ASC']],
  });

  res.status(200).json({ success: true, data: categories });
});

// export const createProduit = expressAsyncHandler(async (req, res) => {
//   console.log('[produit.controllers] createProduit payload:', req.body);

//   const errors = validateProduit(req.body);
//   if (errors.length > 0) {
//     return res.status(400).json({ success: false, message: errors[0] });
//   }

//   const payload = {
//     nom: String(req.body.nom).trim(),
//     description: req.body.description || '',
//     prix: Number(req.body.prix),
//     stock: Number(req.body.stock || 0),
//     image: req.body.image || req.body.photo || '',
//     categorie_id: req.body.categorie_id || null,
//     objectif_id: req.body.objectif_id || null,
//     statut: req.body.statut || 'actif',
//     popularite: Number(req.body.popularite || 0),
//     est_nouveau: req.body.est_nouveau === true || req.body.est_nouveau === 'true',
//   };

//   const created = await produit.create(payload);
//   res.status(201).json({ success: true, message: 'Produit créé avec succès', data: created });
// });

export const createProduit = expressAsyncHandler(async (req, res) => {
   console.log('[produit.controllers] createProduit');
    console.log('📥 req.body:', req.body);
    console.log('📥 req.file:', req.file);
    console.log('📥 req.files:', req.files);

    const errors = validateProduit(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ success: false, message: errors[0] });
    }

    // ✅ Si une image est uploadée, sauvegarder le chemin
    let imagePath = '';
    if (req.file) {
        imagePath = '/uploads/images/' + req.file.filename;
    }

    const payload = {
        nom: String(req.body.nom).trim(),
        description: req.body.description || '',
        prix: Number(req.body.prix),
        stock: Number(req.body.stock || 0),
        image: imagePath,  // ← Chemin de l'image
        categorie_id: req.body.categorie_id || null,
        objectif_id: req.body.objectif_id || null,
        statut: req.body.statut || 'actif',
        popularite: Number(req.body.popularite || 0),
        est_nouveau: req.body.est_nouveau === true || req.body.est_nouveau === 'true',
    };

    const created = await produit.create(payload);
    res.status(201).json({ success: true, message: 'Produit créé avec succès', data: created });
});

// export const updateProduit = expressAsyncHandler(async (req, res) => {
//   console.log('[produit.controllers] updateProduit called for id:', req.params.id, 'payload:', req.body);

//   const item = await produit.findByPk(req.params.id);
//   if (!item) {
//     return res.status(404).json({ success: false, message: 'Produit introuvable' });
//   }

//   const errors = validateProduit(req.body);
//   if (errors.length > 0) {
//     return res.status(400).json({ success: false, message: errors[0] });
//   }

//   await item.update({
//     nom: String(req.body.nom).trim(),
//     description: req.body.description || '',
//     prix: Number(req.body.prix),
//     stock: Number(req.body.stock || 0),
//     image: req.body.image || req.body.photo || '',
//     categorie_id: req.body.categorie_id || null,
//     objectif_id: req.body.objectif_id || null,
//     statut: req.body.statut || 'actif',
//     popularite: Number(req.body.popularite || 0),
//     est_nouveau: req.body.est_nouveau === true || req.body.est_nouveau === 'true',
//   });

//   res.status(200).json({ success: true, message: 'Produit mis à jour avec succès', data: item });
// });

export const updateProduit = expressAsyncHandler(async (req, res) => {
    try {
        console.log('[produit.controllers] updateProduit');
        console.log('📥 req.params:', req.params);
        console.log('📥 req.body:', req.body);
        console.log('📥 req.file:', req.file);

        const { id } = req.params;
        const item = await produit.findByPk(id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Produit introuvable' });
        }

        // ✅ DÉFINIR imagePath AVANT de l'utiliser
        let imagePath = item.image || '';

        // ✅ Gérer l'image
        if (req.file) {
            // Supprimer l'ancienne image
            if (item.image) {
                const oldPath = path.join(__dirname, '../../', item.image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            imagePath = '/uploads/images/' + req.file.filename;
        }

        const payload = {
            nom: String(req.body.nom || item.nom).trim(),
            description: req.body.description || item.description,
            prix: Number(req.body.prix || item.prix),
            stock: Number(req.body.stock || item.stock),
            image: imagePath,  // ← Maintenant défini !
            categorie_id: req.body.categorie_id || item.categorie_id,
            objectif_id: req.body.objectif_id || item.objectif_id,
            statut: req.body.statut || item.statut,
            popularite: Number(req.body.popularite || item.popularite),
            est_nouveau: req.body.est_nouveau === 'true' || req.body.est_nouveau === true || item.est_nouveau,
        };

        console.log('📤 Payload final:', payload);

        await item.update(payload);
        res.status(200).json({ success: true, message: 'Produit mis à jour avec succès', data: item });

    } catch (error) {
        console.error('❌ Erreur updateProduit:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});


export const deleteProduit = expressAsyncHandler(async (req, res) => {
  console.log('[produit.controllers] deleteProduit called for id:', req.params.id);

  const item = await produit.findByPk(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Produit introuvable' });
  }

  await item.destroy();
  res.status(200).json({ success: true, message: 'Produit supprimé avec succès' });
});
