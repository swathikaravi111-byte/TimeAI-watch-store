import axios, { AxiosInstance, AxiosError } from 'axios'
import type { ApiResponse, ApiError } from '@/types'
import { useAuthStore } from '@/store'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, params?: Record<string, any>) {
    const response = await this.client.get<ApiResponse<T>>(url, { params })
    return response.data
  }

  async post<T>(url: string, data?: any) {
    const response = await this.client.post<ApiResponse<T>>(url, data)
    return response.data
  }

  async put<T>(url: string, data?: any) {
    const response = await this.client.put<ApiResponse<T>>(url, data)
    return response.data
  }

  async delete<T>(url: string) {
    const response = await this.client.delete<ApiResponse<T>>(url)
    return response.data
  }

  async patch<T>(url: string, data?: any) {
    const response = await this.client.patch<ApiResponse<T>>(url, data)
    return response.data
  }
}

export const apiClient = new ApiClient()
