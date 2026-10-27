import { Request, Response } from 'express'
import reviewService from '@/services/reviews'
import { sendResponse } from '@/utils/helpers'
import { asyncHandler } from '@/middleware'

export class ReviewController {
  /**
   * POST /products/:productId/reviews
   * Create review
   */
  createReview = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId
    const { productId } = req.params

    const review = await reviewService.createReview(userId, productId, req.body)
    sendResponse(res, 201, 'Review created', review)
  })

  /**
   * GET /products/:productId/reviews
   * Get product reviews
   */
  getProductReviews = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const result = await reviewService.getProductReviews(productId, page, limit)
    sendResponse(res, 200, 'Reviews retrieved', result.reviews, {
      averageRating: result.averageRating,
      pagination: { page: result.page, limit: result.limit, total: result.total },
    })
  })

  /**
   * PUT /reviews/:reviewId
   * Update review
   */
  updateReview = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId
    const { reviewId } = req.params

    const review = await reviewService.updateReview(reviewId, userId, req.body)
    sendResponse(res, 200, 'Review updated', review)
  })

  /**
   * DELETE /reviews/:reviewId
   * Delete review
   */
  deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId
    const { reviewId } = req.params

    await reviewService.deleteReview(reviewId, userId)
    sendResponse(res, 200, 'Review deleted')
  })

  /**
   * GET /reviews/user
   * Get user reviews
   */
  getUserReviews = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId

    const reviews = await reviewService.getUserReviews(userId)
    sendResponse(res, 200, 'User reviews retrieved', reviews)
  })
}

export default new ReviewController()
