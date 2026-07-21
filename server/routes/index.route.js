import express from 'express'
import authRoutes from './auth.routes.js'
import tableRoutes from './table.route.js'
import { doubleCsrfProtection } from '../services/csrf.service.js'
const router = express.Router({ caseSensitive: true })

// Auth routes here
router.use('/api/auth', authRoutes)

// Table routes here
router.use('/api/table', doubleCsrfProtection, tableRoutes)

export default router