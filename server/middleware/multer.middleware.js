import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import config from '../config/config.js'
import { deleteFile } from '../utils/removeFile.utils.js'

const createStorage = (dir) => {
    const uploadPath = path.join('uploads', dir)

    // Ensure the folder exists
    fs.promises.mkdir(uploadPath, { recursive: true })

    return multer.diskStorage({
        destination: (req, file, cb) => { cb(null, uploadPath) },
        filename: (req, file, cb) => {
            const randomNo = Math.round(Math.random() * 10)
            const newFileName = `${Date.now()}${randomNo}${path.extname(file.originalname)}`;
            cb(null, newFileName)
        }
    })
}

const getFileFilter = (req, file, cb) => {
    if (!file || !file.originalname) {
        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Missing file name'), false)
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = config.allowedImageExtensions || [];

    if (!allowed.includes(ext)) {
        return cb(new Error(`Invalid Image Format for field '${file.fieldname}'. Allowed: ${allowed.join(', ')}`), false)
    }

    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error(`Invalid file type. Only images are allowed for field '${file.fieldname}'`), false)
    }

    cb(null, true)
}

export const checkSizeLimits = (fieldRules) => async (req, res, next) => {
    try {
        const rules = Array.isArray(fieldRules) ? fieldRules : [fieldRules]

        for (const rule of rules) {
            const files = getFilesByField(rule.field_name, req)

            for (const file of files) {
                const limitInBytes = rule?.size * 1024;
                if (file?.size > limitInBytes) {
                    await Promise.all(files.map(file => deleteFile(file.path)))
                    return res.status(400).json({
                        success: false, message: `${rule.field_name} exceeds ${rule.size}KB size limit`
                    })
                }
            }
        }

        return next()
    } catch (error) {
        console.error('checkSizeLimits:', error.message)
        return res.status(500).json({ success: false, message: 'Internal server error during file size check' })
    }
}

// 🔹 Helper: Get matching files by field name
function getFilesByField(fieldName, req) {
    if (req.files?.[fieldName]) return req.files[fieldName]
    if (req.file?.fieldname === fieldName) return [req.file]
    if (Array.isArray(req.files)) {
        return req.files.filter(file => file.fieldname === fieldName)
    }
    return []
}

// export const compressImages = async (req, res, next) => {
//     try {
//         const filesToProcess = []
//         if (req.file) filesToProcess.push(req.file)

//         if (req.files) {
//             if (Array.isArray(req.files)) {
//                 filesToProcess.push(...req.files)
//             } else {
//                 Object.values(req.files).forEach(fileArray => {
//                     if (Array.isArray(fileArray)) {
//                         filesToProcess.push(...fileArray)
//                     } else {
//                         filesToProcess.push(fileArray)
//                     }
//                 })
//             }
//         }

//         if (filesToProcess.length === 0) {
//             return next()
//         }

//         const imageExtensions = config.allowedImageExtensions || []

//         await Promise.all(filesToProcess.map(async (file) => {
//             if (!file.path) return;

//             const ext = path.extname(file.originalname).toLowerCase()
//             if (imageExtensions.includes(ext)) {
//                 await compressImageFile(file.path)

//                 // Update file size after compression
//                 const stats = await fs.promises.stat(file.path)
//                 file.size = stats.size
//             }
//         }))

//         next()
//     } catch (error) {
//         console.error('Image Optimization Error:', error.message)
//         next()
//     }
// }

export const handlemulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
        // A Multer error occurred when uploading.
        return res.status(400).json({ success: false, message: 'Too many files.' })
    } else if (err) {
        // Use the original status code if available (e.g., 401 from protect), otherwise default to 400
        const statusCode = err.statusCode || 400;
        return res.status(statusCode).json({ success: false, message: err.message })
    }
    else if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(400).json({ success: false, message: err.message })
    }

    next()
} // Error handling middleware

export const upload = (folder = '') => {
    return multer({
        storage: createStorage(folder),
        fileFilter: getFileFilter,
        limits: {
            fileSize: 2 * 1024 * 1024, // 2MB
        },
    })
}