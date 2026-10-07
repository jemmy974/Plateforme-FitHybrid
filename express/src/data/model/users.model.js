import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";

const users = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    datedn: {
        type: DataTypes.DATE,
        allowNull: false
    },
    poids: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    photo: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    genre: {
        type: DataTypes.ENUM('Homme', 'Femme'),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    addresse: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numero: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mdp: {
        type: DataTypes.STRING,
        allowNull: false

    },
    role: {
        type: DataTypes.ENUM('super_admin','client', 'admin'),
        allowNull: false,
        defaultValue: 'client'  
    },
    objectif_id: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'objectifs',
            key: 'id'
        }
    },
    niveau: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }

    },{ timestamps: true, tableName: "users" })





export default users;
