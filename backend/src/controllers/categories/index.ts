import { Request, Response } from 'express'
import categoryService from '@/services/categories'
import { sendResponse } from '@/utils/helpers'
import { asyncHandler } from '@/middleware'
import logger from '@/utils/logger'

export class CategoryController {
  /**
   * POST /categories
   * Create category (Admin only)
   */
  createCategory = asyncHandler(async (req: Request, res: Response) => {
    logger.info('Creating category', { body: req.body })
    const category = await categoryService.createCategory(req.body)
    sendResponse(res, 201, 'Category created successfully', category)
  })

  /**
   * GET /categories
   * Get all categories
   */
  getCategories = asyncHandler(async (req: Request, res: Response) => {
    logger.debug('Fetching all categories')
    const categories = await categoryService.getCategories()
    sendResponse(res, 200, 'Categories retrieved', categories, {
      total: categories.length,
    })
  })

  /**
   * GET /categories/:id
   * Get single category
   */
  getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    logger.debug('Fetching category', { categoryId: id })
    const category = await categoryService.getCategoryById(id)
    sendResponse(res, 200, 'Category retrieved', category)
  })

  /**
   * PUT /categories/:id
   * Update category (Admin only)
   */
  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    logger.info('Updating category', { categoryId: id, body: req.body })
    const category = await categoryService.updateCategory(id, req.body)
    sendResponse(res, 200, 'Category updated successfully', category)
  })

  /**
   * DELETE /categories/:id
   * Delete category (Admin only)
   */
  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    logger.info('Deleting category', { categoryId: id })
    await categoryService.deleteCategory(id)
    sendResponse(res, 200, 'Category deleted successfully')
  })

  /**
   * GET /categories/:id/products
   * Get products in category
   */
  getCategoryProducts = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    logger.debug('Fetching category products', { categoryId: id, page, limit })
    const result = await categoryService.getCategoryProducts(id, page, limit)
    sendResponse(res, 200, 'Products retrieved', result.products, {
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.pages,
      },
    })
  })
}

export default new CategoryController()
