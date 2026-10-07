import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";


const userProgramme = sequelize.define('userprogramme', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    programme_id: { type: DataTypes.INTEGER, allowNull: false },
    statut:{
        type:DataTypes.ENUM("en_cours","terminé"),
        defaultValue:"en_cours"
    }
    
},
{ timestamps: true, tableName: 'userprogramme' });



export default userProgramme;