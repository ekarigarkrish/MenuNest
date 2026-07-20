import express from 'express'
import userController from '../controllers/user.controller.js'
import authController from '../controllers/auth.controller.js'

const router = express.Router({ caseSensitive: true })

// Add your routes here
router.post('/login', userController.handleLogin)
router.post('/logout', userController.handleLogout)

// CSRF Token
router.get('/get/csrf-token', authController.generateCSRFToken)

export default router