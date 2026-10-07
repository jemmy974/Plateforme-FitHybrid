import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";

const reservationDetail = sequelize.define("reservationDetail",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    reservation_id:{
        type:DataTypes.INTEGER,
        allowNull:false},
    produit_id:{
        type:DataTypes.INTEGER,
        allowNull:false},
    quantite:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:1},
    prix_unitaire:{
        type:DataTypes.DECIMAL(10,2),
    allowNull:false},
},{timestamps:true, tableName:"reservationDetail"});



export default reservationDetail;