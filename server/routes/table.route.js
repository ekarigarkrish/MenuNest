import express from 'express'
import tableController from '../controllers/table.controller.js'
import { isAuthenticated } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'
const router = express.Router({ caseSensitive: true })

router.get('/all/data',isAuthenticated('admin'),tableController.getAllTablesData)
router.route('/tb-qrcode/:id?')
    .post(isAuthenticated('admin'), upload('qrlogo').single('qrLogo'), tableController.createTableQRCode)
    .get(isAuthenticated('admin'), tableController.downloadQRCode)
    .put(isAuthenticated('admin'), upload('qrlogo').single('qrLogo'), tableController.updateTable)
    .delete(isAuthenticated('admin'), tableController.deleteTable)
router.post('/bulk-create', isAuthenticated('admin'), upload('qrlogo').single('qrLogo'), tableController.bulkCreateTableQRCodes)

export default router