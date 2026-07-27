import express from 'express'
import customerController from '../controllers/customer.controller.js'
import { isAuthenticated } from '../middleware/auth.middleware.js'

const router = express.Router({ caseSensitive: true })

router.get('/', isAuthenticated('admin'), customerController.getCustomers)
router.post('/check', customerController.checkCustomerByPhone)

export default router