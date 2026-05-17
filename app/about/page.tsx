import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us | NutriFitness.ch',
  description: 'Learn about NutriFitness.ch — Premium Swiss nutrition and fitness supplements since 2018.',
}

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#111] text-white py-16 px-4">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="text-xs font-bold tracking-[4px] text-[#c8102e] uppercase mb-4">Our Story</div>
          <h1 className="font-display text-6xl font-black tracking-wide mb-4">ABOUT <span className="text-[#c8102e]">NUTRIFITNESS</span></h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Premium Swiss nutrition and fitness supplements since 2018.</p>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-black tracking-[3px] text-[#c8102e] uppercase mb-3">Who We Are</div>
            <h2 className="font-display text-4xl text-dark mb-4">Built for Athletes. Backed by Science.</h2>
            <p className="text-gray-600 leading-relaxed">NutriFitness was founded in 2018 in Switzerland with a single mission: make premium, science-backed sports nutrition accessible to every athlete. We believe everyone deserves access to the best supplements without the confusion of fake claims and inflated prices.</p>
          </div>
          <div className="bg-gray-50 h-64 flex items-center justify-center rounded-sm border border-gray-100">
            <div className="text-center">
              <div className="text-6xl font-black text-[#c8102e] leading-none">NF</div>
              <div className="text-sm font-bold text-gray-400 tracking-[4px] uppercase mt-2">Est. 2018</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { stat: '10,000+', label: 'Happy Customers', icon: '👥' },
            { stat: '227+',    label: 'Products',         icon: '🧬' },
            { stat: 'CHF 79', label: 'Free Shipping From', icon: '🚚' },
          ].map(s => (
            <div key={s.label} className="text-center border border-gray-100 p-8 rounded-sm">
              <div className="text-4xl mb-3">{s.icon}</div>
              <div className="font-display text-4xl font-black text-[#c8102e]">{s.stat}</div>
              <div className="text-sm text-gray-500 mt-1 font-semibold">{s.label}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="text-xs font-black tracking-[3px] text-[#c8102e] uppercase mb-3">Our Values</div>
          <h2 className="font-display text-4xl text-dark mb-8">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: '🔬', title: 'Science First', desc: 'Every product is selected based on clinical evidence and third-party testing.' },
              { icon: '🇨🇭', title: 'Swiss Quality', desc: 'Based in Switzerland, we hold our products to the highest quality standards in the world.' },
              { icon: '💯', title: 'Transparency', desc: 'Full ingredient labels, no proprietary blends, no hidden doses.' },
              { icon: '🌿', title: 'Sustainability', desc: 'We\'re committed to eco-friendly packaging and responsible sourcing.' },
            ].map(v => (
              <div key={v.title} className="flex gap-4 p-6 border border-gray-100 rounded-sm">
                <div className="text-3xl flex-shrink-0">{v.icon}</div>
                <div>
                  <div className="font-bold text-dark mb-1">{v.title}</div>
                  <div className="text-sm text-gray-500 leading-relaxed">{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#c8102e] text-white p-10 text-center rounded-sm">
          <h2 className="font-display text-4xl font-black mb-3">Ready to Start?</h2>
          <p className="text-red-100 mb-6">Browse our full range of premium supplements.</p>
          <Link href="/products" className="bg-white text-[#c8102e] font-black px-8 py-3.5 text-sm tracking-widest hover:bg-gray-100 transition-colors inline-block">
            SHOP NOW →
          </Link>
        </div>
      </div>
    </div>
  )
}
