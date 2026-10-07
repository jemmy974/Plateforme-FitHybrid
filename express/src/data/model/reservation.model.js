import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";

const reservation = sequelize.define("reservation", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date_reservation: {
        type: DataTypes.DATE,
        defaultValue:DataTypes.NOW,
        allowNull:true
    },
    reference: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    dateRetrait: {
        type: DataTypes.DATE,
        allowNull: true
    },
    typeLivraison: {
        type: DataTypes.ENUM('retrait_salle', 'livraison'), defaultValue: 'retrait_salle',
        allowNull: true
    },
    adresse_livraison: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    montant_total: {
        type: DataTypes.DECIMAL(10, 2), defaultValue: 0,
        allowNull: false
    },
    statut: {
        type: DataTypes.ENUM('en_attente', 'confirmee', 'annulee'), defaultValue: 'en_attente',
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { timestamps: true, tableName: "reservation" });



export default reservation;