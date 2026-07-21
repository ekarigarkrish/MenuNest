import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { globalErrorHandler } from './utils/helper.utils.js'
import compression from 'compression'
import cors from 'cors'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import config from './config/config.js'
import helmet from 'helmet'
import indexRoutes from './routes/index.route.js'

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

app.use('/', indexRoutes)

// error handler
app.use(globalErrorHandler)
export default app