import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { HomePageUI } from '@/components/HomePageUI'
import type { Product, HomepageShowcase } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Nutrition — Compléments Suisses Premium',
  description:
    'Votre destination de confiance pour les compléments alimentaires premium en Suisse. Protéines, pré-workout, créatine et plus. Livraison gratuite dès CHF 75.',
}

export const revalidate = 60

async function getData() {
  try {
    const supabase = createServerSupabaseClient()

    const [featuredResult, newResult, showcaseResult] = await Promise.all([
      supabase.from('products').select('*').eq('is_featured', true).eq('in_stock', true).limit(16),
      supabase.from('products').select('*').eq('is_new', true).eq('in_stock', true).limit(4),
      supabase.from('homepage_showcase').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
    ])

    let featured = (featuredResult.data ?? []) as Product[]
    if (featured.length === 0) {
      const fallback = await supabase.from('products').select('*').eq('in_stock', true).limit(16)
      featured = (fallback.data ?? []) as Product[]
    }

    let newProducts = (newResult.data ?? []) as Product[]
    if (newProducts.length === 0) {
      const fallback = await supabase.from('products').select('*').eq('in_stock', true).range(8, 11)
      newProducts = (fallback.data ?? []) as Product[]
    }

    const showcase = (showcaseResult.data ?? []) as HomepageShowcase[]

    return { featured, newProducts, showcase }
  } catch (error) {
    console.error('SERVER FETCH ERROR IN app/page.tsx:', error)
    return { featured: [], newProducts: [], showcase: [] }
  }
}

export default async function HomePage() {
  const { featured, newProducts, showcase } = await getData()

  return <HomePageUI featured={featured} newProducts={newProducts} showcase={showcase} />
}
