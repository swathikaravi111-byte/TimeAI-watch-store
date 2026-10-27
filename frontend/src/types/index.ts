// ===========================
// User & Authentication Types
// ===========================
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

// ===========================
// Product Types
// ===========================
export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  brand: string
  model: string
  material: string
  waterResistance: string
  movement: 'Mechanical' | 'Automatic' | 'Quartz' | 'Digital'
  images: string[]
  thumbnail: string
  stock: number
  rating: number
  reviewCount: number
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductsResponse {
  data: Product[]
  total: number
  page: number
  limit: number
  pages: number
}

// ===========================
// Cart Types
// ===========================
export interface CartItem {
  productId: string
  quantity: number
  product?: Product
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
}

// ===========================
// Order Types
// ===========================
export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  subtotal: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

// ===========================
// Address Types
// ===========================
export interface Address {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  country: string
  zipCode: string
  isDefault?: boolean
}

// ===========================
// Payment Types
// ===========================
export interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay'
  last4?: string
  expiryMonth?: number
  expiryYear?: number
  cardholderName?: string
  isDefault: boolean
}

// ===========================
// Review Types
// ===========================
export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
  helpful: number
  unhelpful: number
  createdAt: string
  updatedAt: string
}

// ===========================
// Wishlist Types
// ===========================
export interface WishlistItem {
  id: string
  userId: string
  productId: string
  product?: Product
  createdAt: string
}

// ===========================
// API Response Types
// ===========================
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface ApiError {
  statusCode: number
  message: string
  errors?: Record<string, string[]>
}

// ===========================
// Filter & Search Types
// ===========================
export interface ProductFilters {
  search?: string
  brand?: string[]
  priceMin?: number
  priceMax?: number
  material?: string[]
  movement?: string[]
  waterResistance?: string[]
  rating?: number
  inStock?: boolean
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular'
  page?: number
  limit?: number
}

// ===========================
// Admin Types
// ===========================
export interface AdminStats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  ordersThisMonth: number
  revenueThisMonth: number
  recentOrders: Order[]
  topProducts: Product[]
}

export interface AdminUser extends User {
  status: 'active' | 'inactive' | 'banned'
  lastLogin?: string
  totalOrders: number
  totalSpent: number
}
