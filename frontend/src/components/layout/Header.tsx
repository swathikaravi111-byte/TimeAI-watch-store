import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore, useCartStore, useUIStore } from '@/store'
import { Button } from '@components/common/Button'
import clsx from 'clsx'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { items: cartItems } = useCartStore()
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsUserMenuOpen(false)
  }

  const cartItemsCount = cartItems.length

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-card">
      {/* Desktop Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
            <span className="text-xl font-bold text-white">⏱</span>
          </div>
          <span className="hidden text-xl font-bold text-gray-900 sm:inline">
            TimeAI Watch Store
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden flex-1 px-8 md:block">
          <input
            type="text"
            placeholder="Search watches..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            onFocus={() => navigate('/products')}
          />
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 text-gray-700 hover:text-primary-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cartItemsCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">
                {cartItemsCount}
              </span>
            )}
            <span className="hidden text-sm font-medium sm:inline">Cart</span>
          </Link>

          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100"
              >
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.firstName}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="hidden text-sm font-medium sm:inline">{user.firstName}</span>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className={clsx(
                'h-6 w-6 transition-transform',
                isMobileMenuOpen && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search watches..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              onFocus={() => {
                navigate('/products')
                closeMobileMenu()
              }}
            />
          </div>
          <nav className="space-y-2">
            <Link
              to="/products"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={closeMobileMenu}
            >
              Products
            </Link>
            <Link
              to="/wishlist"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={closeMobileMenu}
            >
              Wishlist
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={closeMobileMenu}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export { Header }
