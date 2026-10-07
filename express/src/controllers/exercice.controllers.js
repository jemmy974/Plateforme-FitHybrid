import expressAsyncHandler from "express-async-handler";
import Exercice from "../data/model/exercice.model.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const creatExercice = expressAsyncHandler(async(req,res)=>{
//     const data = req.body
//     const response = await exercice.create(data)
//     if(!response){
//         res.json({"error":"le video n'est pas placé"})
//         return;
//     }
//     res.json({"message":"Vidéo enregistrée"})
// })

const creatExercice = async (req, res) => {
    try {
        const data = req.body;
        
        // Récupérer les fichiers
        const videoFile = req.file
        
        // Ajouter les chemins des fichiers
            if (videoFile) {
            data.video = '/uploads/videos/' + videoFile.filename;
        }
        
        // Validation
        if (!data.nomE || !data.muscle || !data.niveau) {
            
            return res.status(400).json({
                success: false,
                message: 'Nom, muscle et niveau sont requis'
            });
        }
        
        const exercice = await Exercice.create(data);
        res.status(201).json({
            success: true,
            message: 'Exercice créé avec succès',
            data: exercice
        });
        console.log('Exercice créé:', exercice);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
        console.error('Erreur lors de la création de l\'exercice:', error);
    }
};

const getAllExercice = expressAsyncHandler(async(req,res)=>{
    const response = await Exercice.findAll()
    res.json(response);
  
})

export const updateExercice = expressAsyncHandler(async (req, res) => {
    try {
        console.log('[exercice.controllers] updateExercice');
        console.log('📥 req.params:', req.params);
        console.log('📥 req.body:', req.body);
        console.log('📥 req.file:', req.file);

        const { id } = req.params;
        const item = await exercice.findByPk(id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Exercice non trouvé' });
        }

        let videoPath = item.video || '';

        // ✅ Gérer la vidéo
        if (req.file) {
            // Supprimer l'ancienne vidéo si elle existe
            if (item.video) {
                const oldPath = path.join(__dirname, '../../', item.video);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                    console.log('🗑️ Ancienne vidéo supprimée:', oldPath);
                }
            }
            videoPath = '/uploads/videos/' + req.file.filename;
            console.log('✅ Nouvelle vidéo sauvegardée:', videoPath);
        }

        const payload = {
            nomE: String(req.body.nomE || req.body.nom || item.nomE).trim(),
            description: req.body.description || item.description,
            niveau: req.body.niveau || item.niveau,
            materiel: req.body.materiel || item.materiel,
            video: videoPath,
            muscle: req.body.muscle || item.muscle,
            conseil: req.body.conseil || item.conseil
        };

        console.log('📤 Payload final:', payload);

        await item.update(payload);
        res.status(200).json({ success: true, message: 'Exercice mis à jour avec succès', data: item });

    } catch (error) {
        console.error('❌ Erreur updateExercice:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});
export const deleteExercice = expressAsyncHandler(async (req, res) => {
    try {
        console.log('[exercice.controllers] deleteExercice called for id:', req.params.id);

        const { id } = req.params;
        const item = await Exercice.findByPk(id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Exercice non trouvé' });
        }

        // ✅ Supprimer la vidéo du serveur
        if (item.video) {
            const videoPath = path.join(__dirname, '../../', item.video);
            if (fs.existsSync(videoPath)) {
                fs.unlinkSync(videoPath);
                console.log('🗑️ Vidéo supprimée:', videoPath);
            }
        }

        await item.destroy();
        res.status(200).json({ success: true, message: 'Exercice supprimé avec succès' });
    } catch (error) {
        console.error('❌ Erreur deleteExercice:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});


export {creatExercice, getAllExercice}