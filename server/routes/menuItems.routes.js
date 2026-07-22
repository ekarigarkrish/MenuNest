import express from 'express'
import menuItemsController from '../controllers/menuItems.controller.js'
import { upload } from '../middleware/multer.middleware.js'
import { isAuthenticated } from '../middleware/auth.middleware.js'

const router = express.Router({ caseSensitive: true })

// All Menu Items
router.get('/all', isAuthenticated('admin'), menuItemsController.getAllMenuItems)

//public route for all menu items for customer
router.get('/public/all', menuItemsController.getPublicAllMenuItems)

// Create Menu Item
router.post('/create', isAuthenticated('admin'), upload('menuItem').single('image'), menuItemsController.createMenuItem)

// Single Menu Item by id
router.route('/:id')
    .all(isAuthenticated('admin'),)
    .get(menuItemsController.getSingleMenuItemDetail)
    .put(upload('menuItem').single('image'), menuItemsController.updateMenuItem)
    .delete(menuItemsController.deleteMenuItem)

export default router