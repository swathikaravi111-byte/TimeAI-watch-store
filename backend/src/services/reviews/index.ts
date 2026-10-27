import logger from '@/utils/logger'
import { NotFoundError, BadRequestError } from '@/utils/errors'
import { getPaginationMetadata, getPaginationOffset } from '@/utils/helpers'

// Mock database
const reviews = new Map<string, any[]>()

export class ReviewService {
  /**
   * Create review
   */
  async createReview(
    userId: string,
    productId: string,
    data: { rating: number; title: string; comment: string }
  ) {
    logger.info('Creating review', { userId, productId })

    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestError('Rating must be between 1 and 5')
    }

    if (!reviews.has(productId)) {
      reviews.set(productId, [])
    }

    const review = {
      id: `review-${Date.now()}`,
      userId,
      productId,
      ...data,
      helpful: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    reviews.get(productId)!.push(review)
    logger.info('Review created', { reviewId: review.id })

    return review
  }

  /**
   * Get product reviews
   */
  async getProductReviews(productId: string, page = 1, limit = 10) {
    const productReviews = reviews.get(productId) || []
    const sortedReviews = productReviews.sort((a, b) => b.createdAt - a.createdAt)

    const total = sortedReviews.length
    const offset = getPaginationOffset(page, limit)
    const paginatedReviews = sortedReviews.slice(offset, offset + limit)

    const averageRating =
      total > 0
        ? productReviews.reduce((sum, r) => sum + r.rating, 0) / total
        : 0

    return {
      reviews: paginatedReviews,
      total,
      averageRating,
      ...getPaginationMetadata(page, limit, total),
    }
  }

  /**
   * Update review
   */
  async updateReview(
    reviewId: string,
    userId: string,
    data: Partial<any>
  ) {
    logger.info('Updating review', { reviewId })

    for (const [productId, productReviews] of reviews.entries()) {
      const review = productReviews.find((r) => r.id === reviewId)
      if (review) {
        if (review.userId !== userId) {
          throw new BadRequestError('Unauthorized')
        }

        Object.assign(review, {
          ...data,
          updatedAt: new Date(),
        })

        logger.info('Review updated', { reviewId })
        return review
      }
    }

    throw new NotFoundError('Review')
  }

  /**
   * Delete review
   */
  async deleteReview(reviewId: string, userId: string) {
    logger.info('Deleting review', { reviewId })

    for (const [productId, productReviews] of reviews.entries()) {
      const index = productReviews.findIndex((r) => r.id === reviewId)
      if (index !== -1) {
        const review = productReviews[index]
        if (review.userId !== userId) {
          throw new BadRequestError('Unauthorized')
        }

        productReviews.splice(index, 1)
        logger.info('Review deleted', { reviewId })
        return
      }
    }

    throw new NotFoundError('Review')
  }

  /**
   * Get user reviews
   */
  async getUserReviews(userId: string) {
    const userReviews: any[] = []

    for (const productReviews of reviews.values()) {
      userReviews.push(...productReviews.filter((r) => r.userId === userId))
    }

    return userReviews.sort((a, b) => b.createdAt - a.createdAt)
  }
}

export default new ReviewService()
