import { Request, Response } from 'express'
import wishlistService from '@/services/wishlist'
import { sendResponse } from '@/utils/helpers'
import { asyncHandler } from '@/middleware'

export class WishlistController {
  /**
   * POST /wishlist
   * Add to wishlist
   */
  addItem = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId
    const { productId } = req.body

    await wishlistService.addItem(userId, productId)
    sendResponse(res, 201, 'Added to wishlist')
  })

  /**
   * DELETE /wishlist/:productId
   * Remove from wishlist
   */
  removeItem = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId
    const { productId } = req.params

    await wishlistService.removeItem(userId, productId)
    sendResponse(res, 200, 'Removed from wishlist')
  })

  /**
   * GET /wishlist
   * Get wishlist
   */
  getWishlist = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId
    const items = await wishlistService.getWishlist(userId)
    sendResponse(res, 200, 'Wishlist retrieved', items)
  })

  /**
   * DELETE /wishlist
   * Clear wishlist
   */
  clearWishlist = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId
    await wishlistService.clearWishlist(userId)
    sendResponse(res, 200, 'Wishlist cleared')
  })

  /**
   * GET /wishlist/:productId/check
   * Check if product in wishlist
   */
  checkInWishlist = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId
    const { productId } = req.params

    const inWishlist = await wishlistService.isInWishlist(userId, productId)
    sendResponse(res, 200, 'Check complete', { inWishlist })
  })
}

export default new WishlistController()
