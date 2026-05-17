'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bot } from 'lucide-react'

type Message = {
  role: 'user' | 'assistant'
  content: string
  products?: { name: string; slug: string; price: number }[]
}

const PRODUCT_SUGGESTIONS: Record<string, { name: string; slug: string; price: number }[]> = {
  protein: [
    { name: 'Ultimate Whey Bigman 2KG', slug: 'ultimate-whey-bigman-2kg', price: 49.9 },
    { name: 'Dirty Amino X 300G - Lemon', slug: 'dirty-amino-x-300g-lemon', price: 34.9 },
  ],
  creatine: [
    { name: 'PW Creapure Premium 250G', slug: 'pw-creapure-premium-250g', price: 29.9 },
    { name: '8M EAA 300G - Orange', slug: 'bm-eaa-300g-orange', price: 24.9 },
  ],
  energy: [
    { name: 'ABE Drink - Blue Lagoon', slug: 'abe-drink-blue-lagoon', price: 3.5 },
    { name: 'Ghost Pre-Workout 645G', slug: 'ghost-pre-workout-645g-blue-raspberry', price: 59.9 },
  ],
  weight: [
    { name: 'ZMA 90 Caps – Marvelous', slug: 'zma-90-caps', price: 24.9 },
    { name: 'Calcium 120 Tabs', slug: 'calcium-120-tabs', price: 14.9 },
  ],
  vitamin: [
    { name: 'Vitamine C Liposomale 60 Caps', slug: 'vitamine-c-liposomale-60-caps', price: 19.9 },
    { name: 'Stage Diuretique 45 Caps', slug: 'stage-diuretique-45-caps', price: 24.9 },
  ],
}

