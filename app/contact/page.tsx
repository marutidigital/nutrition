import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | NutriFitness.ch',
  description: 'Get in touch with the NutriFitness team.',
}

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#111] text-white py-14 px-4 text-center">
        <h1 className="font-display text-5xl font-black tracking-wide">CONTACT <span className="text-[#c8102e]">US</span></h1>
        <p className="text-gray-400 mt-2">We typically reply within 24 hours.</p>
      </div>
      <div className="max-w-[900px] mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div>
            <div className="text-xs font-black tracking-widest text-[#c8102e] uppercase mb-4">Get In Touch</div>
            <div className="space-y-4">
              {[
                { icon: '📧', label: 'Email', value: 'support@nutrifitness.ch' },
                { icon: '📞', label: 'Phone', value: '+41 (0) 44 000 00 00' },
                { icon: '📍', label: 'Address', value: 'Zurich, Switzerland' },
                { icon: '🕐', label: 'Hours', value: 'Mon–Fri: 9am – 6pm CET' },
              ].map(item => (
                <div key={item.label} className="flex gap-3 items-start">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</div>
                    <div className="text-sm font-semibold text-dark">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form className="space-y-4">
          <div className="text-xs font-black tracking-widest text-[#c8102e] uppercase mb-4">Send a Message</div>
          {[
            { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
            { name: 'subject', label: 'Subject', type: 'text', placeholder: 'How can we help?' },
          ].map(f => (
            <div key={f.name}>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#c8102e] rounded-sm" />
            </div>
          ))}
          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">Message</label>
            <textarea rows={5} placeholder="Your message..." className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#c8102e] rounded-sm resize-none" />
          </div>
          <button type="submit" className="w-full bg-[#c8102e] text-white font-black tracking-widest py-3.5 text-sm hover:bg-[#a50d28] transition-colors uppercase">
            SEND MESSAGE
          </button>
        </form>
      </div>
    </div>
  )
}
