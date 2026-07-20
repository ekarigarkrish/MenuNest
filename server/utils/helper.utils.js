import { deleteFile } from './removeFile.utils.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'
import config from '../config/config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logErrorToFile = (message) => {
    try {
        const date = new Date();
        const dateString = date.toISOString().split('T')[0];
        const timeString = date.toISOString().replace('T', ' ').split('.')[0];
        
        const logsDir = path.join(__dirname, '../logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
        
        const logFilePath = path.join(logsDir, `${dateString}.log`);
        const logMessage = `[${timeString}] ${message}\n`;
        
        fs.appendFileSync(logFilePath, logMessage, 'utf8');
    } catch (err) {
        console.error('Failed to log error to file:', err.message);
    }
}

export const ApiError = (message, statusCode) => {
    const error = new Error(message)
    error.statusCode = statusCode
    error.success = false
    return error
}

export const asyncHandler = (fn, name = 'UnknownController') => {

    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            const errorMsg = `Error in ${name} : ${err.message}`;
            console.error(`🔥 ${errorMsg}`)
            if (req.file?.filename) deleteFile(req.file?.path)
            if (req.files && req.files?.length > 0) req.files?.forEach(file => deleteFile(file.path))
            next(err)
        })
    }
}

export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    
    // Log error to file
    const errorMessage = err.message || 'Something went wrong';
    logErrorToFile(`Global Error: ${errorMessage}`);

    // For API requests (JSON response)
    return res.status(statusCode).json(
        {
            success: false,
            message: errorMessage,
        }
    )
}

// Token encryption utilities
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

const getEncryptionKey = () => {
    const secret = config.secretKey;
    // sha256 produces a 32-byte hash, which is required for aes-256-cbc
    return crypto.createHash('sha256').update(String(secret)).digest();
};

export const signToken = (payload) => {
    try {
        const text = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        throw new Error('Error signing token: ' + error.message);
    }
}

export const decryptToken = (token) => {
    try {
        const textParts = token.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        
        const decryptedString = decrypted.toString();
        try {
            return JSON.parse(decryptedString);
        } catch (e) {
            return decryptedString;
        }
    } catch (error) {
        throw new Error('Error decrypting token: ' + error.message);
    }
}
