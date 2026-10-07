import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.config.js';

const abonnement = sequelize.define('abonnement', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    salle_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'salles',
            key: 'id'
        }
    },
    date_abonnement: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    date_expiration: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duree_mois: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    statut: {
        type: DataTypes.ENUM('actif', 'inactif', 'suspendu', 'expire'),
        allowNull: false,
        defaultValue: 'actif'
    }
}, {
    tableName: 'abonnements',
    timestamps: true
});

export default abonnement;
