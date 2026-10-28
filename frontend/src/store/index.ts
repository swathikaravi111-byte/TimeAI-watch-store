import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User, Cart, CartItem, WishlistItem, Product } from '@/types'

// ===========================
// Auth Store
// ===========================
interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        setToken: (token) => set({ token, isAuthenticated: !!token }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        logout: () =>
          set({
            user: null,
            token: null,
            error: null,
            isAuthenticated: false,
          }),
      }),
      {
        name: 'auth-storage',
      }
    )
  )
)

// ===========================
// Cart Store
// ===========================
interface CartState {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  calculateTotals: () => void
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        addItem: (item) => {
          const state = get()
          const existingItem = state.items.find((i) => i.productId === item.productId)
          if (existingItem) {
            existingItem.quantity += item.quantity
          } else {
            state.items.push(item)
          }
          set({ items: state.items })
          get().calculateTotals()
        },
        removeItem: (productId) => {
          set((state) => ({
            items: state.items.filter((item) => item.productId !== productId),
          }))
          get().calculateTotals()
        },
        updateQuantity: (productId, quantity) => {
          set((state) => ({
            items: state.items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          }))
          get().calculateTotals()
        },
        clearCart: () =>
          set({
            items: [],
            subtotal: 0,
            tax: 0,
            shipping: 0,
            total: 0,
          }),
        calculateTotals: () => {
          const state = get()
          const subtotal = state.items.reduce(
            (sum, item) => sum + ((item.product?.price || 0) * item.quantity),
            0
          )
          const tax = subtotal * 0.1 // 10% tax
          const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
          const total = subtotal + tax + shipping
          set({
            subtotal: Math.round(subtotal * 100) / 100,
            tax: Math.round(tax * 100) / 100,
            shipping: Math.round(shipping * 100) / 100,
            total: Math.round(total * 100) / 100,
          })
        },
      }),
      {
        name: 'cart-storage',
      }
    )
  )
)

// ===========================
// Wishlist Store
// ===========================
interface WishlistState {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        addItem: (item) => {
          const state = get()
          if (!state.items.find((i) => i.productId === item.productId)) {
            set({ items: [...state.items, item] })
          }
        },
        removeItem: (productId) => {
          set((state) => ({
            items: state.items.filter((item) => item.productId !== productId),
          }))
        },
        isInWishlist: (productId) => {
          return get().items.some((item) => item.productId === productId)
        },
      }),
      {
        name: 'wishlist-storage',
      }
    )
  )
)

// ===========================
// UI Store
// ===========================
interface UIState {
  isMobileMenuOpen: boolean
  isCartOpen: boolean
  isFilterOpen: boolean
  toggleMobileMenu: () => void
  toggleCart: () => void
  toggleFilter: () => void
  closeMobileMenu: () => void
  closeCart: () => void
  closeFilter: () => void
}

export const useUIStore = create<UIState>()(
  devtools((set) => ({
    isMobileMenuOpen: false,
    isCartOpen: false,
    isFilterOpen: false,
    toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
    toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    toggleFilter: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),
    closeMobileMenu: () => set({ isMobileMenuOpen: false }),
    closeCart: () => set({ isCartOpen: false }),
    closeFilter: () => set({ isFilterOpen: false }),
  }))
)

// ===========================
// Theme Store
// ===========================
interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set) => ({
        isDark: false,
        toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      }),
      {
        name: 'theme-storage',
      }
    )
  )
)
