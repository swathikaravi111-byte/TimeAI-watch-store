import { Router } from 'express'
import wishlistController from '@/controllers/wishlist'
import { authMiddleware } from '@/middleware'

const router = Router()

/**
 * POST /wishlist
 * Add to wishlist
 */
router.post('/', authMiddleware, wishlistController.addItem)

/**
 * GET /wishlist
 * Get wishlist
 */
router.get('/', authMiddleware, wishlistController.getWishlist)

/**
 * DELETE /wishlist/:productId
 * Remove from wishlist
 */
router.delete('/:productId', authMiddleware, wishlistController.removeItem)

/**
 * DELETE /wishlist
 * Clear wishlist
 */
router.delete('/', authMiddleware, wishlistController.clearWishlist)

/**
 * GET /wishlist/:productId/check
 * Check if product in wishlist
 */
router.get('/:productId/check', authMiddleware, wishlistController.checkInWishlist)

export default router
