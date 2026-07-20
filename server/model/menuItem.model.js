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
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isVeg: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    isVisible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    timestamps: true,
    tableName: "menuItems"
})

export default menuItemModel