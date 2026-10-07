import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Users, UserCog, User, Plus, Edit, Trash2, X, Save,
    Search, Filter, Shield, Key, Ban, CheckCircle
} from 'lucide-react';
import authService from '../../services/authService';
import api from '../../services/api';

const SuperAdminUsers = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('admins');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        mdp: '',
        role: 'admin'
    });

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user || user.role !== 'super_admin') {
            navigate('/');
            return;
        }
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [adminsRes, clientsRes] = await Promise.all([
                api.get('/superadmin/admins'),
                api.get('/superadmin/clients')
            ]);
            setAdmins(adminsRes.data.data || []);
            setClients(clientsRes.data.data || []);
        } catch (error) {
            console.error('Erreur chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = formData.role === 'admin' 
                ? '/superadmin/users/admin' 
                : '/superadmin/users/client';
            
            await api.post(endpoint, formData);
            alert(`✅ ${formData.role === 'admin' ? 'Admin' : 'Client'} créé !`);
            setShowModal(false);
            setFormData({ nom: '', prenom: '', email: '', mdp: '', role: 'admin' });
            await loadData();
        } catch (error) {
            alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleToggleStatus = async (id, actif) => {
        if (!confirm(`${actif ? 'Activer' : 'Désactiver'} ce compte ?`)) return;
        try {
            await api.patch(`/superadmin/users/${id}/status`, { actif });
            alert(`✅ Compte ${actif ? 'activé' : 'désactivé'} !`);
            await loadData();
        } catch (error) {
            alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleResetPassword = async (id) => {
        const nouveau_mdp = prompt('Nouveau mot de passe (6 caractères minimum) :');
        if (!nouveau_mdp || nouveau_mdp.length < 6) {
            alert('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }
        try {
            await api.post(`/superadmin/users/${id}/reset-password`, { nouveau_mdp });
            alert('✅ Mot de passe réinitialisé !');
        } catch (error) {
            alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('⚠️ Supprimer définitivement cet utilisateur ?')) return;
        try {
            await api.delete(`/superadmin/users/${id}`);
            alert('✅ Utilisateur supprimé !');
            await loadData();
        } catch (error) {
            alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
        }
    };

    const renderUserTable = (users, title, role) => (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-[#1A1A24] border-b border-white/10">
                    <tr>
                        <th className="text-left p-4 text-gray-400 font-medium">Utilisateur</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Email</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Statut</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                                        <span className="text-[#D4AF37] font-semibold">
                                            {user.prenom?.[0]}{user.nom?.[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{user.prenom} {user.nom}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 text-gray-300">{user.email}</td>
                            <td className="p-4">
                                {user.role === 'super_admin' ? (
                                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs">👑 Super Admin</span>
                                ) : (
                                    <button
                                        onClick={() => handleToggleStatus(user.id, !user.actif)}
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                                            user.actif !== false
                                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                                : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                        }`}
                                    >
                                        {user.actif !== false ? '✅ Actif' : '⛔ Inactif'}
                                    </button>
                                )}
                            </td>
                            <td className="p-4 text-gray-400 text-sm">
                                {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    {user.role !== 'super_admin' && (
                                        <>
                                            <button
                                                onClick={() => handleResetPassword(user.id)}
                                                className="p-1.5 bg-yellow-500/10 rounded-lg text-yellow-400 hover:bg-yellow-500/20 transition"
                                                title="Réinitialiser le mot de passe"
                                            >
                                                <Key className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-1.5 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0A0A0F]">
                <div className="w-12 h-12 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
            </div>
        );
    }

    const currentData = activeTab === 'admins' ? admins : clients;
    const currentTitle = activeTab === 'admins' ? 'Administrateurs' : 'Clients';
    const currentRole = activeTab === 'admins' ? 'admin' : 'client';

    return (
        <div className="min-h-screen bg-[#0A0A0F] py-8 px-4">
            <div className="max-w-7xl mx-auto">
                
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">👥 Gestion des utilisateurs</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            {admins.length} admins • {clients.length} clients
                        </p>
                    </div>
                    <button
                        onClick={() => { setEditingUser(null); setShowModal(true); }}
                        className="flex items-center gap-2 bg-[#D4AF37] text-black px-5 py-2.5 rounded-xl font-semibold hover:bg-[#D4AF37]/90 transition"
                    >
                        <Plus className="w-4 h-4" />
                        Nouvel utilisateur
                    </button>
                </div>

                {/* Onglets */}
                <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
                    <button
                        onClick={() => setActiveTab('admins')}
                        className={`px-5 py-2.5 rounded-xl font-medium transition flex items-center gap-2 ${
                            activeTab === 'admins'
                                ? 'bg-[#D4AF37] text-black'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <UserCog className="w-4 h-4" />
                        Admins
                        <span className="ml-1 text-xs bg-white/10 px-2 py-0.5 rounded-full">{admins.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('clients')}
                        className={`px-5 py-2.5 rounded-xl font-medium transition flex items-center gap-2 ${
                            activeTab === 'clients'
                                ? 'bg-[#D4AF37] text-black'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <User className="w-4 h-4" />
                        Clients
                        <span className="ml-1 text-xs bg-white/10 px-2 py-0.5 rounded-full">{clients.length}</span>
                    </button>
                </div>

                {/* Tableau */}
                <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-5 border-b border-white/10">
                        <h2 className="text-lg font-semibold text-white">{currentTitle}</h2>
                        <p className="text-gray-400 text-sm">{currentData.length} utilisateurs</p>
                    </div>
                    {renderUserTable(currentData, currentTitle, currentRole)}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-[#D4AF37]/30 w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">👤 Nouvel utilisateur</h2>
                            <button onClick={() => { setShowModal(false); setFormData({ nom: '', prenom: '', email: '', mdp: '', role: 'admin' }); }} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Nom *</label>
                                    <input
                                        type="text"
                                        value={formData.nom}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Prénom *</label>
                                    <input
                                        type="text"
                                        value={formData.prenom}
                                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                        className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Mot de passe *</label>
                                <input
                                    type="password"
                                    value={formData.mdp}
                                    onChange={(e) => setFormData({ ...formData, mdp: e.target.value })}
                                    className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Rôle</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                                    onClick={() => { setShowModal(false); setFormData({ nom: '', prenom: '', email: '', mdp: '', role: 'admin' }); }}
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

export default SuperAdminUsers;
