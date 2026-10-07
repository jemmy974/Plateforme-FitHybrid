import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, Filter, MoreVertical, Shield, ShieldCheck, 
  ShieldAlert, Mail, Calendar, Activity, Ban, CheckCircle, 
  Edit, Trash2, Plus, X, Star, UserCheck, UserX,
  AlertCircle, Loader2
} from 'lucide-react';
import { userService } from '../../services/userService';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Données utilisateurs (dynamiques)
  const [users, setUsers] = useState([]);

  // Charger les utilisateurs
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userService.getAll();
      console.log('📥 Utilisateurs chargés:', response);
      
      // Adapter les données du backend
      const usersData = response.data || response || [];
      setUsers(usersData);
    } catch (error) {
      console.error('❌ Erreur chargement utilisateurs:', error);
      setError(error.response?.data?.message || 'Impossible de charger les utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const roleIcons = {
    admin: <ShieldAlert className="w-4 h-4 text-red-400" />,
    user: <Shield className="w-4 h-4 text-gray-400" />,
    client: <Shield className="w-4 h-4 text-gray-400" />,
  };

  const roleLabels = {
    admin: 'Administrateur',
    client: 'Client',
  };

  const statusColors = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    banned: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  // Filtrage
  const filteredUsers = users.filter(user => {
    if (userRole !== 'all' && user.role !== userRole) return false;
    if (searchTerm && !user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !user.email?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Statistiques
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    newThisMonth: users.filter(u => {
      const createdAt = new Date(u.createdAt || u.created_at);
      const now = new Date();
      return createdAt.getMonth() === now.getMonth() && 
             createdAt.getFullYear() === now.getFullYear();
    }).length,
    totalSpent: users.reduce((sum, u) => sum + (u.depenses || u.spent || 0), 0),
  };

  // Actions
  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await userService.updateStatus(userId, newStatus);
      setSuccess('✅ Statut mis à jour');
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la mise à jour');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.updateRole(userId, newRole);
      setSuccess('✅ Rôle mis à jour');
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la mise à jour');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await userService.delete(userId);
        setSuccess('✅ Utilisateur supprimé');
        loadUsers();
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError(error.response?.data?.message || 'Erreur lors de la suppression');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  // ✅ Rediriger vers la page d'inscription
  const handleAddUser = () => {
    navigate('/inscrire');
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  // Format prix
  const formatPrix = (prix) => {
    return prix?.toLocaleString() + ' Ar' || '0 Ar';
  };

  // Rendu
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Gestion des utilisateurs
          </h1>
          <p className="text-gray-400 text-sm mt-1">Gérez les comptes, rôles et permissions</p>
        </div>
        <button 
          onClick={handleAddUser}
          className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8940F] text-black px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-[#D4AF37]/20 hover:shadow-xl transition"
        >
          <Plus className="w-4 h-4" />
          Ajouter un utilisateur
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        </div>
      )}
      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <p className="text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {success}
          </p>
        </div>
      )}

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-xl p-4 border border-white/10">
          <div className="flex justify-between items-center">
            <Users className="w-8 h-8 text-[#D4AF37]" />
            <span className="text-2xl font-bold text-white">{stats.total}</span>
          </div>
          <p className="text-gray-400 text-sm mt-1">Total utilisateurs</p>
        </div>
        <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-xl p-4 border border-white/10">
          <div className="flex justify-between items-center">
            <UserCheck className="w-8 h-8 text-emerald-400" />
            <span className="text-2xl font-bold text-white">{stats.active}</span>
          </div>
          <p className="text-gray-400 text-sm mt-1">Utilisateurs actifs</p>
        </div>
        <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-xl p-4 border border-white/10">
          <div className="flex justify-between items-center">
            <Calendar className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">{stats.newThisMonth}</span>
          </div>
          <p className="text-gray-400 text-sm mt-1">Nouveaux ce mois</p>
        </div>
        <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-xl p-4 border border-white/10">
          <div className="flex justify-between items-center">
            <Star className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">{formatPrix(stats.totalSpent)}</span>
          </div>
          <p className="text-gray-400 text-sm mt-1">Chiffre d'affaires total</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Tous', icon: Users },
            { id: 'admin', label: 'Admins', icon: ShieldAlert },
            { id: 'user', label: 'Utilisateurs', icon: Shield },
            { id: 'client', label: 'Clients', icon: Shield },
          ].map((role) => (
            <button
              key={role.id}
              onClick={() => setUserRole(role.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                userRole === role.id
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-[#12121A] text-gray-400 border border-white/10 hover:text-white'
              }`}
            >
              <role.icon className="w-4 h-4" />
              {role.label}
            </button>
          ))}
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#12121A] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition"
          />
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      {filteredUsers.length === 0 ? (
        <div className="bg-[#12121A] rounded-2xl border border-white/10 p-8 text-center">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Aucun utilisateur trouvé</p>
        </div>
      ) : (
        <div className="bg-[#12121A] rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1A1A24] border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium">Utilisateur</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Email</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Rôle</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Commandes</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Dépenses</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Inscription</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Statut</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 rounded-full flex items-center justify-center">
                          <span className="text-[#D4AF37] font-semibold">
                            {user.prenom?.charAt(0) || user.nom?.charAt(0) || '?'}
                            {user.nom?.charAt(0) || ''}
                          </span>
                        </div>
                        <span className="text-white font-medium">
                          {user.prenom} {user.nom}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-500" />
                        {user.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {roleIcons[user.role] || roleIcons.user}
                        <select
                          value={user.role || 'client'}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-transparent text-gray-300 text-sm focus:outline-none cursor-pointer"
                        >
                          <option value="super_admin">Super Admin</option>
                          <option value="admin">Administrateur</option>
                          <option value="moderator">Modérateur</option>
                          <option value="coach">Coach</option>
                          <option value="client">Client</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{user.commandes || user.orders || 0}</td>
                    <td className="p-4 text-[#D4AF37] font-semibold">
                      {formatPrix(user.depenses || user.spent || 0)}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {formatDate(user.createdAt || user.created_at || user.joined)}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleStatusToggle(user.id, user.status || 'active')}
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          statusColors[user.status || 'active']
                        }`}
                      >
                        {user.status === 'active' ? 'Actif' : 
                         user.status === 'banned' ? 'Banni' : 'Inactif'}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 hover:bg-blue-500/20 transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;