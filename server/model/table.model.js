import sequelize from "../config/db.config.js";
import { DataTypes } from "sequelize";

const tableModel = sequelize.define("tables", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tableToken: {
        type: DataTypes.STRING,
        allowNull: false
    },
    capacity:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: "tables"
})

export default tableModel