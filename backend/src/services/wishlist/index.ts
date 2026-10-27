import logger from '@/utils/logger'
import { NotFoundError } from '@/utils/errors'

// Mock database: userId -> Set of productIds
const wishlists = new Map<string, Set<string>>()

export class WishlistService {
  /**
   * Add to wishlist
   */
  async addItem(userId: string, productId: string) {
    logger.debug('Adding to wishlist', { userId, productId })

    if (!wishlists.has(userId)) {
      wishlists.set(userId, new Set())
    }

    const wishlist = wishlists.get(userId)!
    wishlist.add(productId)

    return { message: 'Added to wishlist' }
  }

  /**
   * Remove from wishlist
   */
  async removeItem(userId: string, productId: string) {
    logger.debug('Removing from wishlist', { userId, productId })

    const wishlist = wishlists.get(userId)
    if (!wishlist || !wishlist.has(productId)) {
      throw new NotFoundError('Item in wishlist')
    }

    wishlist.delete(productId)
    return { message: 'Removed from wishlist' }
  }

  /**
   * Get wishlist
   */
  async getWishlist(userId: string) {
    const wishlist = wishlists.get(userId) || new Set()
    return Array.from(wishlist)
  }

  /**
   * Clear wishlist
   */
  async clearWishlist(userId: string) {
    wishlists.delete(userId)
    return { message: 'Wishlist cleared' }
  }

  /**
   * Check if product in wishlist
   */
  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const wishlist = wishlists.get(userId)
    return wishlist ? wishlist.has(productId) : false
  }
}

export default new WishlistService()
