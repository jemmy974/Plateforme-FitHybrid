import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Calendar, CheckCircle, XCircle, Clock, Building,
    RefreshCw, Eye, AlertCircle, TrendingUp
} from 'lucide-react';
import authService from '../../services/authService';
import api from '../../services/api';

const SuperAdminAbonnements = () => {
    const navigate = useNavigate();
    const [abonnements, setAbonnements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSalle, setSelectedSalle] = useState(null);
    const [showRenewModal, setShowRenewModal] = useState(false);
    const [renewData, setRenewData] = useState({ duree_mois: 1 });

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
            const response = await api.get('/superadmin/abonnements');
            setAbonnements(response.data.data || []);
        } catch (error) {
            console.error('Erreur chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRenew = async () => {
        if (!selectedSalle) return;
        try {
            await api.post(`/superadmin/abonnements/${selectedSalle}/renew`, renewData);
            alert(`✅ Abonnement renouvelé pour ${renewData.duree_mois} mois !`);
            setShowRenewModal(false);
            setSelectedSalle(null);
            await loadData();
        } catch (error) {
            alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
        }
    };

    const checkStatus = async (id) => {
        try {
            const response = await api.get(`/superadmin/abonnements/${id}/status`);
            const data = response.data.data;
            alert(
                `📊 Statut de l'abonnement:\n\n` +
                `Statut: ${data.actif ? '✅ Actif' : '❌ Inactif'}\n` +
                `Jours restants: ${data.jours_restants || 0} jours\n` +
                `Date d'abonnement: ${new Date(data.date_abonnement).toLocaleDateString('fr-FR')}\n` +
                `Date d'expiration: ${new Date(data.date_expiration).toLocaleDateString('fr-FR')}`
            );
        } catch (error) {
            alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
        }
    };

    const getStatusBadge = (statut) => {
        const now = new Date();
        const expiration = new Date(statut.date_expiration);
        const isExpired = expiration < now;

        if (statut.statut === 'actif' && !isExpired) {
            return { label: '✅ Actif', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
        } else if (statut.statut === 'suspendu') {
            return { label: '⛔ Suspendu', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
        } else if (isExpired) {
            return { label: '⏰ Expiré', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
        }
        return { label: '⭕ Inactif', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
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
                
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">📋 Gestion des abonnements</h1>
                        <p className="text-gray-400 text-sm mt-1">{abonnements.length} abonnements</p>
                    </div>
                    <button
                        onClick={() => loadData()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Rafraîchir
                    </button>
                </div>

                {/* Tableau */}
                <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#1A1A24] border-b border-white/10">
                                <tr>
                                    <th className="text-left p-4 text-gray-400 font-medium">Salle</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Date abonnement</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Date expiration</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Statut</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {abonnements.map((abonnement) => {
                                    const status = getStatusBadge(abonnement);
                                    return (
                                        <tr key={abonnement.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                                                        <Building className="w-5 h-5 text-[#D4AF37]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{abonnement.nom}</p>
                                                        <p className="text-gray-400 text-xs">{abonnement.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-300">
                                                {abonnement.date_abonnement 
                                                    ? new Date(abonnement.date_abonnement).toLocaleDateString('fr-FR')
                                                    : 'Non défini'}
                                            </td>
                                            <td className="p-4 text-gray-300">
                                                {abonnement.date_expiration 
                                                    ? new Date(abonnement.date_expiration).toLocaleDateString('fr-FR')
                                                    : 'Non défini'}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => checkStatus(abonnement.id)}
                                                        className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 hover:bg-blue-500/20 transition"
                                                        title="Voir statut"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedSalle(abonnement.id);
                                                            setShowRenewModal(true);
                                                        }}
                                                        className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition"
                                                        title="Renouveler"
                                                    >
                                                        <RefreshCw className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal renouvellement */}
            {showRenewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-[#D4AF37]/30 w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">🔄 Renouveler l'abonnement</h2>
                            <button onClick={() => { setShowRenewModal(false); setSelectedSalle(null); }} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Durée (mois)</label>
                                <select
                                    value={renewData.duree_mois}
                                    onChange={(e) => setRenewData({ duree_mois: parseInt(e.target.value) })}
                                    className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                >
                                    <option value={1}>1 mois</option>
                                    <option value={3}>3 mois</option>
                                    <option value={6}>6 mois</option>
                                    <option value={12}>12 mois</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleRenew}
                                    className="flex-1 bg-[#D4AF37] text-black py-2.5 rounded-xl font-semibold hover:bg-[#D4AF37]/90 transition"
                                >
                                    Renouveler
                                </button>
                                <button
                                    onClick={() => { setShowRenewModal(false); setSelectedSalle(null); }}
                                    className="px-6 py-2.5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/5 transition"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminAbonnements;
