import express from 'express'
import analyticsController from '../controllers/analytics.controller.js'
import { isAuthenticated } from '../middleware/auth.middleware.js'

const router = express.Router({ caseSensitive: true })

router.get('/summary', isAuthenticated('admin'), analyticsController.getSummary)

export default router