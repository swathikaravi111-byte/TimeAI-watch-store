import logger from '@/utils/logger'
import { NotFoundError, ConflictError } from '@/utils/errors'

// Mock database
const categories = new Map<string, any>()
let categoryIdCounter = 1

export class CategoryService {
  /**
   * Create category (Admin only)
   */
  async createCategory(data: { name: string; description?: string; icon?: string }) {
    logger.info('Creating category', { name: data.name })

    // Check if exists
    const exists = Array.from(categories.values()).find((c) => c.name === data.name)
    if (exists) {
      throw new ConflictError('Category already exists')
    }

    const categoryId = `cat-${categoryIdCounter++}`
    const category = {
      id: categoryId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    categories.set(categoryId, category)
    logger.info('Category created', { categoryId })

    return category
  }

  /**
   * Get all categories
   */
  async getCategories() {
    return Array.from(categories.values())
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string) {
    const category = categories.get(id)
    if (!category) {
      throw new NotFoundError('Category')
    }
    return category
  }

  /**
   * Update category (Admin only)
   */
  async updateCategory(id: string, data: Partial<any>) {
    logger.info('Updating category', { id })

    const category = categories.get(id)
    if (!category) {
      throw new NotFoundError('Category')
    }

    Object.assign(category, {
      ...data,
      updatedAt: new Date(),
    })

    return category
  }

  /**
   * Delete category (Admin only)
   */
  async deleteCategory(id: string) {
    logger.info('Deleting category', { id })

    if (!categories.has(id)) {
      throw new NotFoundError('Category')
    }

    categories.delete(id)
  }
}

export default new CategoryService()
