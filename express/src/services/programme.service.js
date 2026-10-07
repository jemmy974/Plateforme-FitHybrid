// import exercice from "../data/model/exercice.model.js";
// import objectifs  from "../data/model/objectifs.model.js";
// import programmeModel from "../data/model/programme.model.js";
// import programmeExo from "../data/model/programmeExo.model.js";
import { exercice, objectifs, programme as programmeModel, programmeExo } from "../data/model/index.model.js";

export const getProgrammeWithExercices = async (objectif_id) => {
  const programmes = await programmeModel.findAll({
    where: { objectif_id, status: 'actif' },
    include: [
      {
        model: objectifs,
        attributes: ['id', 'nom','description']
      },
      {
        model: exercice,
        attributes: ['id', 'nomE', 'description', 'niveau', 'materiel', 'muscle', 'video', 'conseil'],
        through: {
          attributes: ['series', 'repetition', 'description']
        }
      }
    ],
    attributes: ['id', 'nomPro', 'description', 'objectif_id', 'niveau', 'duree', 'status'],
    order: [['ordre', 'ASC'], ['createdAt', 'DESC']]
  });
  
  return programmes;
};

