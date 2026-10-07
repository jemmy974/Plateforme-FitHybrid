import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Calendar, MapPin, CreditCard, Truck, 
    Store, CheckCircle, ArrowLeft, AlertCircle,
    ShoppingBag
} from 'lucide-react';
import { reservationService } from '../services/reservationService';
import authService from '../services/authService';

const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    // Formulaire
    const [formData, setFormData] = useState({
        date_retrait: '',
        type_livraison: 'retrait_salle', // 'retrait_salle' ou 'livraison'
        adresse: '',
        mode_paiement: 'mobile_money',
        instructions: ''
    });

    // Options
    const typesLivraison = [
        { value: 'retrait_salle', label: 'Retrait en salle', icon: Store, price: 0 },
        { value: 'livraison', label: 'Livraison à domicile', icon: Truck, price: 5000 }
    ];

    const modesPaiement = [
        { value: 'mobile_money', label: 'Mobile Money', icon: '📱' },
        { value: 'carte', label: 'Carte bancaire', icon: '💳' },
        { value: 'especes', label: 'Espèces', icon: '💰' }
    ];

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        loadCart(currentUser.id);
    }, []);

    const loadCart = async (userId) => {
        try {
            const panier = await reservationService.getCart(userId);
            const items = panier?.details || panier?.reservationDetails || panier?.reservationDetail || [];
            setCart(items);
        } catch (error) {
            console.error('Erreur chargement panier', error);
            setError('Impossible de charger votre panier');
        } finally {
            setLoading(false);
        }
    };

    const totalCart = cart.reduce((sum, item) => {
        const prix = Number(item.prix_unitaire || item.produit?.prix || 0);
        const qty = Number(item.quantite || 1);
        return sum + (prix * qty);
    }, 0);

    const fraisLivraison = formData.type_livraison === 'livraison' ? 5000 : 0;
    const totalFinal = totalCart + fraisLivraison;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await reservationService.validateCart(user.id, {
                date_retrait: formData.date_retrait,
                type_livraison: formData.type_livraison,
                adresse_livraison: formData.adresse,
                mode_paiement: formData.mode_paiement,
                instructions: formData.instructions
            });

            alert('✅ Réservation confirmée !');
            navigate('/mes-reservations');

        } catch (error) {
            setError(error.response?.data?.message || 'Erreur lors de la validation');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Votre panier est vide</p>
                    <button 
                        onClick={() => navigate('/boutique')}
                        className="mt-4 text-[#D4AF37] hover:underline"
                    >
                        Continuer vos achats →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0F] py-8 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => navigate('/boutique')}
                        className="p-2 bg-[#12121A] rounded-xl hover:bg-white/10 transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">🛒 Validation</h1>
                        <p className="text-gray-400 text-sm">Confirmez votre réservation</p>
                    </div>
                </div>

                {/* Erreur */}
                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <p className="text-red-400 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </p>
                    </div>
                )}

                {/* Récapitulatif */}
                <div className="bg-[#12121A] rounded-2xl border border-white/10 p-6 mb-6">
                    <h2 className="text-white font-semibold mb-4">📦 Produits réservés</h2>
                    <div className="space-y-3">
                        {cart.map((item, index) => {
                            const produit = item.produit || {};
                            const prix = Number(item.prix_unitaire || produit.prix || 0);
                            const qty = Number(item.quantite || 1);
                            return (
                                <div key={index} className="flex justify-between items-center pb-3 border-b border-white/5">
                                    <div>
                                        <p className="text-white">{produit.nom || 'Produit'}</p>
                                        <p className="text-gray-400 text-sm">×{qty}</p>
                                    </div>
                                    <p className="text-[#D4AF37] font-semibold">{(prix * qty).toLocaleString()} Ar</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex justify-between text-gray-400">
                            <span>Sous-total</span>
                            <span>{totalCart.toLocaleString()} Ar</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>Frais de livraison</span>
                            <span>{fraisLivraison.toLocaleString()} Ar</span>
                        </div>
                        <div className="flex justify-between text-white text-lg font-bold mt-2 pt-2 border-t border-white/10">
                            <span>Total</span>
                            <span className="text-[#D4AF37]">{totalFinal.toLocaleString()} Ar</span>
                        </div>
                    </div>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="bg-[#12121A] rounded-2xl border border-white/10 p-6 space-y-5">
                    
                    {/* Date de retrait */}
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            <Calendar className="w-4 h-4 inline mr-2 text-[#D4AF37]" />
                            Date de retrait <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="date"
                            value={formData.date_retrait}
                            onChange={(e) => setFormData({ ...formData, date_retrait: e.target.value })}
                            className="w-full bg-[#1A1A24] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition"
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Type de livraison */}
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-3">
                            <Truck className="w-4 h-4 inline mr-2 text-[#D4AF37]" />
                            Type de livraison
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {typesLivraison.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type_livraison: type.value })}
                                    className={`p-3 rounded-xl border transition ${
                                        formData.type_livraison === type.value
                                            ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                            : 'border-white/10 hover:border-[#D4AF37]/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <type.icon className={`w-5 h-5 ${
                                            formData.type_livraison === type.value 
                                                ? 'text-[#D4AF37]' 
                                                : 'text-gray-400'
                                        }`} />
                                        <div className="text-left">
                                            <p className="text-white text-sm">{type.label}</p>
                                            {type.price > 0 && (
                                                <p className="text-gray-400 text-xs">{type.price.toLocaleString()} Ar</p>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Adresse (si livraison) */}
                    {formData.type_livraison === 'livraison' && (
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                <MapPin className="w-4 h-4 inline mr-2 text-[#D4AF37]" />
                                Adresse de livraison <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                value={formData.adresse}
                                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                className="w-full bg-[#1A1A24] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition"
                                rows="2"
                                placeholder="Votre adresse complète..."
                                required={formData.type_livraison === 'livraison'}
                            />
                        </div>
                    )}

                    {/* Mode de paiement */}
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-3">
                            <CreditCard className="w-4 h-4 inline mr-2 text-[#D4AF37]" />
                            Mode de paiement
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {modesPaiement.map((mode) => (
                                <button
                                    key={mode.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, mode_paiement: mode.value })}
                                    className={`p-3 rounded-xl border transition text-center ${
                                        formData.mode_paiement === mode.value
                                            ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                            : 'border-white/10 hover:border-[#D4AF37]/50'
                                    }`}
                                >
                                    <span className="text-2xl block mb-1">{mode.icon}</span>
                                    <span className={`text-xs ${
                                        formData.mode_paiement === mode.value 
                                            ? 'text-[#D4AF37]' 
                                            : 'text-gray-400'
                                    }`}>
                                        {mode.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Instructions spéciales
                        </label>
                        <textarea
                            value={formData.instructions}
                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                            className="w-full bg-[#1A1A24] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition"
                            rows="2"
                            placeholder="Informations supplémentaires..."
                        />
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B8940F] text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#D4AF37]/20 transition disabled:opacity-50"
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Confirmer la réservation
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/boutique')}
                            className="px-6 py-3 border border-white/10 rounded-xl text-gray-400 hover:bg-white/5 transition"
                        >
                            Retour
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