function getSuggestions(text: string) {
  const t = text.toLowerCase()
  if (t.includes('protein') || t.includes('whey') || t.includes('muscle') || t.includes('amino')) return PRODUCT_SUGGESTIONS.protein
  if (t.includes('creatine') || t.includes('strength') || t.includes('power')) return PRODUCT_SUGGESTIONS.creatine
  if (t.includes('energy') || t.includes('pre') || t.includes('workout') || t.includes('tired') || t.includes('focus')) return PRODUCT_SUGGESTIONS.energy
  if (t.includes('weight') || t.includes('fat') || t.includes('slim') || t.includes('loss')) return PRODUCT_SUGGESTIONS.weight
  if (t.includes('vitamin') || t.includes('immune') || t.includes('health') || t.includes('mineral')) return PRODUCT_SUGGESTIONS.vitamin
  return null
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'form' | 'chat'>('form')
  const [form, setForm] = useState({ name: '', email: '', city: '' })
  const [formError, setFormError] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Please enter your name and email.')
      return
    }
    setFormError('')
    setStep('chat')
    setMessages([{
      role: 'assistant',
      content: `Welcome, ${form.name}! I'm your personal NutriFitness advisor.\n\nTell me your fitness goal and I'll recommend the best supplements from our store!\n\nTry: "I want to build muscle", "Help me lose weight", "Best pre-workout", "Vitamins for energy"...`
    }])
  }

  const handleChat = async (value: string) => {
    setMessages(prev => [...prev, { role: 'user', content: value }])
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 600))

    const suggestions = getSuggestions(value)
    const t = value.toLowerCase()
    let reply = ''

    if (t.includes('hello') || t.includes('hi') || t.includes('hey')) {
      reply = `Hey ${form.name}! What fitness goal can I help you with today? I can recommend protein shakes, pre-workouts, creatine, fat burners, vitamins and more!`
    } else if (suggestions) {
      reply = `Based on your goal, here are my top picks for you:`
    } else if (t.includes('price') || t.includes('cheap') || t.includes('budget')) {
      reply = `We have products starting from CHF 3.50! Proteins start at CHF 29, creatine from CHF 19. Browse our full range for the best value.`
    } else if (t.includes('ship') || t.includes('deliver')) {
      reply = `We offer FREE shipping on orders over CHF 75! All orders ship within 24 hours from Switzerland.`
    } else if (t.includes('return') || t.includes('refund')) {
      reply = `We have a 14-day return policy for unopened, sealed products. Just contact us and we'll help you!`
    } else if (t.includes('protein') || t.includes('whey')) {
      reply = `Great choice! Protein is essential for muscle recovery and growth. Here are our best sellers:`
    } else {
      reply = `I'm here to help you find the perfect supplement, ${form.name}! Tell me your goal — muscle gain, weight loss, more energy, better recovery — and I'll point you to exactly the right products from our store.`
    }

    setMessages(prev => [...prev, { role: 'assistant', content: reply, products: suggestions ?? undefined }])
    setIsLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const val = input.trim()
    setInput('')
    handleChat(val)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-[#c8102e] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#a50d28] transition-all z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
        aria-label="Open chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
        </svg>
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-6 right-6 w-80 sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: step === 'form' ? 'auto' : '520px', maxHeight: 'calc(100vh - 48px)' }}
      >
        {/* Header */}
        <div className="p-4 bg-[#111] text-white rounded-t-2xl flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <div>
              <div className="font-bold text-sm">NutriFitness AI Advisor</div>
              <div className="text-[10px] text-gray-400">Online · Replies instantly</div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        {/* STEP 1: Lead capture form */}
        {step === 'form' && (
          <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
            <div className="text-center">
              <div className="flex justify-center mb-3"><Bot size={42} strokeWidth={1.5} className="text-dark" /></div>
              <div className="font-bold text-dark text-base">Get Personalised Advice</div>
              <div className="text-xs text-gray-500 mt-1">Fill in your details to start chatting with our AI supplement advisor</div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">Name *</label>
              <input
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#c8102e] focus:ring-1 focus:ring-[#c8102e]"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">Email *</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#c8102e] focus:ring-1 focus:ring-[#c8102e]"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">City</label>
              <input
                type="text"
                placeholder="Your city (optional)"
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#c8102e] focus:ring-1 focus:ring-[#c8102e]"
              />
            </div>

            {formError && <p className="text-xs text-[#c8102e] font-medium">{formError}</p>}

            <button
              type="submit"
              className="w-full bg-[#c8102e] text-white font-black tracking-widest py-3 text-sm hover:bg-[#a50d28] transition-colors rounded-lg uppercase"
            >
              START CHAT →
            </button>

            <p className="text-[10px] text-gray-400 text-center">
              We respect your privacy. No spam, ever.{' '}
              <Link href="/auth/login" onClick={() => setIsOpen(false)} className="text-[#c8102e] hover:underline">Already have an account?</Link>
            </p>
          </form>
        )}

        {/* STEP 2: Chat */}
        {step === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#c8102e] text-white rounded-br-sm px-4 py-2.5'
                      : 'bg-white text-dark border border-gray-200 rounded-bl-sm shadow-sm px-4 py-3'
                  }`}>
                    {msg.content.split('\n').map((line, i) => (
                      <span key={i}>{line}{i < msg.content.split('\n').length - 1 && <br/>}</span>
                    ))}
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.products.map((p) => (
                          <Link
                            key={p.slug}
                            href={`/products/${p.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:border-[#c8102e] hover:bg-red-50 transition-colors group"
                          >
                            <div>
                              <div className="text-xs font-bold text-dark group-hover:text-[#c8102e] leading-tight">{p.name.slice(0, 32)}</div>
                              <div className="text-[11px] text-gray-500">CHF {p.price.toFixed(2)}</div>
                            </div>
                            <span className="text-[#c8102e] text-lg">→</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1">
                    {[0, 150, 300].map(d => (
                      <div key={d} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white rounded-b-2xl flex gap-2 flex-shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about supplements..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#c8102e] focus:ring-1 focus:ring-[#c8102e]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-[#c8102e] text-white rounded-full flex items-center justify-center disabled:opacity-40 hover:bg-[#a50d28] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
                </svg>
              </button>
            </form>
          </>
        )}
      </div>
    </>
  )
}
