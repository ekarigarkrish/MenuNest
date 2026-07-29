import express from 'express'
import settingsController from '../controllers/settings.controller.js'

const router = express.Router({ caseSensitive: true })

router.get('/', settingsController.getRestaurant)

export default router
