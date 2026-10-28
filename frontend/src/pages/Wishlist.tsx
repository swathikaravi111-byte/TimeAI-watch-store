import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { useWishlistStore, useCartStore } from '@/store'

const WishlistPage: React.FC = () => {
  const { items, removeItem } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()

  const handleAddToCart = (item: any) => {
    if (item.product) {
      addToCart({
        productId: item.productId,
        quantity: 1,
        product: item.product,
      })
      removeItem(item.productId)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Your wishlist is empty</h1>
          <p className="mt-2 text-gray-600">Add some watches to your wishlist</p>
          <Button variant="primary" size="lg" asChild className="mt-6">
            <Link to="/products">Explore Watches</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <p className="mt-2 text-gray-600">{items.length} items in your wishlist</p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} className="h-full flex flex-col">
              {item.product?.thumbnail && (
                <div className="relative mb-4 h-48 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              )}
              <CardContent className="flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{item.product?.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.product?.brand}</p>
                <p className="text-lg font-bold text-primary-600 mt-3">
                  ${item.product?.price.toFixed(2)}
                </p>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.productId)}
                  >
                    ✕
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export { WishlistPage }
