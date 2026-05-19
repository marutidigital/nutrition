import { cookies } from 'next/headers'
import { ValidLanguage } from './translations'

export function getServerLanguage(): ValidLanguage {
  const cookieStore = cookies()
  const lang = cookieStore.get('NEXT_LOCALE')?.value as ValidLanguage
  return lang === 'en' ? 'en' : 'fr'
}
