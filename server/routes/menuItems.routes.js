import express from 'express'
import menuItemsController from '../controllers/menuItems.controller.js'
import { upload } from '../middleware/multer.middleware.js'

const router = express.Router({ caseSensitive: true })

// All Menu Items
router.get('/all', menuItemsController.getAllMenuItems)

// Create Menu Item
router.post('/create', upload('menuItem').single('image'), menuItemsController.createMenuItem)

// Single Menu Item by id
router.route('/:id')
    .get(menuItemsController.getSingleMenuItemDetail)
    .put(upload('menuItem').single('image'), menuItemsController.updateMenuItem)
    .delete(menuItemsController.deleteMenuItem)

export default router