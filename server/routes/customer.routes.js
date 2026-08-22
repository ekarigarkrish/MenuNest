import express from 'express'
import customerController from '../controllers/customer.controller.js'
import { isAuthenticated, isCustomerAuthenticated } from '../middleware/auth.middleware.js'
import { otpRequestLimiter, otpVerifyLimiter } from '../config/limiter.config.js'

const router = express.Router({ caseSensitive: true })

router.get('/', isAuthenticated('admin'), customerController.getCustomers)

router.post('/check', customerController.checkCustomerByPhone)

router.get('/me', isCustomerAuthenticated, customerController.getCustomerInfo)

router.put('/update', isCustomerAuthenticated, customerController.updateCustomerInfo)

router.get('/export', isAuthenticated('admin'), customerController.exportCustomersInfo)

router.post('/send/otp', isCustomerAuthenticated, otpRequestLimiter, customerController.sendOtp)

router.post('/verify/otp',isCustomerAuthenticated, otpVerifyLimiter, customerController.verifyOtp)

export default router