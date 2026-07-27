import express from 'express'
import orderController from '../controllers/order.controller.js'
const router = express.Router({ caseSensitive: true })

router.get('/get/data', orderController.getliveReceivingData)
router.get('/all', orderController.getAllOrders)
router.patch('/update/status/:id', orderController.updateOrderStatus)

export default router