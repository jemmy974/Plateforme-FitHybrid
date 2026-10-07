import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.config.js';
// import sequelize from '../config/database.js';

const Salle = sequelize.define('Salle', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    adresse: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    telephone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    logo: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    statut: {
        type: DataTypes.ENUM('actif', 'inactif', 'suspendu'),
        defaultValue: 'actif'
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    date_abonnement: {
        type: DataTypes.DATE,
        allowNull: true
    },
    date_expiration: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'salles',
    timestamps: true
});

export default Salle;