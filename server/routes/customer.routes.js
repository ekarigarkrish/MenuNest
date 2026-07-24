import express from 'express'
import customerController from '../controllers/customer.controller.js'

const router = express.Router({ caseSensitive: true })

router.get('/', customerController.getCustomers)
router.post('/check', customerController.checkCustomerByPhone)

export default router