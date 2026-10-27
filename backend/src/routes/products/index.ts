import { Router } from 'express'
import productController from '@/controllers/products'
import { validateCreateProduct, validateUpdateProduct, validatePagination } from '@/utils/validators'
import { handleValidationErrors, authMiddleware, adminMiddleware } from '@/middleware'

const router = Router()

/**
 * POST /products
 * Create product (Admin only)
 */
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validateCreateProduct(),
  handleValidationErrors,
  productController.createProduct
)

/**
 * GET /products
 * Get all products with filters, sorting, and pagination
 * Query: search, brand, category, minPrice, maxPrice, inStock, rating, sort, page, limit
 */
router.get(
  '/',
  validatePagination(),
  handleValidationErrors,
  productController.getProducts
)

/**
 * GET /products/search/:query
 * Search products by name or brand
 */
router.get('/search/:query', productController.searchProducts)

/**
 * GET /products/featured
 * Get featured products
 */
router.get('/featured', productController.getFeaturedProducts)

/**
 * GET /products/recommended
 * Get recommended products
 */
router.get('/recommended', productController.getRecommendedProducts)

/**
 * GET /products/category/:categoryId
 * Get products by category
 */
router.get('/category/:categoryId', productController.getProductsByCategory)

/**
 * GET /products/:id
 * Get single product
 */
router.get('/:id', productController.getProduct)

/**
 * PUT /products/:id
 * Update product (Admin only)
 */
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validateUpdateProduct(),
  handleValidationErrors,
  productController.updateProduct
)

/**
 * DELETE /products/:id
 * Delete product (Admin only)
 */
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct
)

export default router
