import logger from '@/utils/logger'
import { NotFoundError, BadRequestError } from '@/utils/errors'
import { getPaginationMetadata, getPaginationOffset, parseFilters } from '@/utils/helpers'

// Mock database
const products = new Map<string, any>()
let productIdCounter = 1

export class ProductService {
  /**
   * Create product (Admin only)
   */
  async createProduct(data: {
    name: string
    description: string
    price: number
    originalPrice?: number
    brand: string
    model: string
    material: string
    waterResistance: string
    movement: string
    images: string[]
    thumbnail: string
    stock: number
    categoryId: string
    tags?: string[]
  }) {
    logger.info('Creating product', { name: data.name })

    const productId = `prod-${productIdCounter++}`
    const product = {
      id: productId,
      ...data,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    products.set(productId, product)
    logger.info('Product created', { productId })

    return product
  }

  /**
   * Get all products with filters
   */
  async getProducts(filters: any = {}, page = 1, limit = 20) {
    logger.debug('Fetching products', { filters, page, limit })

    let allProducts = Array.from(products.values())

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase()
      allProducts = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.brand.toLowerCase().includes(search)
      )
    }

    if (filters.brand) {
      allProducts = allProducts.filter((p) => p.brand === filters.brand)
    }

    if (filters.category) {
      allProducts = allProducts.filter((p) => p.categoryId === filters.category)
    }

    if (filters.minPrice) {
      allProducts = allProducts.filter((p) => p.price >= filters.minPrice)
    }

    if (filters.maxPrice) {
      allProducts = allProducts.filter((p) => p.price <= filters.maxPrice)
    }

    if (filters.inStock) {
      allProducts = allProducts.filter((p) => p.stock > 0)
    }

    if (filters.rating) {
      allProducts = allProducts.filter((p) => p.rating >= filters.rating)
    }

    // Sort
    const sort = filters.sort || 'newest'
    if (sort === 'newest') {
      allProducts.sort((a, b) => b.createdAt - a.createdAt)
    } else if (sort === 'price-asc') {
      allProducts.sort((a, b) => a.price - b.price)
    } else if (sort === 'price-desc') {
      allProducts.sort((a, b) => b.price - a.price)
    } else if (sort === 'rating') {
      allProducts.sort((a, b) => b.rating - a.rating)
    }

    // Paginate
    const total = allProducts.length
    const offset = getPaginationOffset(page, limit)
    const paginatedProducts = allProducts.slice(offset, offset + limit)

    return {
      data: paginatedProducts,
      ...getPaginationMetadata(page, limit, total),
    }
  }

  /**
   * Get single product by ID
   */
  async getProductById(id: string) {
    logger.debug('Fetching product', { id })

    const product = products.get(id)
    if (!product) {
      throw new NotFoundError('Product')
    }

    return product
  }

  /**
   * Update product (Admin only)
   */
  async updateProduct(
    id: string,
    data: Partial<any>
  ) {
    logger.info('Updating product', { id })

    const product = products.get(id)
    if (!product) {
      throw new NotFoundError('Product')
    }

    Object.assign(product, {
      ...data,
      updatedAt: new Date(),
    })

    logger.info('Product updated', { id })
    return product
  }

  /**
   * Delete product (Admin only)
   */
  async deleteProduct(id: string) {
    logger.info('Deleting product', { id })

    if (!products.has(id)) {
      throw new NotFoundError('Product')
    }

    products.delete(id)
    logger.info('Product deleted', { id })
  }

  /**
   * Search products
   */
  async searchProducts(query: string, limit = 10) {
    const search = query.toLowerCase()
    const results = Array.from(products.values())
      .filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.brand.toLowerCase().includes(search)
      )
      .slice(0, limit)

    return results
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit = 8) {
    const featured = Array.from(products.values())
      .filter((p) => p.rating >= 4 && p.reviewCount > 10)
      .slice(0, limit)

    return featured
  }

  /**
   * Get recommended products
   */
  async getRecommendedProducts(limit = 8) {
    const recommended = Array.from(products.values())
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)

    return recommended
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId: string, page = 1, limit = 20) {
    let categoryProducts = Array.from(products.values()).filter(
      (p) => p.categoryId === categoryId
    )

    const total = categoryProducts.length
    const offset = getPaginationOffset(page, limit)
    const paginatedProducts = categoryProducts.slice(offset, offset + limit)

    return {
      data: paginatedProducts,
      ...getPaginationMetadata(page, limit, total),
    }
  }

  /**
   * Update product stock
   */
  async updateProductStock(id: string, quantity: number) {
    const product = products.get(id)
    if (!product) {
      throw new NotFoundError('Product')
    }

    if (product.stock + quantity < 0) {
      throw new BadRequestError('Insufficient stock')
    }

    product.stock += quantity
    product.updatedAt = new Date()

    return product
  }
}

export default new ProductService()
