'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/cart'
import { ShoppingCart, ArrowLeft, PartyPopper, Lock, ShieldCheck, RotateCcw, MapPin } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCartStore()
  const total = totalPrice()
  const count = totalItems()
  const freeShipping = total >= 75
  const shippingCost = freeShipping ? 0 : 5.90

  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center page-transition">
        <div className="flex justify-center mb-6 text-gray-300">
          <ShoppingCart size={80} strokeWidth={1} />
        </div>
        <h1 className="font-display text-4xl text-dark mb-3 tracking-wide">YOUR CART IS EMPTY</h1>
        <p className="text-gray-400 mb-8">Add some products to get started!</p>
        <Link href="/products" className="bg-primary text-white px-10 py-4 text-sm font-bold tracking-wider hover:bg-primary-dark transition-colors inline-block">
          SHOP NOW
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 page-transition">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl text-dark tracking-wide">
          YOUR CART <span className="text-base font-body font-normal text-gray-400">({count} items)</span>
        </h1>
        <button onClick={clearCart} className="text-xs text-gray-400 hover:text-primary transition-colors">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free shipping bar */}
          {!freeShipping && (
            <div className="bg-gray-light border border-gray-border p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-dark">
                  Add CHF {(75 - total).toFixed(2)} more for <span className="text-primary font-bold">FREE shipping!</span>
                </span>
                <span className="text-gray-400">{Math.round((total / 75) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${Math.min((total / 75) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
          {freeShipping && (
            <div className="bg-green-50 border border-green-200 p-3 text-sm text-green-700 font-semibold text-center flex items-center justify-center gap-2">
              <PartyPopper size={18} /> You qualify for FREE shipping!
            </div>
          )}

          {items.map((item) => (
            <div key={`${item.product_id}-${item.flavor}`} className="bg-white border border-gray-border p-4 flex gap-4">
              <div className="w-24 h-24 bg-gray-light flex-shrink-0 relative overflow-hidden">
                {item.product_image ? (
                  <Image
                    src={item.product_image.startsWith('http') ? item.product_image : `/products/${item.product_image}`}
                    alt={item.product_name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-dark-3 flex items-center justify-center">
                    <span className="text-white font-display text-2xl">{item.product_name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                {item.brand && <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">{item.brand}</div>}
                <Link href={`/products/${item.product_slug}`} className="font-semibold text-dark hover:text-primary transition-colors text-sm line-clamp-2">
                  {item.product_name}
                </Link>
                {item.flavor && <div className="text-xs text-gray-400 mt-0.5">Flavor: {item.flavor}</div>}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-border">
                    <button onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.flavor ?? undefined)} className="w-8 h-9 flex items-center justify-center hover:bg-gray-light text-sm">−</button>
                    <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.flavor ?? undefined)} className="w-8 h-9 flex items-center justify-center hover:bg-gray-light text-sm">+</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-dark">CHF {(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeItem(item.product_id, item.flavor ?? undefined)} className="text-gray-300 hover:text-primary text-xl leading-none transition-colors">×</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white border border-gray-border p-6 sticky top-24">
            <h2 className="font-display text-2xl text-dark mb-4 tracking-wide">ORDER SUMMARY</h2>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal ({count} items)</span>
                <span className="font-semibold text-dark">CHF {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className={`font-semibold flex items-center gap-1 ${freeShipping ? 'text-green-600' : 'text-dark'}`}>
                  {freeShipping ? <><PartyPopper size={16} /> FREE</> : `CHF ${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-gray-border pt-3 flex justify-between text-base font-bold">
                <span>Total</span>
                <span>CHF {(total + shippingCost).toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-primary text-white text-center py-4 font-bold tracking-wider text-sm hover:bg-primary-dark transition-colors mb-3"
            >
              PROCEED TO CHECKOUT
            </Link>

            <div className="flex flex-col items-center text-xs text-gray-400 space-y-1">
              <div className="flex items-center gap-1.5"><Lock size={12} /> Secure checkout</div>
              <div>Free shipping over CHF 75 · 14-day returns</div>
            </div>

            {/* Trust logos */}
            <div className="mt-4 pt-4 border-t border-gray-border grid grid-cols-3 gap-2 text-center">
              {[
                { icon: <ShieldCheck size={18} className="mx-auto mb-1" />, text: 'SSL Secure' },
                { icon: <RotateCcw size={18} className="mx-auto mb-1" />, text: '14-Day Returns' },
                { icon: <MapPin size={18} className="mx-auto mb-1" />, text: 'Swiss Store' }
              ].map(t => (
                <div key={t.text} className="text-[10px] font-bold text-gray-400">
                  {t.icon}
                  {t.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
