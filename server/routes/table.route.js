import express from 'express'
import tableController from '../controllers/table.controller.js'
import { upload } from '../middleware/multer.middleware.js'
const router = express.Router({ caseSensitive: true })

router.get(
    '/all/data',
    tableController.getAllTablesData)

router.post(
    '/bulk-create',
    upload('qrlogo').single('qrLogo'),
    tableController.bulkCreateTableQRCodes)

router
    .route('/tb-qrcode/:id?')
    .post(upload('qrlogo').single('qrLogo'), tableController.createTableQRCode)
    .get(tableController.downloadQRCode)
    .put(upload('qrlogo').single('qrLogo'), tableController.updateTable)
    .delete(tableController.deleteTable)

export default router