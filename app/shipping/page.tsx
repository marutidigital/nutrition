import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping Information | NutriFitness.ch',
  description: 'NutriFitness shipping rates, delivery times, and policies.',
}

export default function ShippingPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#111] text-white py-14 px-4 text-center">
        <h1 className="font-display text-5xl font-black tracking-wide">SHIPPING <span className="text-[#c8102e]">INFO</span></h1>
        <p className="text-gray-400 mt-2">Fast, reliable delivery across Switzerland and Europe.</p>
      </div>
      <div className="max-w-[800px] mx-auto px-4 py-12 space-y-10">
        {[
          {
            title: 'Shipping Rates',
            content: [
              { label: 'Standard (Switzerland)', value: 'CHF 5.90' },
              { label: 'Free Shipping (Switzerland)', value: 'Orders over CHF 79' },
              { label: 'Europe', value: 'CHF 12.90' },
            ]
          },
          {
            title: 'Delivery Times',
            content: [
              { label: 'Switzerland', value: '1–2 business days' },
              { label: 'EU Countries', value: '3–7 business days' },
              { label: 'Rest of World', value: '7–14 business days' },
            ]
          },
          {
            title: 'Order Processing',
            content: [
              { label: 'Cut-off time', value: '2:00 PM CET, Mon–Fri' },
              { label: 'Weekend orders', value: 'Dispatched on Monday' },
              { label: 'Tracking', value: 'Tracking link sent by email' },
            ]
          },
        ].map(section => (
          <div key={section.title}>
            <h2 className="font-display text-2xl text-dark mb-4 pb-2 border-b-2 border-[#c8102e] inline-block">{section.title}</h2>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-sm">
              {section.content.map(row => (
                <div key={row.label} className="flex justify-between items-center px-5 py-4">
                  <span className="text-sm text-gray-600 font-medium">{row.label}</span>
                  <span className="text-sm font-black text-dark">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-gray-50 border border-gray-100 p-6 rounded-sm">
          <h2 className="font-bold text-dark mb-2">Important Notes</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• All orders are shipped from our warehouse in Switzerland.</li>
            <li>• Customs duties may apply for international orders.</li>
            <li>• We are not responsible for delays caused by customs or postal services.</li>
            <li>• For lost or damaged shipments, please contact us within 7 days of the expected delivery date.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
