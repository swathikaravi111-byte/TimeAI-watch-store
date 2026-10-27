import { apiClient } from './index'
import type { Product, ProductsResponse, ProductFilters, Review } from '@/types'

export const productsApi = {
  async getAll(filters?: ProductFilters): Promise<ProductsResponse> {
    const response = await apiClient.get<ProductsResponse>('/products', filters)
    return response.data!
  },

  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data!
  },

  async search(query: string, limit = 10): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products/search', {
      q: query,
      limit,
    })
    return response.data!
  },

  async getByCategory(category: string, page = 1, limit = 20): Promise<ProductsResponse> {
    const response = await apiClient.get<ProductsResponse>(`/products/category/${category}`, {
      page,
      limit,
    })
    return response.data!
  },

  async getFeatured(limit = 8): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products/featured', { limit })
    return response.data!
  },

  async getRecommended(limit = 8): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products/recommended', { limit })
    return response.data!
  },

  async getReviews(productId: string, page = 1, limit = 10): Promise<{
    reviews: Review[]
    total: number
    averageRating: number
  }> {
    const response = await apiClient.get(`/products/${productId}/reviews`, {
      page,
      limit,
    })
    return response.data!
  },

  async addReview(
    productId: string,
    data: {
      rating: number
      title: string
      comment: string
    }
  ): Promise<Review> {
    const response = await apiClient.post<Review>(`/products/${productId}/reviews`, data)
    return response.data!
  },

  async updateReview(
    productId: string,
    reviewId: string,
    data: Partial<Review>
  ): Promise<Review> {
    const response = await apiClient.put<Review>(
      `/products/${productId}/reviews/${reviewId}`,
      data
    )
    return response.data!
  },

  async deleteReview(productId: string, reviewId: string): Promise<void> {
    await apiClient.delete(`/products/${productId}/reviews/${reviewId}`)
  },
}
