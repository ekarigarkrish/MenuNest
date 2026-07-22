import categoryModel from "../model/category.model.js";
import menuItemModel from "../model/menuItem.model.js";
import { asyncHandler, ApiError } from "../utils/helper.utils.js";
import { deleteFile } from "../utils/removeFile.utils.js";
import { col, fn, Op } from "sequelize";

export default {
    createCategory: asyncHandler(async (req, res) => {
        const { name, slug, desc, isVisible } = req.body;

        const isExist = await categoryModel.findOne({ where: { slug } });
        if (isExist) throw ApiError('A category with this slug already exists', 400);

        const category = await categoryModel.create({
            name,
            slug,
            desc,
            isVisible: isVisible === 'true' || isVisible === true,
            image: req.file?.path ?? null,
        }, { raw: true });
        if (!category) throw ApiError('Unable to create category', 400);


        category.image = `${req.protocol}://${req.get("host")}/${category.image}`;
        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category,
        });
    }, 'createCategory'),

    getAllCategories: asyncHandler(async (req, res) => {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const search = (req.query.search || "").trim();
        const offset = (page - 1) * limit;

        const whereClause = search
            ? { name: { [Op.like]: `%${search}%` } }
            : {};

        const { count, rows } = await categoryModel.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [["createdAt", "ASC"]],
            raw: true,
            attributes: {
                include: [
                    [fn("COUNT", col("menuItems.id")), "count"],
                ],
            },
            include: [
                {
                    model: menuItemModel,
                    as: "menuItems",
                    attributes: [],
                    required: false,
                },
            ],
            group: ["categories.id"],
            subQuery: false,
        });

        const categoriesWithUrl = rows.map((cat) => ({
            ...cat,
            image: cat.image
                ? `${req.protocol}://${req.get("host")}/${cat.image}`
                : null,
        }));

        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            categories: categoriesWithUrl,
            total: count,
            page,
            limit,
            hasMore: offset + rows.length < count,
        });
    }, 'getAllCategories'),

    getSingleCategoryDetail: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const category = await categoryModel.findByPk(id, { raw: true });
        if (!category) throw ApiError('Category not found', 404);

        if (category.image) {
            category.image = `${req.protocol}://${req.get("host")}/${category.image}`;
        }

        return res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            category,
        });
    }, 'getSingleCategoryDetail'),

    updateCategory: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { name, slug, desc, isVisible, removeImage } = req.body;

        const category = await categoryModel.findByPk(id);
        if (!category) throw ApiError('Category not found', 404);

        // Check slug uniqueness if slug is being changed
        if (slug && slug !== category.slug) {
            const slugExists = await categoryModel.findOne({ where: { slug } });
            if (slugExists) throw ApiError('A category with this slug already exists', 400);
        }

        let imageValue = category.image;

        if (removeImage === 'true' || removeImage === true) {
            // Delete old image from disk and set null
            if (category.image) await deleteFile(category.image);
            imageValue = null;
        }

        if (req.file?.path) {
            // Delete old image from disk before replacing
            if (category.image) await deleteFile(category.image);
            imageValue = req.file.path;
        }

        await category.update({
            name: name ?? category.name,
            slug: slug ?? category.slug,
            desc: desc ?? category.desc,
            isVisible: isVisible !== undefined
                ? (isVisible === 'true' || isVisible === true)
                : category.isVisible,
            image: imageValue,
        });

        const updatedCategory = category.get({ plain: true });
        if (updatedCategory.image) {
            updatedCategory.image = `${req.protocol}://${req.get("host")}/${updatedCategory.image}`;
        }

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category: updatedCategory,
        });
    }, 'updateCategory'),

    deleteCategory: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const category = await categoryModel.findByPk(id, { raw: true });
        if (!category) throw ApiError('Category not found', 404);

        if (category.image) await deleteFile(category.image);
        await categoryModel.destroy({ where: { id } });

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    }, 'deleteCategory'),
}