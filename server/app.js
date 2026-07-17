import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { globalErrorHandler } from './utils/helper.utils.js'
import compression from 'compression'
import cors from 'cors'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import config from './config/config.js'
import { generateToken, doubleCsrfProtection } from './services/csrf.service.js'
import helmet from 'helmet'
import authRoutes from './routes/auth.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()

app.use(cors(
  {
    origin: config.clientOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    preflightContinue: false,
    credentials: true
  }
))
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}))
app.use(logger('dev'))
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(compression(
  {
    level: 4, // compression level
    threshold: 0, // Compress all
    memLevel: 9, // memory usuage
    filter: (req, res) => compression.filter(req, res)
  }
))

app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// app.get('/api/get/csrf-token', (req, res) => {
//   const token = generateToken(req, res); // Sets 'x-csrf-token' hash cookie
  
//   // Set a separate non-HttpOnly cookie for Axios to automatically read
//   res.cookie('csrf-token', token, {
//      httpOnly: true,
      // secure: !config.isDEV,
      // sameSite: config.isDEV ? 'lax' : 'none',
//   });
  
//   return res.status(200).json({ message: "CSRF cookies set successfully" });
// })

// app.use(doubleCsrfProtection)
app.use('/api/auth', authRoutes)

// error handler
app.use(globalErrorHandler)
export default app