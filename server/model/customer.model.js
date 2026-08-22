import sequelize from "../config/db.config.js";
import { DataTypes } from "sequelize";

const customerModel = sequelize.define('customers', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    hashOtp: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    expiresAt:{
        type:DataTypes.DATE,
        allowNull:true,
    }
}, {
    timestamps: true,
    tableName: 'customers'
})

export default customerModel