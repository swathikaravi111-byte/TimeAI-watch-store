import logger from '@/utils/logger'
import { NotFoundError, BadRequestError } from '@/utils/errors'
import { getPaginationMetadata, getPaginationOffset } from '@/utils/helpers'
import productService from '@/services/products'

// Mock database
const orders = new Map<string, any>()
let orderIdCounter = 1

export class OrderService {
  /**
   * Create order
   */
  async createOrder(userId: string, data: {
    items: Array<{ productId: string; quantity: number }>
    shippingAddress: any
    billingAddress?: any
    paymentMethod: string
  }) {
    logger.info('Creating order', { userId, itemCount: data.items.length })

    // Calculate totals
    let subtotal = 0
    for (const item of data.items) {
      const product = await productService.getProductById(item.productId)
      if (product.stock < item.quantity) {
        throw new BadRequestError(`Insufficient stock for ${product.name}`)
      }
      subtotal += product.price * item.quantity

      // Update inventory
      await productService.updateProductStock(item.productId, -item.quantity)
    }

    const tax = subtotal * 0.1 // 10% tax
    const shipping = 15 // Fixed shipping
    const total = subtotal + tax + shipping

    const orderId = `order-${orderIdCounter++}`
    const order = {
      id: orderId,
      userId,
      items: data.items,
      subtotal,
      tax,
      shipping,
      total,
      status: 'pending',
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress || data.shippingAddress,
      paymentMethod: data.paymentMethod,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    orders.set(orderId, order)
    logger.info('Order created', { orderId, userId, total })

    return order
  }

  /**
   * Get user orders
   */
  async getUserOrders(userId: string, page = 1, limit = 20) {
    logger.debug('Fetching user orders', { userId, page, limit })

    const userOrders = Array.from(orders.values())
      .filter((o) => o.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt)

    const total = userOrders.length
    const offset = getPaginationOffset(page, limit)
    const paginatedOrders = userOrders.slice(offset, offset + limit)

    return {
      data: paginatedOrders,
      ...getPaginationMetadata(page, limit, total),
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string) {
    const order = orders.get(id)
    if (!order) {
      throw new NotFoundError('Order')
    }
    return order
  }

  /**
   * Update order status (Admin only)
   */
  async updateOrderStatus(id: string, status: string) {
    logger.info('Updating order status', { id, status })

    const order = orders.get(id)
    if (!order) {
      throw new NotFoundError('Order')
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      throw new BadRequestError('Invalid status')
    }

    order.status = status
    order.updatedAt = new Date()

    logger.info('Order status updated', { id, status })
    return order
  }

  /**
   * Cancel order
   */
  async cancelOrder(id: string, reason: string) {
    logger.info('Cancelling order', { id, reason })

    const order = orders.get(id)
    if (!order) {
      throw new NotFoundError('Order')
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      throw new BadRequestError('Cannot cancel order in current status')
    }

    // Restore inventory
    for (const item of order.items) {
      await productService.updateProductStock(item.productId, item.quantity)
    }

    order.status = 'cancelled'
    order.cancelReason = reason
    order.updatedAt = new Date()

    logger.info('Order cancelled', { id })
    return order
  }

  /**
   * Get all orders (Admin only)
   */
  async getAllOrders(page = 1, limit = 20) {
    const allOrders = Array.from(orders.values()).sort(
      (a, b) => b.createdAt - a.createdAt
    )

    const total = allOrders.length
    const offset = getPaginationOffset(page, limit)
    const paginatedOrders = allOrders.slice(offset, offset + limit)

    return {
      data: paginatedOrders,
      ...getPaginationMetadata(page, limit, total),
    }
  }

  /**
   * Get order statistics (Admin only)
   */
  async getOrderStats() {
    const allOrders = Array.from(orders.values())

    return {
      totalOrders: allOrders.length,
      totalRevenue: allOrders.reduce((sum, o) => sum + o.total, 0),
      avgOrderValue: allOrders.length > 0 
        ? allOrders.reduce((sum, o) => sum + o.total, 0) / allOrders.length 
        : 0,
      byStatus: {
        pending: allOrders.filter((o) => o.status === 'pending').length,
        confirmed: allOrders.filter((o) => o.status === 'confirmed').length,
        shipped: allOrders.filter((o) => o.status === 'shipped').length,
        delivered: allOrders.filter((o) => o.status === 'delivered').length,
        cancelled: allOrders.filter((o) => o.status === 'cancelled').length,
      },
    }
  }
}

export default new OrderService()
