import logger from '@/utils/logger'
import { NotFoundError, BadRequestError } from '@/utils/errors'
import { getPaginationMetadata, getPaginationOffset } from '@/utils/helpers'

// Mock database for inventory
const inventory = new Map<string, any>()
let inventoryIdCounter = 1

export class InventoryService {
  /**
   * Create inventory record
   */
  async createInventory(data: {
    productId: string
    quantity: number
    reorderLevel: number
    reorderQuantity: number
    warehouse?: string
  }) {
    logger.info('Creating inventory record', { productId: data.productId })

    const inventoryId = `inv-${inventoryIdCounter++}`
    const inventoryRecord = {
      id: inventoryId,
      ...data,
      lastUpdated: new Date(),
      createdAt: new Date(),
    }

    inventory.set(inventoryId, inventoryRecord)
    logger.info('Inventory record created', { inventoryId })

    return inventoryRecord
  }

  /**
   * Get inventory by product ID
   */
  async getInventoryByProductId(productId: string) {
    const inv = Array.from(inventory.values()).find((i) => i.productId === productId)

    if (!inv) {
      throw new NotFoundError('Inventory')
    }

    return inv
  }

  /**
   * Update stock
   */
  async updateStock(productId: string, quantity: number, operation: 'add' | 'subtract') {
    logger.info('Updating stock', { productId, quantity, operation })

    const inv = Array.from(inventory.values()).find((i) => i.productId === productId)

    if (!inv) {
      throw new NotFoundError('Inventory')
    }

    const newQuantity = operation === 'add' ? inv.quantity + quantity : inv.quantity - quantity

    if (newQuantity < 0) {
      throw new BadRequestError('Insufficient stock')
    }

    inv.quantity = newQuantity
    inv.lastUpdated = new Date()

    logger.info('Stock updated', { productId, newQuantity })

    return inv
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(page = 1, limit = 20) {
    logger.debug('Fetching low stock products', { page, limit })

    const lowStock = Array.from(inventory.values())
      .filter((inv) => inv.quantity <= inv.reorderLevel)
      .sort((a, b) => a.quantity - b.quantity)

    const total = lowStock.length
    const offset = getPaginationOffset(page, limit)
    const paginatedProducts = lowStock.slice(offset, offset + limit)

    return {
      data: paginatedProducts,
      page,
      limit,
      total,
      ...getPaginationMetadata(page, limit, total),
    }
  }

  /**
   * Get inventory statistics
   */
  async getInventoryStats() {
    const allInventory = Array.from(inventory.values())

    const stats = {
      totalProducts: allInventory.length,
      totalStock: allInventory.reduce((sum, inv) => sum + inv.quantity, 0),
      lowStockCount: allInventory.filter((inv) => inv.quantity <= inv.reorderLevel).length,
      outOfStock: allInventory.filter((inv) => inv.quantity === 0).length,
      averageStock: allInventory.length > 0
        ? allInventory.reduce((sum, inv) => sum + inv.quantity, 0) / allInventory.length
        : 0,
    }

    return stats
  }

  /**
   * Adjust inventory (Admin only)
   */
  async adjustInventory(
    productId: string,
    adjustment: {
      quantity: number
      reason: string
    }
  ) {
    logger.info('Adjusting inventory', { productId, adjustment })

    const inv = Array.from(inventory.values()).find((i) => i.productId === productId)

    if (!inv) {
      throw new NotFoundError('Inventory')
    }

    inv.quantity += adjustment.quantity
    inv.lastAdjustment = {
      quantity: adjustment.quantity,
      reason: adjustment.reason,
      date: new Date(),
    }
    inv.lastUpdated = new Date()

    logger.info('Inventory adjusted', { productId, newQuantity: inv.quantity })

    return inv
  }
}

export default new InventoryService()
