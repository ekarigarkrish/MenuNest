import categoryModel from "./category.model.js";
import menuItemModel from "./menuItem.model.js";

categoryModel.hasMany(menuItemModel, {
    foreignKey: "categoryId",
    as: "menuItems",
});

menuItemModel.belongsTo(categoryModel, {
    foreignKey: "categoryId",
    as: "category",
});

export {
    categoryModel,
    menuItemModel
}