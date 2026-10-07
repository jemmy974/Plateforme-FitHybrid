import { useState } from 'react';
import { 
  Users, Award, Star, MessageCircle, Heart, 
  Share2,
  MapPin, CheckCircle, Dumbbell, Flame,
  TrendingUp, Target, Clock, Calendar
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Communautes = () => {
  const [activeTab, setActiveTab] = useState('coachs');

  // Données des coachs
  const coachs = [
    {
      id: 1,
      nom: 'Jean Rakoto',
      specialite: 'Prise de masse & Nutrition',
      experience: '8 ans',
      clients: 156,
      note: 4.9,
      avis: 234,
      image: null,
      bio: 'Ancien compétiteur de bodybuilding, je vous aide à atteindre vos objectifs de prise de masse avec des programmes personnalisés.',
      disponibilite: 'Disponible',
      certifications: ['Certifié NASM', 'Nutritionniste sportif']
    },
    {
      id: 2,
      nom: 'Marie Rabe',
      specialite: 'Perte de poids & Cardio',
      experience: '5 ans',
      clients: 98,
      note: 4.8,
      avis: 187,
      image: null,
      bio: 'Passionnée de running et de nutrition, je vous accompagne dans votre perte de poids avec des méthodes douces et efficaces.',
      disponibilite: 'Complet',
      certifications: ['Coach sportif diplômé', 'Spécialiste en nutrition']
    },
    {
      id: 3,
      nom: 'Tiana Ravelo',
      specialite: 'CrossFit & Performance',
      experience: '10 ans',
      clients: 203,
      note: 4.7,
      avis: 312,
      image: null,
      bio: 'Ancien athlète de haut niveau, je vous prépare aux compétitions et vous aide à repousser vos limites.',
      disponibilite: 'Disponible',
      certifications: ['CrossFit Level 2', 'Préparateur physique']
    },
    {
      id: 4,
      nom: 'Hery Andria',
      specialite: 'Yoga & Bien-être',
      experience: '6 ans',
      clients: 78,
      note: 4.9,
      avis: 156,
      image: null,
      bio: 'Professeure de yoga certifiée, je vous guide vers un équilibre entre corps et esprit pour une transformation globale.',
      disponibilite: 'Disponible',
      certifications: ['Yoga Alliance RYT 200', 'Méditation pleine conscience']
    },
    {
      id: 5,
      nom: 'Faly Rakoto',
      specialite: 'Musculation & Force',
      experience: '12 ans',
      clients: 245,
      note: 4.9,
      avis: 401,
      image: null,
      bio: 'Spécialiste de la musculation et de la force, je vous aide à développer votre puissance et votre masse musculaire.',
      disponibilite: 'Disponible',
      certifications: ['Coach sportif', 'Préparateur physique']
    },
    {
      id: 6,
      nom: 'Mia Raso',
      specialite: 'Rééducation & Mobilité',
      experience: '4 ans',
      clients: 67,
      note: 4.6,
      avis: 89,
      image: null,
      bio: 'Kinésithérapeute de formation, je vous aide à prévenir les blessures et à améliorer votre mobilité.',
      disponibilite: 'Complet',
      certifications: ['Kinésithérapeute', 'Spécialiste en mobilité']
    }
  ];

  // Témoignages
  const temoignages = [
    {
      id: 1,
      nom: 'Rakoto Jean',
      avatar: null,
      message: 'Grâce à Jean Rakoto, j\'ai pris 8kg de muscle en 6 mois ! Un coach exceptionnel.',
      note: 5,
      date: '12/06/2026'
    },
    {
      id: 2,
      nom: 'Rabe Andry',
      avatar: null,
      message: 'Marie Rabe m\'a aidé à perdre 15kg en 4 mois. Je me sens mieux que jamais !',
      note: 5,
      date: '05/06/2026'
    },
    {
      id: 3,
      nom: 'Ravelo Tiana',
      avatar: null,
      message: 'Les séances avec Tiana Ravelo sont intenses mais tellement satisfaisantes. Je recommande !',
      note: 4,
      date: '28/05/2026'
    }
  ];

  // Événements
  const evenements = [
    {
      id: 1,
      titre: 'Challenge Prise de Masse',
      date: '15 Juillet 2026',
      participants: 45,
      image: null,
      description: 'Un défi de 8 semaines pour transformer votre corps.'
    },
    {
      id: 2,
      titre: 'Atelier Nutrition',
      date: '22 Juillet 2026',
      participants: 28,
      image: null,
      description: 'Apprenez à manger pour vos objectifs fitness.'
    },
    {
      id: 3,
      titre: 'Compétition CrossFit',
      date: '5 Août 2026',
      participants: 32,
      image: null,
      description: 'Venez vous mesurer aux meilleurs athlètes de la région.'
    }
  ];

  // ===== RENDU =====
  return (
    <div className="min-h-screen bg-[#0A0A0F] py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            🌟 Communauté FitnessForge
          </h1>
          <p className="text-gray-400 text-lg mt-3 max-w-2xl mx-auto">
            Rejoignez une communauté de passionnés de fitness, échangez avec nos coachs experts et progressez ensemble.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {[
            { id: 'coachs', label: '👨‍🏫 Nos Coachs' },
            { id: 'temoignages', label: '💬 Témoignages' },
            { id: 'evenements', label: '📅 Événements' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                  : 'bg-[#12121A] text-gray-400 border border-white/10 hover:text-white hover:border-[#D4AF37]/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== SECTION COACHS ===== */}
        {activeTab === 'coachs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coachs.map((coach) => (
              <div key={coach.id} className="group bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/50 hover:-translate-y-2 transition-all duration-500">
                
                {/* En-tête coach */}
                <div className="relative p-6 pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border-2 border-[#D4AF37]/50 flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl text-[#D4AF37] font-bold">
                        {coach.nom.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg">{coach.nom}</h3>
                      <p className="text-[#D4AF37] text-sm">{coach.specialite}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-500 text-sm">★</span>
                        <span className="text-white text-sm font-medium">{coach.note}</span>
                        <span className="text-gray-400 text-xs">({coach.avis} avis)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Infos */}
                <div className="p-6 pt-4">
                  <p className="text-gray-300 text-sm line-clamp-2">{coach.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {coach.certifications.map((cert, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {coach.clients} clients
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {coach.experience}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      coach.disponibilite === 'Disponible'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {coach.disponibilite}
                    </span>
                  </div>

                  <button className="w-full mt-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-xl text-[#D4AF37] text-sm font-medium hover:bg-[#D4AF37] hover:text-black transition-all duration-300">
                    <MessageCircle className="w-4 h-4 inline mr-1" />
                    Contacter le coach
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== SECTION TÉMOIGNAGES ===== */}
        {activeTab === 'temoignages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {temoignages.map((t) => (
              <div key={t.id} className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 p-6 hover:border-[#D4AF37]/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                    <span className="text-[#D4AF37] font-bold">
                      {t.nom.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{t.nom}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < t.note ? 'fill-yellow-500 text-yellow-500' : 'fill-gray-600 text-gray-600'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{t.message}</p>
                <p className="text-gray-500 text-xs mt-3">{t.date}</p>
              </div>
            ))}
          </div>
        )}

        {/* ===== SECTION ÉVÉNEMENTS ===== */}
        {activeTab === 'evenements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {evenements.map((e) => (
              <div key={e.id} className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 p-6 hover:border-[#D4AF37]/50 transition-all duration-300">
                <div className="w-full h-32 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="w-12 h-12 text-[#D4AF37]/30" />
                </div>
                <h3 className="text-white font-semibold text-lg">{e.titre}</h3>
                <p className="text-gray-400 text-sm mt-1">{e.description}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {e.date}
                  </span>
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {e.participants} participants
                  </span>
                </div>
                <button className="w-full mt-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-xl text-[#D4AF37] text-sm font-medium hover:bg-[#D4AF37] hover:text-black transition-all duration-300">
                  Participer
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Section réseau sociaux */}
        <div className="mt-16 text-center">
          <h3 className="text-white font-semibold text-xl mb-4">📱 Suivez-nous</h3>
          <div className="flex justify-center gap-6">
            <a href="#" className="p-3 bg-[#12121A] rounded-xl border border-white/10 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300">
              <FaInstagram className="w-6 h-6" />
            </a>
            <a href="#" className="p-3 bg-[#12121A] rounded-xl border border-white/10 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300">
              <FaFacebook className="w-6 h-6" />
            </a>
            <a href="#" className="p-3 bg-[#12121A] rounded-xl border border-white/10 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300">
              <FaYoutube className="w-6 h-6" />
            </a>
            <a href="#" className="p-3 bg-[#12121A] rounded-xl border border-white/10 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300">
              <FaTwitter className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communautes;