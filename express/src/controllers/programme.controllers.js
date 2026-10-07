import expressAsyncHandler from "express-async-handler";
import { recVideo } from "../services/exercice.service.js";
import programmeExo from "../data/model/programmeExo.model.js";
import programme from "../data/model/programme.model.js";
import exercice from "../data/model/exercice.model.js";
import { getProgrammeWithExercices } from "../services/programme.service.js";


export const createProgramme = expressAsyncHandler(async (req, res) => {
    const data = req.body;

    console.log('📥 Données reçues par le backend:', JSON.stringify(data, null, 2));
    console.log('📥 Exercices reçus:', data.exercices);

    // ✅ Status par défaut : actif
    data.status = data.status || 'actif';

    // ✅ 1. Créer le programme
    const result = await programme.create({
        nomPro: data.nomPro || data.nom || 'Sans nom',
        description: data.description || '',
        objectif_id: data.objectif_id,
        niveau: data.niveau || 'debutant',
        duree: data.duree || '',
        status: data.status
    });

    if (!result) {
        return res.status(400).json({
            success: false,
            message: "Le programme n'a pas été créé"
        });
    }

    console.log('✅ Programme créé avec ID:', result.id);

    // ✅ 2. Ajouter les exercices si présents
    if (data.exercices && data.exercices.length > 0) {
        for (const ex of data.exercices) {
            await programmeExo.create({
                programme_id: result.id,
                exercice_id: ex.exercice_id,
                serie: ex.serie || '0',
                repetition: ex.repetition || '0'
            });
        }
        console.log(`✅ ${data.exercices.length} exercices ajoutés au programme`);
    }

    // ✅ 3. Récupérer le programme avec ses exercices
    const programmeComplet = await programme.findByPk(result.id, {
        include: [{
            model: programmeExo,
            as: 'programmeExos'
        }]
    });

    res.status(201).json({
        success: true,
        message: "Programme créé avec succès",
        data: programmeComplet || result
    });
});



// ✅ Ajouter un exercice à un programme
export const addExerciceToProgramme = async (req, res) => {
    try {
        const { programme_id, exercice_id } = req.params;
        const { series, repetitions, description } = req.body;
        
        // 1. Vérifier que le programme existe
        const programmes = await programme.findByPk(programme_id);
        if (!programmes) {
            return res.status(404).json({ error: "Programme non trouvé" });
        }
        
        // 2. Vérifier que l'exercice existe
        const exercices = await exercice.findByPk(exercice_id);
        if (!exercices) {
            return res.status(404).json({ error: "Exercice non trouvé" });
        }
        
        // 3. Vérifier si l'association existe déjà
        const existing = await programmeExo.findOne({
            where: {
                programme_id: programme_id,
                exercice_id: exercice_id
            }
        });
        
        if (existing) {
            return res.status(400).json({ error: "Cet exercice est déjà dans le programme" });
        }
        
        // 4. Créer l'association avec TOUS les champs requis
        const association = await programmeExo.create({
            programme_id: parseInt(programme_id),
            exercice_id: parseInt(exercice_id),
            series: series || 3,           // Valeur par défaut
            repetitions: repetitions || "10",
            description: description || "Aucune description fournie"
        });
        
        res.status(201).json({
            message: "Exercice ajouté au programme",
            data: association
        });
        
    } catch (error) {
        console.error("Erreur détaillée:", error);
        res.status(500).json({ 
            error: error.message,
            sql: error.parent?.sql 
        });
    }
};

// controllers/programmeController.js


export const getProgrammeByObjectif = async (req, res) => {
  try {
    const { objectif_id } = req.params;
    
    const programme = await getProgrammeWithExercices(objectif_id);
    
    if (!programme) {
      return res.status(404).json({ message: 'Aucun programme trouvé pour cet objectif.' });
    }
    
    res.json(programme);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

export const getAllProgrammes = async (req, res) => {
    try {
        const programmes = await programme.findAll({
            include: [{
                model: programmeExo,
                attributes: ['id', 'exercice_id', 'series', 'repetition','description']
            }],
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json({
            success: true,
            data: programmes
        });
    } catch (error) {
        console.error('❌ Erreur getAllProgrammes:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// export const getProgrammesByObjectif = async (req, res) => {
//     try {
//         const { objectif_id } = req.params;
        
//         const programmes = await Programme.findAll({
//             where: { objectif_id: objectif_id },
//             include: [{
//                 model: ProgrammeExercice,
//                 as: 'exercices',
//                 include: [{
//                     model: Exercice,
//                     as: 'exercice'
//                 }]
//             }]
//         });
        
//         res.status(200).json({
//             success: true,
//             data: programmes
//         });
//     } catch (error) {
//         console.error('❌ Erreur:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

export const updateProgramme = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        // ✅ 1. Mettre à jour le programme
        await programme.update(data, { where: { id } });
        
        // ✅ 2. ICI : Supprimer les anciens exercices
        await programmeExo.destroy({ where: { programme_id: id } });
        
        // ✅ 3. ICI : Ajouter les nouveaux exercices
        if (data.exercices && data.exercices.length > 0) {
            for (const ex of data.exercices) {
                await programmeExo.create({
                    programme_id: id,
                    exercice_id: ex.exercice_id,
                    serie: ex.serie,
                    repetition: ex.repetition,
                    description: ex.description || "Aucune description fournie"
                });
            }
        }
        
        // ✅ 4. Récupérer le programme mis à jour
        const programmeComplet = await programme.findByPk(id, {
            include: [{
                model: programmeExo,
                as: 'programmeExos'
            }]
        });
        
        res.status(200).json({
            success: true,
            message: 'Programme mis à jour',
            data: programmeComplet
        });
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// export const getprogramms = expressAsyncHandler(async(req,res)=>{
//     const {objectif} = req.params
//     const recV= await recVideo(objectif)
//     res.json(recV)
// })

// ✅ Supprimer un programme
export const deleteProgramme = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    console.log('📥 Suppression du programme ID:', id);

    // ✅ 1. Vérifier que le programme existe
    const existingProgramme = await programme.findByPk(id);
    if (!existingProgramme) {
        return res.status(404).json({
            success: false,
            message: 'Programme non trouvé'
        });
    }

    // ✅ 2. Supprimer les exercices associés (cascade)
    await programmeExo.destroy({
        where: { programme_id: id }
    });

    // ✅ 3. Supprimer le programme
    await programme.destroy({
        where: { id: id }
    });

    res.status(200).json({
        success: true,
        message: "Programme supprimé avec succès"
    });
});

export const uploadProgramms = expressAsyncHandler(async(req,res)=>{
    const data = req.body;
    const result = await programmeExo.create(data)
    if(!result){
        res.json({"error":"le video n'est pas placé"})
        return;
    }
    res.json({"message":"Vidéo enregistrée"})   

})