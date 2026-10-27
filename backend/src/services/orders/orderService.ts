import logger from '@/utils/logger'
import prisma from '@/utils/prisma'
import { NotFoundError, BadRequestError } from '@/utils/errors'
import { getPaginationMetadata, getPaginationOffset } from '@/utils/helpers'

export class OrderService {
  /**
   * Create order from cart
   */
  async createOrder(
    userId: string,
    data: {
      items: Array<{ productId: string; quantity: number }>
      shippingAddressId: string
      billingAddressId?: string
      paymentMethodId?: string
    }
  ) {
    logger.info('Creating order', { userId, itemCount: data.items.length })

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundError('User')
    }

    // Validate shipping address
    const shippingAddress = await prisma.address.findUnique({
      where: { id: data.shippingAddressId },
    })

    if (!shippingAddress || shippingAddress.userId !== userId) {
      throw new NotFoundError('Shipping address')
    }

    const billingAddress = data.billingAddressId
      ? await prisma.address.findUnique({
          where: { id: data.billingAddressId },
        })
      : shippingAddress

    if (data.billingAddressId && (!billingAddress || billingAddress.userId !== userId)) {
      throw new NotFoundError('Billing address')
    }

    // Calculate totals and validate stock
    let subtotal = 0
    const orderItems = []

    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { inventory: true },
      })

      if (!product) {
        throw new NotFoundError(`Product ${item.productId}`)
      }

      if (!product.inventory || product.inventory.quantity < item.quantity) {
        throw new BadRequestError(`Insufficient stock for ${product.name}`)
      }

      subtotal += product.price * item.quantity

      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: product.price * item.quantity,
      })
    }

    const tax = subtotal * 0.1 // 10% tax
    const shipping = 15 // Fixed shipping
    const total = subtotal + tax + shipping

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        items: orderItems,
        subtotal,
        tax,
        shipping,
        total,
        status: 'PENDING',
        orderNumber: `ORD-${Date.now()}`,
        shippingAddressId,
        billingAddressId: billingAddress!.id,
        paymentStatus: 'PENDING',
      },
      include: {
        shippingAddress: true,
        billingAddress: true,
        payments: true,
      },
    })

    // Reduce inventory
    for (const item of data.items) {
      await prisma.inventory.update({
        where: { productId: item.productId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      })

      logger.info('Inventory updated', {
        productId: item.productId,
        quantity: -item.quantity,
      })
    }

    logger.info('Order created', { orderId: order.id, total })

    return order
  }

  /**
   * Get user orders
   */
  async getUserOrders(userId: string, page = 1, limit = 10) {
    const total = await prisma.order.count({
      where: { userId },
    })

    const offset = getPaginationOffset(page, limit)

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        shippingAddress: true,
        payments: true,
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return {
      data: orders,
      ...getPaginationMetadata(page, limit, total),
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        shippingAddress: true,
        billingAddress: true,
        payments: true,
        shipments: true,
      },
    })

    if (!order) {
      throw new NotFoundError('Order')
    }

    return order
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, status: string) {
    logger.info('Updating order status', { orderId: id, status })

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        shippingAddress: true,
        payments: true,
      },
    })

    return order
  }

  /**
   * Cancel order
   */
  async cancelOrder(id: string) {
    logger.info('Cancelling order', { orderId: id })

    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      throw new NotFoundError('Order')
    }

    if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
      throw new BadRequestError('Cannot cancel order in current status')
    }

    // Restore inventory
    const items = order.items as any[]
    for (const item of items) {
      await prisma.inventory.update({
        where: { productId: item.productId },
        data: {
          quantity: {
            increment: item.quantity,
          },
        },
      })
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    })

    return updatedOrder
  }

  /**
   * Get all orders (Admin)
   */
  async getAllOrders(page = 1, limit = 20) {
    const total = await prisma.order.count()
    const offset = getPaginationOffset(page, limit)

    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        shippingAddress: true,
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return {
      data: orders,
      ...getPaginationMetadata(page, limit, total),
    }
  }
}

export default new OrderService()
