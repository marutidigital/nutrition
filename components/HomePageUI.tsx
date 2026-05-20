'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { HeroSlider } from '@/components/HeroSlider'
import type { Product, HomepageShowcase } from '@/lib/types'
import { useLanguageStore } from '@/store/useLanguageStore'
import { translations } from '@/lib/i18n/translations'
import { Dumbbell, Zap, Flame, Milk, Scale, Leaf, TrendingUp, Cookie, LeafyGreen, Fish, RotateCw } from 'lucide-react'

interface HomePageUIProps {
  featured: Product[]
  newProducts: Product[]
  showcase: HomepageShowcase[]
}

const CATEGORY_ICONS = [
  <Dumbbell size={24} />,
  <Zap size={24} />,
  <Flame size={24} />,
  <Milk size={24} />,
  <Scale size={24} />,
  <Leaf size={24} />,
  <TrendingUp size={24} />,
  <Cookie size={24} />,
  <LeafyGreen size={24} />,
  <Fish size={24} />,
  <RotateCw size={24} />,
  <Zap size={24} />,
]

const FALLBACK_SHOWCASE: HomepageShowcase[] = [
  {
    id: 'f1',
    title: 'Whey Proteins',
    category_slug: 'Proteins',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-muscular-back-in-gym-4889-large.mp4',
    media_type: 'video',
    sort_order: 1,
    is_active: true,
    created_at: '',
  },
  {
    id: 'f2',
    title: 'Pre-Workout',
    category_slug: 'Pre Workout',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-dumbbell-workout-34289-large.mp4',
    media_type: 'video',
    sort_order: 2,
    is_active: true,
    created_at: '',
  },
  {
    id: 'f3',
    title: 'Pure Creatine',
    category_slug: 'CREATINE',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-training-in-the-gym-39875-large.mp4',
    media_type: 'video',
    sort_order: 3,
    is_active: true,
    created_at: '',
  },
  {
    id: 'f4',
    title: 'Shakers & Gear',
    category_slug: 'Accessories',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-man-drinking-from-a-shaker-43183-large.mp4',
    media_type: 'video',
    sort_order: 4,
    is_active: true,
    created_at: '',
  },
  {
    id: 'f5',
    title: 'Recovery & Health',
    category_slug: 'ÉNERGIE - RÉCUPÉRATION',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-doing-squats-with-barbell-in-gym-39881-large.mp4',
    media_type: 'video',
    sort_order: 5,
    is_active: true,
    created_at: '',
  }
]

