import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Menu, 
  User, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  ChevronDown,
  Shield
} from 'lucide-react';
import authService from '../../services/authService.js';

const AdminHeader = ({ sidebarCollapsed }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  const notifications = [
    { id: 1, title: 'Nouvelle commande #ORD-005', time: '5 min', read: false, icon: 'ðŸ›’' },
    { id: 2, title: 'Stock faible : ProtÃ©ine Whey', time: '1 heure', read: false, icon: 'âš ï¸' },
    { id: 3, title: 'Nouvel utilisateur inscrit', time: '3 heures', read: true, icon: 'ðŸ‘¤' },
    { id: 4, title: 'Paiement reÃ§u de 145.000 Ar', time: '5 heures', read: true, icon: 'ðŸ’°' },
  ];

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set('q', value.trim());
    } else {
      nextParams.delete('q');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="bg-[#0F0F15]/80 backdrop-blur-md border-b border-white/10 px-6 py-3 sticky top-0 z-40">
      <div className="flex justify-between items-center">
        {/* Left side - Search */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-80 bg-[#1A1A24] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <div
          role="button"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-[#1A1A24] rounded-xl hover:bg-white/10 transition"
          >
            {darkMode ? <Sun className="w-5 h-5 text-gray-400" /> : <Moon className="w-5 h-5 text-gray-400" />}
          </div>

          {/* Notifications */}
          <div className="relative">
            <div
            role="button"
            cursor="pointer"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-[#1A1A24] rounded-xl hover:bg-white/10 transition"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>

            {/* Dropdown Notifications */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-[#12121A] border border-white/10 rounded-2xl shadow-2xl z-50">
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-white font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition ${!notif.read ? 'bg-[#D4AF37]/5' : ''}`}>
                      <div className="flex gap-3">
                        <div className="text-xl">{notif.icon}</div>
                        <div className="flex-1">
                          <p className="text-white text-sm">{notif.title}</p>
                          <p className="text-gray-500 text-xs mt-1">{notif.time}</p>
                        </div>
                        {!notif.read && <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2"></div>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/10 text-center">
                  <button className="text-[#D4AF37] text-sm hover:underline">Voir toutes les notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <div
            role="button"
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 bg-[#1A1A24] rounded-xl hover:bg-white/10 transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#9C7E2C] rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">AD</span>
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-white text-sm font-medium">Admin User</p>
                <p className="text-gray-500 text-xs">Super Administrateur</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
            </div>

            {/* Dropdown Profile */}
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#12121A] border border-white/10 rounded-2xl shadow-2xl z-50">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#9C7E2C] rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-lg">AD</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Admin User</p>
                      <p className="text-gray-500 text-xs">admin@fitnessforge.com</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button 
                  cursor="pointer"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-3 w-full px-4 py-2 text-gray-300 hover:bg-white/5 transition">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Mon profil</span>
                  </button>
                  <button 
                  cursor="pointer"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-3 w-full px-4 py-2 text-gray-300 hover:bg-white/5 transition">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Permissions</span>
                  </button>
                  <button 
                  cursor="pointer"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-3 w-full px-4 py-2 text-gray-300 hover:bg-white/5 transition">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">ParamÃ¨tres</span>
                  </button>
                </div>
                <div className="border-t border-white/10 p-2">
                  <div onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition">
                    <LogOut className="w-4 h-4" />
                    <button className="text-sm">Déconnexion</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
