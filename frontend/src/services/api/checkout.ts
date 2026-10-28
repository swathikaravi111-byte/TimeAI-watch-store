import { apiClient } from './index'

/**
 * Checkout & Payments API Service
 * Handles payment processing and checkout flow
 */
export const checkoutApi = {
  /**
   * Process payment
   * POST /api/payments/process
   */
  async processPayment(data: {
    orderId: string
    amount: number
    paymentMethod: 'card' | 'paypal'
    cardDetails?: {
      cardNumber: string
      cardHolder: string
      expiryDate: string
      cvv: string
    }
  }): Promise<{
    success: boolean
    message: string
    payment?: any
  }> {
    const response = await apiClient.post('/payments/process', data)
    return response.data!
  },

  /**
   * Get payment status
   * GET /api/payments/:paymentId
   */
  async getPaymentStatus(paymentId: string): Promise<{
    status: string
    amount: number
    paymentMethod: string
  }> {
    const response = await apiClient.get(`/payments/${paymentId}`)
    return response.data!
  },

  /**
   * Validate shipping address
   * POST /api/checkout/validate-address
   */
  async validateAddress(address: {
    street: string
    city: string
    state: string
    country: string
    zipCode: string
  }): Promise<{
    valid: boolean
    message?: string
  }> {
    const response = await apiClient.post('/checkout/validate-address', address)
    return response.data!
  },

  /**
   * Calculate shipping cost
   * POST /api/checkout/shipping
   */
  async calculateShipping(data: {
    addressId?: string
    address?: {
      zipCode: string
      country: string
    }
    items: Array<{ productId: string; quantity: number }>
  }): Promise<{
    shippingCost: number
    estimatedDays: number
    method: string
  }> {
    const response = await apiClient.post('/checkout/shipping', data)
    return response.data!
  },

  /**
   * Calculate tax
   * POST /api/checkout/tax
   */
  async calculateTax(data: {
    subtotal: number
    addressId?: string
    state?: string
    country?: string
  }): Promise<{
    taxAmount: number
    taxRate: number
  }> {
    const response = await apiClient.post('/checkout/tax', data)
    return response.data!
  },

  /**
   * Create user address
   * POST /api/addresses
   */
  async createAddress(data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    street: string
    city: string
    state: string
    country: string
    zipCode: string
    isDefault: boolean
    addressType: string
  }): Promise<any> {
    const response = await apiClient.post('/addresses', data)
    return response.data!
  },

  /**
   * Get user addresses
   * GET /api/addresses
   */
  async getAddresses(): Promise<any[]> {
    const response = await apiClient.get('/addresses')
    return response.data!
  },

  /**
   * Apply coupon/discount code
   * POST /api/checkout/coupon
   */
  async applyCoupon(code: string, cartTotal: number): Promise<{
    discountAmount: number
    finalTotal: number
    message: string
  }> {
    const response = await apiClient.post('/checkout/coupon', { code, cartTotal })
    return response.data!
  },
}
