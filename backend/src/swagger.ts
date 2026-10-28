import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TimeAI Watch Store API',
      version: '1.0.0',
      description: 'Production-ready REST API for TimeAI Watch Store e-commerce platform',
      contact: {
        name: 'API Support',
        email: 'support@timeaiwatch.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development Server',
      },
      {
        url: 'https://api.timeaiwatch.com/api',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            originalPrice: { type: 'number' },
            brand: { type: 'string' },
            stock: { type: 'integer' },
            rating: { type: 'number' },
            reviewCount: { type: 'integer' },
            categoryId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  quantity: { type: 'integer' },
                  price: { type: 'number' },
                },
              },
            },
            total: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'shipped', 'delivered'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            icon: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            metadata: { type: 'object' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    tags: [
      { name: 'Authentication', description: 'User authentication endpoints' },
      { name: 'Products', description: 'Product management endpoints' },
      { name: 'Categories', description: 'Category management endpoints' },
      { name: 'Orders', description: 'Order management endpoints' },
      { name: 'Wishlist', description: 'Wishlist management endpoints' },
      { name: 'Reviews', description: 'Review management endpoints' },
      { name: 'Users', description: 'User management endpoints (Admin)' },
      { name: 'Inventory', description: 'Inventory management endpoints (Admin)' },
    ],
  },
  apis: [
    './src/routes/auth/*.ts',
    './src/routes/products/*.ts',
    './src/routes/categories/*.ts',
    './src/routes/orders/*.ts',
    './src/routes/wishlist/*.ts',
    './src/routes/reviews/*.ts',
    './src/routes/users/*.ts',
    './src/routes/inventory/*.ts',
  ],
}

export const swaggerSpec = swaggerJsdoc(options)
