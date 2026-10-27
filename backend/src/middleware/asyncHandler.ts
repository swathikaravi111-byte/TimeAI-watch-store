import { Request, Response, NextFunction } from 'express'
import logger from '@/utils/logger'

/**
 * Async Error Handler Wrapper
 * Wraps async route handlers to catch errors and pass to error handler middleware
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      logger.error('Async handler error', {
        message: error.message,
        path: req.path,
        method: req.method,
      })
      next(error)
    })
  }
}
