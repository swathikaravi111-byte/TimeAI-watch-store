import { body, param, query, ValidationChain } from 'express-validator'

/**
 * ===========================
 * AUTH VALIDATORS
 * ===========================
 */

export const validateLogin = (): ValidationChain[] => [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
]

export const validateRegister = (): ValidationChain[] => [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain number')
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must contain special character'),
]

export const validateChangePassword = (): ValidationChain[] => [
  body('oldPassword')
    .notEmpty()
    .withMessage('Old password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .custom((value, { req }) => value !== req.body.oldPassword)
    .withMessage('New password must be different from old password'),
]

/**
 * ===========================
 * PRODUCT VALIDATORS
 * ===========================
 */

export const validateCreateProduct = (): ValidationChain[] => [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Original price must be a positive number'),
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('categoryId')
    .notEmpty()
    .withMessage('Category ID is required'),
]

export const validateUpdateProduct = (): ValidationChain[] => [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3 and 100 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
]

/**
 * ===========================
 * ORDER VALIDATORS
 * ===========================
 */

export const validateCreateOrder = (): ValidationChain[] => [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.productId')
    .notEmpty()
    .withMessage('Product ID is required'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('shippingAddress.street')
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.country')
    .notEmpty()
    .withMessage('Country is required'),
  body('shippingAddress.zipCode')
    .notEmpty()
    .withMessage('Zip code is required'),
  body('paymentMethod')
    .isIn(['card', 'paypal', 'bank_transfer'])
    .withMessage('Invalid payment method'),
]

/**
 * ===========================
 * CATEGORY VALIDATORS
 * ===========================
 */

export const validateCreateCategory = (): ValidationChain[] => [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('icon')
    .optional()
    .trim()
    .isURL()
    .withMessage('Icon must be a valid URL'),
]

/**
 * ===========================
 * REVIEW VALIDATORS
 * ===========================
 */

export const validateCreateReview = (): ValidationChain[] => [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Review title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Review title must be between 3 and 100 characters'),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Review comment is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Review comment must be between 10 and 1000 characters'),
]

/**
 * ===========================
 * PAGINATION VALIDATORS
 * ===========================
 */

export const validatePagination = (): ValidationChain[] => [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be at least 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
]

/**
 * ===========================
 * PARAMETER VALIDATORS
 * ===========================
 */

export const validateId = (): ValidationChain[] => [
  param('id')
    .notEmpty()
    .withMessage('ID is required'),
]

export const validateProductId = (): ValidationChain[] => [
  param('productId')
    .notEmpty()
    .withMessage('Product ID is required'),
]

/**
 * ===========================
 * INVENTORY VALIDATORS
 * ===========================
 */

export const validateStockUpdate = (): ValidationChain[] => [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('operation')
    .isIn(['add', 'subtract'])
    .withMessage('Operation must be add or subtract'),
]

export const validateInventoryAdjustment = (): ValidationChain[] => [
  body('quantity')
    .isInt()
    .withMessage('Quantity must be an integer'),
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason is required')
    .isLength({ min: 3 })
    .withMessage('Reason must be at least 3 characters'),
]
