import { apiClient } from './index'
import type { Order } from '@/types'

export const ordersApi = {
  async getAll(page = 1, limit = 20): Promise<{
    orders: Order[]
    total: number
  }> {
    const response = await apiClient.get('/orders', { page, limit })
    return response.data!
  },

  async getById(id: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/${id}`)
    return response.data!
  },

  async create(data: Partial<Order>): Promise<Order> {
    const response = await apiClient.post<Order>('/orders', data)
    return response.data!
  },

  async cancel(id: string, reason: string): Promise<Order> {
    const response = await apiClient.post<Order>(`/orders/${id}/cancel`, { reason })
    return response.data!
  },

  async getStatus(id: string): Promise<{ status: string; trackingNumber?: string }> {
    const response = await apiClient.get(`/orders/${id}/status`)
    return response.data!
  },

  async requestReturn(id: string, reason: string): Promise<void> {
    await apiClient.post(`/orders/${id}/return-request`, { reason })
  },
}
