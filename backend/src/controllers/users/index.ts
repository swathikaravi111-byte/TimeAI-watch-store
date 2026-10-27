import { Request, Response } from 'express'
import userService from '@/services/users'
import { sendResponse } from '@/utils/helpers'
import { asyncHandler } from '@/middleware'
import logger from '@/utils/logger'

export class UserController {
  /**
   * GET /users
   * Get all users (Admin only)
   */
  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    logger.debug('Fetching all users', { page, limit })
    const result = await userService.getAllUsers(page, limit)
    sendResponse(res, 200, 'Users retrieved', result.data, {
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.pages,
      },
    })
  })

  /**
   * GET /users/:id
   * Get user by ID (Admin or own user)
   */
  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    logger.debug('Fetching user', { userId: id })
    const user = await userService.getUserById(id)
    sendResponse(res, 200, 'User retrieved', user)
  })

  /**
   * PUT /users/:id
   * Update user (Admin or own user)
   */
  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    logger.info('Updating user', { userId: id, body: req.body })
    const user = await userService.updateUser(id, req.body)
    sendResponse(res, 200, 'User updated successfully', user)
  })

  /**
   * DELETE /users/:id
   * Delete user (Admin only)
   */
  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    logger.info('Deleting user', { userId: id })
    await userService.deleteUser(id)
    sendResponse(res, 200, 'User deleted successfully')
  })

  /**
   * PATCH /users/:id/role
   * Update user role (Admin only)
   */
  updateUserRole = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const { role } = req.body

    logger.info('Updating user role', { userId: id, role })
    const user = await userService.updateUserRole(id, role)
    sendResponse(res, 200, 'User role updated', user)
  })

  /**
   * GET /users/stats/all
   * Get user statistics (Admin only)
   */
  getUserStats = asyncHandler(async (req: Request, res: Response) => {
    logger.debug('Fetching user statistics')
    const stats = await userService.getUserStats()
    sendResponse(res, 200, 'User statistics retrieved', stats)
  })

  /**
   * GET /users/:id/orders
   * Get user orders
   */
  getUserOrders = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    logger.debug('Fetching user orders', { userId: id, page, limit })
    const result = await userService.getUserOrders(id, page, limit)
    sendResponse(res, 200, 'User orders retrieved', result.data, {
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
      },
    })
  })

  /**
   * GET /users/:id/reviews
   * Get user reviews
   */
  getUserReviews = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    logger.debug('Fetching user reviews', { userId: id, page, limit })
    const result = await userService.getUserReviews(id, page, limit)
    sendResponse(res, 200, 'User reviews retrieved', result.data, {
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
      },
    })
  })
}

export default new UserController()
