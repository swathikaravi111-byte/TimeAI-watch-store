import jwt from 'jsonwebtoken'
import logger from '@/utils/logger'
import { UnauthorizedError, ConflictError, NotFoundError } from '@/utils/errors'
import { sanitizeUser, hashPassword, comparePassword } from '@/utils/helpers'

// Mock database - in production use Prisma
const users = new Map<string, any>()
let userIdCounter = 1

export class AuthService {
  /**
   * Register new user
   */
  async register(data: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) {
    logger.info('User registration attempt', { email: data.email })

    // Check if user exists
    const existingUser = Array.from(users.values()).find(
      (u) => u.email === data.email
    )
    if (existingUser) {
      throw new ConflictError('Email already registered')
    }

    const userId = `user-${userIdCounter++}`
    const user = {
      id: userId,
      ...data,
      password: hashPassword(data.password),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    users.set(userId, user)
    logger.info('User registered successfully', { userId, email: data.email })

    const token = this.generateToken(user)
    const refreshToken = this.generateRefreshToken(user)

    return {
      user: sanitizeUser(user),
      token,
      refreshToken,
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string) {
    logger.info('User login attempt', { email })

    const user = Array.from(users.values()).find((u) => u.email === email)
    if (!user) {
      throw new UnauthorizedError('Invalid email or password')
    }

    const passwordMatch = comparePassword(password, user.password)
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid email or password')
    }

    logger.info('User logged in successfully', { userId: user.id, email })

    const token = this.generateToken(user)
    const refreshToken = this.generateRefreshToken(user)

    return {
      user: sanitizeUser(user),
      token,
      refreshToken,
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh-secret') as any
      const user = users.get(decoded.userId)

      if (!user) {
        throw new NotFoundError('User')
      }

      const newToken = this.generateToken(user)
      return { token: newToken }
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token')
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(userId: string) {
    const user = users.get(userId)
    if (!user) {
      throw new NotFoundError('User')
    }
    return sanitizeUser(user)
  }

  /**
   * Update profile
   */
  async updateProfile(
    userId: string,
    data: {
      firstName?: string
      lastName?: string
      phone?: string
      avatar?: string
    }
  ) {
    const user = users.get(userId)
    if (!user) {
      throw new NotFoundError('User')
    }

    Object.assign(user, {
      ...data,
      updatedAt: new Date(),
    })

    logger.info('User profile updated', { userId })
    return sanitizeUser(user)
  }

  /**
   * Change password
   */
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = users.get(userId)
    if (!user) {
      throw new NotFoundError('User')
    }

    const passwordMatch = comparePassword(oldPassword, user.password)
    if (!passwordMatch) {
      throw new UnauthorizedError('Current password is incorrect')
    }

    user.password = hashPassword(newPassword)
    user.updatedAt = new Date()

    logger.info('User password changed', { userId })
  }

  /**
   * Logout user
   */
   async logout(userId: string) {
    logger.info('User logged out', { userId })
    return { message: 'Logged out successfully' }
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: any): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    )
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(user: any): string {
    return jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    )
  }
}

export default new AuthService()
