import Salle from "../data/model/Salle.model.js";
import abonnement from "../data/model/abonnement.model.js";
import "../data/model/relation.model.js";

const validStatuts = ['actif', 'inactif', 'suspendu', 'expire'];

const addMonths = (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + Number(months));
    return result;
};

const getComputedStatus = (item) => {
    const expiration = item.date_expiration ? new Date(item.date_expiration) : null;
    if (item.statut === 'suspendu') return 'suspendu';
    if (!expiration) return 'inactif';
    if (expiration < new Date()) return 'expire';
    return item.statut || 'actif';
};

const formatAbonnement = (item, salleFallback = null) => {
    const data = item?.toJSON ? item.toJSON() : item;
    const salle = data?.salle || salleFallback || {};

    return {
        id: data?.id || salle.id,
        abonnement_id: data?.id || null,
        salle_id: data?.salle_id || salle.id,
        nom: salle.nom,
        email: salle.email,
        date_abonnement: data?.date_abonnement || salle.date_abonnement,
        date_expiration: data?.date_expiration || salle.date_expiration,
        duree_mois: data?.duree_mois || null,
        statut: getComputedStatus(data || salle)
    };
};

const syncSalleAbonnement = async (salle, payload) => {
    await salle.update({
        date_abonnement: payload.date_abonnement,
        date_expiration: payload.date_expiration,
        statut: payload.statut === 'expire' ? 'inactif' : payload.statut
    });
};

