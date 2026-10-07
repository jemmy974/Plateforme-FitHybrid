import { Router } from "express";
import { assignProgramme, deleteUser, getAllUsers, getUserById, getUserProgramme, inscription, login, logout, updateUser, updateUserRole, updateUserStatus, verifyToken } from "../controllers/users.controllers.js";


const users = Router()

users.post('/create',inscription)
users.post('/login', login)
users.post('/logout', logout)

users.post('/:user_id/assign-programme', assignProgramme);     // Assigner un programme
users.get('/:user_id/programme', getUserProgramme);            // Voir son programme
users.get('/verify', verifyToken)
users.get('/users', getAllUsers)
users.get('/:id', getUserById);
users.put('/:id', updateUser);
users.patch('/:id/status', updateUserStatus);
users.patch('/:id/role', updateUserRole);
users.delete('/:id', deleteUser);
export default users