import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Return Policy | NutriFitness.ch',
  description: 'NutriFitness 30-day hassle-free return policy.',
}

export default function ReturnsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#111] text-white py-14 px-4 text-center">
        <h1 className="font-display text-5xl font-black tracking-wide">RETURN <span className="text-[#c8102e]">POLICY</span></h1>
        <p className="text-gray-400 mt-2">30-day hassle-free returns. No questions asked.</p>
      </div>
      <div className="max-w-[800px] mx-auto px-4 py-12 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: '📦', title: '30 Days', sub: 'Return window from delivery' },
            { icon: '💰', title: 'Full Refund', sub: 'Original payment method' },
            { icon: '📧', title: 'Easy Process', sub: 'Just email us to start' },
          ].map(item => (
            <div key={item.title} className="text-center border border-gray-100 p-6 rounded-sm">
              <div className="text-4xl mb-2">{item.icon}</div>
              <div className="font-black text-dark text-xl">{item.title}</div>
              <div className="text-xs text-gray-500 mt-1">{item.sub}</div>
            </div>
          ))}
        </div>

        {[
          { title: 'Eligibility', body: 'Items must be returned within 30 days of delivery. Products must be unused, unopened, and in original packaging. Opened supplements cannot be returned for health and safety reasons unless they are defective.' },
          { title: 'How to Return', body: '1. Email us at returns@nutrifitness.ch with your order number.\n2. We\'ll send you a prepaid return label within 24 hours.\n3. Pack the item securely and drop it at any post office.\n4. Your refund will be processed within 5–7 business days of receiving the return.' },
          { title: 'Defective or Damaged Items', body: 'If you received a damaged or defective product, we\'ll replace it or issue a full refund immediately. Just email us a photo of the damage within 7 days of delivery.' },
          { title: 'Refund Timeline', body: 'Refunds are processed within 5–7 business days after we receive your return. The money will appear in your account within 3–5 business days depending on your bank.' },
        ].map(section => (
          <div key={section.title} className="border-b border-gray-100 pb-6">
            <h2 className="font-display text-xl text-dark font-black mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#c8102e] rounded-full flex items-center justify-center text-white text-[10px]">→</span>
              {section.title}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{section.body}</p>
          </div>
        ))}

        <div className="bg-[#c8102e] text-white p-6 rounded-sm text-center">
          <div className="font-bold mb-1">Need to Return Something?</div>
          <div className="text-sm text-red-100 mb-3">Contact our support team and we'll take care of you.</div>
          <a href="mailto:returns@nutrifitness.ch" className="bg-white text-[#c8102e] font-black px-6 py-2.5 text-sm inline-block hover:bg-gray-100 transition-colors">
            EMAIL US →
          </a>
        </div>
      </div>
    </div>
  )
}
