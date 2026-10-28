import { Request, Response } from 'express'
import orderService from '@/services/orders'
import { sendResponse } from '@/utils/helpers'
import { asyncHandler } from '@/middleware'

export class OrderController {
  /**
   * POST /orders
   * Create order
   */
  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId
    const order = await orderService.createOrder(userId, req.body)
    sendResponse(res, 201, 'Order created', order)
  })

  /**
   * GET /orders
   * Get user orders
   */
  getUserOrders = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    const result = await orderService.getUserOrders(userId, page, limit)
    sendResponse(res, 200, 'Orders retrieved', result.data, {
      pagination: { page: result.page, limit: result.limit, total: result.total },
    })
  })

  /**
   * GET /orders/:id
   * Get order by ID
   */
  getOrder = asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.getOrderById(req.params.id)
    sendResponse(res, 200, 'Order retrieved', order)
  })

  /**
   * PATCH /orders/:id/status
   * Update order status (Admin only)
   */
  updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body
    const order = await orderService.updateOrderStatus(req.params.id, status)
    sendResponse(res, 200, 'Order status updated', order)
  })

  /**
   * POST /orders/:id/cancel
   * Cancel order
   */
  cancelOrder = asyncHandler(async (req: Request, res: Response) => {
    const { reason } = req.body
    const order = await orderService.cancelOrder(req.params.id, reason)
    sendResponse(res, 200, 'Order cancelled', order)
  })

  /**
   * GET /orders/admin/all
   * Get all orders (Admin only)
   */
  getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    const result = await orderService.getAllOrders(page, limit)
    sendResponse(res, 200, 'Orders retrieved', result.data, {
      pagination: { page: result.page, limit: result.limit, total: result.total },
    })
  })

  /**
   * GET /orders/admin/stats
   * Get order statistics (Admin only)
   */
  getOrderStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await orderService.getOrderStats()
    sendResponse(res, 200, 'Order statistics', stats)
  })
}

export default new OrderController()
