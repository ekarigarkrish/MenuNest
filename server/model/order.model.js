import sequelize from "../config/db.config.js";
import { DataTypes } from "sequelize";

const orderModel = sequelize.define("orders", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    tableId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    customerId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'preparing', 'ready', 'served', 'cancelled', 'completed'),
        allowNull: false,
        defaultValue: 'pending'
    },
    order: {
        type: DataTypes.JSON,
        allowNull: false,
        get() {
            const value = this.getDataValue("order");
            if (!value) return [];
            if (typeof value === "string") return JSON.parse(value);
            return value;
        },

        set(value) {
            this.setDataValue("order", value || []);
        }
    }
}, {
    timestamps: true,
    tableName: "orders"
})

export default orderModel