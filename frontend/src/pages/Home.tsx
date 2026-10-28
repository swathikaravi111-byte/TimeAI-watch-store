import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@components/common/Card'
import { Button, buttonVariants } from '@components/common/Button'
import { Loading } from '@components/common/Loading'
import type { Product } from '@/types'
import { productsApi } from '@/services/api/products'

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true)
        const products = await productsApi.getFeatured(8)
        setFeaturedProducts(products)
      } catch (err) {
        setError('Failed to load featured products')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-600 md:h-screen">
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="relative flex h-full items-center justify-center px-4 text-center">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
              Discover Premium Luxury Watches
            </h1>
            <p className="mb-8 text-lg text-gray-100 md:text-xl">
              Experience AI-powered personalization for the perfect timepiece
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/products"
                className={buttonVariants({
                  size: 'lg',
                  className:
                    '!bg-white !text-primary-700 font-semibold shadow-lg hover:!bg-gray-100',
                })}
              >
                Shop Now
              </Link>
              <Link
                to="/products"
                className={buttonVariants({
                  size: 'lg',
                  className:
                    '!border-2 !border-white !bg-transparent !text-white font-semibold hover:!bg-white/20',
                })}
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            Why Choose TimeAI?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: '🤖',
                title: 'AI-Powered Recommendations',
                description: 'Get personalized watch suggestions based on your style and preferences',
              },
              {
                icon: '👁️',
                title: 'Virtual Try-On',
                description: 'See how watches look on your wrist with our AR technology',
              },
              {
                icon: '✅',
                title: 'Verified Authenticity',
                description: 'Every watch is verified genuine with authentication certificates',
              },
            ].map((feature) => (
              <Card key={feature.title} className="text-center">
                <div className="mb-4 text-5xl">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            Featured Watches
          </h2>

          {isLoading ? (
            <Loading message="Loading featured watches..." />
          ) : error ? (
            <div className="rounded-lg bg-red-50 p-4 text-center text-red-800">{error}</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <Card className="h-full hover:shadow-card-lg" interactive hover>
                    <div className="relative mb-4 h-48 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <CardContent>
                      <h3 className="mb-1 font-semibold text-gray-900 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="mb-3 text-sm text-gray-500">{product.brand}</p>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-lg font-bold text-primary-600">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({product.reviewCount})</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 px-4 py-16 text-center text-white sm:px-6 lg:px-8">
        <h2 className="mb-4 text-3xl font-bold">Ready to Find Your Perfect Watch?</h2>
        <p className="mb-8 text-lg text-primary-100">
          Let our AI help you discover the timepiece that matches your style
        </p>
        <Button
          variant="primary"
          size="lg"
          asChild
          className="bg-white text-primary-600 hover:bg-gray-100"
        >
          <Link to="/products">Start Shopping</Link>
        </Button>
      </section>
    </div>
  )
}

export { HomePage }
