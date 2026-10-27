import express, { Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import logger from '@/utils/logger'
import {
  requestLogger,
  corsMiddleware,
  rateLimiter,
  errorHandler,
  notFound,
} from '@/middleware'
import { swaggerSpec } from '@/swagger'

// Routes
import authRoutes from '@/routes/auth'
import productRoutes from '@/routes/products'
import categoryRoutes from '@/routes/categories'
import orderRoutes from '@/routes/orders'
import wishlistRoutes from '@/routes/wishlist'
import reviewRoutes from '@/routes/reviews'
import userRoutes from '@/routes/users'
import inventoryRoutes from '@/routes/inventory'

const app: Express = express()

/**
 * Trust proxy
 */
app.set('trust proxy', 1)

/**
 * Security Middleware
 */
app.use(helmet())

/**
 * CORS Middleware
 */
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}))

/**
 * Body Parser Middleware
 */
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

/**
 * Compression Middleware
 */
app.use(compression())

/**
 * Logging Middleware
 */
app.use(morgan('combined'))
app.use(requestLogger)

/**
 * Rate Limiter Middleware
 * 100 requests per 15 minutes
 */
app.use(rateLimiter(15 * 60 * 1000, 100))

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

/**
 * API Version Info
 */
app.get('/api/info', (req, res) => {
  res.json({
    name: 'TimeAI Watch Store API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  })
})

/**
 * Swagger Documentation
 */
app.use('/api/docs', swaggerUi.serve)
app.get('/api/docs', swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/api/swagger.json',
  },
}))

app.get('/api/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/users', userRoutes)
app.use('/api/inventory', inventoryRoutes)

/**
 * 404 Handler
 */
app.use(notFound)

/**
 * Global Error Handler (must be last)
 */
app.use(errorHandler)

export default app
