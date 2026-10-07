import { Router } from "express";
import { voirPanier, ajouter, retirer, modifier, valider } from '../controllers/reservation.controllers.js';
import { verifyToken } from "../middlewares/auth.middleware.js";

const reservation = Router();

reservation.get('/:userId', voirPanier);
reservation.post('/:userId/ajouter/:produitId', verifyToken,ajouter);
reservation.delete('/:userId/retirer/:produitId', verifyToken,retirer);
reservation.put('/:userId/modifier/:produitId', verifyToken,modifier);
reservation.post('/:userId/valider', verifyToken,valider);

export default reservation;