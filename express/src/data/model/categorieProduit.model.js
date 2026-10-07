import { DataTypes } from "sequelize";
import sequelize from "../../config/database.config.js";

const categorieProduit = sequelize.define('categorieProduit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nomCat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: 'categorieProduit',
});



export default categorieProduit;