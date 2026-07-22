import express from 'express'
import authRoutes from './auth.routes.js'
import tableRoutes from './table.route.js'
import categoryRoutes from './category.routes.js'
import menuItemsRoutes from './menuItems.routes.js'
import { doubleCsrfProtection } from '../services/csrf.service.js'
import { isAuthenticated } from '../middleware/auth.middleware.js'
const router = express.Router({ caseSensitive: true })

// Auth routes here
router.use('/api/auth', authRoutes)

// Table routes here
router.use('/api/table', doubleCsrfProtection, isAuthenticated('admin'), tableRoutes)

// MenuItems Category Routes
router.use('/api/category', doubleCsrfProtection, isAuthenticated('admin'), categoryRoutes)

// MenuItems Routes
router.use('/api/menu', doubleCsrfProtection, isAuthenticated('admin'), menuItemsRoutes)

export default router