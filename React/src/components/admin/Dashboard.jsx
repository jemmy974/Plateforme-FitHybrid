// src/pages/admin/Dashboard.jsx
// import Link from "react-router-dom";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  DollarSign, ShoppingBag, Users, Package,
  Eye, Download, Calendar, ArrowUpRight, ArrowDownRight,
  Activity, Clock, Award, Zap
} from 'lucide-react';
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../../services/api';

const emptyDashboard = {
  stats: {
    revenue: { value: '0 Ar', change: '0%', trend: 'up' },
    orders: { value: '0', change: '0%', trend: 'up' },
    users: { value: '0', change: '0%', trend: 'up' },
    products: { value: '0', change: '0%', trend: 'up' },
  },
  chart: [],
  topProducts: [],
  recentOrders: [],
  activities: []
};

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [searchParams] = useSearchParams();
  const [dashboardData, setDashboardData] = useState(emptyDashboard);
  const [loading, setLoading] = useState(false);
  const search = searchParams.get('q') || '';

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboard = async () => {
      setLoading(true);
      try {
        const response = await api.get('/dashboard', {
          params: { range: timeRange, search },
          signal: controller.signal
        });
        setDashboardData(response.data.data || emptyDashboard);
      } catch (error) {
        if (error.name !== 'CanceledError') {
          console.error('Erreur chargement dashboard:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
    return () => controller.abort();
  }, [timeRange, search]);

  const handleExport = async () => {
    try {
      const response = await api.get('/dashboard/export', {
        params: { range: timeRange, search },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dashboard-stats-${timeRange}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur export dashboard:', error);
    }
  };

  const statsCards = [
    { title: 'Chiffre d\'affaires', value: dashboardData.stats.revenue.value, change: dashboardData.stats.revenue.change, trend: dashboardData.stats.revenue.trend, icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
    { title: 'Commandes', value: dashboardData.stats.orders.value, change: dashboardData.stats.orders.change, trend: dashboardData.stats.orders.trend, icon: ShoppingBag, color: 'from-blue-500 to-cyan-500' },
    { title: 'Utilisateurs', value: dashboardData.stats.users.value, change: dashboardData.stats.users.change, trend: dashboardData.stats.users.trend, icon: Users, color: 'from-purple-500 to-pink-500' },
    { title: 'Produits', value: dashboardData.stats.products.value, change: dashboardData.stats.products.change, trend: dashboardData.stats.products.trend, icon: Package, color: 'from-orange-500 to-red-500' },
  ];

  const revenueData = dashboardData.chart;
  const topProducts = dashboardData.topProducts;
  const recentOrders = dashboardData.recentOrders;
  const activities = dashboardData.activities;

  const activityStyles = {
    order: { icon: Zap, color: 'bg-emerald-500/20', text: 'text-emerald-400' },
    user: { icon: Users, color: 'bg-blue-500/20', text: 'text-blue-400' },
    product: { icon: Package, color: 'bg-[#D4AF37]/20', text: 'text-[#D4AF37]' },
    salle: { icon: Award, color: 'bg-purple-500/20', text: 'text-purple-400' },
    abonnement: { icon: Calendar, color: 'bg-orange-500/20', text: 'text-orange-400' },
  };

  return (
    <div className="space-y-6">
      {/* En-tete avec bienvenue et filtres */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Tableau de bord
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Voici ce qui se passe avec votre boutique aujourd'hui.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-[#12121A] rounded-xl border border-white/10 p-1">
            {['day', 'week', 'month', 'year'].map((range) => (
              <span
                cursor="pointer"
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-[#D4AF37] text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range === 'day' ? 'Jour' : range === 'week' ? 'Semaine' : range === 'month' ? 'Mois' : 'Annee'}
              </span>
            ))}
          </div>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-[#12121A] border border-white/10 rounded-xl text-sm text-gray-300 hover:border-[#D4AF37]/50 transition">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((stat, index) => (
          <div key={index} className="group relative bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 p-5 hover:border-[#D4AF37]/40 transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500">vs derniere periode</span>
                </div>
              </div>
              <div className={`bg-gradient-to-br ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center opacity-80 group-hover:scale-110 transition`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            {/* Ligne de progression subtile */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/50 to-[#D4AF37]/0 rounded-full opacity-0 group-hover:opacity-100 transition"></div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique des revenus */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 p-5">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-white font-semibold">Apercu des revenus</h3>
              <p className="text-gray-500 text-xs mt-1">Evolution {timeRange === 'day' ? 'du jour' : timeRange === 'week' ? 'sur 7 jours' : timeRange === 'month' ? 'sur 30 jours' : 'sur 12 mois'}</p>
            </div>
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">Revenus</button>
              <button className="text-xs px-3 py-1 rounded-lg text-gray-400 hover:bg-white/5">Commandes</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" stroke="#6B6B84" />
              <YAxis stroke="#6B6B84" />
              <Tooltip
                contentStyle={{ backgroundColor: '#12121A', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px' }}
                labelStyle={{ color: '#D4AF37' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top produits */}
        <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">Produits populaires</h3>
            <Eye className="w-4 h-4 text-gray-400 cursor-pointer hover:text-[#D4AF37]" />
          </div>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{product.name}</p>
                    <p className="text-gray-500 text-xs">{product.sales} ventes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#D4AF37] text-sm font-semibold">{Number(product.revenue || 0).toLocaleString()} Ar</p>
                  <p className={`text-xs ${product.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {product.trend}
                  </p>
                </div>
              </div>
            ))}
            {!loading && topProducts.length === 0 && (
              <p className="text-gray-500 text-sm">Aucun produit trouve</p>
            )}
          </div>
          <button className="w-full mt-5 py-2 text-center text-sm text-gray-400 hover:text-[#D4AF37] transition">
            Voir tous les produits -&gt;
          </button>
        </div>
      </div>

      {/* Commandes recentes et activite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commandes recentes */}
        <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">Commandes recentes</h3>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentOrders.map((order, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${order.status === 'completed' ? 'bg-green-400' : order.status === 'processing' ? 'bg-blue-400' : order.status === 'shipped' ? 'bg-purple-400' : 'bg-yellow-400'}`}></div>
                  <div>
                    <p className="text-white text-sm font-medium">{order.id}</p>
                    <p className="text-gray-500 text-xs">{order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#D4AF37] text-sm font-semibold">{order.amount}</p>
                  <p className="text-gray-500 text-xs">{order.date}</p>
                </div>
              </div>
            ))}
            {!loading && recentOrders.length === 0 && (
              <p className="text-gray-500 text-sm">Aucune commande trouvee</p>
            )}
          </div>
          <button className="w-full mt-4 py-2 text-center text-sm text-[#D4AF37] hover:underline">
            Voir toutes les commandes
          </button>
        </div>

        {/* Activite recente */}
        <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">Activite recente</h3>
            <Activity className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-4">
            {activities.map((item, idx) => {
              const style = activityStyles[item.type] || activityStyles.order;
              const Icon = style.icon;

              return (
                <div key={idx} className="flex gap-3">
                  <div className={`w-8 h-8 ${style.color} rounded-full flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${style.text}`} />
                  </div>
                  <div>
                    <p className="text-white text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs">{item.time}</p>
                  </div>
                </div>
              );
            })}
            {!loading && activities.length === 0 && (
              <p className="text-gray-500 text-sm">Aucune activite trouvee</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
