import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MENU_ITEMS, type MenuItem } from '@/data/menuItems'
import { useCartStore } from '@/store'
import { Button } from '@components/common/Button'
import { Input } from '@components/common/Input'

export const MenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [priceSort, setPriceSort] = useState<'all' | 'asc' | 'desc'>('all')
  const [activeItemModal, setActiveItemModal] = useState<MenuItem | null>(null)
  const [addedNotice, setAddedNotice] = useState<string | null>(null)

  const { addItem } = useCartStore()

  const categories = [
    'All',
    'Fresh Flowers',
    'Special Bouquets',
    'Rice Dishes & Meals',
    'Gourmet Rice Sets',
  ]

  const filteredItems = useMemo(() => {
    let result = [...MENU_ITEMS]

    if (selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory)
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    }

    if (priceSort === 'asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (priceSort === 'desc') {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [selectedCategory, searchQuery, priceSort])

  const flowerCount = MENU_ITEMS.filter(
    (i) => i.category === 'Fresh Flowers' || i.category === 'Special Bouquets'
  ).length
  const riceCount = MENU_ITEMS.filter(
    (i) => i.category === 'Rice Dishes & Meals' || i.category === 'Gourmet Rice Sets'
  ).length

  const handleAddToCart = (item: MenuItem, quantity: number = 1) => {
    addItem({
      productId: item.id,
      quantity,
      product: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        originalPrice: item.originalPrice,
        brand: item.category.includes('Flower') ? 'Petals & Blooms' : 'Artisan Rice Kitchen',
        model: item.unit,
        material: item.category,
        waterResistance: 'N/A',
        movement: 'Quartz',
        images: [item.image],
        thumbnail: item.image,
        stock: 50,
        rating: item.rating,
        reviewCount: item.reviewCount,
        category: item.category,
        tags: item.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })

    setAddedNotice(`Added "${item.name}" to cart!`)
    setTimeout(() => {
      setAddedNotice(null)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-amber-50/20 to-gray-50 pb-16">
      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-gray-900 px-5 py-3.5 text-white shadow-2xl transition-all duration-300">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold">
            ✓
          </span>
          <span className="text-sm font-medium">{addedNotice}</span>
          <Link
            to="/cart"
            className="ml-2 text-xs font-semibold text-rose-300 underline hover:text-white"
          >
            View Cart
          </Link>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-200 backdrop-blur-sm border border-rose-300/20">
              🌸 Blooms & Savory Bowls 🍚
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
              Flower Shop & Gourmet Rice Menu
            </h1>
            <p className="mt-4 max-w-2xl text-base text-rose-100 sm:text-lg">
              Explore our fresh floral bouquets, elegant gift baskets, and chef-crafted artisan rice bowls. Handpicked petals and slow-cooked perfection in one menu.
            </p>

            {/* Quick Stat Badges */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-white/10 px-5 py-3 backdrop-blur-md border border-white/10">
                <div className="text-2xl font-bold">{MENU_ITEMS.length}</div>
                <div className="text-xs text-rose-200">Total Menu Items</div>
              </div>
              <div className="rounded-xl bg-white/10 px-5 py-3 backdrop-blur-md border border-white/10">
                <div className="text-2xl font-bold">{flowerCount}</div>
                <div className="text-xs text-rose-200">Fresh Flower Items</div>
              </div>
              <div className="rounded-xl bg-white/10 px-5 py-3 backdrop-blur-md border border-white/10">
                <div className="text-2xl font-bold">{riceCount}</div>
                <div className="text-xs text-rose-200">Gourmet Rice Items</div>
              </div>
              <div className="rounded-xl bg-white/10 px-5 py-3 backdrop-blur-md border border-white/10">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-xs text-rose-200">Fresh & Handcrafted</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Categories, Search, Filters */}
      <div className="sticky top-16 z-20 border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'Fresh Flowers' && '🌸 '}
                  {cat === 'Special Bouquets' && '💐 '}
                  {cat === 'Rice Dishes & Meals' && '🍚 '}
                  {cat === 'Gourmet Rice Sets' && '🍱 '}
                  {cat}
                </button>
              ))}
            </div>

            {/* Search & Price sorting */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative min-w-[220px]">
                <Input
                  type="text"
                  placeholder="Search flowers or rice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm pr-8"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              <select
                aria-label="Sort by Price"
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value as any)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="all">Sort by Price</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredItems.length}</span> of {MENU_ITEMS.length} items
            {selectedCategory !== 'All' && <span> in <strong className="text-rose-700">{selectedCategory}</strong></span>}
            {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
          </p>

          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:text-rose-800"
          >
            Go to Cart →
          </Link>
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 px-4 text-center">
            <span className="text-5xl">🔍</span>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No menu items found</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-md">
              We couldn't find any items matching your current search or category filter. Try clearing filters.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory('All')
                  setSearchQuery('')
                  setPriceSort('all')
                }}
              >
                Reset All Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  {/* Image Container with Badge */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Category icon pill */}
                    <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm text-gray-800 shadow-sm">
                      {item.category.includes('Flower') ? '🌸 Flower' : '🍚 Rice Meal'}
                    </span>

                    {/* Featured / Special badge */}
                    {item.badge && (
                      <span className="absolute top-3 right-3 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                        {item.badge}
                      </span>
                    )}

                    {/* Unit tag overlay */}
                    <span className="absolute bottom-3 right-3 rounded-md bg-black/65 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                      {item.unit}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-medium text-rose-600">{item.category}</span>
                      <div className="flex items-center gap-1 font-semibold text-amber-600">
                        <span>★</span>
                        <span>{item.rating.toFixed(1)}</span>
                        <span className="text-gray-400 font-normal">({item.reviewCount})</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => setActiveItemModal(item)}
                      className="mt-2 text-base font-bold text-gray-900 group-hover:text-rose-600 cursor-pointer line-clamp-1"
                      title={item.name}
                    >
                      {item.name}
                    </h3>

                    <p className="mt-1.5 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Tag list */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer: Price & Add to Cart */}
                <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-extrabold text-gray-900">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-emerald-600">
                      ✓ In Stock
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveItemModal(item)}
                      className="w-full text-xs font-medium"
                    >
                      Quick View
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      className="w-full text-xs font-semibold bg-rose-600 hover:bg-rose-700"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => setActiveItemModal(null)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow-md backdrop-blur-sm hover:bg-white"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-square md:aspect-auto w-full bg-gray-100">
                <img
                  src={activeItemModal.image}
                  alt={activeItemModal.name}
                  className="h-full w-full object-cover"
                />
                {activeItemModal.badge && (
                  <span className="absolute top-4 left-4 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                    {activeItemModal.badge}
                  </span>
                )}
              </div>

              <div className="flex flex-col justify-between p-6">
                <div>
                  <div className="inline-block rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                    {activeItemModal.category}
                  </div>
                  <h2 className="mt-2 text-xl font-bold text-gray-900">
                    {activeItemModal.name}
                  </h2>

                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-amber-500 font-bold">★ {activeItemModal.rating.toFixed(1)}</span>
                    <span>•</span>
                    <span>{activeItemModal.reviewCount} customer reviews</span>
                  </div>

                  <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                    {activeItemModal.description}
                  </p>

                  <div className="mt-4 border-t border-b border-gray-100 py-3 text-xs text-gray-500 space-y-1">
                    <div><strong>Serving / Unit:</strong> {activeItemModal.unit}</div>
                    <div><strong>Freshness Guarantee:</strong> Prepared daily upon order</div>
                    <div><strong>Delivery:</strong> Express same-day delivery available</div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {activeItemModal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-gray-900">
                      ${activeItemModal.price.toFixed(2)}
                    </span>
                    {activeItemModal.originalPrice && (
                      <span className="text-base text-gray-400 line-through">
                        ${activeItemModal.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      className="bg-rose-600 hover:bg-rose-700"
                      onClick={() => {
                        handleAddToCart(activeItemModal)
                        setActiveItemModal(null)
                      }}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setActiveItemModal(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
