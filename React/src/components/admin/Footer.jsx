const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F0F15]/80 backdrop-blur-sm border-t border-white/10 px-6 py-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="text-gray-500 text-xs">
          © {currentYear} FitnessForge. Tous droits réservés.
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-gray-500 text-xs hover:text-[#D4AF37] transition">À propos</a>
          <a href="#" className="text-gray-500 text-xs hover:text-[#D4AF37] transition">Support</a>
          <a href="#" className="text-gray-500 text-xs hover:text-[#D4AF37] transition">Politique de confidentialité</a>
          <a href="#" className="text-gray-500 text-xs hover:text-[#D4AF37] transition">CGU</a>
        </div>
        <div className="text-gray-500 text-xs">
          Version 2.0.0
        </div>
      </div>
    </footer>
  );
};

export default Footer;