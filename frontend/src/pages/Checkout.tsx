import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { Input } from '@components/common/Input'
import { Alert } from '@components/common/Alert'
import { useCartStore, useAuthStore } from '@/store'
import type { Address } from '@/types'

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  })

  const [billingAddress, setBillingAddress] = useState<Address>(shippingAddress)
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card')

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Alert type="info" title="Empty Cart">
          Please add items to your cart before checking out.
        </Alert>
        <Button variant="primary" className="mt-4" onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </div>
    )
  }

  const handleAddressChange = (
    field: keyof Address,
    value: string,
    isShipping = true
  ) => {
    if (isShipping) {
      setShippingAddress((prev) => ({ ...prev, [field]: value }))
    } else {
      setBillingAddress((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmitOrder = async () => {
    try {
      setError(null)
      setIsProcessing(true)

      // Validate addresses
      if (
        !shippingAddress.street ||
        !shippingAddress.city ||
        !shippingAddress.country ||
        !shippingAddress.zipCode
      ) {
        setError('Please fill in all shipping address fields')
        setCurrentStep(1)
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear cart and redirect
      clearCart()
      navigate('/orders')
    } catch (err) {
      setError('Failed to process order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

        {error && (
          <Alert type="error" className="mt-4" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Steps */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            <Card className={currentStep !== 1 ? 'opacity-50' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </span>
                  Shipping Address
                </CardTitle>
              </CardHeader>
              {currentStep >= 1 && (
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="First Name"
                      value={shippingAddress.firstName}
                      onChange={(e) => handleAddressChange('firstName', e.target.value, true)}
                    />
                    <Input
                      label="Last Name"
                      value={shippingAddress.lastName}
                      onChange={(e) => handleAddressChange('lastName', e.target.value, true)}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => handleAddressChange('email', e.target.value, true)}
                      className="sm:col-span-2"
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value, true)}
                      className="sm:col-span-2"
                    />
                    <Input
                      label="Street Address"
                      value={shippingAddress.street}
                      onChange={(e) => handleAddressChange('street', e.target.value, true)}
                      className="sm:col-span-2"
                    />
                    <Input
                      label="City"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value, true)}
                    />
                    <Input
                      label="State"
                      value={shippingAddress.state}
                      onChange={(e) => handleAddressChange('state', e.target.value, true)}
                    />
                    <Input
                      label="Country"
                      value={shippingAddress.country}
                      onChange={(e) => handleAddressChange('country', e.target.value, true)}
                    />
                    <Input
                      label="ZIP Code"
                      value={shippingAddress.zipCode}
                      onChange={(e) => handleAddressChange('zipCode', e.target.value, true)}
                    />
                  </div>

                  <Button
                    variant="primary"
                    className="mt-6 w-full"
                    onClick={() => setCurrentStep(2)}
                  >
                    Continue to Billing
                  </Button>
                </CardContent>
              )}
            </Card>

            {/* Step 2: Billing Address */}
            <Card className={`mt-6 ${currentStep < 2 ? 'opacity-50' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </span>
                  Billing Address
                </CardTitle>
              </CardHeader>
              {currentStep >= 2 && (
                <CardContent>
                  <label className="mb-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => {
                        setSameAsShipping(e.target.checked)
                        if (e.target.checked) {
                          setBillingAddress(shippingAddress)
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Same as shipping address</span>
                  </label>

                  {!sameAsShipping && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Input
                        label="First Name"
                        value={billingAddress.firstName}
                        onChange={(e) => handleAddressChange('firstName', e.target.value, false)}
                      />
                      <Input
                        label="Last Name"
                        value={billingAddress.lastName}
                        onChange={(e) => handleAddressChange('lastName', e.target.value, false)}
                      />
                      {/* Add more billing address fields as needed */}
                    </div>
                  )}

                  <div className="mt-6 flex gap-2">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => setCurrentStep(3)}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Step 3: Payment */}
            <Card className={`mt-6 ${currentStep < 3 ? 'opacity-50' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    3
                  </span>
                  Payment Method
                </CardTitle>
              </CardHeader>
              {currentStep >= 3 && (
                <CardContent>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 rounded-lg border border-gray-300 p-4 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="rounded-full"
                      />
                      <span className="flex-1 font-medium text-gray-900">Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center gap-3 rounded-lg border border-gray-300 p-4 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="rounded-full"
                      />
                      <span className="flex-1 font-medium text-gray-900">PayPal</span>
                    </label>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-6 space-y-4">
                      <Input label="Card Number" placeholder="4111 1111 1111 1111" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Expiry Date" placeholder="MM/YY" />
                        <Input label="CVC" placeholder="123" />
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex gap-2">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      isLoading={isProcessing}
                      onClick={handleSubmitOrder}
                    >
                      Place Order
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.product?.name} x {item.quantity}</span>
                      <span className="font-medium text-gray-900">
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Subtotal</dt>
                    <dd className="text-gray-900">${(total * 0.9).toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Tax</dt>
                    <dd className="text-gray-900">${(total * 0.1).toFixed(2)}</dd>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <dt>Total</dt>
                      <dd className="text-primary-600">${total.toFixed(2)}</dd>
                    </div>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export { CheckoutPage }
