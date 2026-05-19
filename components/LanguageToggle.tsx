'use client'

import { useLanguageStore } from '@/store/useLanguageStore'
import { useState, useRef, useEffect } from 'react'

const FLAG_FR = '🇫🇷'
const FLAG_EN = '🇬🇧'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentFlag = isMounted ? (language === 'fr' ? FLAG_FR : FLAG_EN) : FLAG_FR
  const currentLabel = isMounted ? (language === 'fr' ? 'FR' : 'EN') : 'FR'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-gray-200 hover:border-[#c8102e] bg-white transition-all duration-200 group"
        title="Changer de langue / Change language"
        aria-label="Language selector"
      >
        <span className="text-base leading-none">{currentFlag}</span>
        <span className="text-xs font-black tracking-wider text-dark group-hover:text-[#c8102e] transition-colors">
          {currentLabel}
        </span>
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={() => { setLanguage('fr'); setIsOpen(false) }}
            className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
              language === 'fr'
                ? 'bg-red-50 text-[#c8102e] font-bold'
                : 'text-gray-700 hover:bg-gray-50 font-medium'
            }`}
          >
            <span className="text-base">{FLAG_FR}</span>
            <span className="tracking-wide">Français</span>
            {language === 'fr' && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c8102e]" />
            )}
          </button>
          <div className="border-t border-gray-100" />
          <button
            onClick={() => { setLanguage('en'); setIsOpen(false) }}
            className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
              language === 'en'
                ? 'bg-red-50 text-[#c8102e] font-bold'
                : 'text-gray-700 hover:bg-gray-50 font-medium'
            }`}
          >
            <span className="text-base">{FLAG_EN}</span>
            <span className="tracking-wide">English</span>
            {language === 'en' && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c8102e]" />
            )}
          </button>
        </div>
      )}
    </div>
  )
}
