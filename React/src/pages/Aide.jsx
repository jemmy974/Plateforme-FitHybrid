import { useState } from 'react';
import { 
  HelpCircle, MessageCircle, Phone, Mail, 
  ChevronDown, ChevronUp, FileText, Video,
  BookOpen, Shield, CreditCard, Truck,
  Clock, Users, Dumbbell, Award,
  ExternalLink, Send, Search
} from 'lucide-react';

const Aide = () => {
  const [openFaq, setOpenFaq] = useState(null);

  // FAQ
  const faqItems = [
    {
      id: 1,
      question: 'Comment créer mon compte FitnessForge ?',
      answer: 'Pour créer un compte, rendez-vous sur la page d\'inscription. Remplissez vos informations personnelles (nom, email, mot de passe), votre profil fitness (poids, objectif, niveau) et acceptez les conditions générales. Une fois inscrit, vous pourrez accéder à tous les services de la plateforme.'
    },
    {
      id: 2,
      question: 'Comment suivre un programme d\'entraînement ?',
      answer: 'Une fois connecté, allez dans la section "Programmes". Vous y trouverez des programmes adaptés à votre objectif et votre niveau. Cliquez sur "Voir" pour accéder aux détails et commencer votre entraînement. Vous pouvez marquer les exercices comme terminés pour suivre votre progression.'
    },
    {
      id: 3,
      question: 'Comment réserver un produit ?',
      answer: 'Pour réserver un produit, parcourez la boutique, sélectionnez le produit souhaité et cliquez sur "Ajouter au panier". Une fois vos produits sélectionnés, validez votre panier en remplissant les informations de livraison et en choisissant votre mode de paiement. Vous recevrez une confirmation par email.'
    },
    {
      id: 4,
      question: 'Puis-je annuler une réservation ?',
      answer: 'Oui, vous pouvez annuler une réservation depuis votre espace personnel dans la section "Mes réservations". Sélectionnez la réservation à annuler et cliquez sur "Annuler". Les produits seront remis en stock automatiquement.'
    },
    {
      id: 5,
      question: 'Comment contacter un coach ?',
      answer: 'Rendez-vous dans la section "Communauté" pour voir la liste de nos coachs. Chaque coach a une fiche avec ses spécialités et ses disponibilités. Cliquez sur "Contacter le coach" pour lui envoyer un message.'
    },
    {
      id: 6,
      question: 'Quels sont les modes de paiement acceptés ?',
      answer: 'Nous acceptons les paiements par Mobile Money (MVola, Airtel Money), carte bancaire (Visa, Mastercard) et espèces (uniquement pour les retraits en salle).'
    },
    {
      id: 7,
      question: 'Comment fonctionne la livraison ?',
      answer: 'Vous pouvez choisir entre un retrait en salle (gratuit) ou une livraison à domicile (frais de 5 000 Ar). Pour la livraison, assurez-vous de fournir une adresse complète lors de la validation de votre commande.'
    },
    {
      id: 8,
      question: 'Comment modifier mon profil ?',
      answer: 'Connectez-vous à votre compte et allez dans "Mon profil". Vous pourrez y modifier vos informations personnelles, votre photo de profil, vos objectifs fitness et votre niveau.'
    }
  ];

  // Catégories d'aide
  const categories = [
    { id: 'compte', label: '🔐 Compte & Profil', icon: Shield },
    { id: 'programmes', label: '📋 Programmes', icon: Dumbbell },
    { id: 'boutique', label: '🛒 Boutique & Réservations', icon: CreditCard },
    { id: 'coachs', label: '👨‍🏫 Coachs', icon: Award },
    { id: 'paiement', label: '💳 Paiement & Livraison', icon: Truck },
    { id: 'technique', label: '⚙️ Problèmes techniques', icon: HelpCircle }
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Centre d'aide
          </h1>
          <p className="text-gray-400 text-lg mt-3 max-w-2xl mx-auto">
            Trouvez des réponses à vos questions et contactez notre équipe si besoin.
          </p>
        </div>

        {/* Contact rapide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-[#12121A] rounded-2xl border border-white/10 p-6 text-center hover:border-[#D4AF37]/50 transition">
            <MessageCircle className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
            <h3 className="text-white font-medium">Chat en direct</h3>
            <p className="text-gray-400 text-sm">Du lundi au vendredi 8h-18h</p>
            <button className="mt-3 text-[#D4AF37] text-sm font-medium hover:underline">
              Ouvrir le chat →
            </button>
          </div>
          <div className="bg-[#12121A] rounded-2xl border border-white/10 p-6 text-center hover:border-[#D4AF37]/50 transition">
            <Phone className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
            <h3 className="text-white font-medium">Appelez-nous</h3>
            <p className="text-gray-400 text-sm">+261 32 00 000 00</p>
            <p className="text-gray-500 text-xs">Lun-Ven 8h-17h</p>
          </div>
          <div className="bg-[#12121A] rounded-2xl border border-white/10 p-6 text-center hover:border-[#D4AF37]/50 transition">
            <Mail className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
            <h3 className="text-white font-medium">Email</h3>
            <p className="text-gray-400 text-sm">support@fitnessforge.com</p>
            <p className="text-gray-500 text-xs">Réponse sous 24h</p>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
          <input
            type="text"
            placeholder="Rechercher dans l'aide..."
            className="w-full bg-[#12121A] border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
          />
        </div>

        {/* FAQ */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white mb-6">❓ Foire aux questions</h2>
          {faqItems.map((item) => (
            <div key={item.id} className="bg-[#12121A] rounded-2xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-300">
              <button
                onClick={() => toggleFaq(item.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-white font-medium">{item.question}</span>
                {openFaq === item.id ? (
                  <ChevronUp className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                )}
              </button>
              {openFaq === item.id && (
                <div className="px-5 pb-5">
                  <p className="text-gray-300 text-sm leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="mt-12 bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">📩 Vous n'avez pas trouvé votre réponse ?</h2>
          <p className="text-gray-400 text-sm mb-4">Écrivez-nous, nous vous répondrons dans les plus brefs délais.</p>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Votre nom"
                className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition"
              />
              <input
                type="email"
                placeholder="Votre email"
                className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition"
              />
            </div>
            <select className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition">
              <option value="">Sélectionnez un sujet</option>
              <option value="compte">Compte & Profil</option>
              <option value="programmes">Programmes</option>
              <option value="boutique">Boutique & Réservations</option>
              <option value="coachs">Coachs</option>
              <option value="paiement">Paiement & Livraison</option>
              <option value="autre">Autre</option>
            </select>
            <textarea
              placeholder="Votre message..."
              rows="4"
              className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition"
            />
            <button className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8940F] text-black px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300">
              <Send className="w-4 h-4" />
              Envoyer le message
            </button>
          </form>
        </div>

        {/* Liens utiles */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="#" className="text-center p-4 bg-[#12121A] rounded-xl border border-white/10 hover:border-[#D4AF37] transition group">
            <FileText className="w-6 h-6 text-[#D4AF37] mx-auto mb-2 group-hover:scale-110 transition" />
            <p className="text-gray-400 text-xs">CGU</p>
          </a>
          <a href="#" className="text-center p-4 bg-[#12121A] rounded-xl border border-white/10 hover:border-[#D4AF37] transition group">
            <Shield className="w-6 h-6 text-[#D4AF37] mx-auto mb-2 group-hover:scale-110 transition" />
            <p className="text-gray-400 text-xs">Politique<br/>confidentialité</p>
          </a>
          <a href="#" className="text-center p-4 bg-[#12121A] rounded-xl border border-white/10 hover:border-[#D4AF37] transition group">
            <BookOpen className="w-6 h-6 text-[#D4AF37] mx-auto mb-2 group-hover:scale-110 transition" />
            <p className="text-gray-400 text-xs">Guide<br/>d'utilisation</p>
          </a>
          <a href="#" className="text-center p-4 bg-[#12121A] rounded-xl border border-white/10 hover:border-[#D4AF37] transition group">
            <Video className="w-6 h-6 text-[#D4AF37] mx-auto mb-2 group-hover:scale-110 transition" />
            <p className="text-gray-400 text-xs">Tutoriels<br/>vidéo</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Aide;