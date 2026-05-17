'use client'

import Link from 'next/link'

const footerColumns = [
  {
    title: 'Aide & Support',
    links: [
      { label: 'Suivi de commande',   href: '/track-order' },
      { label: 'Contactez-nous',    href: '/contact' },
      { label: 'Livraison & Expédition', href: '/shipping' },
      { label: 'Politique de retour', href: '/returns' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Boutique',
    links: [
      { label: 'Tous les produits',  href: '/products' },
      { label: 'Protéines',       href: '/products?category=Proteins' },
      { label: 'Pré-Workout',   href: '/products?category=Pre Workout' },
      { label: 'Créatine',      href: '/products?category=CREATINE' },
      { label: 'Nouveautés',  href: '/products?new=true' },
    ],
  },
  {
    title: 'Entreprise',
    links: [
      { label: 'À propos', href: '/about' },
      { label: 'Blog',     href: '/blog' },
      { label: 'Contact',  href: '/contact' },
    ],
  },
]

const socials = [
  { label: 'fb', name: 'Facebook', href: 'https://www.facebook.com/p/NutriFit-100069395283617/' },
  { label: 'ig', name: 'Instagram', href: 'https://www.instagram.com/nutrifitness.ch/' },
  { label: 'wa', name: 'WhatsApp', href: 'https://wa.me/41792503564?text=Je%20suis%20int%C3%A9ress%C3%A9(e)%20%C3%A0%20en%20savoir%20plus%20sur%20vos%20produits' },
]

export function Footer() {
  return (
    <footer className="bg-white border-t-2 border-gray-border mt-12">
      {/* Trust bar */}
      <div className="bg-gray-light border-b border-gray-border py-6 px-4">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🚚', title: 'Livraison Gratuite', sub: 'Dès CHF 75 d’achat' },
            { icon: '↩', title: 'Retours sous 14 jours', sub: 'Produits non ouverts' },
            { icon: '🛡', title: 'Qualité Suisse', sub: 'Certifiée & premium' },
            { icon: '💬', title: 'Support Expert', sub: '+41 79 250 35 64' },
          ].map(({ icon, title, sub }) => (
            <div key={title}>
              <div className="text-3xl mb-2">{icon}</div>
              <div className="font-bold text-sm text-dark">{title}</div>
              <div className="text-xs text-gray-500 mt-1">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {footerColumns.map((col) => (
          <div key={col.title}>
            <h3 className="font-bold text-sm mb-4 tracking-wide text-dark">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        <div>
          <h3 className="font-bold text-sm mb-2 tracking-wide text-dark">RESTEZ CONNECTÉ</h3>
          <p className="text-xs text-gray-500 mb-4">Recevez nos offres exclusives en vous inscrivant.</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex mb-6"
          >
            <input
              type="email"
              placeholder="Votre e-mail"
              className="flex-1 border border-r-0 border-gray-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="bg-dark text-white px-4 py-2.5 text-xs font-bold tracking-wider hover:bg-dark-2 transition-colors"
            >
              REJOINDRE
            </button>
          </form>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-primary text-white px-2 py-1 font-display text-xl leading-none">NF</div>
            <div className="font-display text-lg text-dark leading-none">
              NUTRI<span className="text-primary">FITNESS</span>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Compléments alimentaires premium pour sportifs exigeants.
          </p>
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
            {[
              { label: 'CGV', href: '/shipping' },
              { label: 'Confidentialité', href: '/returns' }
            ].map((item) => (
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
            © {new Date().getFullYear()} NutriFitness.ch — Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
