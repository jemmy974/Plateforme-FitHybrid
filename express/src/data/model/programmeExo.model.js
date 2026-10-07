import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";

const programmeExo = sequelize.define("programmeExo",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
   
    series:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:3
    },
    repetition:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:10
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    exercice_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    programme_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    // objectif_id:{
    //     type:DataTypes.INTEGER,
    //     allowNull:false
    // }
},{timestamps:true, tableName:"programmeExo"});




export default programmeExo;
