import { PrismaClient } from '@prisma/client'
import logger from './logger'

// Singleton pattern for Prisma Client
let prisma: PrismaClient

const globalForPrisma = global as unknown as { prisma: PrismaClient }

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // Use global in development to prevent reinstantiation on hot reload
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: [
        { emit: 'stdout', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
    })
  }
  prisma = globalForPrisma.prisma
}

// Log connection status
prisma.$connect()
  .then(() => {
    logger.info('✅ Database connected successfully')
  })
  .catch((err) => {
    logger.error('❌ Database connection failed', { error: err.message })
    process.exit(1)
  })

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  logger.info('Prisma disconnected on SIGTERM')
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  logger.info('Prisma disconnected on SIGINT')
})

export default prisma
