import { DataTypes } from 'sequelize'
import sequelize from '../config/db.config.js'

const restaurantModel = sequelize.define('restaurant', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'My Restaurant'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contactEmail: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contactPhone: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'restaurant'
})

export default restaurantModel