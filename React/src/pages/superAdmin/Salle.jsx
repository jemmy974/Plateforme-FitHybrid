import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Building, Plus, Edit, Trash2, Eye, X, Save,
    Search, Filter, MoreVertical, CheckCircle, XCircle,
    AlertCircle, Users, Calendar, Mail, Phone, MapPin
} from 'lucide-react';
import authService from '../../services/authService';
import api from '../../services/api';

const Salles = () => {
    const navigate = useNavigate();
    const [salles, setSalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSalle, setEditingSalle] = useState(null);
    const [formData, setFormData] = useState({
        nom: '',
        adresse: '',
        telephone: '',
        email: '',
        description: '',
        admin_id: '',
        statut: 'actif'
    });
    const [admins, setAdmins] = useState([]);

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
            const [sallesRes, adminsRes] = await Promise.all([
                api.get('/superadmin/salles'),
                api.get('/superadmin/admins')
            ]);
            setSalles(sallesRes.data.data || []);
            setAdmins(adminsRes.data.data || []);
        } catch (error) {
            console.error('Erreur chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSalle) {
                await api.put(`/superadmin/salles/${editingSalle.id}`, formData);
                alert('✅ Salle modifiée !');
            } else {
                await api.post('/superadmin/salles', formData);
                alert('✅ Salle ajoutée !');
            }
            setShowModal(false);
            resetForm();
            await loadData();
        } catch (error) {
            alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleToggleStatus = async (id, statut) => {
        if (!confirm(`Changer le statut de cette salle ?`)) return;
        try {
            await api.patch(`/superadmin/salles/${id}/status`, { statut });
            alert('✅ Statut mis à jour !');
            await loadData();
        } catch (error) {
            alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('⚠️ Supprimer définitivement cette salle ?')) return;
        try {
            await api.delete(`/superadmin/salles/${id}`);
            alert('✅ Salle supprimée !');
            await loadData();
        } catch (error) {
            alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
        }
    };

    const openCreateModal = () => {
        setEditingSalle(null);
        setFormData({ nom: '', adresse: '', telephone: '', email: '', description: '', admin_id: '', statut: 'actif' });
        setShowModal(true);
    };

    const openEditModal = (salle) => {
        setEditingSalle(salle);
        setFormData({
            nom: salle.nom || '',
            adresse: salle.adresse || '',
            telephone: salle.telephone || '',
            email: salle.email || '',
            description: salle.description || '',
            admin_id: salle.admin_id || '',
            statut: salle.statut || 'actif'
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({ nom: '', adresse: '', telephone: '', email: '', description: '', admin_id: '', statut: 'actif' });
        setEditingSalle(null);
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
                
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">🏢 Gestion des salles</h1>
                        <p className="text-gray-400 text-sm mt-1">{salles.length} salles partenaires</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#D4AF37] text-black px-5 py-2.5 rounded-xl font-semibold hover:bg-[#D4AF37]/90 transition"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter une salle
                    </button>
                </div>

                {/* Tableau */}
                <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#1A1A24] border-b border-white/10">
                                <tr>
                                    <th className="text-left p-4 text-gray-400 font-medium">Salle</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Admin</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Statut</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Abonnement</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salles.map((salle) => (
                                    <tr key={salle.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                                                    <Building className="w-5 h-5 text-[#D4AF37]" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{salle.nom}</p>
                                                    <p className="text-gray-400 text-xs">{salle.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {salle.admin ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-xs font-bold text-blue-400">
                                                        {salle.admin.prenom?.[0]}{salle.admin.nom?.[0]}
                                                    </div>
                                                    <span className="text-gray-300 text-sm">
                                                        {salle.admin.prenom} {salle.admin.nom}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 text-sm">Non assigné</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={salle.statut}
                                                onChange={(e) => handleToggleStatus(salle.id, e.target.value)}
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                                                    salle.statut === 'actif' 
                                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                                        : salle.statut === 'suspendu'
                                                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                                                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                                }`}
                                            >
                                                <option value="actif">✅ Actif</option>
                                                <option value="suspendu">⛔ Suspendu</option>
                                                <option value="inactif">⭕ Inactif</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            {salle.date_expiration ? (
                                                <div className="text-sm">
                                                    <span className="text-gray-300">
                                                        {new Date(salle.date_expiration).toLocaleDateString('fr-FR')}
                                                    </span>
                                                    {new Date(salle.date_expiration) > new Date() ? (
                                                        <span className="ml-2 text-emerald-400 text-xs">● Actif</span>
                                                    ) : (
                                                        <span className="ml-2 text-red-400 text-xs">● Expiré</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 text-sm">Non défini</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEditModal(salle)}
                                                    className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 hover:bg-blue-500/20 transition"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(salle.id)}
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
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-[#D4AF37]/30 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">
                                {editingSalle ? '✏️ Modifier la salle' : '🏢 Nouvelle salle'}
                            </h2>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Nom de la salle *</label>
                                <input
                                    type="text"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                    className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                    required
                                />
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
                                <label className="block text-gray-300 text-sm font-medium mb-2">Téléphone</label>
                                <input
                                    type="tel"
                                    value={formData.telephone}
                                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                    className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                    placeholder="032 00 000 00"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Adresse</label>
                                <textarea
                                    value={formData.adresse}
                                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                    className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                    rows="2"
                                    placeholder="Adresse complète de la salle"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                    rows="2"
                                    placeholder="Description de la salle"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Administrateur (gérant)</label>
                                <select
                                    value={formData.admin_id}
                                    onChange={(e) => setFormData({ ...formData, admin_id: e.target.value })}
                                    className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                >
                                    <option value="">Non assigné</option>
                                    {admins.map((admin) => (
                                        <option key={admin.id} value={admin.id}>
                                            {admin.prenom} {admin.nom} ({admin.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Statut</label>
                                <select
                                    value={formData.statut}
                                    onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                                    className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                >
                                    <option value="actif">✅ Actif</option>
                                    <option value="suspendu">⛔ Suspendu</option>
                                    <option value="inactif">⭕ Inactif</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#D4AF37] text-black py-2.5 rounded-xl font-semibold hover:bg-[#D4AF37]/90 transition"
                                >
                                    {editingSalle ? 'Modifier' : 'Ajouter'} la salle
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); resetForm(); }}
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

export default Salles;
