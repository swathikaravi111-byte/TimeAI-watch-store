import { Router } from 'express'
import userController from '@/controllers/users'
import { authMiddleware, adminMiddleware } from '@/middleware'

const router = Router()

/**
 * GET /users
 * Get all users (Admin only)
 * Query: page, limit
 */
router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  userController.getAllUsers
)

/**
 * GET /users/stats/all
 * Get user statistics (Admin only)
 */
router.get(
  '/stats/all',
  authMiddleware,
  adminMiddleware,
  userController.getUserStats
)

/**
 * GET /users/:id
 * Get user by ID
 */
router.get('/:id', authMiddleware, userController.getUserById)

/**
 * PUT /users/:id
 * Update user
 */
router.put('/:id', authMiddleware, userController.updateUser)

/**
 * DELETE /users/:id
 * Delete user (Admin only)
 */
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  userController.deleteUser
)

/**
 * PATCH /users/:id/role
 * Update user role (Admin only)
 */
router.patch(
  '/:id/role',
  authMiddleware,
  adminMiddleware,
  userController.updateUserRole
)

/**
 * GET /users/:id/orders
 * Get user orders
 */
router.get('/:id/orders', authMiddleware, userController.getUserOrders)

/**
 * GET /users/:id/reviews
 * Get user reviews
 */
router.get('/:id/reviews', authMiddleware, userController.getUserReviews)

export default router
