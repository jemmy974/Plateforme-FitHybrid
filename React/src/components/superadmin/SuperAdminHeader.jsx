import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
  Shield,
  Crown,
  Users,
  Building,
  Package,
  Calendar,
  Menu,
  X,
  Sparkles,
  HelpCircle,
  UserCog
} from 'lucide-react';
import authService from '../../services/authService';

const SuperAdminHeader = ({ sidebarCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const notifications = [
    { 
      id: 1, 
      title: 'Nouvelle salle inscrite', 
      description: 'FitZone vient de rejoindre la plateforme',
      time: 'Il y a 5 min', 
      read: false, 
      icon: '🏢',
      color: 'bg-blue-500/20 text-blue-400'
    },
    { 
      id: 2, 
      title: 'Abonnement expiré', 
      description: 'L\'abonnement de GymPro expire dans 3 jours',
      time: 'Il y a 1 heure', 
      read: false, 
      icon: '⚠️',
      color: 'bg-orange-500/20 text-orange-400'
    },
    { 
      id: 3, 
      title: 'Nouvel utilisateur', 
      description: '3 nouveaux clients se sont inscrits',
      time: 'Il y a 3 heures', 
      read: true, 
      icon: '👤',
      color: 'bg-emerald-500/20 text-emerald-400'
    },
    { 
      id: 4, 
      title: 'Produit signalé', 
      description: 'Un produit a été signalé comme non conforme',
      time: 'Il y a 5 heures', 
      read: true, 
      icon: '📦',
      color: 'bg-red-500/20 text-red-400'
    }
  ];

  const quickStats = [
    { label: 'Salles', value: '12', icon: Building, color: 'text-blue-400' },
    { label: 'Utilisateurs', value: '1 284', icon: Users, color: 'text-purple-400' },
    { label: 'Produits', value: '47', icon: Package, color: 'text-orange-400' },
    { label: 'Abonnements', value: '9', icon: Calendar, color: 'text-rose-400' }
  ];

  const handleLogout = () => {
    if (confirm('⚠️ Voulez-vous vraiment vous déconnecter ?')) {
      authService.logout();
      navigate('/login');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/superadmin/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-[#0F0F15]/90 backdrop-blur-md border-b border-[#D4AF37]/20 px-4 py-2 sticky top-0 z-40">
      <div className="flex justify-between items-center">
        
        {/* ===== GAUCHE ===== */}
        <div className="flex items-center gap-4">
          {/* Bouton toggle sidebar (mobile) */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </button>

          {/* Titre de la page (mobile) */}
          <div className="lg:hidden">
            <h1 className="text-sm font-bold text-white flex items-center gap-1">
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              Super Admin
            </h1>
          </div>

          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-72 bg-[#1A1A24] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </form>
        </div>

        {/* ===== CENTRE ===== */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Statistiques rapides */}
          <div className="flex items-center gap-4">
            {quickStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                <span className="text-xs text-gray-300">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== DROITE ===== */}
        <div className="flex items-center gap-2">
          
          {/* Statut Super Admin */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[10px] text-purple-400 font-medium">Super Admin</span>
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-[#1A1A24] rounded-xl hover:bg-white/10 transition"
            title={darkMode ? 'Mode clair' : 'Mode sombre'}
          >
            {darkMode ? 
              <Sun className="w-4 h-4 text-gray-400" /> : 
              <Moon className="w-4 h-4 text-gray-400" />
            }
          </button>

          {/* Aide */}
          <button onClick={() => navigate('/superadmin')} className="hidden md:flex p-2 bg-[#1A1A24] rounded-xl hover:bg-white/10 transition">
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-[#1A1A24] rounded-xl hover:bg-white/10 transition"
            >
              <Bell className="w-4 h-4 text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Notifications */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-[#12121A] border border-[#D4AF37]/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-[#D4AF37]/10 flex justify-between items-center">
                  <h3 className="text-white font-semibold text-sm">Notifications</h3>
                  <button className="text-[10px] text-[#D4AF37] hover:underline">
                    Tout marquer comme lu
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 border-b border-white/5 hover:bg-white/5 transition ${!notif.read ? 'bg-[#D4AF37]/5' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 ${notif.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <span className="text-sm">{notif.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">{notif.title}</p>
                          <p className="text-gray-400 text-xs truncate">{notif.description}</p>
                          <p className="text-gray-500 text-[10px] mt-1">{notif.time}</p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-[#D4AF37]/10 text-center">
                  <button onClick={() => navigate('/superadmin')} className="text-[#D4AF37] text-xs hover:underline">
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-1.5 bg-[#1A1A24] rounded-xl hover:bg-white/10 transition border border-[#D4AF37]/10"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#9C7E2C] rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">
                    {user?.prenom?.[0]}{user?.nom?.[0] || 'SA'}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0F0F15]"></div>
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-white text-sm font-medium">
                  {user?.prenom} {user?.nom || 'Super Admin'}
                </p>
                <p className="text-[10px] text-purple-400 flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Super Admin
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
            </button>

            {/* Dropdown Profile */}
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#12121A] border border-[#D4AF37]/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-[#D4AF37]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#9C7E2C] rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-lg">
                        {user?.prenom?.[0]}{user?.nom?.[0] || 'SA'}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {user?.prenom} {user?.nom || 'Super Admin'}
                      </p>
                      <p className="text-gray-400 text-xs">{user?.email}</p>
                      <p className="text-[10px] text-purple-400 flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Super Administrateur
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button onClick={() => navigate('/superadmin')} className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-300 hover:bg-white/5 transition text-sm">
                    <User className="w-4 h-4" />
                    Mon profil
                  </button>
                  <button onClick={() => navigate('/superadmin/users')} className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-300 hover:bg-white/5 transition text-sm">
                    <Shield className="w-4 h-4" />
                    Permissions
                  </button>
                  <button onClick={() => navigate('/superadmin/users')} className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-300 hover:bg-white/5 transition text-sm">
                    <UserCog className="w-4 h-4" />
                    Gestion des admins
                  </button>
                  <button onClick={() => navigate('/superadmin')} className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-300 hover:bg-white/5 transition text-sm">
                    <Settings className="w-4 h-4" />
                    Paramètres
                  </button>
                </div>
                <div className="border-t border-[#D4AF37]/10 p-2">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
