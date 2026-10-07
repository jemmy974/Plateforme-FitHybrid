import express from 'express';
const router = express.Router();
// import { verifyToken, isSuperAdmin } from '../middleware/auth.middleware.js';

import { isSuperAdmin, verifyToken } from '../middlewares/auth.middleware.js';
import {
    createAdmin,
    createClient,
    deleteProduct,
    deleteProgrammeContent,
    deleteUser,
    deleteVideoContent,
    getAdmins,
    getAllProducts,
    getAllUsers,
    getClients,
    getProgrammes,
    getSettings,
    getStats,
    getVideos,
    resetUserPassword,
    toggleUserStatus,
    updateUser,
    updateUserRole,
    verifyProduct
} from '../controllers/superadmin.controllers.js';
import { createSalle, deleteSalle, getAllSalles, getSalleById, toggleSalleStatus, updateSalle } from '../controllers/salle.controllers.js';
import {
    createAbonnement,
    deactivateAbonnement,
    deleteAbonnement,
    getAbonnements,
    renouvelerAbonnement,
    updateAbonnement,
    verifierAbonnement
} from '../controllers/abonnement.controllers.js';

// ✅ Toutes les routes nécessitent authentification + super admin
router.use(verifyToken);
router.use(isSuperAdmin);

// Statistiques
router.get('/stats', getStats);

// Gestion des utilisateurs
router.get('/users', getAllUsers);
router.get('/admins', getAdmins);
router.get('/clients', getClients);
router.post('/users/admin', createAdmin);
router.post('/users/client', createClient);
router.put('/users/:id', updateUser);
router.put('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', toggleUserStatus);
router.post('/users/:id/reset-password', resetUserPassword);
router.delete('/users/:id', deleteUser);

router.get('/salles', getAllSalles);
router.get('/salles/:id', getSalleById);
router.post('/salles', createSalle);
router.post('/salles/create', createSalle);
router.put('/salles/:id', updateSalle);
router.patch('/salles/:id/status', toggleSalleStatus);
router.delete('/salles/:id', deleteSalle);

router.get('/products', getAllProducts);
router.patch('/products/:id/verify', verifyProduct);
router.delete('/products/:id', deleteProduct);

router.get('/contenus/programmes', getProgrammes);
router.get('/contenus/videos', getVideos);
router.delete('/contenus/programmes/:id', deleteProgrammeContent);
router.delete('/contenus/videos/:id', deleteVideoContent);

router.get('/settings', getSettings);

router.get('/abonnements', getAbonnements);
router.post('/abonnements', createAbonnement);
router.put('/abonnements/:id', updateAbonnement);
router.patch('/abonnements/:id/status', deactivateAbonnement);
router.get('/abonnements/:id/status', verifierAbonnement);
router.post('/abonnements/:id/renew', renouvelerAbonnement);
router.delete('/abonnements/:id', deleteAbonnement);


export default router;
