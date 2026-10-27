import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { Input } from '@components/common/Input'
import { Loading, Skeleton } from '@components/common/Loading'
import { useIsMobile } from '@/hooks'
import { useUIStore } from '@/store'
import type { Product, ProductFilters } from '@/types'
import { productsApi } from '@/services/api/products'

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>({
    search: searchParams.get('search') || '',
    brand: searchParams.getAll('brand') || [],
    priceMin: searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined,
    priceMax: searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined,
    sort: (searchParams.get('sort') as any) || 'newest',
    page: 1,
    limit: 20,
  })
  const [totalCount, setTotalCount] = useState(0)
  const isMobile = useIsMobile()
  const { isFilterOpen, toggleFilter, closeFilter } = useUIStore()

  const brands = ['Rolex', 'Omega', 'Seiko', 'Tag Heuer', 'Breitling', 'Cartier']
  const movements = ['Mechanical', 'Automatic', 'Quartz', 'Digital']

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await productsApi.getAll(filters)
        setProducts(response.data)
        setTotalCount(response.total)
      } catch (err) {
        setError('Failed to load products')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [filters])

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
    if (isMobile) closeFilter()
  }

  const handleSortChange = (sort: string) => {
    handleFilterChange({ sort: sort as any })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-gray-900">Watches</h1>
          <p className="mt-2 text-gray-600">{totalCount} products available</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`${
              isMobile && !isFilterOpen ? 'hidden' : ''
            } mb-6 w-full space-y-6 md:mb-0 md:w-64 md:flex-shrink-0`}
          >
            {/* Search */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Search</h3>
              <Input
                type="text"
                placeholder="Search watches..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
              />
            </div>

            {/* Brand Filter */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Brand</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.brand?.includes(brand) || false}
                      onChange={(e) => {
                        const newBrands = e.target.checked
                          ? [...(filters.brand || []), brand]
                          : filters.brand?.filter((b) => b !== brand) || []
                        handleFilterChange({ brand: newBrands })
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Price Range</h3>
              <div className="space-y-3">
                <Input
                  type="number"
                  placeholder="Min price"
                  value={filters.priceMin || ''}
                  onChange={(e) =>
                    handleFilterChange({ priceMin: e.target.value ? parseFloat(e.target.value) : undefined })
                  }
                />
                <Input
                  type="number"
                  placeholder="Max price"
                  value={filters.priceMax || ''}
                  onChange={(e) =>
                    handleFilterChange({ priceMax: e.target.value ? parseFloat(e.target.value) : undefined })
                  }
                />
              </div>
            </div>

            {/* Movement Filter */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Movement</h3>
              <div className="space-y-2">
                {movements.map((movement) => (
                  <label key={movement} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700">{movement}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Sort */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">Showing {products.length} of {totalCount}</p>
              <select
                value={filters.sort || 'newest'}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <Skeleton height="h-48" />
                    <Skeleton height="h-4" className="mt-4" />
                    <Skeleton height="h-4" className="mt-2" width="w-2/3" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-4 text-center text-red-800">{error}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
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
          </main>
        </div>
      </div>
    </div>
  )
}

export { ProductsPage }
