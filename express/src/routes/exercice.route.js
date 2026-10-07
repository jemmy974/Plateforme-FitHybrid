import { Router } from "express";
import { creatExercice, deleteExercice, getAllExercice, updateExercice } from "../controllers/exercice.controllers.js";
import upload from "../middlewares/upload.js";

const exercice = Router()
exercice.post("/uploadV", upload.single('video'),creatExercice) // video sns
exercice.get("/getE",getAllExercice)

exercice.put('/:id', upload.single('video'), updateExercice);
exercice.delete('/:id', deleteExercice);


export {exercice}