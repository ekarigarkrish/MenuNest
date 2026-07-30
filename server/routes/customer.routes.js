import express from 'express'
import customerController from '../controllers/customer.controller.js'
import { isAuthenticated, isCustomerAuthenticated } from '../middleware/auth.middleware.js'

const router = express.Router({ caseSensitive: true })

router.get('/', isAuthenticated('admin'), customerController.getCustomers)

router.post('/check', customerController.checkCustomerByPhone)

router.get('/me', isCustomerAuthenticated, customerController.getCustomerInfo)

router.put('/update', isCustomerAuthenticated, customerController.updateCustomerInfo)

export default router