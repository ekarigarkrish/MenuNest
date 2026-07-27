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
    },
    gst_enabled:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    gst_type:{
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false,
        defaultValue: 'percentage'
    },
    gst_rate:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 5
    }
}, {
    timestamps: true,
    tableName: 'restaurant'
})

export default restaurantModel