export function HomePageUI({ featured, newProducts, showcase }: HomePageUIProps) {
  const { language } = useLanguageStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const t = isMounted ? translations[language] : translations.fr

  const availableFeatured = featured.filter((p) => p.in_stock)
  const availableNew = newProducts.filter((p) => p.in_stock)
  const activeShowcase = showcase && showcase.length > 0 ? showcase : FALLBACK_SHOWCASE

  const HARDCODED_CATEGORIES = [
    { id: '1',  slug: 'Proteins',                  name: { fr: 'Protéines',        en: 'Proteins' } },
    { id: '2',  slug: 'Pre Workout',               name: { fr: 'Pré-Workout',      en: 'Pre Workout' } },
    { id: '3',  slug: 'CREATINE',                  name: { fr: 'Créatine',         en: 'Creatine' } },
    { id: '4',  slug: 'WHEY/ISOLATE',              name: { fr: 'Whey / Isolat',    en: 'Whey / Isolate' } },
    { id: '5',  slug: 'Weight Loss',               name: { fr: 'Perte de poids',   en: 'Weight Loss' } },
    { id: '6',  slug: 'Vitamins & Minerals',       name: { fr: 'Vitamines',        en: 'Vitamins' } },
    { id: '7',  slug: 'Mass Gainer',               name: { fr: 'Prise de masse',   en: 'Mass Gainer' } },
    { id: '8',  slug: 'SNACKS',                    name: { fr: 'Collations',       en: 'Snacks' } },
    { id: '9',  slug: 'ASHWAGANDHA',               name: { fr: 'Ashwagandha',      en: 'Ashwagandha' } },
    { id: '10', slug: 'OMEGA 3',                   name: { fr: 'Oméga 3',          en: 'Omega 3' } },
    { id: '11', slug: 'Post Workout',              name: { fr: 'Post-Entraînement',en: 'Post Workout' } },
    { id: '12', slug: 'ÉNERGIE - RÉCUPÉRATION',    name: { fr: 'Énergie & Récup',  en: 'Energy & Recovery' } },
  ]

  const lang = isMounted ? language : 'fr'

  return (
    <div className="page-transition bg-white">

      {/* ── Category Pills Strip ── */}
      <section className="bg-white border-b border-gray-100 py-5 px-4 overflow-x-auto">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex gap-2 min-w-max mx-auto justify-center flex-wrap">
            {HARDCODED_CATEGORIES.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="flex items-center gap-1.5 px-5 py-2.5 border-2 border-gray-200 hover:border-[#c8102e] hover:text-[#c8102e] text-xs font-black tracking-widest text-dark bg-white transition-all uppercase rounded-sm hover:bg-red-50 whitespace-nowrap"
              >
                <span>{CATEGORY_ICONS[i]}</span>
                {cat.name[lang as 'fr' | 'en']}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hero Banner ── */}
      <HeroSlider />

      {/* ── Featured Products + Media Showcase (interspersed) ── */}
      {(availableFeatured.length > 0 || activeShowcase.length > 0) && (
        <section className="bg-white py-12 px-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-xs font-bold tracking-[3px] text-gray-400 uppercase mb-2">
                  {t.home.topPicks}
                </div>
                <h2 className="font-display font-black text-4xl sm:text-5xl text-dark tracking-wide uppercase">
                  {t.home.brandsOnSale}
                </h2>
                <div className="w-16 h-1 bg-[#c8102e] mt-2" />
              </div>
              <Link
                href="/products"
                className="text-[#c8102e] text-sm font-bold hover:underline flex items-center gap-1 group"
              >
                {t.home.viewAll} <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {(() => {
                // Build a merged list: insert each showcase item at a random slot among products
                type GridItem =
                  | { kind: 'product'; product: (typeof availableFeatured)[0]; idx: number }
                  | { kind: 'media'; item: (typeof activeShowcase)[0] }

                const items: GridItem[] = availableFeatured.map((p, idx) => ({
                  kind: 'product',
                  product: p,
                  idx,
                }))

                // Deterministic spread: insert showcase every ~3 products
                const step = Math.max(3, Math.floor(items.length / (activeShowcase.length || 1)))
                activeShowcase.forEach((item, si) => {
                  const pos = Math.min(step * (si + 1), items.length)
                  items.splice(pos + si, 0, { kind: 'media', item })
                })

                return items.map((entry) => {
                  if (entry.kind === 'product') {
                    return (
                      <ProductCard
                        key={entry.product.id}
                        product={entry.product}
                        priority={entry.idx < 5}
                      />
                    )
                  }
                  const { item } = entry
                  const isVideo =
                    item.media_type === 'video' || !!item.media_url.match(/\.(mp4|webm|ogg)/i)
                  return (
                    <Link
                      key={`showcase-${item.id}`}
                      href={`/products?category=${encodeURIComponent(item.category_slug)}`}
                      className="group relative overflow-hidden rounded-xl border border-gray-border/60 shadow-sm hover:shadow-glow-hover hover:-translate-y-1 transition-all duration-300 aspect-[4/5] bg-gray-100"
                    >
                      {isVideo ? (
                        <video
                          src={item.media_url}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <img
                          src={item.media_url}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                      {/* Minimal bottom label — no overlay */}
                      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-white/80 backdrop-blur-sm flex items-center justify-between">
                        <span className="text-[11px] font-black tracking-widest text-dark uppercase truncate">
                          {item.title}
                        </span>
                        <span className="text-[#c8102e] text-xs font-bold ml-1 shrink-0">→</span>
                      </div>
                    </Link>
                  )
                })
              })()}
            </div>
          </div>
        </section>
      )}

      {/* ── PRO Membership Banner ── */}
      <section className="bg-[#111] py-12 px-4">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="text-gray-500 text-xs font-bold tracking-[3px] uppercase mb-3">
              {t.home.membership}
            </div>
            <h2 className="font-display text-5xl text-white mb-3 leading-none">
              {t.home.membershipTitle} <span className="text-[#c8102e]">{t.home.membershipHighlight}</span>
            </h2>
            <p className="text-gray-400 text-sm">{t.home.membershipDesc}</p>
          </div>
          <div className="w-full md:w-auto md:min-w-[320px]">
            <div className="inline-block bg-[#c8102e] text-white text-[10px] font-bold tracking-[2px] px-3 py-1.5 mb-4 uppercase">
              {t.home.itPaysToPro}
            </div>
            <ul className="space-y-2 mb-6">
              {t.home.proPerks.map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="text-[#c8102e] font-bold">✓</span> {perk}
                </li>
              ))}
            </ul>
            <Link
              href="/account"
              className="block text-center bg-white text-dark px-8 py-3.5 text-sm font-bold tracking-wider hover:bg-gray-100 transition-colors"
            >
              {t.home.membershipCta}
            </Link>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      {availableNew.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="inline-block bg-[#c8102e] text-white text-[10px] font-bold tracking-[2px] px-2 py-1 mb-2 uppercase">
                  {t.home.newDropTag}
                </div>
                <h2 className="font-display text-4xl text-dark tracking-wide">
                  {t.home.newDrop}
                </h2>
              </div>
              <Link href="/products?new=true" className="text-[#c8102e] text-sm font-bold hover:underline flex items-center gap-1 group">
                {t.home.viewAll} <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {availableNew.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
