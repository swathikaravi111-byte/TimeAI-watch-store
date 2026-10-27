import { Request, Response, NextFunction } from 'express'
import { RateLimitError } from '@/utils/errors'
import logger from '@/utils/logger'

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}

/**
 * Rate Limiter Middleware
 * Limits requests per IP address
 * @param windowMs - Time window in milliseconds
 * @param maxRequests - Maximum requests per window
 */
export const rateLimiter = (windowMs: number, maxRequests: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'unknown'
    const now = Date.now()

    // Initialize or reset if window expired
    if (!store[ip] || now > store[ip].resetTime) {
      store[ip] = {
        count: 0,
        resetTime: now + windowMs,
      }
    }

    // Increment request count
    store[ip].count++

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests.toString())
    res.setHeader(
      'X-RateLimit-Remaining',
      Math.max(0, maxRequests - store[ip].count).toString()
    )
    res.setHeader(
      'X-RateLimit-Reset',
      new Date(store[ip].resetTime).toISOString()
    )

    // Check if limit exceeded
    if (store[ip].count > maxRequests) {
      logger.warn('Rate limit exceeded', { ip, count: store[ip].count })
      throw new RateLimitError(
        `Rate limit exceeded. Max ${maxRequests} requests per ${Math.round(windowMs / 1000)} seconds`
      )
    }

    next()
  }
}

/**
 * Cleanup old entries from store periodically
 */
setInterval(() => {
  const now = Date.now()
  for (const ip in store) {
    if (now > store[ip].resetTime) {
      delete store[ip]
    }
  }
}, 60000) // Cleanup every minute
