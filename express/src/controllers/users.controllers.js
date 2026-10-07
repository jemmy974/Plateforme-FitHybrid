import expressAsyncHandler from "express-async-handler";
import users from "../data/model/users.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv"
import { findUser, getUserCurrentProgramme, ProgrammeAutom } from "../services/users.service.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
dotenv.config()


// const inscription = expressAsyncHandler(async(req,res)=>{
//     const data = req.body;
//     const {mdp} = data;
//     const hashedpassword = await bcrypt.hash(mdp,10); 
//     data.mdp = hashedpassword;  
//     const response = await users.create(data);
//     if(!response){
//         res.status(200).json({"message":"L'email est deja prise"});
//         return;
//     }
//        res.status(201).json({"message":"Félicitation, Votre compte est bien crée"})
// });

const inscription = async (req, res) => {
    try {
        const data = req.body;
        
        // Vérifier que les données existent
        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'Aucune donnée reçue'
            });
        }

        // Vérifier le mot de passe
        const { mdp } = data;
        if (!mdp) {
            return res.status(400).json({
                success: false,
                message: 'Le mot de passe est requis'
            });
        }

        // Hasher le mot de passe
        const hashedpassword = await bcrypt.hash(mdp, 10);
        data.mdp = hashedpassword;

        // Créer l'utilisateur (remplacez par votre logique)
        const response = await users.create(data);

        // Simuler une réponse (pour tester)
        return res.status(201).json({
            success: true,
            message: 'Félicitation, votre compte est bien créé'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Erreur interne du serveur'
        });
    }
};


const login = expressAsyncHandler(async(req,res)=>{
    const {email,mdp} = req.body
    const user = await findUser(email)
    if(!user){
        res.status(401).json({"error":"Votre email est incorrect"});
        return;
    }

    if (user.niveau < 0) {
        res.status(403).json({ "error": "Votre compte est désactivé" });
        return;
    }

    const validemdp = await bcrypt.compare(mdp, user.mdp);
    if (!validemdp){
        res.status(400).json({"error":"Mot de passe incorrect"});
        return;
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, prenom: user.prenom },
        process.env.JWT_SECRET || 'projet-sport-secret',
        { expiresIn: '1d' }
    );

    res.status(200).json({
        message: 'connecté',
        token,
        user: { id: user.id, email: user.email, prenom: user.prenom, nom: user.nom, role: user.role, objectif_id: user.objectif_id }
    })
})


// Assigner un programme à un utilisateur (auto selon objectif)
export const assignProgramme = expressAsyncHandler(async (req, res) => {
    const { user_id } = req.params;
    
    const assignment = await ProgrammeAutom(user_id);
    
    res.status(200).json({
        success: true,
        message: "Programme assigné avec succès",
        data: assignment
    });
});

// Récupérer le programme d'un utilisateur
export const getUserProgramme = expressAsyncHandler(async (req, res) => {
    const { user_id } = req.params;
    
    const programme = await getUserCurrentProgramme(user_id);
    
    if (!programme) {
        return res.status(404).json({
            success: false,
            message: "Aucun programme en cours pour cet utilisateur"
        });
    }
    
    res.status(200).json({
        success: true,
        data: programme
    });
});

const logout = expressAsyncHandler(async(req, res)=>{
    const {token} = req.cookies;
    if(!token){
        res.status(401).json({ "error": "Vous devez vous connecter" });
        return
    }
    res.clearCookie("token")
    res.status(201).json({ "message": "Deconnection réussie" })
})

const verifyToken = expressAsyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies?.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token requis' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'projet-sport-secret');
        const user = await users.findByPk(decoded.id, {
            attributes: ['id', 'nom', 'prenom', 'email', 'role', 'objectif_id', 'niveau']
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Utilisateur non trouvÃ©' });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token invalide' });
    }
});

