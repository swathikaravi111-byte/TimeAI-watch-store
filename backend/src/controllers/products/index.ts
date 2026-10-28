import { Request, Response } from 'express'
import productService from '@/services/products'
import { sendResponse, sendError, parseFilters } from '@/utils/helpers'
import { asyncHandler } from '@/middleware'

export class ProductController {
  /**
   * POST /products
   * Create product (Admin only)
   */
  createProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.createProduct(req.body)
    sendResponse(res, 201, 'Product created', product)
  })

  /**
   * GET /products
   * Get all products with filters
   */
  getProducts = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const filters = parseFilters(req.query)

    const result = await productService.getProducts(filters, page, limit)
    sendResponse(res, 200, 'Products retrieved', result.data, {
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.pages,
      },
    })
  })

  /**
   * GET /products/:id
   * Get single product
   */
  getProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.getProductById(req.params.id)
    sendResponse(res, 200, 'Product retrieved', product)
  })

  /**
   * PUT /products/:id
   * Update product (Admin only)
   */
  updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.updateProduct(req.params.id, req.body)
    sendResponse(res, 200, 'Product updated', product)
  })

  /**
   * DELETE /products/:id
   * Delete product (Admin only)
   */
  deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    await productService.deleteProduct(req.params.id)
    sendResponse(res, 200, 'Product deleted')
  })

  /**
   * GET /products/search/:query
   * Search products
   */
  searchProducts = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10
    const results = await productService.searchProducts(req.params.query, limit)
    sendResponse(res, 200, 'Search results', results)
  })

  /**
   * GET /products/featured
   * Get featured products
   */
  getFeaturedProducts = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 8
    const products = await productService.getFeaturedProducts(limit)
    sendResponse(res, 200, 'Featured products', products)
  })

  /**
   * GET /products/recommended
   * Get recommended products
   */
  getRecommendedProducts = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 8
    const products = await productService.getRecommendedProducts(limit)
    sendResponse(res, 200, 'Recommended products', products)
  })

  /**
   * GET /products/category/:categoryId
   * Get products by category
   */
  getProductsByCategory = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const result = await productService.getProductsByCategory(
      req.params.categoryId,
      page,
      limit
    )
    sendResponse(res, 200, 'Category products', result.data, {
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
      },
    })
  })
}

export default new ProductController()
