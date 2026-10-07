import sequelize from '../../config/database.config.js';
import categorieProduit from '../model/categorieProduit.model.js';
import produit from '../model/produit.model.js';

const categories = [
  { nomCat: 'Nutrition', description: 'Suppléments, protéines et énergie.' },
  { nomCat: 'Équipement', description: 'Matériel de musculation et training.' },
  { nomCat: 'Accessoires', description: 'Petits équipements et accessoires fitness.' },
];

const produits = [
  {
    nom: 'Whey Pro 5kg',
    description: 'Protéine de lait pour récupération optimale.',
    prix: 129900,
    stock: 30,
    image: 'https://via.placeholder.com/320x240?text=Whey+Pro',
    categorieNom: 'Nutrition',
    objectif_id: null,
    statut: 'actif',
    popularite: 85,
    est_nouveau: true,
  },
  {
    nom: 'Kettlebell 16kg',
    description: 'Garde la force et l’endurance du bas du corps.',
    prix: 89000,
    stock: 12,
    image: 'https://via.placeholder.com/320x240?text=Kettlebell',
    categorieNom: 'Équipement',
    objectif_id: null,
    statut: 'actif',
    popularite: 55,
    est_nouveau: false,
  },
  {
    nom: 'Tapis Yoga Premium',
    description: 'Confort et adhérence pour toutes les pratiques.',
    prix: 42000,
    stock: 25,
    image: 'https://via.placeholder.com/320x240?text=Tapis+Yoga',
    categorieNom: 'Accessoires',
    objectif_id: null,
    statut: 'actif',
    popularite: 34,
    est_nouveau: true,
  },
  {
    nom: 'Shaker Blender',
    description: 'Mélange rapide pour boissons protéinées.',
    prix: 14900,
    stock: 60,
    image: 'https://via.placeholder.com/320x240?text=Shaker',
    categorieNom: 'Accessoires',
    objectif_id: null,
    statut: 'actif',
    popularite: 77,
    est_nouveau: false,
  },
];

const seed = async () => {
  try {
    console.log('[seedData] Synchronisation de la base de données...');
    await sequelize.sync({ alter: true });

    console.log('[seedData] Création des catégories...');
    for (const categorie of categories) {
      await categorieProduit.upsert(categorie);
    }

    console.log('[seedData] Création des produits...');
    const savedCategories = await categorieProduit.findAll();
    const categoryMap = savedCategories.reduce((map, item) => {
      map[item.nomCat] = item.id;
      return map;
    }, {});

    for (const item of produits) {
      const payload = {
        nom: item.nom,
        description: item.description,
        prix: item.prix,
        stock: item.stock,
        image: item.image,
        categorie_id: categoryMap[item.categorieNom] || null,
        objectif_id: item.objectif_id,
        statut: item.statut,
        popularite: item.popularite,
        est_nouveau: item.est_nouveau,
        created_at: new Date(),
        updated_at: new Date(),
      };
      await produit.upsert(payload);
    }

    console.log('[seedData] Seed terminé.');
    process.exit(0);
  } catch (error) {
    console.error('[seedData] Erreur seed', error);
    process.exit(1);
  }
};

seed();