// ✅ Réinitialiser le mot de passe
export const resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { nouveau_mdp } = req.body;

        const user = await users.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        const hashedPassword = await bcrypt.hash(nouveau_mdp, 10);
        await user.update({ mdp: hashedPassword });

        res.status(200).json({ success: true, message: 'Mot de passe réinitialisé' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Désactiver un compte
export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { actif } = req.body; // true ou false

        const user = await users.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        await user.update({ actif });
        res.status(200).json({ success: true, message: `Compte ${actif ? 'activé' : 'désactivé'}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const user = await users.findAll({
            where: {
                role: {
                    [Op.ne]: 'super_admin'  // Exclure super_admin
                }
            },
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('❌ Erreur getAllUsers:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Récupérer un utilisateur par ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await users.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Empêcher l'accès au super_admin
        if (user.role === 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('❌ Erreur getUserById:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, prenom, email, telephone, adresse, role, status, objectif_id } = req.body;

        const user = await users.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Empêcher la modification du super_admin
        if (user.role === 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'Impossible de modifier le Super Administrateur'
            });
        }

        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        if (email && email !== user.email) {
            const existingUser = await users.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Cet email est déjà utilisé'
                });
            }
        }

        await user.update({
            nom: nom || user.nom,
            prenom: prenom || user.prenom,
            email: email || user.email,
            telephone: telephone !== undefined ? telephone : user.telephone,
            adresse: adresse !== undefined ? adresse : user.adresse,
            role: role || user.role,
            status: status || user.status,
            objectif_id: objectif_id !== undefined ? objectif_id : user.objectif_id
        });

        const userData = user.toJSON();
        delete userData.password;

        res.status(200).json({
            success: true,
            message: 'Utilisateur mis à jour avec succès',
            data: userData
        });
    } catch (error) {
        console.error('❌ Erreur updateUser:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Mettre à jour le statut d'un utilisateur
export const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const user = await users.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Empêcher la modification du super_admin
        if (user.role === 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'Impossible de modifier le Super Administrateur'
            });
        }

        const validStatus = ['active', 'inactive', 'banned'];
        if (!validStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Statut invalide. Utilisez: active, inactive ou banned'
            });
        }

        await user.update({ status });

        res.status(200).json({
            success: true,
            message: 'Statut mis à jour avec succès',
            data: { id: user.id, status: user.status }
        });
    } catch (error) {
        console.error('❌ Erreur updateUserStatus:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Mettre à jour le rôle d'un utilisateur
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await users.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Empêcher la modification du super_admin
        if (user.role === 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'Impossible de modifier le Super Administrateur'
            });
        }

        // Empêcher la définition en super_admin
        if (role === 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'Impossible de définir un utilisateur comme Super Administrateur'
            });
        }

        const validRoles = ['admin', 'moderator', 'coach', 'client'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Rôle invalide. Utilisez: admin, moderator, coach ou client'
            });
        }

        await user.update({ role });

        res.status(200).json({
            success: true,
            message: 'Rôle mis à jour avec succès',
            data: { id: user.id, role: user.role }
        });
    } catch (error) {
        console.error('❌ Erreur updateUserRole:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Supprimer un utilisateur
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await users.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Empêcher la suppression du super_admin
        if (user.role === 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'Impossible de supprimer le Super Administrateur'
            });
        }

        await user.destroy();

        res.status(200).json({
            success: true,
            message: 'Utilisateur supprimé avec succès'
        });
    } catch (error) {
        console.error('❌ Erreur deleteUser:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Récupérer les statistiques des utilisateurs
export const getUserStats = async (req, res) => {
    try {
        const total = await users.count({
            where: {
                role: {
                    [Op.ne]: 'super_admin'
                }
            }
        });

        const active = await users.count({
            where: {
                status: 'active',
                role: {
                    [Op.ne]: 'super_admin'
                }
            }
        });

        const admins = await users.count({
            where: { role: 'admin' }
        });

        const clients = await users.count({
            where: { role: 'client' }
        });

        res.status(200).json({
            success: true,
            data: {
                total,
                active,
                admins,
                clients
            }
        });
    } catch (error) {
        console.error('❌ Erreur getUserStats:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export { inscription, login, logout, verifyToken }
