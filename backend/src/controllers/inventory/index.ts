import { Request, Response } from 'express'
import inventoryService from '@/services/inventory'
import { sendResponse } from '@/utils/helpers'
import { asyncHandler } from '@/middleware'
import logger from '@/utils/logger'

export class InventoryController {
  /**
   * POST /inventory
   * Create inventory record (Admin only)
   */
  createInventory = asyncHandler(async (req: Request, res: Response) => {
    logger.info('Creating inventory record', { body: req.body })
    const inventory = await inventoryService.createInventory(req.body)
    sendResponse(res, 201, 'Inventory record created', inventory)
  })

  /**
   * GET /inventory/:productId
   * Get inventory by product ID
   */
  getInventoryByProductId = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params
    logger.debug('Fetching inventory', { productId })
    const inventory = await inventoryService.getInventoryByProductId(productId)
    sendResponse(res, 200, 'Inventory retrieved', inventory)
  })

  /**
   * PATCH /inventory/:productId/stock
   * Update stock (Admin only)
   */
  updateStock = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params
    const { quantity, operation } = req.body

    logger.info('Updating stock', { productId, quantity, operation })
    const inventory = await inventoryService.updateStock(productId, quantity, operation)
    sendResponse(res, 200, 'Stock updated', inventory)
  })

  /**
   * GET /inventory/low-stock
   * Get low stock products (Admin only)
   */
  getLowStockProducts = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    logger.debug('Fetching low stock products', { page, limit })
    const result = await inventoryService.getLowStockProducts(page, limit)
    sendResponse(res, 200, 'Low stock products retrieved', result.data, {
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
      },
    })
  })

  /**
   * GET /inventory/stats
   * Get inventory statistics (Admin only)
   */
  getInventoryStats = asyncHandler(async (req: Request, res: Response) => {
    logger.debug('Fetching inventory statistics')
    const stats = await inventoryService.getInventoryStats()
    sendResponse(res, 200, 'Inventory statistics retrieved', stats)
  })

  /**
   * POST /inventory/:productId/adjust
   * Adjust inventory (Admin only)
   */
  adjustInventory = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params
    const { quantity, reason } = req.body

    logger.info('Adjusting inventory', { productId, quantity, reason })
    const inventory = await inventoryService.adjustInventory(productId, {
      quantity,
      reason,
    })
    sendResponse(res, 200, 'Inventory adjusted', inventory)
  })
}

export default new InventoryController()
