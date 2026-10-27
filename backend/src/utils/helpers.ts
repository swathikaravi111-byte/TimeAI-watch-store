import crypto from 'crypto'
import { Response } from 'express'

/**
 * Generate random token
 */
export const generateToken = (length = 32): string => {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Hash password (in real app use bcryptjs)
 */
export const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

/**
 * Compare password (in real app use bcryptjs.compare)
 */
export const comparePassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash
}

/**
 * Sanitize user object (remove sensitive data)
 */
export const sanitizeUser = (user: any) => {
  const { password, ...sanitized } = user
  return sanitized
}

/**
 * Generate pagination metadata
 */
export const getPaginationMetadata = (page: number, limit: number, total: number) => {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPreviousPage: page > 1,
  }
}

/**
 * Calculate pagination offset
 */
export const getPaginationOffset = (page: number, limit: number): number => {
  return (page - 1) * limit
}

/**
 * Standard API response
 */
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  metadata?: any
) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data: data || null,
    metadata: metadata || null,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Error response
 */
export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: any
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: errors || null,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Generate slug from string
 */
export const generateSlug = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Parse filters from query string
 */
export const parseFilters = (query: any) => {
  return {
    search: query.search || undefined,
    brand: query.brand ? (Array.isArray(query.brand) ? query.brand : [query.brand]) : undefined,
    category: query.category || undefined,
    minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
    maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
    inStock: query.inStock === 'true' ? true : undefined,
    rating: query.rating ? parseFloat(query.rating) : undefined,
    sort: query.sort || 'newest',
  }
}

/**
 * Generate JWT token payload
 */
export const generateJwtPayload = (user: any) => {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  }
}

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (originalPrice: number, discountedPrice: number): number => {
  if (originalPrice <= 0) return 0
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password)
  )
}

/**
 * Truncate string
 */
export const truncateString = (str: string, length: number): string => {
  return str.length > length ? str.slice(0, length) + '...' : str
}

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Check if object is empty
 */
export const isEmpty = (obj: any): boolean => {
  return Object.keys(obj).length === 0
}
