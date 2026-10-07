import sequelize from "../../config/database.config.js";
import categorieProduit from "./categorieProduit.model.js";
import exercice from "./exercice.model.js";
import objectifs from "./objectifs.model.js";
import produit from "./produit.model.js";
import programme from "./programme.model.js";
import programmeExo from "./programmeExo.model.js";
import reservation from "./reservation.model.js";
import reservationDetail from "./reservationDetail.model.js";
import Salle from "./Salle.model.js";
import abonnement from "./abonnement.model.js";
import userProgramme from "./userprogramme.model.js";
import users from "./users.model.js";

const models = {
    users,
    objectifs,
    programme,
    exercice,
    programmeExo,
    userProgramme,
    categorieProduit,
    produit,
    reservation,
    reservationDetail,
    Salle,
    abonnement
}

import "./relation.model.js";

export {
    sequelize,
    users,
    objectifs,
    programme,
    exercice,
    programmeExo,
    userProgramme,
    categorieProduit,
    produit,
    reservation,
    reservationDetail,
    Salle,
    abonnement};
