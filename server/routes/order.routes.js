import express from 'express'
import orderController from '../controllers/order.controller.js'
import { isAuthenticated } from '../middleware/auth.middleware.js'
const router = express.Router({ caseSensitive: true })

router.get('/get/data', isAuthenticated('admin'), orderController.getliveReceivingData)
router.get('/all', isAuthenticated('admin'), orderController.getAllOrders)
router.patch('/update/status/:id', isAuthenticated('admin'), orderController.updateOrderStatus)

export default router