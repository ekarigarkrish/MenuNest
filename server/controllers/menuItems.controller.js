import menuItemModel from "../model/menuItem.model.js";
import categoryModel from "../model/category.model.js";
import { asyncHandler, ApiError } from "../utils/helper.utils.js";
import { deleteFile } from "../utils/removeFile.utils.js";
import { Op } from "sequelize";

export default {
    getAllMenuItems: asyncHandler(async (req, res) => {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const search = (req.query.search || "").trim();
        const categoryId = req.query.category; // Optional filter by category
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (search) {
            whereClause.name = { [Op.like]: `%${search}%` };
        }
        if (categoryId) {
            whereClause.categoryId = categoryId;
        }

        const { count, rows } = await menuItemModel.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [{
                model: categoryModel,
                as: "category",
                attributes: ["id", "name"]
            }]
        });

        const itemsWithUrl = rows.map((item) => {
            const plainItem = item.get({ plain: true });
            if (plainItem.image) {
                plainItem.image = `${req.protocol}://${req.get("host")}/${plainItem.image}`;
            }
            return plainItem;
        });

        return res.status(200).json({
            success: true,
            message: "Menu items fetched successfully",
            menuItems: itemsWithUrl,
            total: count,
            page,
            limit,
            hasMore: offset + rows.length < count,
        });
    }, 'getAllMenuItems'),

    createMenuItem: asyncHandler(async (req, res) => {
        const { 
            name, slug, description, price, discount, 
            discountPrice, categoryId, preparationTime, 
            isVeg, isFeatured, isAvailable 
        } = req.body;

        const isExist = await menuItemModel.findOne({ where: { slug } });
        if (isExist) throw ApiError('A menu item with this slug already exists', 400);

        const category = await categoryModel.findByPk(categoryId);
        if (!category) throw ApiError('Category not found', 404);

        const menuItem = await menuItemModel.create({
            name,
            slug,
            description,
            price: parseFloat(price),
            discount: parseFloat(discount) || 0,
            discountPrice: parseFloat(discountPrice) || parseFloat(price),
            categoryId,
            preparationTime: parseInt(preparationTime) || 0,
            isVeg: isVeg === 'true' || isVeg === true,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            isAvailable: isAvailable !== undefined ? (isAvailable === 'true' || isAvailable === true) : true,
            image: req.file?.path ?? null,
        });

        const createdItem = menuItem.get({ plain: true });
        if (createdItem.image) {
            createdItem.image = `${req.protocol}://${req.get("host")}/${createdItem.image}`;
        }

        return res.status(201).json({
            success: true,
            message: "Menu item created successfully",
            menuItem: createdItem,
        });
    }, 'createMenuItem'),

    getSingleMenuItemDetail: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const menuItem = await menuItemModel.findByPk(id, {
            include: [{
                model: categoryModel,
                as: "category",
                attributes: ["id", "name"]
            }]
        });
        if (!menuItem) throw ApiError('Menu item not found', 404);

        const plainItem = menuItem.get({ plain: true });
        if (plainItem.image) {
            plainItem.image = `${req.protocol}://${req.get("host")}/${plainItem.image}`;
        }

        return res.status(200).json({
            success: true,
            message: "Menu item fetched successfully",
            menuItem: plainItem,
        });
    }, 'getSingleMenuItemDetail'),

    updateMenuItem: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { 
            name, slug, description, price, discount, 
            discountPrice, categoryId, preparationTime, 
            isVeg, isFeatured, isAvailable, removeImage 
        } = req.body;

        const menuItem = await menuItemModel.findByPk(id);
        if (!menuItem) throw ApiError('Menu item not found', 404);

        if (slug && slug !== menuItem.slug) {
            const slugExists = await menuItemModel.findOne({ where: { slug } });
            if (slugExists) throw ApiError('A menu item with this slug already exists', 400);
        }

        if (categoryId && categoryId !== menuItem.categoryId) {
            const category = await categoryModel.findByPk(categoryId);
            if (!category) throw ApiError('Category not found', 404);
        }

        let imageValue = menuItem.image;

        if (removeImage === 'true' || removeImage === true) {
            if (menuItem.image) await deleteFile(menuItem.image);
            imageValue = null;
        }

        if (req.file?.path) {
            if (menuItem.image) await deleteFile(menuItem.image);
            imageValue = req.file.path;
        }

        await menuItem.update({
            name: name ?? menuItem.name,
            slug: slug ?? menuItem.slug,
            description: description !== undefined ? description : menuItem.description,
            price: price !== undefined ? parseFloat(price) : menuItem.price,
            discount: discount !== undefined ? parseFloat(discount) : menuItem.discount,
            discountPrice: discountPrice !== undefined ? parseFloat(discountPrice) : menuItem.discountPrice,
            categoryId: categoryId ?? menuItem.categoryId,
            preparationTime: preparationTime !== undefined ? parseInt(preparationTime) : menuItem.preparationTime,
            isVeg: isVeg !== undefined ? (isVeg === 'true' || isVeg === true) : menuItem.isVeg,
            isFeatured: isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : menuItem.isFeatured,
            isAvailable: isAvailable !== undefined ? (isAvailable === 'true' || isAvailable === true) : menuItem.isAvailable,
            image: imageValue,
        });

        const updatedItem = menuItem.get({ plain: true });
        if (updatedItem.image) {
            updatedItem.image = `${req.protocol}://${req.get("host")}/${updatedItem.image}`;
        }

        return res.status(200).json({
            success: true,
            message: "Menu item updated successfully",
            menuItem: updatedItem,
        });
    }, 'updateMenuItem'),
    
    deleteMenuItem: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const menuItem = await menuItemModel.findByPk(id);
        if (!menuItem) throw ApiError('Menu item not found', 404);

        if (menuItem.image) await deleteFile(menuItem.image);
        await menuItem.destroy();

        return res.status(200).json({
            success: true,
            message: "Menu item deleted successfully",
        });
    }, 'deleteMenuItem'),
}