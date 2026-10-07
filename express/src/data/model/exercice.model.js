import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";

const exercice = sequelize.define("exercice",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    nomE:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    muscle:{
        type:DataTypes.STRING,
        allowNull:false
    },
    niveau:{
        type:DataTypes.ENUM("debutant","intermediare", "avance"),
        allowNull:false
    },
    materiel:{
        type:DataTypes.STRING,
        allowNull:false
    },
    video:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    conseil:{
        type:DataTypes.TEXT,
        allowNull:false
    }
   
},{timestamps:true, tableName:"exercice"})

export default exercice