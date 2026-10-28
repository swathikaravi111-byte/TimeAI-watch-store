import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import logger from '@/utils/logger'
import { UnauthorizedError, ForbiddenError } from '@/utils/errors'

interface JwtPayload {
  id: string
  email: string
  role: 'user' | 'admin'
  iat: number
  exp: number
}

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      userId?: string
      user?: {
        id: string
        email: string
        role: 'user' | 'admin'
      }
    }
  }
}

/**
 * JWT Authentication Middleware
 * Verifies JWT token and extracts user information
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      throw new UnauthorizedError('No authorization header provided')
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as JwtPayload

    req.userId = decoded.id
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    }

    logger.debug('User authenticated', { userId: decoded.id })
    next()
  } catch (error: any) {
    logger.warn('Authentication failed', { error: error.message })
    throw new UnauthorizedError('Invalid or expired token')
  }
}

/**
 * Admin Authorization Middleware
 * Requires user to have admin role
 */
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    logger.warn('Unauthorized admin access attempt', { userId: req.userId })
    throw new ForbiddenError('Admin access required')
  }
  logger.debug('Admin access granted', { userId: req.userId })
  next()
}

/**
 * Optional Authentication Middleware
 * Extracts user info if token present, but doesn't require it
 */
export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader) {
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secret'
      ) as JwtPayload

      req.userId = decoded.id
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      }
    }
  } catch (error) {
    // Silently ignore auth errors for optional auth
    logger.debug('Optional auth token invalid or expired')
  }
  next()
}
