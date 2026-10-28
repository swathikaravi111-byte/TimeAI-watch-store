import { Request, Response } from 'express'
import authService from '@/services/auth'
import { sendResponse, sendError } from '@/utils/helpers'
import logger from '@/utils/logger'
import { asyncHandler } from '@/middleware'

export class AuthController {
  /**
   * POST /auth/register
   * Register new user
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body

    const result = await authService.register({
      firstName,
      lastName,
      email,
      password,
    })

    sendResponse(res, 201, 'User registered successfully', result)
  })

  /**
   * POST /auth/login
   * Login user
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    const result = await authService.login(email, password)

    sendResponse(res, 200, 'Login successful', result)
  })

  /**
   * POST /auth/refresh
   * Refresh access token
   */
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return sendError(res, 400, 'Refresh token is required')
    }

    const result = await authService.refreshToken(refreshToken)

    sendResponse(res, 200, 'Token refreshed', result)
  })

  /**
   * GET /auth/me
   * Get current user
   */
  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId

    const user = await authService.getCurrentUser(userId)

    sendResponse(res, 200, 'User retrieved', user)
  })

  /**
   * PUT /auth/profile
   * Update user profile
   */
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId
    const { firstName, lastName, phone, avatar } = req.body

    const user = await authService.updateProfile(userId, {
      firstName,
      lastName,
      phone,
      avatar,
    })

    sendResponse(res, 200, 'Profile updated', user)
  })

  /**
   * POST /auth/change-password
   * Change user password
   */
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId
    const { oldPassword, newPassword } = req.body

    await authService.changePassword(userId, oldPassword, newPassword)

    sendResponse(res, 200, 'Password changed successfully')
  })

  /**
   * POST /auth/logout
   * Logout user
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId

    await authService.logout(userId)

    sendResponse(res, 200, 'Logged out successfully')
  })
}

export default new AuthController()
