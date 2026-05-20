import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Livraison & Expédition | Nutrition',
  description: 'Informations de livraison rapides pour la Suisse. Expédition sous 24/48h et livraison offerte dès CHF 75.',
}

export default function ShippingPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#111] text-white py-14 px-4 text-center">
        <h1 className="font-display text-5xl font-black tracking-wide">EXPÉDITION & <span className="text-[#c8102e]">LIVRAISON</span></h1>
        <p className="text-gray-400 mt-2">Livraison rapide partout en Suisse par La Poste.</p>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-12 space-y-10">
        {[
          {
            title: 'Tarifs de Livraison',
            content: [
              { label: 'Livraison standard en Suisse (La Poste)', value: 'CHF 5.90' },
              { label: 'Livraison gratuite en Suisse', value: 'Dès CHF 75 d’achat' },
              { label: 'Livraison en Europe', value: 'CHF 12.90' },
            ]
          },
          {
            title: 'Délais de Livraison',
            content: [
              { label: 'Expédition des commandes', value: 'Sous 24h à 48h ouvrables' },
              { label: 'Délai d’acheminement (Suisse)', value: '1 à 3 jours ouvrables' },
              { label: 'Délai d’acheminement (Europe)', value: '3 à 7 jours ouvrables' },
            ]
          },
          {
            title: 'Modes de Paiement Sécurisés',
            content: [
              { label: 'TWINT / PostFinance', value: 'Paiement instantané mobile' },
              { label: 'Cartes de crédit', value: 'Visa, Mastercard (SSL & 3D Secure)' },
              { label: 'Virement bancaire', value: 'Traitement à réception des fonds' },
            ]
          },
        ].map(section => (
          <div key={section.title}>
            <h2 className="font-display text-2xl text-dark mb-4 pb-2 border-b-2 border-[#c8102e] inline-block">{section.title}</h2>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-sm bg-gray-50/20">
              {section.content.map(row => (
                <div key={row.label} className="flex justify-between items-center px-5 py-4 flex-wrap gap-2">
                  <span className="text-sm text-gray-600 font-medium">{row.label}</span>
                  <span className="text-sm font-black text-dark">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-gray-50 border border-gray-100 p-6 rounded-sm space-y-2">
          <h2 className="font-bold text-dark mb-2">Informations Importantes</h2>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
            <li>• Toutes nos commandes sont emballées avec soin et expédiées directement depuis notre boutique en Suisse.</li>
            <li>• Dès l’expédition de votre commande, vous recevrez automatiquement un numéro de suivi par e-mail.</li>
            <li>• Si votre commande n’a pas encore été expédiée, vous pouvez nous contacter pour une modification ou une annulation. Une fois remise au transporteur, aucune modification n’est possible.</li>
            <li>• En cas d’absence lors de la livraison, votre colis sera déposé dans votre boîte aux lettres ou à l’office de poste le plus proche.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
