import express from 'express'
import profileController from '../controllers/profile.controller.js'
import { isAuthenticated } from '../middleware/auth.middleware.js'

const router = express.Router({ caseSensitive: true })

// GET current user profile
router.get('/', isAuthenticated('admin'), profileController.getProfile)

// PUT update current user profile
router.put('/', isAuthenticated('admin'), profileController.updateProfile)

export default router
