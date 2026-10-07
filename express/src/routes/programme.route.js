import { Router } from "express";
import { addExerciceToProgramme, createProgramme, deleteProgramme, getAllProgrammes, getProgrammeByObjectif, updateProgramme, uploadProgramms } from "../controllers/programme.controllers.js";
import { requireRole, verifyToken } from "../middlewares/auth.middleware.js";

const programme = Router()

// programme.get('/recV', getprogramms)

programme.get('/Gprogramme', getAllProgrammes); //maka ilay programme mifanaraka amin'ny objectif_id nalefa avy @ frontend
programme.get('/:objectif_id', getProgrammeByObjectif); //maka ilay programme mifanaraka amin'ny objectif_id nalefa avy @ frontend
// ✅ Vérifie que cette route existe
// programme.get('/objectif/:objectif_id', getProgrammesByObjectif);
programme.post('/uploadP', verifyToken, requireRole(2), uploadProgramms)
programme.post('/create', createProgramme) // mamorona programme vaovao
programme.post('/:programme_id/exercices/:exercice_id', addExerciceToProgramme);

programme.put('/maj/:id', verifyToken, requireRole(2), updateProgramme);    // ← Mise à jour
programme.delete('/delete/:id', verifyToken, requireRole(2), deleteProgramme); // ← Suppression

export {programme}