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

// RELATIONS PRODUIT ↔ CATEGORIE
categorieProduit.hasMany(produit, {
    foreignKey: 'categorie_id',
    as: 'produits',
});
produit.belongsTo(categorieProduit, {
  foreignKey: 'categorie_id',
  as: 'categorie',
});

// RELATION RESERVATION ↔ USER
reservation.belongsTo(users, {
    foreignKey: 'user_id',  // ← La colonne qui fait le lien
    // ← Alias: "l'utilisateur de cette réservation"
});
 users.hasMany(reservation, { foreignKey: 'user_id' });


// RELATION PRODUIT ↔ RESERVATION
produit.belongsToMany(reservation, {
    through: reservationDetail,
    foreignKey: 'produit_id',
    otherKey: 'reservation_id',
});
reservation.belongsToMany(produit, {
    through: reservationDetail,
    foreignKey: 'reservation_id',
    otherKey: 'produit_id',
});

//  RELATION RESERVATION ↔ RESERVATION_DETAIL
reservation.hasMany(reservationDetail, { 
    foreignKey: 'reservation_id', 
    as: 'details'
});
reservationDetail.belongsTo(reservation, { 
    foreignKey: 'reservation_id', 
    as: 'reservation'
});
reservationDetail.belongsTo(produit, { 
    foreignKey: 'produit_id', 
     as: 'produit'
});

//RELATION OBJECTIFS ↔ USER
users.belongsTo(objectifs, { foreignKey: 'objectif_id'});
objectifs.hasMany(users, { foreignKey: 'objectif_id'});

//RELATION PROGRAMME ↔ OBJECTIFS
programme.belongsTo(objectifs, { 
    foreignKey: 'objectif_id', 

});
objectifs.hasMany(programme, { 
    foreignKey: 'objectif_id', 
});

//RELATION PROGRAMME ↔ USER
users.belongsToMany(programme, {
    through: userProgramme,
    foreignKey: 'user_id',
    otherKey: 'programme_id',
     // Un user a plusieurs programmes
});

programme.belongsToMany(users, {
    through: userProgramme,
    foreignKey: 'programme_id',
    otherKey: 'user_id',
      // Un programme peut être suivi par plusieurs users
});

//RELATION DIRECTE PROGRAMME ↔ USER
users.hasMany(userProgramme, { foreignKey: 'user_id' });
userProgramme.belongsTo(users, { foreignKey: 'user_id' });

//  RELATIONS DIRECTES PROGRAMME ↔ USERPROGRAMME
programme.hasMany(userProgramme, { foreignKey: 'programme_id'  });
userProgramme.belongsTo(programme, { foreignKey: 'programme_id'});

// RELATIONS PROGRAMME ↔ EXERCICE
programme.belongsToMany(exercice, { 
    through: programmeExo, 
    foreignKey: 'programme_id', 
    otherKey: 'exercice_id',
   
});
exercice.belongsToMany(programme, { 
    through: programmeExo, 
    foreignKey: 'exercice_id', 
    otherKey: 'programme_id',
    
});

// RELATIONS DIRECTES PROGRAMME ↔ PROGRAMMEEXO
programme.hasMany(programmeExo, { foreignKey: 'programme_id'});
programmeExo.belongsTo(programme, { foreignKey: 'programme_id'});

// RELATIONS DIRECTES EXERCICE ↔ PROGRAMMEEXO
exercice.hasMany(programmeExo, { foreignKey: 'exercice_id' });
programmeExo.belongsTo(exercice, { foreignKey: 'exercice_id'});


// RELATIONS OBJECTIFS ↔ PRODUIT
produit.belongsTo(objectifs, {
    foreignKey: 'objectif_id',
    as: 'objectif',
});

objectifs.hasMany(produit, {
    foreignKey: 'objectif_id',
    as: 'produits',
});

// Une salle appartient à un admin (utilisateur)
Salle.belongsTo(users, {
    foreignKey: 'admin_id',
    as: 'admin'
});

// Un admin peut avoir plusieurs salles
users.hasMany(Salle, {
    foreignKey: 'admin_id',
    as: 'salles'
});

// RELATION SALLE ↔ ABONNEMENT
Salle.hasMany(abonnement, {
    foreignKey: 'salle_id',
    as: 'abonnements'
});

abonnement.belongsTo(Salle, {
    foreignKey: 'salle_id',
    as: 'salle'
});
