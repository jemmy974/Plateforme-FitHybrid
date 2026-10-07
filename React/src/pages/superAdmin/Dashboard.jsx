import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Users, UserCog, ShoppingBag, Package, 
    TrendingUp, Calendar, Award, DollarSign,
    UserPlus, Settings, Shield, BarChart3,
    Edit, Trash2, Plus, X, Save, Dumbbell
} from 'lucide-react';
import authService from '../../services/authService';
import api from '../../services/api';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAdmins: 0,
        totalClients: 0,
        totalProducts: 0,
        totalReservations: 0,
        totalRevenue: 0,
        newUsersThisMonth: 0
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUserModal, setShowUserModal] = useState(false);
    const [userForm, setUserForm] = useState({
        nom: '',
        prenom: '',
        email: '',
        mdp: '',
        role: 'admin'
    });

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user || user.role !== 'super_admin') {
            navigate('/login');
            return;
        }
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.get('/superadmin/stats'),
                api.get('/superadmin/users')
            ]);
            setStats(statsRes.data.data);
            setUsers(usersRes.data.data);
        } catch (error) {
            console.error('Erreur chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const endpoint = userForm.role === 'admin' 
                ? '/superadmin/users/admin' 
                : '/superadmin/users/client';
            
            await api.post(endpoint, userForm);
            setShowUserModal(false);
            setUserForm({ nom: '', prenom: '', email: '', mdp: '', role: 'admin' });
            await loadData();
            alert('✅ Utilisateur créé avec succès !');
        } catch (error) {
            alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleUpdateRole = async (userId, newRole) => {
        if (!confirm('Modifier le rôle de cet utilisateur ?')) return;
        try {
            await api.put(`/superadmin/users/${userId}/role`, { role: newRole });
            await loadData();
            alert('✅ Rôle mis à jour !');
        } catch (error) {
            alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('⚠️ Supprimer cet utilisateur définitivement ?')) return;
        try {
            await api.delete(`/superadmin/users/${userId}`);
            await loadData();
            alert('✅ Utilisateur supprimé !');
        } catch (error) {
            alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
        }
    };

    // ===== STATISTIQUES =====
    const statCards = [
        { 
            title: 'Total utilisateurs', 
            value: stats.totalUsers, 
            icon: Users, 
            color: 'from-blue-500 to-blue-600' 
        },
        { 
            title: 'Administrateurs (Salles)', 
            value: stats.totalAdmins, 
            icon: UserCog, 
            color: 'from-purple-500 to-purple-600' 
        },
        { 
            title: 'Clients (Membres)', 
            value: stats.totalClients, 
            icon: Users, 
            color: 'from-emerald-500 to-emerald-600' 
        },
        { 
            title: 'Produits', 
            value: stats.totalProducts, 
            icon: Package, 
            color: 'from-orange-500 to-orange-600' 
        },
        { 
            title: 'Réservations', 
            value: stats.totalReservations, 
            icon: ShoppingBag, 
            color: 'from-rose-500 to-rose-600' 
        },
        { 
            title: 'Chiffre d\'affaires', 
            value: stats.totalRevenue.toLocaleString() + ' Ar', 
            icon: DollarSign, 
            color: 'from-green-500 to-green-600' 
        },
        { 
            title: 'Nouveaux ce mois', 
            value: stats.newUsersThisMonth, 
            icon: TrendingUp, 
            color: 'from-indigo-500 to-indigo-600' 
        }
    ];

    const roleLabels = {
        'super_admin': '👑 Super Admin',
        'admin': '🏢 Admin (Salle)',
        'client': '👤 Client'
    };

    const roleColors = {
        'super_admin': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        'admin': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'client': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0A0A0F]">
                <div className="w-12 h-12 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0F] py-8 px-4">
            <div className="max-w-7xl mx-auto">
                
                {/* ===== HEADER ===== */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#D4AF37]/20 rounded-2xl">
                            <Shield className="w-8 h-8 text-[#D4AF37]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                                👑 Super Administration
                                <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full font-medium">
                                    Niveau 3
                                </span>
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">
                                Gérez les administrateurs des salles et les clients
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => { setShowUserModal(true); }}
                        className="flex items-center gap-2 bg-[#D4AF37] text-black px-5 py-2.5 rounded-xl font-semibold hover:bg-[#D4AF37]/90 transition"
                    >
                        <UserPlus className="w-4 h-4" />
                        Nouvel utilisateur
                    </button>
                </div>

                {/* ===== STATISTIQUES ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((stat, index) => (
                        <div key={index} className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 p-5 hover:border-[#D4AF37]/40 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">{stat.title}</p>
                                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                                </div>
                                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl`}>
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ===== LISTE DES UTILISATEURS ===== */}
                <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-5 border-b border-white/10 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-white">👥 Tous les utilisateurs</h2>
                            <p className="text-gray-400 text-sm">
                                {users.length} utilisateurs • 
                                <span className="text-blue-400 ml-1">{users.filter(u => u.role === 'admin').length} Administrateurs</span> • 
                                <span className="text-gray-400 ml-1">{users.filter(u => u.role === 'client').length} Clients</span>
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#1A1A24] border-b border-white/10">
                                <tr>
                                    <th className="text-left p-4 text-gray-400 font-medium">Utilisateur</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Email</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Rôle</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Niveau</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 rounded-full flex items-center justify-center">
                                                    <span className="text-[#D4AF37] font-semibold">
                                                        {user.nom?.[0]}{user.prenom?.[0]}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{user.nom} {user.prenom}</p>
                                                    <p className="text-gray-500 text-xs">
                                                        {user.role === 'super_admin' && '👑 Propriétaire de la plateforme'}
                                                        {user.role === 'admin' && '🏢 Gérant de salle de sport'}
                                                        {user.role === 'client' && '👤 Membre'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-300">{user.email}</td>
                                        <td className="p-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                                className={`px-2 py-1 rounded-full text-xs font-medium border ${roleColors[user.role] || 'bg-gray-500/20 text-gray-400'}`}
                                                disabled={user.role === 'super_admin'}
                                            >
                                                <option value="super_admin">👑 Super Admin</option>
                                                <option value="admin">🏢 Admin (Salle)</option>
                                                <option value="client">👤 Client</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                                                Niveau {user.niveau || 0}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                {user.role !== 'super_admin' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-1.5 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 transition"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ===== MODAL CRÉATION UTILISATEUR ===== */}
            {showUserModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-[#D4AF37]/30 w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">👤 Créer un utilisateur</h2>
                            <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Nom *</label>
                                    <input
                                        type="text"
                                        value={userForm.nom}
                                        onChange={(e) => setUserForm({ ...userForm, nom: e.target.value })}
                                        className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Prénom *</label>
                                    <input
                                        type="text"
                                        value={userForm.prenom}
                                        onChange={(e) => setUserForm({ ...userForm, prenom: e.target.value })}
                                        className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Email *</label>
                                <input
                                    type="email"
                                    value={userForm.email}
                                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                    className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Mot de passe *</label>
                                <input
                                    type="password"
                                    value={userForm.mdp}
                                    onChange={(e) => setUserForm({ ...userForm, mdp: e.target.value })}
                                    className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Rôle</label>
                                <select
                                    value={userForm.role}
                                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                    className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                >
                                    <option value="admin">🏢 Admin (Salle)</option>
                                    <option value="client">👤 Client</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#D4AF37] text-black py-2.5 rounded-xl font-semibold hover:bg-[#D4AF37]/90 transition"
                                >
                                    Créer l'utilisateur
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowUserModal(false)}
                                    className="px-6 py-2.5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/5 transition"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;
