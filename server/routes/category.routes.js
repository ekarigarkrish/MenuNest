import express from 'express'
import categoryController from '../controllers/category.controller.js'
import { upload } from '../middleware/multer.middleware.js'

const router = express.Router({ caseSensitive: true })

// All categories
router.get('/all', categoryController.getAllCategories)

// Single category by id
router.route('/:id')
    .post(upload('category').single('image'), categoryController.createCategory)
    .get(categoryController.getSingleCategoryDetail)
    .put(upload('category').single('image'), categoryController.updateCategory)
    .delete(categoryController.deleteCategory)

export default router