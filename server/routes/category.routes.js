import express from 'express'
import categoryController from '../controllers/category.controller.js'
import { upload } from '../middleware/multer.middleware.js'
import { isAuthenticated } from '../middleware/auth.middleware.js'

const router = express.Router({ caseSensitive: true })

// All categories
router.get('/all', isAuthenticated('admin'), categoryController.getAllCategories)

// Pubic categories
router.get('/public/all', categoryController.getAllCategoriesPublic)

// Single category by id
router.route('/:id?')
    .all(isAuthenticated('admin'))
    .post(upload('category').single('image'), categoryController.createCategory)
    .get(categoryController.getSingleCategoryDetail)
    .put(upload('category').single('image'), categoryController.updateCategory)
    .delete(categoryController.deleteCategory)

export default router