import jwt from 'jsonwebtoken';
import users from '../data/model/users.model.js';

// ✅ Vérifier le token
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Non authentifié' });
        }

        // const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret'); voloany
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'projet-sport-secret');
        const user = await users.findByPk(decoded.id);
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token invalide' });
    }
};

// ✅ Vérifier le rôle (niveau minimum)
export const requireRole = (niveauMinimum) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Non authentifié' });
        }
        
        if ((req.user.niveau || 0) < niveauMinimum) {
            return res.status(403).json({ 
                success: false, 
                message: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.' 
            });
        }
        
        next();
    };
};

// ✅ Vérifier que c'est un Super Admin (niveau 3)
export const isSuperAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'super_admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Accès réservé au Super Administrateur' 
        });
    }
    next();
};
