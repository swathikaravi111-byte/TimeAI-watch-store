import logger from '@/utils/logger'
import prisma from '@/utils/prisma'
import { NotFoundError, BadRequestError } from '@/utils/errors'

export class PaymentService {
  /**
   * Process payment
   */
  async processPayment(data: {
    orderId: string
    userId: string
    amount: number
    paymentMethod: 'card' | 'paypal'
    cardDetails?: {
      cardNumber: string
      cardHolder: string
      expiryDate: string
      cvv: string
    }
  }) {
    logger.info('Processing payment', {
      orderId: data.orderId,
      amount: data.amount,
      method: data.paymentMethod,
    })

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
    })

    if (!order) {
      throw new NotFoundError('Order')
    }

    if (order.userId !== data.userId) {
      throw new BadRequestError('Unauthorized payment')
    }

    if (order.total !== data.amount) {
      throw new BadRequestError('Payment amount does not match order total')
    }

    try {
      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          orderId: data.orderId,
          userId: data.userId,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          status: 'PROCESSING',
          // In production, integrate with actual payment gateway
          // providerTransactionId: stripeResponse.id,
        },
      })

      // Simulate payment processing
      // In production, use actual Stripe/PayPal API
      const success = Math.random() > 0.05 // 95% success rate for demo

      if (success) {
        // Update payment status
        const updatedPayment = await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
          },
        })

        // Update order status
        await prisma.order.update({
          where: { id: data.orderId },
          data: {
            paymentStatus: 'COMPLETED',
            status: 'CONFIRMED',
          },
        })

        logger.info('Payment successful', {
          orderId: data.orderId,
          paymentId: payment.id,
          amount: data.amount,
        })

        return {
          success: true,
          payment: updatedPayment,
          message: 'Payment processed successfully',
        }
      } else {
        // Update payment status to failed
        const failedPayment = await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED',
            failureReason: 'Payment declined by card issuer',
          },
        })

        logger.warn('Payment failed', {
          orderId: data.orderId,
          paymentId: payment.id,
          amount: data.amount,
        })

        throw new BadRequestError('Payment was declined. Please try again.')
      }
    } catch (error: any) {
      logger.error('Payment processing error', {
        orderId: data.orderId,
        error: error.message,
      })

      throw error
    }
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(id: string) {
    const payment = await prisma.payment.findUnique({
      where: { id },
    })

    if (!payment) {
      throw new NotFoundError('Payment')
    }

    return payment
  }

  /**
   * Get order payments
   */
  async getOrderPayments(orderId: string) {
    return await prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId: string, reason: string) {
    logger.info('Processing refund', { paymentId, reason })

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    })

    if (!payment) {
      throw new NotFoundError('Payment')
    }

    if (payment.status !== 'COMPLETED') {
      throw new BadRequestError('Only completed payments can be refunded')
    }

    // Create refund record
    const refund = await prisma.refund.create({
      data: {
        paymentId,
        amount: payment.amount,
        reason,
        status: 'PROCESSING',
      },
    })

    // Update payment status
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'REFUNDED',
      },
    })

    logger.info('Refund processed', {
      refundId: refund.id,
      paymentId,
      amount: payment.amount,
    })

    return refund
  }
}

export default new PaymentService()
