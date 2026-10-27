import { apiClient } from './index'
import type { User, AuthResponse, LoginPayload, RegisterPayload } from '@/types'

/**
 * Authentication API Service
 * Handles user login, registration, and profile management
 */
export const authApi = {
  /**
   * Register new user
   * POST /api/auth/register
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', payload)
    return response.data!
  },

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload)
    return response.data!
  },

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const response = await apiClient.post('/auth/refresh', { refreshToken })
    return response.data!
  },

  /**
   * Get current user
   * GET /api/auth/me
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me')
    return response.data!
  },

  /**
   * Update user profile
   * PUT /api/auth/profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/auth/profile', data)
    return response.data!
  },

  /**
   * Change password
   * POST /api/auth/change-password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', { oldPassword, newPassword })
  },

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },
}
