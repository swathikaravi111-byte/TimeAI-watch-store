import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store'
import { MENU_ITEMS } from '@/data/menuItems'

export const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const { items, subtotal, tax, shipping, total, removeItem, updateQuantity, clearCart } = useCartStore()
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [giftNote, setGiftNote] = useState('')
  const [isGiftNoteOpen, setIsGiftNoteOpen] = useState(false)

  // Enrich cart items with data from MENU_ITEMS if product is missing
  const enrichedItems = items.map((cartItem) => {
    const menuItem = MENU_ITEMS.find((m) => m.id === cartItem.productId)
    const name = cartItem.product?.name || menuItem?.name || 'Artisan Shop Item'
    const price = cartItem.product?.price || menuItem?.price || 0
    const image =
      cartItem.product?.thumbnail ||
      cartItem.product?.images?.[0] ||
      menuItem?.image ||
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&q=80'
    const category = cartItem.product?.category || menuItem?.category || 'Flower & Rice'
    const unit = menuItem?.unit || 'Item'

    return {
      ...cartItem,
      displayName: name,
      displayPrice: price,
      displayImage: image,
      displayCategory: category,
      displayUnit: unit,
      lineTotal: price * cartItem.quantity,
    }
  })

  const discountAmount = appliedPromo === 'BLOOM15' ? subtotal * 0.15 : 0
  const finalSubtotal = Math.max(0, subtotal - discountAmount)
  const calculatedTax = finalSubtotal * 0.08
  const calculatedShipping = subtotal > 50 || subtotal === 0 ? 0 : 7.99
  const calculatedTotal = finalSubtotal + calculatedTax + calculatedShipping

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    setPromoError(null)
    if (promoCode.trim().toUpperCase() === 'BLOOM15') {
      setAppliedPromo('BLOOM15')
    } else {
      setPromoError('Invalid coupon. Try "BLOOM15" for 15% off flowers & rice!')
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center bg-gradient-to-b from-rose-50/50 via-white to-amber-50/40 px-4 py-16">
        <div className="relative mx-auto max-w-md text-center">
          <div className="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-pink-200 via-rose-100 to-amber-100 shadow-xl">
            <span className="text-6xl animate-bounce">🌸</span>
            <span className="absolute -bottom-1 -right-1 text-3xl">🧺</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Basket is Empty</h1>
          <p className="mt-3 text-base text-gray-600 leading-relaxed">
            Your floral and culinary basket hasn't bloomed yet! Explore our 20 fresh floral bouquets, aromatic paellas, and gourmet rice dishes.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.02] hover:shadow-rose-500/40"
            >
              <span>🌸 Explore 20 Menu Items 🍚</span>
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Our Story
            </Link>
          </div>

          {/* Quick suggestions */}
          <div className="mt-12 rounded-2xl border border-rose-100 bg-white/80 p-6 backdrop-blur shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600">✨ Popular Today</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 text-left">
              {MENU_ITEMS.slice(0, 2).map((item) => (
                <Link
                  key={item.id}
                  to="/menu"
                  className="flex items-center gap-3 rounded-lg border border-gray-100 p-2.5 transition-colors hover:border-rose-200 hover:bg-rose-50/50"
                >
                  <img src={item.image} alt={item.name} className="h-11 w-11 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs font-bold text-rose-600">${item.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-amber-50/30 pb-16 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs & Title */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-rose-100 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
              <Link to="/" className="hover:text-rose-600">Home</Link>
              <span>/</span>
              <Link to="/menu" className="hover:text-rose-600">Flower & Rice Menu</Link>
              <span>/</span>
              <span className="text-rose-600 font-semibold">Flower Basket & Cart</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <span>🌸 Floral & Feast Basket</span>
              <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-700">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/menu"
              className="text-sm font-medium text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
            >
              ← Add more items
            </Link>
            <button
              onClick={clearCart}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Clear Basket
            </button>
          </div>
        </div>

        {/* Free shipping progress notification */}
        <div className="mb-6 rounded-xl border border-pink-200 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <span>🚚</span>
              {subtotal >= 50
                ? '🎉 You unlocked FREE Same-Day Floral & Meal Delivery!'
                : `Add $${(50 - subtotal).toFixed(2)} more to qualify for FREE express courier delivery`}
            </span>
            <span>{Math.min(100, Math.round((subtotal / 50) * 100))}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
              style={{ width: `${Math.min(100, (subtotal / 50) * 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items List */}
          <div className="space-y-4 lg:col-span-2">
            {enrichedItems.map((item) => (
              <div
                key={item.productId}
                className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-rose-100/70 bg-white p-4 sm:p-5 shadow-sm transition-all hover:border-rose-200 hover:shadow-md"
              >
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                  <img
                    src={item.displayImage}
                    alt={item.displayName}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                    {item.displayUnit}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 mb-1">
                        {item.displayCategory}
                      </span>
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug">
                        {item.displayName}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                        <span>✨ Fresh Handled</span> • <span>📦 Sealed Eco-Wrap</span>
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-gray-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove item"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    {/* Quantity controls */}
                    <div className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50/80 p-0.5">
                      <button
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-extrabold text-rose-600">
                        ${item.lineTotal.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">
                        ${item.displayPrice.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Custom Gift Note Box */}
            <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
              <button
                onClick={() => setIsGiftNoteOpen(!isGiftNoteOpen)}
                className="flex w-full items-center justify-between text-left font-semibold text-gray-800"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">💌</span>
                  <span>Add a Complimentary Flower Gift Card & Message</span>
                </div>
                <span className="text-xs text-rose-600 font-bold">
                  {isGiftNoteOpen ? 'Hide' : '+ Add Note'}
                </span>
              </button>
              {isGiftNoteOpen && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">
                    We will handwrite your message on textured floral stationery tucked into your bouquet or gift parcel.
                  </p>
                  <textarea
                    rows={3}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="E.g., Happy Anniversary my love! Enjoy these blooms and delicious saffron rice. Always yours..."
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                  {giftNote && (
                    <p className="mt-1 text-xs text-emerald-600 font-medium">✓ Gift note attached</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                  Basket Summary
                </h2>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Promo (BLOOM15 - 15%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <span>Express Shipping</span>
                      {calculatedShipping === 0 && (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          FREE
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {calculatedShipping === 0 ? '$0.00' : `$${calculatedShipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-semibold text-gray-900">${calculatedTax.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-base font-bold text-gray-900">Grand Total</span>
                      <span className="text-2xl font-black text-rose-600">
                        ${calculatedTotal.toFixed(2)}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-400">
                      Includes all fresh packaging, ribbons & culinary steam seals
                    </p>
                  </div>
                </div>

                {/* Promo code form */}
                <form onSubmit={handleApplyPromo} className="mt-6 border-t border-gray-100 pt-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Have a floral promo code?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Use code: BLOOM15"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs uppercase focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-gray-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="mt-1.5 text-xs text-rose-600">{promoError}</p>
                  )}
                  {appliedPromo && (
                    <p className="mt-1.5 text-xs font-semibold text-emerald-600">
                      ✓ Coupon BLOOM15 applied (15% discount)
                    </p>
                  )}
                </form>

                {/* Checkout CTA */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.01] hover:shadow-rose-500/40"
                  >
                    <span>Proceed to Secure Checkout</span>
                    <span>→</span>
                  </button>

                  <Link
                    to="/menu"
                    className="block w-full rounded-xl border border-gray-200 bg-white py-2.5 text-center text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Continue Browsing Flowers & Rice
                  </Link>
                </div>
              </div>

              {/* Guarantees */}
              <div className="rounded-2xl border border-rose-100/60 bg-gradient-to-br from-rose-50/50 to-pink-50/50 p-5 text-xs text-gray-600 space-y-2.5">
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  <span className="text-base">🌸</span>
                  <span>7-Day Fresh Bloom Guarantee</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  <span className="text-base">🍲</span>
                  <span>Chefs Hot-Sealed Fresh Delivery</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  <span className="text-base">🔒</span>
                  <span>256-Bit Encrypted Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}