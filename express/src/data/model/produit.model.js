import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.config.js';

const produit = sequelize.define('produit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  prix: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  categorie_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  objectif_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  statut: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'actif',
  },
  popularite: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  est_nouveau: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: 'produits',
});

export default produit;


