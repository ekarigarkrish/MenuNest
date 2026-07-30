import express from 'express'
import orderController from '../controllers/order.controller.js'
import { isAuthenticated, isCustomerAuthenticated } from '../middleware/auth.middleware.js'
const router = express.Router({ caseSensitive: true })

router.get('/get/data', isAuthenticated('admin'), orderController.getliveReceivingData)

router.get('/all', isAuthenticated('admin'), orderController.getAllOrders)

router.patch('/update/status/:id', isAuthenticated('admin'), orderController.updateOrderStatus)

router.patch('/update-payment-status/:id', isAuthenticated('admin'), orderController.updatePaymentStatus)

router.post('/customer/orders', isCustomerAuthenticated, orderController.getCustomerOrderHistory)

router.get('/:id/receipt', isCustomerAuthenticated, orderController.getReceipt)

export default router