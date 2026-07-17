import express from 'express'
import userController from '../controllers/user.controller.js'

const router = express.Router({ caseSensitive: true })

// Add your routes here
router.post('/login', userController.handleLogin)
router.post('/logout', userController.handleLogout)

export default router