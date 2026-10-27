import { apiClient } from './index'
import type { WishlistItem } from '@/types'

export const wishlistApi = {
  async getAll(): Promise<WishlistItem[]> {
    const response = await apiClient.get<WishlistItem[]>('/wishlist')
    return response.data!
  },

  async add(productId: string): Promise<WishlistItem> {
    const response = await apiClient.post<WishlistItem>('/wishlist', { productId })
    return response.data!
  },

  async remove(productId: string): Promise<void> {
    await apiClient.delete(`/wishlist/${productId}`)
  },

  async clear(): Promise<void> {
    await apiClient.delete('/wishlist')
  },
}
