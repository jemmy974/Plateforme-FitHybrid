import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Eye, Package, Calendar, 
  Truck, MapPin, CreditCard, CheckCircle, 
  Clock, XCircle, AlertCircle, ChevronRight,
  Loader2, ArrowLeft, X, User
} from 'lucide-react';
import { commandeService } from '../services/commandeService';
import authService from '../services/authService';

const MesCommandes = () => {
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const statusConfig = {
    en_attente: { label: 'En attente', icon: Clock, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
    confirme: { label: 'Confirmée', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    annulee: { label: 'Annulée', icon: XCircle, color: 'text-red-400 bg-red-500/10 border-red-500/30' }
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    loadCommandes(user.id);
  }, []);

  const loadCommandes = async (userId) => {
    setLoading(true);
    try {
      const response = await commandeService.getByUser(userId);
      console.log('📥 Commandes:', response);
      setCommandes(response || []);
    } catch (error) {
      console.error('❌ Erreur:', error);
      setError('Impossible de charger vos commandes');
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (commande) => {
    setSelectedCommande(commande);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedCommande(null);
  };

  const formatPrix = (prix) => {
    return prix?.toLocaleString() + ' Ar' || '0 Ar';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (statut) => {
    const config = statusConfig[statut] || statusConfig.en_attente;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <config.icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-[#12121A] rounded-xl hover:bg-white/10 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
              Mes commandes
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {commandes.length} commande{commandes.length > 1 ? 's' : ''} passée{commandes.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          </div>
        )}

        {/* Liste des commandes */}
        {commandes.length === 0 ? (
          <div className="bg-[#12121A] rounded-2xl border border-white/10 p-12 text-center">
            <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <h3 className="text-white font-semibold text-lg">Aucune commande</h3>
            <p className="text-gray-400 text-sm mt-2">
              Vous n'avez pas encore passé de commande.
            </p>
            <button
              onClick={() => navigate('/boutique')}
              className="mt-4 px-6 py-2 bg-[#D4AF37] text-black rounded-xl font-medium hover:bg-[#D4AF37]/90 transition"
            >
              Découvrir la boutique
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {commandes.map((commande) => {
              const total = commande.montant_total || 0;
              const details = commande.details || commande.reservationDetails || [];
              const nbProduits = details.length;

              return (
                <div
                  key={commande.id}
                  className="bg-[#12121A] rounded-2xl border border-white/10 p-5 hover:border-[#D4AF37]/40 transition cursor-pointer"
                  onClick={() => openDetails(commande)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Infos principales */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-white font-medium">
                          {commande.reference || `#${commande.id}`}
                        </span>
                        {getStatusBadge(commande.statut)}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(commande.createdAt || commande.date_reservation)}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {nbProduits} produit{nbProduits > 1 ? 's' : ''}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <span className="flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          {commande.typereservation === 'livraison' ? 'Livraison' : 'Retrait en salle'}
                        </span>
                      </div>
                    </div>

                    {/* Prix & action */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-[#D4AF37] font-bold text-lg">
                        {formatPrix(total)}
                      </p>
                      <button className="text-[#D4AF37] text-sm font-medium hover:underline flex items-center gap-1">
                        Voir détails
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== MODAL DÉTAILS ===== */}
      {showDetails && selectedCommande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-[#D4AF37]/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl shadow-[#D4AF37]/10">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                  {selectedCommande.reference || `#${selectedCommande.id}`}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  {getStatusBadge(selectedCommande.statut)}
                  <span className="text-gray-400 text-sm">
                    {formatDate(selectedCommande.createdAt || selectedCommande.date_reservation)}
                  </span>
                </div>
              </div>
              <button
                onClick={closeDetails}
                className="p-2 hover:bg-white/10 rounded-xl transition"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Produits */}
            <div className="bg-[#1A1A24] rounded-xl p-4 mb-4">
              <h3 className="text-[#D4AF37] text-sm font-semibold mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Produits
              </h3>
              <div className="space-y-2">
                {(selectedCommande.details || selectedCommande.reservationDetails || []).map((item, index) => (
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
                  {formatPrix(selectedCommande.montant_total || 0)}
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
                    {selectedCommande.typereservation === 'livraison' ? '🚚 Livraison' : '🏪 Retrait en salle'}
                  </p>
                </div>
                {selectedCommande.dateRetrait && (
                  <div>
                    <p className="text-gray-400 text-xs">Date de retrait</p>
                    <p className="text-white">{formatDate(selectedCommande.dateRetrait)}</p>
                  </div>
                )}
                {selectedCommande.adresse_livraion && (
                  <div className="col-span-2">
                    <p className="text-gray-400 text-xs">Adresse</p>
                    <p className="text-white">{selectedCommande.adresse_livraion}</p>
                  </div>
                )}
              </div>
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
                    {selectedCommande.user?.prenom} {selectedCommande.user?.nom}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Email</p>
                  <p className="text-white">{selectedCommande.user?.email}</p>
                </div>
              </div>
            </div>

            {/* Bouton fermer */}
            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                onClick={closeDetails}
                className="px-6 py-2.5 bg-[#D4AF37] text-black rounded-xl font-semibold hover:bg-[#D4AF37]/90 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesCommandes;