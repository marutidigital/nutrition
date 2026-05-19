'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { translations } from '@/lib/i18n/translations'

const socials = [
  { label: 'fb', name: 'Facebook', href: 'https://www.facebook.com/p/NutriFit-100069395283617/' },
  { label: 'ig', name: 'Instagram', href: 'https://www.instagram.com/nutrifitness.ch/' },
  { label: 'wa', name: 'WhatsApp', href: 'https://wa.me/41792503564?text=Je%20suis%20int%C3%A9ress%C3%A9(e)%20%C3%A0%20en%20savoir%20plus%20sur%20vos%20produits' },
]

const trustIcons = ['🚚', '↩', '🛡', '💬']

export function Footer() {
  const { language } = useLanguageStore()
  const [isMounted, setIsMounted] = useState(false)
  const [openColumns, setOpenColumns] = useState<Record<string, boolean>>({})

  const toggleColumn = (title: string) => {
    setOpenColumns(prev => ({ ...prev, [title]: !prev[title] }))
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const t = isMounted ? translations[language].footer : translations.fr.footer

  return (
    <footer className="bg-white border-t-2 border-gray-border mt-12">
      {/* Trust bar */}
      <div className="bg-gray-light border-b border-gray-border py-6 px-4">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {t.trustBadges.map((badge, i) => (
            <div key={i}>
              <div className="text-3xl mb-2">{trustIcons[i]}</div>
              <div className="font-bold text-sm text-dark">{badge.title}</div>
              <div className="text-xs text-gray-500 mt-1">{badge.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-4 py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 sm:gap-10">
        {t.columns.map((col) => {
          const isOpen = openColumns[col.title]

          return (
            <div key={col.title} className="border-b-2 border-dark sm:border-0 py-4 sm:py-0">
              <button 
                onClick={() => toggleColumn(col.title)}
                className="w-full flex items-center justify-between font-black text-lg sm:text-sm sm:mb-4 tracking-wide text-dark text-left"
              >
                {col.title}
                <span className="sm:hidden text-2xl font-light leading-none">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              
              <ul className={`space-y-4 sm:space-y-2 mt-4 sm:mt-0 ${isOpen ? 'block' : 'hidden sm:block'}`}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-dark hover:text-primary transition-colors block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}

        {/* Newsletter */}
        <div className="pt-8 sm:pt-0 border-b-2 border-dark sm:border-0 pb-8 sm:pb-0">
          <h3 className="font-black text-lg sm:text-sm mb-2 tracking-wide text-dark">{t.stayConnected}</h3>
          <p className="text-sm sm:text-xs text-dark sm:text-gray-500 mb-4">{t.newsletterDesc}</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex mb-6"
          >
            <input
              type="email"
              placeholder={t.emailPlaceholder}
              className="flex-1 border-2 border-r-0 border-dark px-3 py-3 text-sm focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="bg-dark text-white px-5 py-3 text-xs font-bold tracking-wider hover:bg-gray-800 transition-colors"
            >
              {t.subscribe}
            </button>
          </form>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary text-white px-2 py-1 font-display text-xl leading-none">NF</div>
            <div className="font-display text-lg text-dark leading-none">
              NUTRI<span className="text-primary">FITNESS</span>
            </div>
          </div>

          <p className="text-sm sm:text-xs text-dark sm:text-gray-400">{t.tagline}</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-border py-6 px-4">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Socials */}
          <div className="flex gap-2">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.name}
                className="w-9 h-9 rounded-full bg-dark text-white flex items-center justify-center text-xs font-bold hover:bg-primary transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>

          {/* Legal */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {t.legal.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs text-gray-400 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} NutriFitness.ch — {t.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
