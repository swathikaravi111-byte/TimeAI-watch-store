import jwt from 'jsonwebtoken'
import logger from '@/utils/logger'
import prisma from '@/utils/prisma'
import { UnauthorizedError, ConflictError, NotFoundError } from '@/utils/errors'
import { sanitizeUser, hashPassword, comparePassword } from '@/utils/helpers'

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
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new ConflictError('Email already registered')
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: hashPassword(data.password),
        role: 'USER',
        status: 'ACTIVE',
      },
    })

    logger.info('User registered successfully', { userId: user.id, email: data.email })

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

    const user = await prisma.user.findUnique({
      where: { email },
    })

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
   * Get current user
   */
  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
      },
    })

    if (!user) {
      throw new NotFoundError('User')
    }

    return sanitizeUser(user)
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: Partial<any>) {
    logger.info('Updating user profile', { userId })

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        avatar: data.avatar,
      },
    })

    return sanitizeUser(user)
  }

  /**
   * Change password
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    logger.info('Changing password', { userId })

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundError('User')
    }

    const passwordMatch = comparePassword(oldPassword, user.password)
    if (!passwordMatch) {
      throw new UnauthorizedError('Current password is incorrect')
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashPassword(newPassword),
      },
    })

    logger.info('Password changed successfully', { userId })
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: any): string {
    const secret = process.env.JWT_SECRET || 'secret'
    const expiresIn = process.env.JWT_EXPIRE || '24h'

    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn }
    )
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(user: any): string {
    const secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret'
    const expiresIn = process.env.JWT_REFRESH_EXPIRE || '7d'

    return jwt.sign(
      {
        id: user.id,
      },
      secret,
      { expiresIn }
    )
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    try {
      const secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret'
      const decoded: any = jwt.verify(refreshToken, secret)

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      })

      if (!user) {
        throw new NotFoundError('User')
      }

      const newToken = this.generateToken(user)
      const newRefreshToken = this.generateRefreshToken(user)

      return {
        token: newToken,
        refreshToken: newRefreshToken,
      }
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token')
    }
  }
}

export default new AuthService()
