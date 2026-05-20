import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ - Foire Aux Questions | Nutrition',
  description: 'Retrouvez toutes les réponses aux questions les plus fréquentes sur nos produits, commandes, livraisons, paiements et compte client.',
}

export default function FAQPage() {
  const categories = [
    {
      title: 'Commandes & Paiement',
      questions: [
        {
          q: 'Quels modes de paiement acceptez-vous ?',
          a: 'Nous acceptons les paiements par carte de crédit (Visa, Mastercard), TWINT, PostFinance, et virement bancaire.'
        },
        {
          q: 'Puis-je modifier ou annuler ma commande ?',
          a: 'Si votre commande n’a pas encore été expédiée, vous pouvez nous contacter rapidement pour une modification ou une annulation. Une fois expédiée, nous ne pouvons plus la modifier.'
        },
        {
          q: 'Ma commande a échoué, mais mon compte a été débité. Que faire ?',
          a: 'Contactez-nous immédiatement par email avec une preuve de paiement. Nous vérifierons la transaction avec notre prestataire de paiement et régulariserons la situation au plus vite.'
        }
      ]
    },
    {
      title: 'Produits & Conseils',
      questions: [
        {
          q: 'Comment choisir les bons compléments pour mes objectifs ?',
          a: 'N’hésitez pas à utiliser notre chatbot IA interactif ou à nous contacter directement. Nous vous guiderons selon votre profil, vos objectifs (prise de masse, perte de poids, endurance, etc.) et votre niveau.'
        },
        {
          q: 'Vos produits sont-ils sûrs et certifiés ?',
          a: 'Oui. Tous nos produits proviennent de marques reconnues et respectent scrupuleusement les normes de sécurité alimentaire suisses et européennes.'
        },
        {
          q: 'Puis-je prendre des compléments si je débute le sport ?',
          a: 'Oui, à condition de choisir les bons produits. Nous recommandons toujours une alimentation équilibrée en complément d’une supplémentation adaptée.'
        }
      ]
    },
    {
      title: 'Livraison & Retours',
      questions: [
        {
          q: 'Livrez-vous dans toute la Suisse ?',
          a: 'Oui, nous livrons absolument partout en Suisse via La Poste, directement depuis notre boutique en Suisse.'
        },
        {
          q: 'Quels sont les délais de livraison ?',
          a: 'L\'expédition se fait sous 24h à 48h. La livraison standard prend ensuite entre 1 à 3 jours ouvrables. Vous recevrez un numéro de suivi dès l’expédition.'
        },
        {
          q: 'Puis-je retourner un produit ?',
          a: 'Oui, vous avez 14 jours pour nous retourner un produit non ouvert, scellé et en parfait état. Veuillez nous contacter obligatoirement par email avant tout retour.'
        },
        {
          q: 'Qui prend en charge les frais de retour ?',
          a: 'Les frais de retour sont à la charge exclusive du client, sauf en cas d\'erreur de notre part lors de la préparation de la commande ou de produit défectueux.'
        }
      ]
    },
    {
      title: 'Facturation & Compte client',
      questions: [
        {
          q: 'Comment obtenir ma facture ?',
          a: 'Vous recevrez automatiquement une facture au format PDF par e-mail après chaque commande. Vous pouvez également la retrouver et la télécharger dans votre espace client.'
        },
        {
          q: 'Je n’arrive pas à me connecter à mon compte. Que faire ?',
          a: 'Vérifiez votre adresse e-mail ou utilisez le lien "Mot de passe oublié" pour réinitialiser vos identifiants. Si le problème persiste, contactez notre support client.'
        }
      ]
    }
  ]

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#111] text-white py-14 px-4 text-center">
        <h1 className="font-display text-5xl font-black tracking-wide">FAQ — <span className="text-[#c8102e]">QUESTIONS</span></h1>
        <p className="text-gray-400 mt-2">Découvrez les réponses aux questions les plus fréquentes.</p>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-12 space-y-12">
        <p className="text-gray-600 text-sm leading-relaxed text-center">
          Chez Nutrition, nous tenons à vous offrir une expérience simple, claire et sans stress. 
          Prenez un moment pour parcourir cette page : la réponse à votre question s’y trouve probablement déjà. 
          Et si ce n’est pas le cas, notre équipe se fera un plaisir de vous aider via notre{' '}
          <Link href="/contact" className="text-[#c8102e] font-bold hover:underline">page de contact</Link>.
        </p>

        {categories.map(category => (
          <div key={category.title} className="space-y-4">
            <h2 className="font-display text-2xl text-dark pb-2 border-b-2 border-[#c8102e] inline-block">
              {category.title}
            </h2>
            <div className="space-y-3">
              {category.questions.map((item, idx) => (
                <div key={idx} className="border border-gray-150 rounded-sm p-5 bg-gray-50/20">
                  <h3 className="font-bold text-dark text-sm mb-2 flex items-start gap-2">
                    <span className="text-[#c8102e] font-black">Q:</span>
                    {item.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed pl-5">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-[#111] text-white p-8 rounded-sm text-center space-y-3">
          <h2 className="font-display text-2xl font-bold tracking-wide">Vous n’avez pas trouvé de réponse ?</h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Notre service client est à votre disposition durant les horaires d'ouverture de notre magasin physique.
          </p>
          <div className="pt-2 flex justify-center gap-4 flex-wrap">
            <Link href="/contact" className="bg-[#c8102e] text-white font-black px-6 py-3 text-xs tracking-widest hover:bg-[#a50d28] transition-colors uppercase">
              NOUS CONTACTER
            </Link>
            <a href="tel:+41210000000" className="bg-white/10 text-white font-black px-6 py-3 text-xs tracking-widest hover:bg-white/20 transition-colors uppercase">
              +41 21 000 00 00
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
