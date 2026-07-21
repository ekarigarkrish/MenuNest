import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

const menuItemModel = sequelize.define("menuItems", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    discount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    discountPrice:{
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    preparationTime: {
        type: DataTypes.INTEGER
    },
    isVeg: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isFeatured:{
        type:DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    timestamps: true,
    tableName: "menuItems"
})

export default menuItemModel