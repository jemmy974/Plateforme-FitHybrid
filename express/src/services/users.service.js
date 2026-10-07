import { users, programme, objectifs, userProgramme, exercice } from "../data/model/index.model.js";

const findUser = async (email) => {
    return await users.findOne({ where: { email } })
}

const ProgrammeAutom = async (user_id) => {
    try {
        const user = await users.findByPk(
            user_id, {
            include: [{ model: objectifs }]
        }
        );
        if (!user) {
            throw new Error("User not found")
        }

        // Trouver le programme correspondant à son objectif
        const Fprogramme = await programme.findOne({
            where: { objectif_id: user.objectif_id }
        });
        
        if (!Fprogramme) {
            throw new Error("Aucun programme trouvé pour cet objectif");
        }


            //verification si le programme est deja assigné a l'utilisateur
        const existing = await userProgramme.findOne({
            where: { user_id: user_id, programme_id: Fprogramme.id }
        });
        
        if (existing) {
            return existing; // Déjà assigné
        }

                // Créer l'assignation

        const assignment = await userProgramme.create({
            user_id: user_id,
            programme_id: Fprogramme.id,
            statut: 'en_cours',
        });
        
        return assignment;

    }catch (error) {
        console.error("Erreur:", error);
        throw error;
    }  

}

// 2. Récupérer le programme actuel d'un utilisateur
 const getUserCurrentProgramme = async (user_id) => {
    try {
        const userProgrammes = await userProgramme.findOne({
            where: { 
                user_id: user_id, 
                statut: 'en_cours' 
            },
            include: [
                {
                    model: programme,
                    include: [
                        {
                            model: exercice,
                            through: { attributes: ['series', 'repetition'] }
                        }
                    ]
                }
            ],
    
        });
        
        return userProgrammes;
        
    } catch (error) {
        console.error("Erreur:", error);
        throw error;
    }
};

export { findUser, ProgrammeAutom, getUserCurrentProgramme }