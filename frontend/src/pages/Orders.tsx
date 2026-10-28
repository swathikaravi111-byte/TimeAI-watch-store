import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@components/common/Card'
import { Loading } from '@components/common/Loading'
import type { Order } from '@/types'
import { ordersApi } from '@/services/api/orders'

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const response = await ordersApi.getAll(1, 20)
        setOrders(response.orders)
      } catch (err) {
        setError('Failed to load orders')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return <Loading fullHeight message="Loading orders..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-2 text-gray-600">{orders.length} orders</p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-800">{error}</div>
        )}

        {orders.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-gray-600">You haven't placed any orders yet</p>
            <Link to="/products" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <Card key={order.id} hover interactive>
                <Link to={`/orders/${order.id}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900">Order {order.id}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary-600">
                            ${order.total.toFixed(2)}
                          </p>
                          <span
                            className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { OrdersPage }
