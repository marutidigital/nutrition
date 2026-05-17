'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/cart'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [proOpen, setProOpen] = useState(false)
  const { totalItems, openCart } = useCartStore()
  const itemCount = totalItems()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(data)
      }
    }
    getUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        setProfile(data)
      } else {
        setProfile(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const subNavLinks = [
    { label: 'ALL PRODUCTS', href: '/products' },
    { label: 'BLOG', href: '/blog' },
    { label: 'PROTEINS', href: '/products?category=Proteins' },
    { label: 'PRE-WORKOUT', href: '/products?category=Pre Workout' },
    { label: 'CREATINE', href: '/products?category=CREATINE' },
    { label: 'SNACKS', href: '/products?category=SNACKS' },
    { label: 'VITAMINS', href: '/products?category=Vitamins & Minerals' },
    { label: 'WEIGHT LOSS', href: '/products?category=Weight Loss' },
  ]

  return (
    <>
      {/* Tier 1: Thin Top Bar */}
      <div className="bg-[#F4F4F4] text-[#555555] border-b border-gray-200 py-1.5 px-4 text-[11px] font-medium tracking-wide">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <Link href="/contact" className="hover:underline">Find a Store</Link>
          </div>
          <div className="hidden md:block font-bold text-dark uppercase tracking-widest">
            Buy 1, Get 1 50% Off!
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-500 text-sm">★</span>
            <button
              onClick={() => setProOpen(true)}
              className="font-bold hover:underline uppercase text-dark"
            >
              Make Me a PRO Access Member
            </button>
          </div>
        </div>
      </div>

      {/* Tier 2: Main Header */}
      <header className="bg-white border-b border-gray-border py-4 px-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-1.5 flex-shrink-0 group">
            <div className="text-primary font-black text-3xl tracking-tighter leading-none font-display">NF</div>
            <div className="border-l-2 border-primary pl-2 flex flex-col justify-center">
              <span className="font-display font-black text-xl text-dark tracking-wide leading-none">
                NUTRI<span className="text-primary">FITNESS</span>
              </span>
              <span className="text-[7px] font-bold tracking-[3.5px] text-gray-400 leading-none mt-0.5 uppercase">LIVE WELL</span>
            </div>
          </Link>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`
            }}
            className="flex-1 max-w-2xl relative items-center hidden sm:flex"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What can we help you find today?"
              className="w-full border-2 border-gray-200 hover:border-gray-400 focus:border-dark px-4 py-2.5 rounded-sm text-sm focus:outline-none transition-colors pr-10"
            />
            <button type="submit" className="absolute right-3 text-lg text-gray-500 hover:text-dark transition-colors">
              🔍
            </button>
          </form>

          <div className="flex items-center gap-5 flex-shrink-0">
            <Link
              href={user ? '/account' : '/auth/login'}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors relative"
              title={user ? 'Account' : 'Sign In'}
            >
              <span className="text-xl text-dark">👤</span>
              {user && <span className="absolute -top-1 -right-1 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-white" />}
            </Link>

            {profile?.role === 'admin' && (
              <Link href="/admin" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors" title="Admin">
                <span className="text-xl text-primary">⚙️</span>
              </Link>
            )}

            <button
              onClick={openCart}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <span className="text-xl text-dark">🛒</span>
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black min-w-[18px] min-h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden p-2 text-2xl text-dark hover:bg-gray-100 rounded-md"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="border-t border-gray-100 mt-3 pt-3 hidden sm:block">
          <div className="max-w-[1400px] mx-auto flex items-center gap-6 overflow-x-auto scrollbar-none">
            {subNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-black tracking-widest whitespace-nowrap hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1 text-dark"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-gray-border bg-white mt-3 pt-3">
            <div className="px-2 pb-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`
                }}
                className="flex relative items-center mb-4"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full border border-gray-300 px-3 py-2 text-sm rounded-sm focus:outline-none"
                />
                <button type="submit" className="absolute right-3 text-gray-500">🔍</button>
              </form>
              {subNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-xs font-black tracking-widest border-b border-gray-100 last:border-0 uppercase text-dark"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={user ? '/account' : '/auth/login'}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-xs font-black tracking-widest text-dark mt-2 border-t border-gray-200"
              >
                👤 {user ? 'MY ACCOUNT' : 'SIGN IN / REGISTER'}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Tier 4: Promo Bar */}
      <div className="bg-[#000000] text-white py-2 px-4 text-[10px] font-black tracking-widest uppercase border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-2 text-center items-center">
          <div className="hover:text-primary transition-colors cursor-pointer">Buy 1, Get 1 50% Off!</div>
          <div className="hidden md:block border-x border-gray-700 px-4 hover:text-primary transition-colors cursor-pointer">Free Shipping Over CHF 79</div>
          <div className="hidden md:block hover:text-primary transition-colors cursor-pointer">Save 10% When You Pick Up In-Store!</div>
        </div>
      </div>

      {/* PRO Access Slide-in Panel */}
      {proOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-[60] transition-opacity"
            onClick={() => setProOpen(false)}
          />

          {/* Slide-in drawer from right */}
          <div className="fixed top-0 right-0 h-full w-full max-w-[440px] bg-white z-[70] shadow-2xl flex flex-col overflow-y-auto animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-display text-3xl font-black tracking-wide">SIGN UP FOR PRO</h2>
              <button
                onClick={() => setProOpen(false)}
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full text-xl transition-colors"
              >
                ✕
              </button>
            </div>

            {/* CTA button top */}
            <div className="p-6 pb-4">
              <Link
                href="/auth/login"
                onClick={() => setProOpen(false)}
                className="block text-center bg-dark text-white font-black tracking-widest py-4 text-sm hover:bg-gray-800 transition-colors uppercase"
              >
                ADD PRO ACCESS FOR CHF 39.99
              </Link>
            </div>

            {/* Dark banner */}
            <div className="mx-6 bg-[#111] text-white p-6 flex gap-6 items-center mb-4">
              <div className="flex-shrink-0">
                <div className="text-3xl font-black leading-none">NF</div>
                <div className="text-[9px] tracking-[2px] text-gray-400 font-bold">PRO★ACCESS</div>
                <div className="grid grid-cols-5 gap-0.5 mt-2">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-gray-600 rounded-full" />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-black mb-2 text-gray-300 uppercase tracking-widest">IT PAYS TO GO PRO.</div>
                <ul className="space-y-1.5">
                  {[
                    'BOGO 50% Off Almost EVERYTHING the 1st - 7th of every month',
                    '15% Cash Back Rewards with Pick-A-Day offers to end each month',
                    '10% Cash Back Rewards on every purchase',
                    'Save on every order with FREE Shipping',
                  ].map((item) => (
                    <li key={item} className="text-[11px] text-gray-300 flex gap-1.5">
                      <span className="text-[#c8102e] font-bold flex-shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/about" onClick={() => setProOpen(false)} className="text-xs font-black underline mt-3 block hover:text-gray-300 transition-colors">
                  LEARN MORE
                </Link>
              </div>
            </div>

            {/* Benefits list */}
            <div className="mx-6 space-y-0">
              {[
                { title: 'BOGO 50% Off Almost EVERYTHING', sub: 'the 1st - 7th of every month', color: '#c8102e' },
                { title: '15% Cash Back', sub: 'Rewards with Pick-A-Day Offers to end each month', color: '#c8102e' },
                { title: '10% Cash Back', sub: 'Rewards on every purchase*', color: '#c8102e' },
                { title: 'FREE Shipping', sub: 'Save on every order automatically', color: '#c8102e' },
              ].map((item, i) => (
                <div key={i} className="py-4 border-b border-gray-100">
                  <div className="text-sm">
                    <span className="font-black" style={{ color: item.color }}>{item.title}</span>{' '}
                    <span className="text-dark font-medium">{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Sign in */}
            <div className="p-6 text-sm text-gray-500 text-center">
              Already a Member?{' '}
              <Link href="/auth/login" onClick={() => setProOpen(false)} className="font-black text-dark underline hover:text-primary">
                Sign In
              </Link>
            </div>

            {/* Bottom CTA */}
            <div className="px-6 pb-8">
              <Link
                href="/auth/login"
                onClick={() => setProOpen(false)}
                className="block text-center bg-dark text-white font-black tracking-widest py-4 text-sm hover:bg-gray-800 transition-colors uppercase"
              >
                ADD PRO ACCESS FOR CHF 39.99
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}
