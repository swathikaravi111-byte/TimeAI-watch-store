import { Router } from 'express'
import reviewController from '@/controllers/reviews'
import { validateCreateReview } from '@/utils/validators'
import { handleValidationErrors, authMiddleware } from '@/middleware'

const router = Router()

/**
 * POST /products/:productId/reviews
 * Create review (Auth required)
 */
router.post(
  '/products/:productId/reviews',
  authMiddleware,
  validateCreateReview(),
  handleValidationErrors,
  reviewController.createReview
)

/**
 * GET /products/:productId/reviews
 * Get product reviews
 */
router.get('/products/:productId/reviews', reviewController.getProductReviews)

/**
 * PUT /reviews/:reviewId
 * Update review (Auth required)
 */
router.put(
  '/:reviewId',
  authMiddleware,
  reviewController.updateReview
)

/**
 * DELETE /reviews/:reviewId
 * Delete review (Auth required)
 */
router.delete(
  '/:reviewId',
  authMiddleware,
  reviewController.deleteReview
)

/**
 * GET /reviews/user
 * Get user reviews (Auth required)
 */
router.get('/user', authMiddleware, reviewController.getUserReviews)

export default router
