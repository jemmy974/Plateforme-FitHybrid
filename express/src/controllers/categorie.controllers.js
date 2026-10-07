import categorieProduit from "../data/model/categorieProduit.model.js";


// ✅ Récupérer toutes les catégories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await categorieProduit.findAll({
            order: [['nomCat', 'ASC']]
        });

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('❌ Erreur getAllCategories:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Récupérer une catégorie par ID
export const getCategorieById = async (req, res) => {
    try {
        const { id } = req.params;
        const categorie = await Categorie.findByPk(id);

        if (!categorie) {
            return res.status(404).json({
                success: false,
                message: 'Catégorie non trouvée'
            });
        }

        res.status(200).json({
            success: true,
            data: categorie
        });
    } catch (error) {
        console.error('❌ Erreur getCategorieById:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Créer une catégorie (admin)
export const createCategorie = async (req, res) => {
    try {
        const data = req.body;

        if (!data.nomCat) {
            return res.status(400).json({
                success: false,
                message: 'Le nom de la catégorie est requis'
            });
        }

        const categorie = await categorieProduit.create({
            nomCat: data.nomCat,
            description: data.description || '',
            icone: data.icone || null
        });

        res.status(201).json({
            success: true,
            message: 'Catégorie créée avec succès',
            data: categorie
        });
    } catch (error) {
        // Gérer l'erreur de duplication
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                success: false,
                message: 'Une catégorie avec ce nom existe déjà'
            });
        }
        console.error('❌ Erreur createCategorie:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Mettre à jour une catégorie (admin)
export const updateCategorie = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const categorie = await Categorie.findByPk(id);
        if (!categorie) {
            return res.status(404).json({
                success: false,
                message: 'Catégorie non trouvée'
            });
        }

        await categorie.update({
            nom: data.nom || categorie.nom,
            description: data.description !== undefined ? data.description : categorie.description,
            icone: data.icone !== undefined ? data.icone : categorie.icone
        });

        res.status(200).json({
            success: true,
            message: 'Catégorie mise à jour avec succès',
            data: categorie
        });
    } catch (error) {
        console.error('❌ Erreur updateCategorie:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Supprimer une catégorie (admin)
export const deleteCategorie = async (req, res) => {
    try {
        const { id } = req.params;

        const categorie = await Categorie.findByPk(id);
        if (!categorie) {
            return res.status(404).json({
                success: false,
                message: 'Catégorie non trouvée'
            });
        }

        await categorie.destroy();

        res.status(200).json({
            success: true,
            message: 'Catégorie supprimée avec succès'
        });
    } catch (error) {
        console.error('❌ Erreur deleteCategorie:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};