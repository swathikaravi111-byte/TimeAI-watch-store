import { apiClient } from './index'
import type { Order } from '@/types'

/**
 * Orders API Service
 * Handles order creation, tracking, and management
 */
export const ordersApi = {
  /**
   * Create order
   * POST /api/orders
   */
  async create(data: {
    items: Array<{ productId: string; quantity: number }>
    shippingAddressId: string
    billingAddressId?: string
    paymentMethodId?: string
  }): Promise<Order> {
    const response = await apiClient.post<Order>('/orders', data)
    return response.data!
  },

  /**
   * Get user orders
   * GET /api/orders
   */
  async getAll(page = 1, limit = 20): Promise<{
    data: Order[]
    total: number
    pages: number
  }> {
    const response = await apiClient.get('/orders', { page, limit })
    return response.data!
  },

  /**
   * Get order by ID
   * GET /api/orders/:id
   */
  async getById(id: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/${id}`)
    return response.data!
  },

  /**
   * Cancel order
   * POST /api/orders/:id/cancel
   */
  async cancel(id: string, reason?: string): Promise<Order> {
    const response = await apiClient.post<Order>(`/orders/${id}/cancel`, { reason })
    return response.data!
  },

  /**
   * Get order status
   * GET /api/orders/:id/status
   */
  async getStatus(id: string): Promise<{
    status: string
    trackingNumber?: string
  }> {
    const response = await apiClient.get(`/orders/${id}/status`)
    return response.data!
  },
}
