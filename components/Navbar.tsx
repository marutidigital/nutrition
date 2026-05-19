'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/cart'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'
import { Menu, X, Search, User as UserIcon, ShoppingCart, Settings } from 'lucide-react'
import { LanguageToggle } from './LanguageToggle'
import { useLanguageStore } from '@/store/useLanguageStore'
import { translations } from '@/lib/i18n/translations'

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [proOpen, setProOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { totalItems, openCart } = useCartStore()
  const itemCount = totalItems()
  const { language } = useLanguageStore()
  const t = translations[language]

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
    { label: t.nav.allProducts, href: '/products' },
    { label: t.nav.blog, href: '/blog' },
    { label: t.nav.proteins, href: '/products?category=Proteins' },
    { label: t.nav.preWorkout, href: '/products?category=Pre Workout' },
    { label: t.nav.creatine, href: '/products?category=CREATINE' },
    { label: t.nav.snacks, href: '/products?category=SNACKS' },
    { label: t.nav.vitamins, href: '/products?category=Vitamins & Minerals' },
    { label: t.nav.weightLoss, href: '/products?category=Weight Loss' },
  ]

  return (
    <>
      {/* Tier 1: Thin Top Bar */}
      <div className="bg-[#F4F4F4] text-[#555555] border-b border-gray-200 py-1.5 px-4 text-[11px] font-medium tracking-wide">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <Link href="/contact" className="hover:underline">
              {isMounted ? t.nav.findStore : 'Trouver un magasin'}
            </Link>
          </div>
          <div className="hidden md:block font-bold text-dark uppercase tracking-widest">
            {isMounted ? t.promo.bogo : 'Achetez-en 1, obtenez 1 à -50% !'}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-500 text-sm">★</span>
            <button
              onClick={() => setProOpen(true)}
              className="font-bold hover:underline uppercase text-dark"
            >
              {isMounted ? t.promo.proMember : 'DEVENEZ MEMBRE PRO'}
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
              placeholder={isMounted ? t.nav.search : 'Rechercher des produits...'}
              className="w-full border-2 border-gray-200 hover:border-gray-400 focus:border-dark px-4 py-2.5 rounded-sm text-sm focus:outline-none transition-colors pr-10"
            />
            <button type="submit" className="absolute right-3 text-gray-500 hover:text-dark transition-colors">
              <Search size={20} />
            </button>
          </form>

          <div className="flex items-center gap-5 flex-shrink-0">
            <Link
              href={user ? '/account' : '/auth/login'}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors relative"
              title={user ? 'Account' : 'Sign In'}
            >
              <UserIcon size={24} className="text-dark" />
              {user && <span className="absolute -top-1 -right-1 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-white" />}
            </Link>

            {profile?.role === 'admin' && (
              <Link href="/admin" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors" title="Admin">
                <Settings size={24} className="text-primary" />
              </Link>
            )}

            <button
              onClick={openCart}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <ShoppingCart size={24} className="text-dark" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black min-w-[18px] min-h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            <LanguageToggle />

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden p-2 text-dark hover:bg-gray-100 rounded-md"
            >
              <Menu size={28} />
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
                  placeholder={isMounted ? t.nav.search : 'Rechercher des produits...'}
                  className="w-full border border-gray-300 px-3 py-2 text-sm rounded-sm focus:outline-none"
                />
                <button type="submit" className="absolute right-3 text-gray-500"><Search size={20} /></button>
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
                className="flex items-center gap-2 py-2.5 text-xs font-black tracking-widest text-dark mt-2 border-t border-gray-200"
              >
                <UserIcon size={16} /> {isMounted ? (user ? t.nav.myAccount : t.nav.signIn) : (user ? 'MON COMPTE' : 'CONNEXION / INSCRIPTION')}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Tier 4: Promo Bar */}
      <div className="bg-[#000000] text-white py-2 px-4 text-[10px] font-black tracking-widest uppercase border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-2 text-center items-center">
          <div className="hover:text-primary transition-colors cursor-pointer">
            {isMounted ? t.promo.bogo : 'Achetez-en 1, obtenez 1 à -50% !'}
          </div>
          <div className="hidden md:block border-x border-gray-700 px-4 hover:text-primary transition-colors cursor-pointer">
            {isMounted ? t.promo.freeShipping : 'Livraison gratuite dès CHF 75'}
          </div>
          <div className="hidden md:block hover:text-primary transition-colors cursor-pointer">
            {isMounted ? t.promo.pickupDiscount : 'Économisez 10% en retrait en magasin !'}
          </div>
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
              <h2 className="font-display text-3xl font-black tracking-wide">
                {isMounted ? t.pro.title : 'INSCRIVEZ-VOUS AU PRO'}
              </h2>
              <button
                onClick={() => setProOpen(false)}
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* CTA button top */}
            <div className="p-6 pb-4">
              <Link
                href="/auth/login"
                onClick={() => setProOpen(false)}
                className="block text-center bg-dark text-white font-black tracking-widest py-4 text-sm hover:bg-gray-800 transition-colors uppercase"
              >
                {isMounted ? t.pro.addCta : 'ACCÈS PRO POUR CHF 39.99'}
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
                <div className="text-xs font-black mb-2 text-gray-300 uppercase tracking-widest">
                  {isMounted ? t.pro.paysToPro : 'ÇA PAIE D\'ÊTRE PRO.'}
                </div>
                <ul className="space-y-1.5">
                  {(isMounted ? t.pro.benefits : translations.fr.pro.benefits).map((item) => (
                    <li key={item} className="text-[11px] text-gray-300 flex gap-1.5">
                      <span className="text-[#c8102e] font-bold flex-shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/about" onClick={() => setProOpen(false)} className="text-xs font-black underline mt-3 block hover:text-gray-300 transition-colors">
                  {isMounted ? t.pro.learnMore : 'EN SAVOIR PLUS'}
                </Link>
              </div>
            </div>

            {/* Benefits list */}
            <div className="mx-6 space-y-0">
              {[
                { title: isMounted ? (language === 'fr' ? 'BOGO -50% sur presque TOUT' : 'BOGO 50% Off Almost EVERYTHING') : 'BOGO -50% sur presque TOUT', sub: isMounted ? (language === 'fr' ? 'du 1er au 7 de chaque mois' : 'the 1st - 7th of every month') : 'du 1er au 7 de chaque mois', color: '#c8102e' },
                { title: isMounted ? (language === 'fr' ? '15% de cashback' : '15% Cash Back') : '15% de cashback', sub: isMounted ? (language === 'fr' ? 'Offres Pick-A-Day en fin de mois' : 'Rewards with Pick-A-Day Offers') : 'Offres Pick-A-Day en fin de mois', color: '#c8102e' },
                { title: isMounted ? (language === 'fr' ? '10% de cashback' : '10% Cash Back') : '10% de cashback', sub: isMounted ? (language === 'fr' ? 'Sur chaque achat' : 'Rewards on every purchase*') : 'Sur chaque achat', color: '#c8102e' },
                { title: isMounted ? (language === 'fr' ? 'Livraison GRATUITE' : 'FREE Shipping') : 'Livraison GRATUITE', sub: isMounted ? (language === 'fr' ? 'Sur chaque commande automatiquement' : 'Save on every order automatically') : 'Sur chaque commande automatiquement', color: '#c8102e' },
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
              {isMounted ? t.pro.alreadyMember : 'Déjà membre ?'}{' '}
              <Link href="/auth/login" onClick={() => setProOpen(false)} className="font-black text-dark underline hover:text-primary">
                {isMounted ? t.pro.signIn : 'Connexion'}
              </Link>
            </div>

            {/* Bottom CTA */}
            <div className="px-6 pb-8">
              <Link
                href="/auth/login"
                onClick={() => setProOpen(false)}
                className="block text-center bg-dark text-white font-black tracking-widest py-4 text-sm hover:bg-gray-800 transition-colors uppercase"
              >
                {isMounted ? t.pro.addCta : 'ACCÈS PRO POUR CHF 39.99'}
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}