export const getAbonnements = async (req, res) => {
    try {
        const salles = await Salle.findAll({
            attributes: ['id', 'nom', 'email', 'date_abonnement', 'date_expiration', 'statut'],
            include: [{
                model: abonnement,
                as: 'abonnements',
                required: false,
                separate: true,
                limit: 1,
                order: [['createdAt', 'DESC']]
            }],
            order: [['createdAt', 'DESC']]
        });

        const data = salles.map((salle) => {
            const latest = salle.abonnements?.[0];
            return formatAbonnement(latest, salle);
        });

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createAbonnement = async (req, res) => {
    try {
        const { salle_id, duree_mois = 1, date_abonnement } = req.body;
        const statut = req.body.statut || 'actif';

        if (!salle_id) {
            return res.status(400).json({ success: false, message: 'La salle est requise' });
        }

        if (!validStatuts.includes(statut)) {
            return res.status(400).json({ success: false, message: 'Statut invalide' });
        }

        if (!Number(duree_mois) || Number(duree_mois) <= 0) {
            return res.status(400).json({ success: false, message: 'La durée doit être supérieure à 0' });
        }

        const salle = await Salle.findByPk(salle_id);
        if (!salle) {
            return res.status(404).json({ success: false, message: 'Salle non trouvée' });
        }

        const debut = date_abonnement ? new Date(date_abonnement) : new Date();
        const fin = req.body.date_expiration ? new Date(req.body.date_expiration) : addMonths(debut, duree_mois);

        if (Number.isNaN(debut.getTime()) || Number.isNaN(fin.getTime()) || fin <= debut) {
            return res.status(400).json({ success: false, message: 'Dates d’abonnement invalides' });
        }

        const created = await abonnement.create({
            salle_id,
            date_abonnement: debut,
            date_expiration: fin,
            duree_mois,
            statut
        });

        await syncSalleAbonnement(salle, created);

        const createdWithSalle = await abonnement.findByPk(created.id, {
            include: [{ model: Salle, as: 'salle', attributes: ['id', 'nom', 'email'] }]
        });

        res.status(201).json({
            success: true,
            message: 'Abonnement créé avec succès',
            data: formatAbonnement(createdWithSalle)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAbonnement = async (req, res) => {
    try {
        const item = await abonnement.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Abonnement non trouvé' });
        }

        const payload = {};
        if (req.body.statut !== undefined) {
            if (!validStatuts.includes(req.body.statut)) {
                return res.status(400).json({ success: false, message: 'Statut invalide' });
            }
            payload.statut = req.body.statut;
        }
        if (req.body.duree_mois !== undefined) {
            if (!Number(req.body.duree_mois) || Number(req.body.duree_mois) <= 0) {
                return res.status(400).json({ success: false, message: 'La durée doit être supérieure à 0' });
            }
            payload.duree_mois = req.body.duree_mois;
        }
        if (req.body.date_abonnement !== undefined) payload.date_abonnement = new Date(req.body.date_abonnement);
        if (req.body.date_expiration !== undefined) payload.date_expiration = new Date(req.body.date_expiration);

        const debut = payload.date_abonnement || item.date_abonnement;
        const fin = payload.date_expiration || item.date_expiration;
        if (Number.isNaN(new Date(debut).getTime()) || Number.isNaN(new Date(fin).getTime()) || new Date(fin) <= new Date(debut)) {
            return res.status(400).json({ success: false, message: 'Dates d’abonnement invalides' });
        }

        await item.update(payload);

        const salle = await Salle.findByPk(item.salle_id);
        if (salle) await syncSalleAbonnement(salle, item);

        const updated = await abonnement.findByPk(item.id, {
            include: [{ model: Salle, as: 'salle', attributes: ['id', 'nom', 'email'] }]
        });

        res.status(200).json({
            success: true,
            message: 'Abonnement mis à jour',
            data: formatAbonnement(updated)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifierAbonnement = async (req, res) => {
    try {
        const id = req.params.id;
        let item = await abonnement.findByPk(id);

        if (!item) {
            const salle = await Salle.findByPk(id);
            if (!salle) {
                return res.status(404).json({ success: false, message: 'Abonnement non trouvé' });
            }
            item = salle;
        }

        const expiration = item.date_expiration ? new Date(item.date_expiration) : null;
        const actif = item.statut === 'actif' && expiration && expiration > new Date();

        res.status(200).json({
            success: true,
            data: {
                actif,
                statut: getComputedStatus(item),
                date_abonnement: item.date_abonnement,
                date_expiration: item.date_expiration,
                jours_restants: actif ? Math.ceil((expiration - new Date()) / (1000 * 60 * 60 * 24)) : 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const renouvelerAbonnement = async (req, res) => {
    try {
        const { id } = req.params;
        const { duree_mois = 1 } = req.body;

        if (!Number(duree_mois) || Number(duree_mois) <= 0) {
            return res.status(400).json({ success: false, message: 'La durée doit être supérieure à 0' });
        }

        let salle = await Salle.findByPk(id);
        let existing = null;

        if (!salle) {
            existing = await abonnement.findByPk(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: 'Salle ou abonnement non trouvé' });
            }
            salle = await Salle.findByPk(existing.salle_id);
        }

        const maintenant = new Date();
        const nouvelleExpiration = addMonths(maintenant, duree_mois);

        const renewed = await abonnement.create({
            salle_id: salle.id,
            date_abonnement: maintenant,
            date_expiration: nouvelleExpiration,
            duree_mois,
            statut: 'actif'
        });

        await syncSalleAbonnement(salle, renewed);

        const renewedWithSalle = await abonnement.findByPk(renewed.id, {
            include: [{ model: Salle, as: 'salle', attributes: ['id', 'nom', 'email'] }]
        });

        res.status(200).json({
            success: true,
            message: 'Abonnement renouvelé',
            data: formatAbonnement(renewedWithSalle)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deactivateAbonnement = async (req, res) => {
    try {
        const item = await abonnement.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Abonnement non trouvé' });
        }

        const statut = req.body.statut || 'inactif';
        if (!validStatuts.includes(statut)) {
            return res.status(400).json({ success: false, message: 'Statut invalide' });
        }

        await item.update({ statut });

        const salle = await Salle.findByPk(item.salle_id);
        if (salle) await syncSalleAbonnement(salle, item);

        res.status(200).json({ success: true, message: 'Abonnement désactivé', data: formatAbonnement(item, salle) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteAbonnement = async (req, res) => {
    try {
        const item = await abonnement.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Abonnement non trouvé' });
        }

        const salle = await Salle.findByPk(item.salle_id);
        await item.destroy();

        if (salle) {
            const latest = await abonnement.findOne({
                where: { salle_id: salle.id },
                order: [['createdAt', 'DESC']]
            });

            if (latest) {
                await syncSalleAbonnement(salle, latest);
            } else {
                await salle.update({
                    date_abonnement: null,
                    date_expiration: null,
                    statut: 'inactif'
                });
            }
        }

        res.status(200).json({ success: true, message: 'Abonnement supprimé' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
