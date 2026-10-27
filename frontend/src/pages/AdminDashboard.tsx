import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { Loading } from '@components/common/Loading'
import { useAuthStore } from '@/store'

interface Stats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  ordersThisMonth: number
  revenueThisMonth: number
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<Stats>({
    totalUsers: 2541,
    totalOrders: 1284,
    totalRevenue: 156842.50,
    totalProducts: 342,
    ordersThisMonth: 128,
    revenueThisMonth: 15684.25,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Simulate loading stats
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card>
          <CardContent>
            <p className="text-center text-gray-600">
              You don't have permission to access the admin dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return <Loading fullHeight message="Loading admin dashboard..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-blue-100 p-3 text-2xl">👥</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-green-100 p-3 text-2xl">📦</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    ${(stats.totalRevenue / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="rounded-lg bg-yellow-100 p-3 text-2xl">💰</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Products</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
                <div className="rounded-lg bg-purple-100 p-3 text-2xl">⏱</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* This Month Stats */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-6">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Orders</dt>
                  <dd className="text-2xl font-bold text-primary-600">{stats.ordersThisMonth}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Revenue</dt>
                  <dd className="text-2xl font-bold text-green-600">${stats.revenueThisMonth.toFixed(2)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="md" fullWidth>
                View All Orders
              </Button>
              <Button variant="outline" size="md" fullWidth>
                Manage Products
              </Button>
              <Button variant="outline" size="md" fullWidth>
                View Users
              </Button>
              <Button variant="outline" size="md" fullWidth>
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">Order #{1000 + i}</p>
                    <p className="text-sm text-gray-600">Customer {i}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${(Math.random() * 5000).toFixed(2)}</p>
                    <p className="text-xs text-green-600">Delivered</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { AdminDashboardPage }
