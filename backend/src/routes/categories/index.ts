import { Router } from 'express'
import categoryController from '@/controllers/categories'
import { validateCreateCategory } from '@/utils/validators'
import { handleValidationErrors, authMiddleware, adminMiddleware } from '@/middleware'

const router = Router()

/**
 * POST /categories
 * Create category (Admin only)
 * Body: { name, description, icon }
 */
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validateCreateCategory(),
  handleValidationErrors,
  categoryController.createCategory
)

/**
 * GET /categories
 * Get all categories
 */
router.get('/', categoryController.getCategories)

/**
 * GET /categories/:id
 * Get single category
 */
router.get('/:id', categoryController.getCategoryById)

/**
 * PUT /categories/:id
 * Update category (Admin only)
 */
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validateCreateCategory(),
  handleValidationErrors,
  categoryController.updateCategory
)

/**
 * DELETE /categories/:id
 * Delete category (Admin only)
 */
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  categoryController.deleteCategory
)

/**
 * GET /categories/:id/products
 * Get products in category
 */
router.get('/:id/products', categoryController.getCategoryProducts)

export default router
