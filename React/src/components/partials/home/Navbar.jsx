import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, ShoppingBag, Dumbbell, Users, HelpCircle, 
  LogIn, UserPlus, LogOut, User, Settings, 
  Shield, Menu, X, ChevronDown
} from 'lucide-react';
import authService from '../../../services/authService.js';
import logo from '../../../assets/Logo.png'

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isAuthenticated = authService.isAuthenticated();
  const userRole = user?.role || 'client';

  // Menu items
  const menuItems = [
    { path: '/', label: 'Accueil', icon: Home },
    { path: '/boutique', label: 'Boutique', icon: ShoppingBag },
    { path: '/exo', label: 'Programmes', icon: Dumbbell },
    { path: '/communautes', label: 'Communautés', icon: Users },
    { path: '/aide', label: 'Aide', icon: HelpCircle },
  ];

  return (
    <nav className="bg-gradient-to-r from-[#0A0A0F] to-[#12121A] border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* ===== LOGO ===== */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8940F] rounded-xl flex items-center justify-center">
              {/* <Dumbbell className="w-6 h-6 text-black" /> */}
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Fit<span className="text-[#D4AF37]">Hybrid</span>
            </span>
          </Link>

          {/* ===== MENU DESKTOP ===== */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 text-sm font-medium"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* ===== ACTIONS DESKTOP ===== */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              // ✅ Utilisateur connecté
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {user?.prenom || user?.nom || 'Mon compte'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#12121A] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                    <Link
                      to="/profil"
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/5 hover:text-white transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Mon profil
                    </Link>
                    <Link
                      to="/mes-commandes"
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/5 hover:text-white transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Mes commandes
                    </Link>
                    
                    {/* Admin / Super Admin */}
                    {(userRole === 'admin' || userRole === 'super_admin') && (
                      <Link
                        to={userRole === 'super_admin' ? '/superadmin' : '/dashboard'}
                        className="flex items-center gap-3 px-4 py-2.5 text-[#D4AF37] hover:bg-white/5 transition"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Shield className="w-4 h-4" />
                        Administration
                      </Link>
                    )}

                    {/* Coach */}
                    {userRole === 'coach' && (
                      <Link
                        to="/coach/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-emerald-400 hover:bg-white/5 transition"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Users className="w-4 h-4" />
                        Dashboard Coach
                      </Link>
                    )}

                    <hr className="border-white/10 my-1" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // ❌ Utilisateur non connecté
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 text-sm font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  Connexion
                </Link>
                <Link
                  to="/inscrire"
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8940F] text-black rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  Rejoindre
                </Link>
              </>
            )}
          </div>

          {/* ===== BOUTON MENU MOBILE ===== */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ===== MENU MOBILE ===== */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-4 space-y-2 bg-[#0F0F15] border-t border-white/5">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}

          <hr className="border-white/10 my-2" />

          {isAuthenticated ? (
            // ✅ Connecté en mobile
            <>
              <Link
                to="/profil"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-5 h-5" />
                Mon profil
              </Link>
              
              {(userRole === 'admin' || userRole === 'super_admin') && (
                <Link
                  to={userRole === 'super_admin' ? '/superadmin' : '/dashboard'}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#D4AF37] hover:bg-white/5 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <Shield className="w-5 h-5" />
                  Administration
                </Link>
              )}

              {userRole === 'coach' && (
                <Link
                  to="/coach/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-400 hover:bg-white/5 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <Users className="w-5 h-5" />
                  Dashboard Coach
                </Link>
              )}

              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </>
          ) : (
            // ❌ Non connecté en mobile
            <>
              <Link
                to="/login"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="w-5 h-5" />
                Connexion
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8940F] text-black font-semibold hover:shadow-lg transition"
                onClick={() => setIsOpen(false)}
              >
                <UserPlus className="w-5 h-5" />
                Rejoindre
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
