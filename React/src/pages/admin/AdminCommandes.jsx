import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Filter, Eye, MoreVertical, 
  Truck, CheckCircle, Clock, XCircle, Package, 
  Download, Printer, ChevronDown, Calendar, 
  AlertCircle, CheckCircle as CheckIcon,
  User, MapPin, Phone, CreditCard, DollarSign,
  RefreshCw, ArrowUpDown,
  Trash2,
  X
} from 'lucide-react';
import { commandeService } from '../../services/commandeService';

const AdminCommandes = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // ✅ SEULEMENT 3 STATUTS
  const statusConfig = {
    en_attente: { label: 'En attente', icon: Clock, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
    confirme: { label: 'Confirmée', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    annulee: { label: 'Annulée', icon: XCircle, color: 'text-red-400 bg-red-500/10 border-red-500/30' }
  };

  // ✅ SEULEMENT 3 OPTIONS
  const statusOptions = [
    { value: 'all', label: 'Tous' },
    { value: 'en_attente', label: 'En attente' },
    { value: 'confirmee', label: 'Confirmée' },
    { value: 'annulee', label: 'Annulée' }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await commandeService.getAll();
      console.log('📥 Commandes chargées:', response);
      setOrders(response.data || []);
    } catch (error) {
      console.error('❌ Erreur chargement commandes:', error);
      setError('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setIsUpdating(true);
    try {
      await commandeService.updateStatus(orderId, newStatus);
      setSuccess('✅ Statut mis à jour avec succès');
      loadOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la mise à jour');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!confirm('⚠️ Supprimer cette commande définitivement ?')) return;
    try {
      await commandeService.delete(orderId);
      setSuccess('✅ Commande supprimée');
      loadOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Erreur lors de la suppression');
      setTimeout(() => setError(''), 3000);
    }
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.statut !== statusFilter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const reference = order.reference || order.id || '';
      const user = order.user?.nom || order.user?.prenom || '';
      return reference.toString().includes(search) || 
             user.toLowerCase().includes(search) ||
             (order.user?.email || '').toLowerCase().includes(search);
    }
    return true;
  });

  // ✅ STATISTIQUES CORRIGÉES
  const stats = {
    total: orders.length,
    en_attente: orders.filter(o => o.statut === 'en_attente').length,
    confirme: orders.filter(o => o.statut === 'confirmee').length,
    annulee: orders.filter(o => o.statut === 'annulee').length,
    totalAmount: orders.reduce((sum, o) => {
      const montant = parseFloat(o.montant_total) || 0;
      return sum + montant;
    }, 0)
  };

  const formatPrix = (prix) => {
    return prix?.toLocaleString() + ' Ar' || '0 Ar';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Modal Détails
  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;

    const orderStatus = selectedOrder.statut || 'en_attente';
    const StatusIcon = statusConfig[orderStatus]?.icon || Clock;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-[#D4AF37]/30 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl shadow-[#D4AF37]/10">
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
                Commande {selectedOrder.reference || `#${selectedOrder.id}`}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[orderStatus]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                  <StatusIcon className="w-3 h-3 inline mr-1" />
                  {statusConfig[orderStatus]?.label || orderStatus}
                </span>
                <span className="text-gray-400 text-sm">
                  {formatDate(selectedOrder.createdAt || selectedOrder.date_reservation)}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Client */}
          <div className="bg-[#1A1A24] rounded-xl p-4 mb-4">
            <h3 className="text-[#D4AF37] text-sm font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Client
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs">Nom</p>
                <p className="text-white">
                  {selectedOrder.user?.prenom} {selectedOrder.user?.nom}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Email</p>
                <p className="text-white">{selectedOrder.user?.email}</p>
              </div>
              {selectedOrder.user?.telephone && (
                <div>
                  <p className="text-gray-400 text-xs">Téléphone</p>
                  <p className="text-white">{selectedOrder.user?.telephone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Produits */}
          <div className="bg-[#1A1A24] rounded-xl p-4 mb-4">
            <h3 className="text-[#D4AF37] text-sm font-semibold mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produits
            </h3>
            <div className="space-y-2">
              {(selectedOrder.details || selectedOrder.reservationDetails || []).map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white">{item.produit?.nom || item.nom || 'Produit'}</p>
                    <p className="text-gray-400 text-xs">×{item.quantite || 1}</p>
                  </div>
                  <p className="text-[#D4AF37] font-semibold">
                    {formatPrix((item.prix_unitaire || item.prix || 0) * (item.quantite || 1))}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
              <span className="text-gray-400">Total</span>
              <span className="text-[#D4AF37] text-xl font-bold">
                {formatPrix(selectedOrder.montant_total || 0)}
              </span>
            </div>
          </div>

          {/* Livraison */}
          <div className="bg-[#1A1A24] rounded-xl p-4 mb-4">
            <h3 className="text-[#D4AF37] text-sm font-semibold mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Livraison
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs">Type</p>
                <p className="text-white">
                  {selectedOrder.typereservation === 'livraison' ? '🚚 Livraison' : '🏪 Retrait en salle'}
                </p>
              </div>
              {selectedOrder.dateRetrait && (
                <div>
                  <p className="text-gray-400 text-xs">Date de retrait</p>
                  <p className="text-white">{new Date(selectedOrder.dateRetrait).toLocaleDateString('fr-FR')}</p>
                </div>
              )}
              {selectedOrder.adresse_livraion && (
                <div className="col-span-2">
                  <p className="text-gray-400 text-xs">Adresse</p>
                  <p className="text-white">{selectedOrder.adresse_livraion}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <select
              value={orderStatus}
              onChange={(e) => {
                handleStatusChange(selectedOrder.id, e.target.value);
                setShowDetailsModal(false);
              }}
              disabled={isUpdating}
              className="flex-1 bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
            >
              {statusOptions.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-6 py-2.5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/5 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* En-tête */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
              Gestion des commandes
            </h1>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              Suivez et gérez toutes les commandes
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              {orders.length} commandes total
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadOrders}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#12121A] border border-white/10 rounded-xl text-gray-300 hover:border-[#D4AF37]/50 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Rafraîchir
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#12121A] border border-white/10 rounded-xl text-gray-300 hover:border-[#D4AF37]/50 transition">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
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
              <CheckIcon className="w-4 h-4" />
              {success}
            </p>
          </div>
        )}

        {/* Statistiques - 4 cartes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#12121A] rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-xs">Total</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-[#12121A] rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-xs">En attente</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.en_attente}</p>
          </div>
          <div className="bg-[#12121A] rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-xs">Confirmées</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.confirme}</p>
          </div>
          <div className="bg-[#12121A] rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-xs">CA total</p>
            <p className="text-2xl font-bold text-[#D4AF37]">
              {stats.totalAmount.toLocaleString()} Ar
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {statusOptions.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatusFilter(s.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                  statusFilter === s.value
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-[#12121A] text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex-1 relative ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une commande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#12121A] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Tableau */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">Chargement des commandes...</p>
            </div>
          </div>
        ) : (
          <div className="bg-[#12121A] rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1A1A24] border-b border-white/10">
                  <tr>
                    <th className="text-left p-4 text-gray-400 font-medium">Commande</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Client</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Montant</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Statut</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-8 text-gray-400">
                        Aucune commande trouvée
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const orderStatus = order.statut || 'en_attente';
                      const StatusIcon = statusConfig[orderStatus]?.icon || Clock;
                      return (
                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="w-4 h-4 text-gray-500" />
                              <span className="text-white font-mono text-sm">
                                {order.reference || `#${order.id}`}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="text-white text-sm">
                                {order.user?.prenom} {order.user?.nom}
                              </p>
                              <p className="text-gray-500 text-xs">{order.user?.email}</p>
                            </div>
                          </td>
                          <td className="p-4 text-gray-300 text-sm">
                            {formatDate(order.createdAt || order.date_reservation)}
                          </td>
                          <td className="p-4 text-[#D4AF37] font-semibold">
                            {formatPrix(order.montant_total || 0)}
                          </td>
                          <td className="p-4">
                            <select
                              value={orderStatus}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[orderStatus]?.color || 'bg-gray-500/20 text-gray-400'} focus:outline-none cursor-pointer`}
                              disabled={isUpdating}
                            >
                              {statusOptions.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openDetails(order)}
                                className="p-1.5 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37] hover:bg-[#D4AF37]/20 transition"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(order.id)}
                                className="p-1.5 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Détails */}
      {showDetailsModal && <OrderDetailsModal />}
    </div>
  );
};

export default AdminCommandes;