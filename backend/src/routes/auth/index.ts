import { Router } from 'express'
import authController from '@/controllers/auth'
import { validateLogin, validateRegister, validateChangePassword } from '@/utils/validators'
import { handleValidationErrors, authMiddleware } from '@/middleware'

const router = Router()

/**
 * POST /auth/register
 * Register new user
 * Body: { firstName, lastName, email, password }
 */
router.post(
  '/register',
  validateRegister(),
  handleValidationErrors,
  authController.register
)

/**
 * POST /auth/login
 * Login user
 * Body: { email, password }
 */
router.post(
  '/login',
  validateLogin(),
  handleValidationErrors,
  authController.login
)

/**
 * POST /auth/refresh
 * Refresh access token
 * Body: { refreshToken }
 */
router.post('/refresh', authController.refreshToken)

/**
 * GET /auth/me
 * Get current user
 * Auth: Required
 */
router.get('/me', authMiddleware, authController.getCurrentUser)

/**
 * PUT /auth/profile
 * Update user profile
 * Auth: Required
 */
router.put('/profile', authMiddleware, authController.updateProfile)

/**
 * POST /auth/change-password
 * Change user password
 * Auth: Required
 */
router.post(
  '/change-password',
  authMiddleware,
  validateChangePassword(),
  handleValidationErrors,
  authController.changePassword
)

/**
 * POST /auth/logout
 * Logout user
 * Auth: Required
 */
router.post('/logout', authMiddleware, authController.logout)

export default router
