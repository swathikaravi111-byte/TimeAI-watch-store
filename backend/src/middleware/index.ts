import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import logger from '@/utils/logger'
import { sendError } from '@/utils/helpers'
import { ApiError } from '@/utils/errors'
import { asyncHandler } from './asyncHandler'
import { authMiddleware, adminMiddleware, optionalAuthMiddleware } from './authMiddleware'
import { rateLimiter } from './rateLimiter'

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userId: (req as any).userId,
  })
  next()
}

/**
 * Validation middleware
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err: any) => ({
      field: err.param,
      message: err.msg,
      value: err.value,
    }))
    return sendError(res, 422, 'Validation failed', formattedErrors)
  }
  next()
}

/**
 * Error handling middleware (should be last)
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    url: req.path,
    method: req.method,
  })

  if (err instanceof ApiError) {
    return sendError(res, err.statusCode, err.message, err.errors)
  }

  sendError(res, 500, 'Internal server error')
}

/**
 * Not found middleware
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  logger.warn(`Route not found: ${req.method} ${req.path}`)
  sendError(res, 404, `Route ${req.path} not found`)
}

/**
 * CORS middleware
 */
export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  )
  res.header('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
}

/**
 * Export all middleware
 */
export {
  asyncHandler,
  authMiddleware,
  adminMiddleware,
  optionalAuthMiddleware,
  rateLimiter,
}
