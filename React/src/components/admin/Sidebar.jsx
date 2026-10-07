import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  TrendingUp,
  MessageSquare,
  Bell,
  Shield
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      badge: null
    },
    {
      path: '/admin/products',
      icon: Package,
      label: 'Produits',
      badge: '12'
    },
    {
      path: '/admin/commande',
      icon: ShoppingCart,
      label: 'Commandes',
      badge: '8'
    },
    {
      path: '/admin/users',
      icon: Users,
      label: 'Utilisateurs',
      badge: null
    },
    {
      path: '/admin/exercice',
      icon: Tag,
      label: 'Exercices',
      badge: null
    },
    {
      path: '/admin/ProgrammeExercice',
      icon: BarChart3,
      label: 'Programmes',
      badge: null
    },
    {
      path: '/admin/settings',
      icon: Settings,
      label: 'Paramètres',
      badge: null
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div
      className={`${collapsed ? 'w-20' : 'w-64'
        } bg-gradient-to-b from-[#0F0F15] to-[#0A0A0F] border-r border-white/10 flex flex-col transition-all duration-300 relative`}
    >
      {/* Logo */}
      <div className={`p-5 border-b border-white/10 ${collapsed ? 'px-3' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#D4AF37] to-[#9C7E2C] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
            <Dumbbell className="w-5 h-5 text-black" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                HybridFit
              </h1>
              <p className="text-[10px] text-gray-500">Administration</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <div
        role='button'
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-[#1A1A24] border border-white/10 rounded-full flex items-center justify-center hover:border-[#D4AF37] transition z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-gray-400" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-gray-400" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-l-2 border-[#D4AF37]'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </div>
            {!collapsed && item.badge && (
              <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-[#1A1A24] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Sidebar */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition group relative`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Déconnexion</span>}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-[#1A1A24] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
              Déconnexion
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
