import logger from '@/utils/logger'
import prisma from '@/utils/prisma'
import { NotFoundError, BadRequestError } from '@/utils/errors'
import { getPaginationMetadata, getPaginationOffset } from '@/utils/helpers'

export class ProductService {
  /**
   * Create product (Admin)
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
    featured?: boolean
    tags?: string[]
  }) {
    logger.info('Creating product', { name: data.name })

    // Create product with inventory
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice,
        brand: data.brand,
        model: data.model,
        material: data.material,
        waterResistance: data.waterResistance,
        movement: data.movement,
        images: data.images,
        thumbnail: data.thumbnail,
        categoryId: data.categoryId,
        featured: data.featured || false,
        tags: data.tags || [],
        active: true,
        inventory: {
          create: {
            quantity: data.stock,
            reorderLevel: Math.ceil(data.stock * 0.2),
            reorderQuantity: Math.ceil(data.stock * 0.5),
          },
        },
      },
      include: {
        inventory: true,
        category: true,
      },
    })

    logger.info('Product created', { productId: product.id })
    return product
  }

  /**
   * Get all products with filters
   */
  async getProducts(
    filters: {
      search?: string
      brand?: string
      categoryId?: string
      minPrice?: number
      maxPrice?: number
      featured?: boolean
      inStock?: boolean
    } = {},
    page = 1,
    limit = 20
  ) {
    logger.debug('Fetching products', { filters, page, limit })

    const where: any = { active: true }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { brand: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.brand) {
      where.brand = filters.brand
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId
    }

    if (filters.minPrice !== undefined) {
      where.price = { gte: filters.minPrice }
    }

    if (filters.maxPrice !== undefined) {
      if (where.price) {
        where.price.lte = filters.maxPrice
      } else {
        where.price = { lte: filters.maxPrice }
      }
    }

    if (filters.featured) {
      where.featured = true
    }

    if (filters.inStock) {
      where.inventory = {
        quantity: { gt: 0 },
      }
    }

    const total = await prisma.product.count({ where })
    const offset = getPaginationOffset(page, limit)

    const products = await prisma.product.findMany({
      where,
      include: {
        inventory: true,
        category: true,
        _count: {
          select: { reviews: true },
        },
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return {
      data: products,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        inventory: true,
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!product) {
      throw new NotFoundError('Product')
    }

    return product
  }

  /**
   * Update product
   */
  async updateProduct(id: string, data: Partial<any>) {
    logger.info('Updating product', { productId: id })

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice,
        brand: data.brand,
        featured: data.featured,
        images: data.images,
        thumbnail: data.thumbnail,
      },
      include: {
        inventory: true,
        category: true,
      },
    })

    return product
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string) {
    logger.info('Deleting product', { productId: id })

    await prisma.product.delete({
      where: { id },
    })
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit = 8) {
    return await prisma.product.findMany({
      where: {
        active: true,
        featured: true,
      },
      include: {
        inventory: true,
        category: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId: string, page = 1, limit = 20) {
    const total = await prisma.product.count({
      where: { categoryId, active: true },
    })

    const offset = getPaginationOffset(page, limit)

    const products = await prisma.product.findMany({
      where: { categoryId, active: true },
      include: {
        inventory: true,
        category: true,
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return {
      data: products,
      ...getPaginationMetadata(page, limit, total),
    }
  }
}

export default new ProductService()
