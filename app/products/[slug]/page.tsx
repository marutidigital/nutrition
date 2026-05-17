import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ProductDetailClient } from '@/components/ProductDetailClient'
import { ProductCard } from '@/components/ProductCard'
import type { Product } from '@/lib/types'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('products')
    .select('name, description_short, images')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Product Not Found' }

  return {
    title: data.name,
    description: data.description_short
      ? data.description_short.replace(/<[^>]*>/g, '').slice(0, 160)
      : '',
    openGraph: {
      title: data.name,
      images: data.images?.[0] ? [data.images[0]] : [],
    },
  }
}

export const revalidate = 60

// Parse Postgres array literal like {"url1","url2"} into a JS string[]
function parseImageArray(raw: any): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.filter(Boolean)
  if (typeof raw === 'string') {
    // Strip outer braces then split on comma, remove surrounding quotes
    const inner = raw.replace(/^\{/, '').replace(/\}$/, '')
    return inner
      .split(',')
      .map((s) => s.trim().replace(/^"/, '').replace(/"$/, ''))
      .filter(Boolean)
  }
  return []
}

export default async function ProductDetailPage({ params }: PageProps) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !data) notFound()
  const product = data as Product

  // Related products
  const { data: related } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category ?? '')
    .neq('id', product.id)
    .limit(4)

  const relatedProducts = (related ?? []) as Product[]

  const discount = product.price_original
    ? Math.round((1 - product.price / product.price_original) * 100)
    : null

  const images = parseImageArray(product.images)

  return (
    <div className="page-transition bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-4 py-4 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#c8102e] transition-colors">Home</Link>
        {' '}›{' '}
        <Link href="/products" className="hover:text-[#c8102e] transition-colors">Products</Link>
        {product.category && (
          <>
            {' '}›{' '}
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="hover:text-[#c8102e] transition-colors"
            >
              {product.category}
            </Link>
          </>
        )}
        {' '}›{' '}
        <span className="text-dark font-semibold">{product.name}</span>
      </div>

      {/* Main product layout — gallery + info all inside ProductDetailClient */}
      <ProductDetailClient product={product} discount={discount} images={images} />

      {/* Long Description */}
      {product.description_long && (
        <div className="max-w-[1200px] mx-auto px-4 mb-16">
          <div className="border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="font-display text-2xl text-dark tracking-wide">PRODUCT DETAILS</h2>
            </div>
            <div
              id="reviews"
              className="px-6 py-6 prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html: product.description_long.replace(/\\n/g, '<br/>'),
              }}
            />
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-4 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-3xl text-dark tracking-wide">YOU MAY ALSO LIKE</h2>
            <Link href={`/products?category=${encodeURIComponent(product.category ?? '')}`} className="text-[#c8102e] text-sm font-bold hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
