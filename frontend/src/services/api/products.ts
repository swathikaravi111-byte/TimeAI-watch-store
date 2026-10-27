import { apiClient } from './index'
import type { Product, ProductsResponse, ProductFilters, Review } from '@/types'

/**
 * Products API Service
 * Handles product fetching, searching, and filtering
 */
export const productsApi = {
  /**
   * Get all products with filters
   * GET /api/products
   */
  async getAll(filters?: ProductFilters): Promise<ProductsResponse> {
    const response = await apiClient.get<ProductsResponse>('/products', filters)
    return response.data!
  },

  /**
   * Get product by ID
   * GET /api/products/:id
   */
  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data!
  },

  /**
   * Search products
   * GET /api/products/search/:query
   */
  async search(query: string, limit = 10): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(`/products/search/${query}`, {
      limit,
    })
    return response.data!
  },

  /**
   * Get featured products
   * GET /api/products/featured
   */
  async getFeatured(limit = 8): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products/featured', { limit })
    return response.data!
  },

  /**
   * Get recommended products
   * GET /api/products/recommended
   */
  async getRecommended(limit = 8): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products/recommended', { limit })
    return response.data!
  },

  /**
   * Get products by category
   * GET /api/products/category/:categoryId
   */
  async getByCategory(
    categoryId: string,
    page = 1,
    limit = 20
  ): Promise<ProductsResponse> {
    const response = await apiClient.get<ProductsResponse>(
      `/products/category/${categoryId}`,
      {
        page,
        limit,
      }
    )
    return response.data!
  },

  /**
   * Get product reviews
   * GET /api/products/:productId/reviews
   */
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

  /**
   * Add product review
   * POST /api/products/:productId/reviews
   */
  async addReview(
    productId: string,
    data: {
      rating: number
      title: string
      comment: string
    }
  ): Promise<Review> {
    const response = await apiClient.post<Review>(
      `/products/${productId}/reviews`,
      data
    )
    return response.data!
  },
}
