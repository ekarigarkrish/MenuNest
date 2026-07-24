import categoryModel from "./category.model.js";
import menuItemModel from "./menuItem.model.js";
import orderModel from "./order.model.js";
import tableModel from "./table.model.js";
import customerModel from "./customer.model.js";

categoryModel.hasMany(menuItemModel, {
    foreignKey: "categoryId",
    as: "menuItems",
});

menuItemModel.belongsTo(categoryModel, {
    foreignKey: "categoryId",
    as: "category",
});

tableModel.hasMany(orderModel, {
    foreignKey: "tableId",
    as: "orders",
});

orderModel.belongsTo(tableModel, {
    foreignKey: "tableId",
    as: "table",
});

customerModel.hasMany(orderModel, {
    foreignKey: "customerId",
    as: "orders",
});

orderModel.belongsTo(customerModel, {
    foreignKey: "customerId",
    as: "customer",
});

export {
    categoryModel,
    menuItemModel,
    orderModel,
    tableModel,
    customerModel
}