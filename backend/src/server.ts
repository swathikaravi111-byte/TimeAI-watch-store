import app from './app'
import logger from '@/utils/logger'

const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'

/**
 * Start server
 */
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server is running`)
  logger.info(`Environment: ${NODE_ENV}`)
  logger.info(`Port: ${PORT}`)
  logger.info(`URL: http://localhost:${PORT}`)
})

/**
 * Handle graceful shutdown
 */
const gracefulShutdown = () => {
  logger.info('Graceful shutdown initiated')
  server.close(() => {
    logger.info('Server closed')
    process.exit(0)
  })
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', { error: err.message, stack: err.stack })
  process.exit(1)
})

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection:', { reason })
  process.exit(1)
})

export default server
