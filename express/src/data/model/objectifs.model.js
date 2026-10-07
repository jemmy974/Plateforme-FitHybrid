import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";

export const objectifs = sequelize.define("objectifs",{
    nom:{
        type:DataTypes.ENUM("Perte de poids", "Prise de masse", "Endurance", "Force"),
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:false
}
},{timestamps:true, tableName:"objectifs"});

export default objectifs;

