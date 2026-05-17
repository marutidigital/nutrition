import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Track Order | NutriFitness.ch',
  description: 'Track your NutriFitness order.',
}

export default function TrackOrderPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#111] text-white py-14 px-4 text-center">
        <h1 className="font-display text-5xl font-black tracking-wide">TRACK <span className="text-[#c8102e]">ORDER</span></h1>
        <p className="text-gray-400 mt-2">Enter your order number to see the latest status.</p>
      </div>
      <div className="max-w-[500px] mx-auto px-4 py-16">
        <div className="border border-gray-200 p-8 rounded-sm">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">📦</div>
            <div className="font-display text-2xl text-dark">Track Your Package</div>
          </div>
          <form className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">Order Number</label>
              <input
                type="text"
                placeholder="e.g. NF-12345"
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#c8102e] rounded-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#c8102e] rounded-sm"
              />
            </div>
            <button type="submit" className="w-full bg-[#c8102e] text-white font-black tracking-widest py-3.5 text-sm hover:bg-[#a50d28] transition-colors uppercase">
              TRACK ORDER
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Have questions?{' '}
            <Link href="/contact" className="text-[#c8102e] font-bold hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
