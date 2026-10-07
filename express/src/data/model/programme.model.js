import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";

const programme = sequelize.define("programme",{
    nomPro:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:false
    },

    objectif_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    niveau:{
        type:DataTypes.ENUM("Débutant", "Intermédiaire", "Avancé"),
        allowNull:false
    },
    status: {
        type: DataTypes.ENUM('actif', 'inactif'),
        defaultValue: 'actif'
    },
    // ✅ NOUVEAU : ordre
    ordre: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    duree:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
    
},{timestamps:true,tableName:"programme"})


export default programme;