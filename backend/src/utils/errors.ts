/**
 * Custom API Error Class
 */
export class ApiError extends Error {
  public readonly statusCode: number
  public readonly errors?: any[]

  constructor(
    message: string,
    statusCode: number = 500,
    errors?: any[]
  ) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors

    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Not Found Error (404)
 */
export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(`${resource} not found`, 404)
  }
}

/**
 * Bad Request Error (400)
 */
export class BadRequestError extends ApiError {
  constructor(message: string, errors?: any[]) {
    super(message, 400, errors)
  }
}

/**
 * Unauthorized Error (401)
 */
export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
  }
}

/**
 * Forbidden Error (403)
 */
export class ForbiddenError extends ApiError {
  constructor(message = 'Access denied') {
    super(message, 403)
  }
}

/**
 * Conflict Error (409)
 */
export class ConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409)
  }
}

/**
 * Validation Error (422)
 */
export class ValidationError extends ApiError {
  constructor(message: string, errors?: any[]) {
    super(message, 422, errors)
  }
}

/**
 * Rate Limit Error (429)
 */
export class RateLimitError extends ApiError {
  constructor(message = 'Too many requests') {
    super(message, 429)
  }
}

/**
 * Internal Server Error (500)
 */
export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error') {
    super(message, 500)
  }
}
