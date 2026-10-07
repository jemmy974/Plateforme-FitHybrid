import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  Package, 
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Dumbbell,
  ShoppingBag,
  TrendingUp,
  UserCog,
  Crown,
  BarChart3,
  HelpCircle,
  Bell
} from 'lucide-react';
import authService from '../../services/authService';
import logo from '../../assets/Logo.png'

const SuperAdminSidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const menuItems = [
    { 
      path: '/superadmin', 
      icon: LayoutDashboard, 
      label: 'Tableau de bord',
      badge: null,
      color: 'text-emerald-400'
    },
    { 
      path: '/superadmin/salles', 
      icon: Building, 
      label: 'Salles de sport',
      badge: '5',
      color: 'text-blue-400'
    },
    { 
      path: '/superadmin/users', 
      icon: Users, 
      label: 'Utilisateurs',
      badge: '24',
      color: 'text-purple-400'
    },
    { 
      path: '/superadmin/products', 
      icon: Package, 
      label: 'Produits',
      badge: '12',
      color: 'text-orange-400'
    },
    { 
      path: '/superadmin/abonnements', 
      icon: Calendar, 
      label: 'Abonnements',
      badge: '3',
      color: 'text-rose-400'
    },
    { 
      path: '/superadmin/stats', 
      icon: BarChart3, 
      label: 'Statistiques',
      badge: null,
      color: 'text-cyan-400'
    }
  ];

  const adminItems = [
    { 
      path: '/dashboard', 
      icon: Shield, 
      label: 'Gestion Admin',
      color: 'text-yellow-400'
    }
  ];

  const handleLogout = () => {
    if (confirm('⚠️ Voulez-vous vraiment vous déconnecter ?')) {
      authService.logout();
      navigate('/login');
    }
  };

  return (
    <div 
      className={`${
        collapsed ? 'w-20' : 'w-72'
      } bg-gradient-to-b from-[#0A0A0F] to-[#0F0F15] border-r border-[#D4AF37]/20 flex flex-col transition-all duration-300 relative h-screen`}
    >
      {/* ===== LOGO SUPER ADMIN ===== */}
      <div className={`p-5 border-b border-[#D4AF37]/20 ${collapsed ? 'px-3' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 relative">
            {/* <Dumbbell className="w-5 h-5 text-black" /> */}
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
              <Crown className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-[#D4AF37] to-white bg-clip-text text-transparent">
                Super Admin
              </h1>
              <p className="text-[10px] text-purple-400">👑 Niveau 3</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== TOGGLE BUTTON ===== */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-[#1A1A24] border border-[#D4AF37]/30 rounded-full flex items-center justify-center hover:border-[#D4AF37] transition z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-[#D4AF37]" />
        )}
      </button>

      {/* ===== NOTIFICATIONS ===== */}
      <div className={`p-4 border-b border-[#D4AF37]/10 ${collapsed ? 'px-2' : ''}`}>
        <button className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} w-full px-3 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 transition`}>
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-purple-400" />
            {!collapsed && <span className="text-white text-sm">Notifications</span>}
          </div>
          {!collapsed && (
            <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
          )}
        </button>
      </div>

      {/* ===== MENU PRINCIPAL ===== */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-[#D4AF37]/30">
        <div className={`${collapsed ? 'text-center' : 'px-3'} mb-2`}>
          {!collapsed && (
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Menu principal</p>
          )}
        </div>
        
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-gradient-to-r from-[#D4AF37]/20 to-transparent border-l-2 border-[#D4AF37] text-[#D4AF37]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${collapsed ? '' : ''}`} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </div>
            {!collapsed && item.badge && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                item.badge ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : ''
              }`}>
                {item.badge}
              </span>
            )}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-[#1A1A24] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50 border border-[#D4AF37]/20">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}

        {/* ===== SEPARATEUR ===== */}
        <div className={`border-t border-[#D4AF37]/10 my-3 ${collapsed ? 'mx-2' : 'mx-4'}`}></div>
        
        <div className={`${collapsed ? 'text-center' : 'px-3'} mb-2`}>
          {!collapsed && (
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Administration</p>
          )}
        </div>

        {adminItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-gradient-to-r from-yellow-500/20 to-transparent border-l-2 border-yellow-500 text-yellow-500' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </div>
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-[#1A1A24] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50 border border-yellow-500/20">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ===== FOOTER ===== */}
      <div className="p-3 border-t border-[#D4AF37]/20">
        {/* Stats rapides */}
        {!collapsed && (
          <div className="mb-3 p-3 bg-[#1A1A24] rounded-xl border border-[#D4AF37]/10">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Plateforme</span>
              <span className="text-[#D4AF37]">● En ligne</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-500">Version</span>
              <span className="text-white">v2.0.0</span>
            </div>
          </div>
        )}

        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition group relative`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Déconnexion</span>}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-[#1A1A24] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap border border-red-500/20">
              Déconnexion
            </div>
          )}
        </button>

        {/* Version */}
        {!collapsed && (
          <div className="mt-2 text-center">
            <p className="text-[10px] text-gray-600">© 2026 HybridFit</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
