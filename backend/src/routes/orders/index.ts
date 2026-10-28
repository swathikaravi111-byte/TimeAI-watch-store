import { Router } from 'express'
import orderController from '@/controllers/orders'
import { validateCreateOrder } from '@/utils/validators'
import { handleValidationErrors, authMiddleware, adminMiddleware } from '@/middleware'

const router = Router()

/**
 * POST /orders
 * Create order (Auth required)
 */
router.post(
  '/',
  authMiddleware,
  validateCreateOrder(),
  handleValidationErrors,
  orderController.createOrder
)

/**
 * GET /orders
 * Get user orders (Auth required)
 */
router.get('/', authMiddleware, orderController.getUserOrders)

/**
 * GET /orders/:id
 * Get order by ID (Auth required)
 */
router.get('/:id', authMiddleware, orderController.getOrder)

/**
 * PATCH /orders/:id/status
 * Update order status (Admin only)
 */
router.patch(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  orderController.updateOrderStatus
)

/**
 * POST /orders/:id/cancel
 * Cancel order (Auth required)
 */
router.post('/:id/cancel', authMiddleware, orderController.cancelOrder)

/**
 * GET /orders/admin/all
 * Get all orders (Admin only)
 */
router.get('/admin/all', authMiddleware, adminMiddleware, orderController.getAllOrders)

/**
 * GET /orders/admin/stats
 * Get order statistics (Admin only)
 */
router.get('/admin/stats', authMiddleware, adminMiddleware, orderController.getOrderStats)

export default router
