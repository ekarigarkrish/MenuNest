import express from 'express'
import settingsController from '../controllers/settings.controller.js'

const router = express.Router({ caseSensitive: true })

/**
 * GET /api/restaurant
 * Public – no authentication required.
 * Returns the restaurant name, logo URL, description, and contact info
 * so the frontend can display branding without a login session.
 */
router.get('/', settingsController.getRestaurant)

export default router
