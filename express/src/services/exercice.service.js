import sequelize from "../config/database.config.js";

const recVideo = async(objectif)=>{
    const ex = await sequelize.query(
        `SELECT 
        exercice.nomE,
        exercice.description,
        exercice.niveau,
        exercice.materiel,
        exercice.muscle,
        exercice.video,
        exercice.conseil
        FROM programme p JOIN programmeExo pe ON p.id = pe.programme_id 
        JOIN exercice ON pe.exercice_id = exercice.id WHERE p.niveau = :objectif`,
        {
            replacements: { objectif },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return ex;
}

export {recVideo}