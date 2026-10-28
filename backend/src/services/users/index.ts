import logger from '@/utils/logger'
import { NotFoundError } from '@/utils/errors'
import { sanitizeUser, getPaginationMetadata, getPaginationOffset } from '@/utils/helpers'

// Mock database - shared with auth service
const users = new Map<string, any>()

export class UserService {
  /**
   * Get user by ID
   */
  async getUserById(id: string) {
    const user = users.get(id)
    if (!user) {
      throw new NotFoundError('User')
    }
    return sanitizeUser(user)
  }

  /**
   * Get all users (Admin only)
   */
  async getAllUsers(page = 1, limit = 20) {
    logger.debug('Fetching all users', { page, limit })

    const allUsers = Array.from(users.values())
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(sanitizeUser)

    const total = allUsers.length
    const offset = getPaginationOffset(page, limit)
    const paginatedUsers = allUsers.slice(offset, offset + limit)

    return {
      data: paginatedUsers,
      ...getPaginationMetadata(page, limit, total),
    }
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(id: string) {
    logger.info('Deleting user', { id })

    if (!users.has(id)) {
      throw new NotFoundError('User')
    }

    users.delete(id)
  }

  /**
   * Update user role (Admin only)
   */
  async updateUserRole(id: string, role: string) {
    logger.info('Updating user role', { id, role })

    const user = users.get(id)
    if (!user) {
      throw new NotFoundError('User')
    }

    user.role = role
    user.updatedAt = new Date()

    return sanitizeUser(user)
  }

  /**
   * Get user statistics (Admin only)
   */
  async getUserStats() {
    const allUsers = Array.from(users.values())

    return {
      totalUsers: allUsers.length,
      adminUsers: allUsers.filter((u) => u.role === 'admin').length,
      regularUsers: allUsers.filter((u) => u.role === 'user').length,
    }
  }
}

export default new UserService()
