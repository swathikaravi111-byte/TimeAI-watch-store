import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { Loading, Skeleton } from '@components/common/Loading'
import { Alert } from '@components/common/Alert'
import { useCartStore, useWishlistStore } from '@/store'
import type { Product, Review } from '@/types'
import { productsApi } from '@/services/api/products'

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { addItem } = useCartStore()
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore()

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const [productData, reviewsData] = await Promise.all([
          productsApi.getById(id),
          productsApi.getReviews(id).then((r) => r.reviews),
        ])

        setProduct(productData)
        setReviews(reviewsData)
      } catch (err) {
        setError('Failed to load product details')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductDetails()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      productId: product.id,
      quantity,
      product,
    })

    setSuccessMessage('Added to cart!')
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const handleToggleWishlist = () => {
    if (!product) return

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: Math.random().toString(),
        userId: 'current',
        productId: product.id,
        product,
        createdAt: new Date().toISOString(),
      })
    }
  }

  if (isLoading) {
    return <Loading fullHeight message="Loading product details..." />
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert type="error" title="Error">
          {error || 'Product not found'}
        </Alert>
      </div>
    )
  }

  const inWishlist = isInWishlist(product.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {successMessage && (
          <Alert type="success" className="mb-6" dismissible onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Product Images */}
          <div>
            <div className="relative mb-4 h-96 overflow-hidden rounded-lg bg-gray-100">
              {product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Skeleton height="h-96" />
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    index === selectedImage ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <p className="text-sm text-gray-500">{product.category}</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-2 text-lg text-gray-600">{product.brand} - {product.model}</p>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < Math.floor(product.rating) ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} out of 5 ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-4xl font-bold text-primary-600">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-4">
              {product.stock > 0 ? (
                <p className="text-sm font-medium text-green-600">✓ In Stock ({product.stock} available)</p>
              ) : (
                <p className="text-sm font-medium text-red-600">Out of Stock</p>
              )}
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>

            {/* Specifications */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Movement</dt>
                      <dd className="mt-1 font-semibold text-gray-900">{product.movement}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Material</dt>
                      <dd className="mt-1 font-semibold text-gray-900">{product.material}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Water Resistance</dt>
                      <dd className="mt-1 font-semibold text-gray-900">{product.waterResistance}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Brand</dt>
                      <dd className="mt-1 font-semibold text-gray-900">{product.brand}</dd>
                    </div>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Add to Cart */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-900">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 border-0 text-center py-1 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleToggleWishlist}
                >
                  {inWishlist ? '❤️' : '🤍'} Wishlist
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <div className="mt-8 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet</p>
            ) : (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{review.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{review.userName}</p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-4 text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { ProductDetailsPage }
