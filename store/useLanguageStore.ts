import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Language = 'fr' | 'en'

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'fr', // French is default
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'nutrifitness-language', // Local storage key
    }
  )
)
