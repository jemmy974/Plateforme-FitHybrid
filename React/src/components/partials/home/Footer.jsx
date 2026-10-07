import { Link } from 'react-router-dom';
import { 
  Dumbbell, Heart, Mail, Phone, MapPin, 
  Send, Shield, Award, Users, ShoppingBag,
  HelpCircle, FileText, Clock
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Liens rapides
  const quickLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Boutique', path: '/boutique' },
    { name: 'Programmes', path: '/programmes' },
    { name: 'Communauté', path: '/communautes' },
    { name: 'Aide', path: '/aide' }
  ];

  // Liens utiles
  const usefulLinks = [
    { name: 'Conditions générales', path: '/cgv' },
    { name: 'Politique de confidentialité', path: '/confidentialite' },
    { name: 'Mentions légales', path: '/mentions-legales' },
    { name: 'FAQ', path: '/aide' }
  ];

  // Contact
  const contact = {
    email: 'support@fitnessforge.com',
    phone: '+261 32 00 000 00',
    address: 'Antananarivo, Analamanga, Madagascar'
  };

  return (
    <footer className="bg-gradient-to-b from-[#0A0A0F] to-[#0F0F15] border-t border-white/5">
      
      {/* ===== MAIN FOOTER ===== */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ===== COLONNE 1 : LOGO & DESCRIPTION ===== */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8940F] rounded-xl flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Fitness<span className="text-[#D4AF37]">Forge</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Votre plateforme fitness complète pour atteindre vos objectifs. 
              Coaching, programmes personnalisés et communauté passionnée.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-[#1A1A24] rounded-lg text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-[#1A1A24] rounded-lg text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-[#1A1A24] rounded-lg text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300">
                <FaYoutube className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-[#1A1A24] rounded-lg text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300">
                <FaTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* ===== COLONNE 2 : LIENS RAPIDES ===== */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-300 text-sm flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#D4AF37]/50"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== COLONNE 3 : LIENS UTILES ===== */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Informations</h3>
            <ul className="space-y-3">
              {usefulLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-300 text-sm flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#D4AF37]/50"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== COLONNE 4 : CONTACT & NEWSLETTER ===== */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <a href={`mailto:${contact.email}`} className="hover:text-[#D4AF37] transition">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <a href={`tel:${contact.phone}`} className="hover:text-[#D4AF37] transition">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>Lun-Ven 8h-18h</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-gray-400 text-sm mb-3">📬 Newsletter</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 bg-[#1A1A24] border border-white/10 rounded-l-xl px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] text-sm"
                />
                <button className="bg-gradient-to-r from-[#D4AF37] to-[#B8940F] text-black px-4 py-2.5 rounded-r-xl hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="text-gray-500 text-xs flex items-center gap-2">
              <span>© {currentYear} FitnessForge.</span>
              <span className="hidden sm:inline">Tous droits réservés.</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <Link to="/cgv" className="text-gray-500 hover:text-[#D4AF37] transition">
                CGV
              </Link>
              <span className="text-gray-600">|</span>
              <Link to="/confidentialite" className="text-gray-500 hover:text-[#D4AF37] transition">
                Confidentialité
              </Link>
              <span className="text-gray-600">|</span>
              <Link to="/mentions-legales" className="text-gray-500 hover:text-[#D4AF37] transition">
                Mentions légales
              </Link>
              <span className="text-gray-600">|</span>
              <span className="text-gray-600 flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-500" />
                <span className="text-gray-500">Made with passion</span>
              </span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;