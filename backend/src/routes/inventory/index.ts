import { Router } from 'express'
import inventoryController from '@/controllers/inventory'
import { authMiddleware, adminMiddleware } from '@/middleware'

const router = Router()

/**
 * POST /inventory
 * Create inventory record (Admin only)
 */
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  inventoryController.createInventory
)

/**
 * GET /inventory/:productId
 * Get inventory by product ID
 */
router.get('/:productId', inventoryController.getInventoryByProductId)

/**
 * GET /inventory/low-stock
 * Get low stock products (Admin only)
 */
router.get(
  '/low-stock/all',
  authMiddleware,
  adminMiddleware,
  inventoryController.getLowStockProducts
)

/**
 * GET /inventory/stats
 * Get inventory statistics (Admin only)
 */
router.get(
  '/stats/all',
  authMiddleware,
  adminMiddleware,
  inventoryController.getInventoryStats
)

/**
 * PATCH /inventory/:productId/stock
 * Update stock (Admin only)
 */
router.patch(
  '/:productId/stock',
  authMiddleware,
  adminMiddleware,
  inventoryController.updateStock
)

/**
 * POST /inventory/:productId/adjust
 * Adjust inventory (Admin only)
 */
router.post(
  '/:productId/adjust',
  authMiddleware,
  adminMiddleware,
  inventoryController.adjustInventory
)

export default router
