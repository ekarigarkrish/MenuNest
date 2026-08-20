import express from 'express'
import userController from '../controllers/user.controller.js'
import { isAuthenticated } from '../middleware/auth.middleware.js'
const router = express.Router({ caseSensitive: true })

router.post('/create', isAuthenticated('admin'), userController.createUserRole)

router.put('/update/:id', isAuthenticated('admin'), userController.updateUserRole)

router.delete('/delete/:id', isAuthenticated('admin'), userController.deleteUserRole)

router.get('/get-roles', isAuthenticated('admin'), userController.getRoles)

export default router