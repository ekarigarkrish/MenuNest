import express from 'express'
import settingsController from '../controllers/settings.controller.js'
import { upload, checkSizeLimits, handlemulterError } from '../middleware/multer.middleware.js'
import { isAuthenticated } from '../middleware/auth.middleware.js'

const router = express.Router({ caseSensitive: true })

// GET restaurant settings
router.get('/restaurant', isAuthenticated('admin'), settingsController.getRestaurant)

// PUT update restaurant settings (with optional logo upload)
router.put(
    '/restaurant',
    isAuthenticated('admin'),
    upload('restaurant').single('logo'),
    handlemulterError,
    checkSizeLimits({ field_name: 'logo', size: 2048 }),
    settingsController.updateRestaurant
)

export default router
