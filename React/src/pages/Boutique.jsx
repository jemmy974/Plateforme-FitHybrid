import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Search, Filter, Star, MapPin, CheckCircle,
  Flame, Sparkles, TrendingUp, Award, Eye, Heart,
  X, Plus, Minus, Trash2, User, Clock, Zap,
  Calendar, Truck, Store, Phone, CreditCard
} from 'lucide-react';
import { produitService } from '../services/produitService';
// import authService from '../services/authService';
import { reservationService } from '../services/reservationService';
import authService from '../services/authService';

const PAGE_SIZE = 8;

function Boutique() {
  const navigate = useNavigate();
  
  // ===== ÉTATS PRODUITS =====
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // ===== ÉTATS PANIER =====
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  
  // ===== ÉTATS PRODUITS SPÉCIFIQUES =====
  const [nouveaux, setNouveaux] = useState([]);
  const [populaires, setPopulaires] = useState([]);
  const [reco, setReco] = useState([]);
  
  // ===== ÉTATS MODAL =====
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  
  // ✅ FORMULAIRE
  const [formData, setFormData] = useState({
    date_retrait: '',
    type_livraison: 'retrait_salle',
    adresse_livraison: '',
    telephone: '',
    mode_paiement: 'mobile_money',
    instructions: ''
  });

  const user = authService.getCurrentUser();

  // ===== FONCTIONS =====
  const getCurrentUser = () => authService.getCurrentUser();

  const loadData = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      const objectif_id = currentUser?.objectif_id || 1;
      const [produitsRes, categoriesRes, nouveauxRes, populairesRes, recommandationsRes] = await Promise.all([
        produitService.getAll({
          search,
          categorie_id: selectedCategory === 'all' ? undefined : selectedCategory,
          page,
          limit: PAGE_SIZE,
        }),
        produitService.getCategories(),
        produitService.getNouveauxArrivages(),
        produitService.getMostPopular(),
        produitService.getRecommandations(objectif_id),
      ]);

      setProduits(produitsRes?.data || []);
      setTotal(produitsRes?.total || 0);
      setCategories(categoriesRes?.data || []);
      setNouveaux(nouveauxRes?.data || []);
      setPopulaires(populairesRes?.data || []);
      setReco(recommandationsRes?.data || []);
    } catch (error) {
      console.error('[Boutique] Erreur chargement produits', error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeCartItems = (panier) => {
    const cartData = panier?.details || panier?.reservationDetails || panier?.reservationDetail || panier?.data || panier;
    const details = Array.isArray(cartData)
      ? cartData
      : cartData?.details || cartData?.reservationDetails || cartData?.reservationDetail || [];
    return details.map((detail) => ({
      id: detail.produit_id,
      nom: detail.produit?.nom || detail.produit?.nomP || 'Produit',
      description: detail.produit?.description || '',
      image: detail.produit?.image || '',
      prix: Number(detail.prix_unitaire || detail.produit?.prix || 0),
      qty: Number(detail.quantite || 1),
      stock: detail.produit?.stock || 0,
    }));
  };

  const loadCart = async () => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      setCart([]);
      return [];
    }
    setCartLoading(true);
    try {
      const panier = await reservationService.getCart(currentUser.id);
      const normalized = normalizeCartItems(panier);
      setCart(normalized);
      return normalized;
    } catch (error) {
      console.error('[Boutique] Erreur chargement panier', error);
      setCart([]);
      return [];
    } finally {
      setCartLoading(false);
    }
  };

  const ensureLoggedIn = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('Veuillez vous connecter pour ajouter des produits au panier.');
      navigate('/login');
      return null;
    }
    return currentUser;
  };

  const addToCart = async (produit) => {
    const currentUser = ensureLoggedIn();
    if (!currentUser) return;
    try {
      await reservationService.addToCart(currentUser.id, produit.id, 1);
      setCartMessage('✅ Produit ajouté au panier');
      await loadCart();
      setTimeout(() => setCartMessage(''), 3000);
    } catch (error) {
      console.error('[Boutique] Impossible d\'ajouter au panier', error);
      alert(error?.response?.data?.message || error.message || 'Impossible d\'ajouter au panier');
    }
  };

  const removeFromCart = async (id) => {
    const currentUser = ensureLoggedIn();
    if (!currentUser) return;
    try {
      await reservationService.removeFromCart(currentUser.id, id);
      await loadCart();
      setCartMessage('🗑️ Produit retiré du panier');
      setTimeout(() => setCartMessage(''), 3000);
    } catch (error) {
      console.error('[Boutique] Impossible de retirer du panier', error);
      alert(error?.response?.data?.message || error.message || 'Impossible de retirer le produit');
    }
  };

  const validateCart = async () => {
    const currentUser = ensureLoggedIn();
    if (!currentUser) return;

    const items = await loadCart();
    if (items.length === 0) {
      setCartMessage('Le panier est vide.');
      return;
    }

    setShowConfirmModal(true);
  };

  const resetFormData = () => {
    setFormData({
      date_retrait: '',
      type_livraison: 'retrait_salle',
      adresse_livraison: '',
      telephone: '',
      mode_paiement: 'mobile_money',
      instructions: ''
    });
  };

  const confirmValidation = async () => {
    setConfirmLoading(true);
    try {
      const userId = user?.id || authService.getCurrentUser()?.id;

      if (!userId) {
        alert('Veuillez vous connecter');
        navigate('/login');
        return;
      }

      await reservationService.validateCart(userId, {
        date_retrait: formData.date_retrait,
        type_livraison: formData.type_livraison,
        adresse_livraison: formData.adresse_livraison,
        telephone: formData.telephone,
        mode_paiement: formData.mode_paiement,
        instructions: formData.instructions
      });

      setCart([]);
      setCartMessage('✅ Réservation confirmée avec succès !');
      setShowConfirmModal(false);
      resetFormData();
      setTimeout(() => setCartMessage(''), 3000);

    } catch (error) {
      console.error('[Boutique] Erreur validation panier', error);
      alert(error?.response?.data?.message || error.message || 'Impossible de valider le panier');
    } finally {
      setConfirmLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, selectedCategory, page]);

  useEffect(() => {
    loadCart();
  }, []);

  const totalCart = useMemo(() => cart.reduce((sum, item) => sum + Number(item.prix) * item.qty, 0), [cart]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // ===== FORMAT PRIX =====
  const formatPrix = (prix) => {
    return prix?.toLocaleString() + ' Ar' || '0 Ar';
  };

  // ===== RENDER STARS =====
  const renderStars = (note) => {
    const fullStars = Math.floor(note || 0);
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < fullStars
              ? 'fill-yellow-500 text-yellow-500'
              : 'fill-gray-600 text-gray-600'
              }`}
          />
        ))}
        <span className="text-white text-xs font-medium ml-1">{note || 0}</span>
      </div>
    );
  };


    const ProductCard = ({ produit }) => {
    // ✅ Construire l'URL complète de l'image
    const isNew = produit.est_nouveau;
    const isPopular = produit.popularite > 50;
    const hasDiscount = produit.ancien_prix && produit.ancien_prix > produit.prix;
    const discountPercent = hasDiscount ? Math.round((1 - produit.prix / produit.ancien_prix) * 100) : 0;
    const imageUrl = produit.image 
        ? (produit.image.startsWith('http') || produit.image.startsWith('data:')
            ? produit.image 
            : `http://localhost:5000${produit.image}`)
        : '';

    return (
      <div className="group bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/50 hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-[#D4AF37]/10">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={produit.nom}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <ShoppingBag className="w-16 h-16 text-[#D4AF37]/20" />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && (
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Nouveau
              </span>
            )}
            {isPopular && (
              <span className="px-2.5 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Populaire
              </span>
            )}
            {hasDiscount && (
              <span className="px-2.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-medium">
                -{discountPercent}%
              </span>
            )}
          </div>

          <button className="absolute bottom-3 right-3 p-2 bg-black/60 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#D4AF37] hover:text-black">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Infos */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-white group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-1">
                {produit.nom}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                <CheckCircle className="w-3 h-3 text-[#D4AF37]" />
                <span>@Vendeur</span>
                {renderStars(produit.note)}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>{produit.categorie?.nom || 'Analamanga'}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-[#D4AF37] font-bold text-lg">{formatPrix(produit.prix)}</span>
              {produit.ancien_prix && (
                <div className="text-gray-500 text-xs line-through">{formatPrix(produit.ancien_prix)}</div>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <div className="w-5 h-5 rounded-full bg-green-600 border border-white/20 cursor-pointer hover:scale-110 transition" />
            <div className="w-5 h-5 rounded-full bg-yellow-500 border border-white/20 cursor-pointer hover:scale-110 transition" />
            <div className="w-5 h-5 rounded-full bg-orange-500 border border-white/20 cursor-pointer hover:scale-110 transition" />
          </div>

          <button
            onClick={() => addToCart(produit)}
            className="w-full mt-3 py-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-xl text-[#D4AF37] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-black transition-all duration-300 group/btn"
          >
            <ShoppingBag className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
            Ajouter au panier
          </button>
        </div>
      </div>
    );
  };

  // ===== RENDU =====
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ===== HEADER ===== */}
        <div className="relative bg-gradient-to-br from-[#0A0A0F] via-[#1A1A24] to-[#0A0A0F] border-b border-white/5 -mx-4 px-4 py-12 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-transparent"></div>
          <div className="relative flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Nouveautés disponibles</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Boutique Fitness
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mt-2">
              Découvrez les meilleurs produits pour votre transformation.
            </p>

            {/* Barre de recherche */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl mt-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                <input
                  value={search}
                  onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                  placeholder="Rechercher un produit..."
                  className="w-full bg-[#1A1A24] border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => { setPage(1); setSelectedCategory(e.target.value); }}
                className="bg-[#1A1A24] border border-white/10 rounded-full px-5 py-3.5 text-white focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nomCat || cat.nom}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ===== MESSAGE ===== */}
        {cartMessage && (
          <div className={`p-4 rounded-xl mb-6 ${cartMessage.includes('✅')
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}>
            <p className="text-sm flex items-center gap-2">{cartMessage}</p>
          </div>
        )}

        {/* ===== GRILLE PRINCIPALE ===== */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">

          {/* ===== PRODUITS ===== */}
          <div className="space-y-12">

            {/* HOT DEALS */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <Flame className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37]" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Hot Deals</h2>
                  <p className="text-gray-400 text-sm">Promotions limitées à ne pas manquer</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {loading ? (
                  <div className="col-span-full flex items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
                  </div>
                ) : populaires.slice(0, 4).length > 0 ? (
                  populaires.slice(0, 4).map((produit) => (
                    <ProductCard key={produit.id} produit={produit} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-400">
                    <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p>Aucun produit en promotion</p>
                  </div>
                )}
              </div>
            </section>

            {/* NEW ARRIVALS */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <Sparkles className="w-6 h-6 text-blue-400" />
                <div>
                  <h2 className="text-2xl font-bold text-white">New Arrivals</h2>
                  <p className="text-gray-400 text-sm">Nouveautés fraîchement ajoutées</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {loading ? (
                  <div className="col-span-full flex items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
                  </div>
                ) : nouveaux.slice(0, 4).length > 0 ? (
                  nouveaux.slice(0, 4).map((produit) => (
                    <ProductCard key={produit.id} produit={produit} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-400">
                    <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p>Aucune nouveauté pour le moment</p>
                  </div>
                )}
              </div>
            </section>

            {/* MOST POPULAR */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Most Popular</h2>
                  <p className="text-gray-400 text-sm">Les produits les plus populaires</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {loading ? (
                  <div className="col-span-full flex items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
                  </div>
                ) : populaires.slice(4, 8).length > 0 ? (
                  populaires.slice(4, 8).map((produit) => (
                    <ProductCard key={produit.id} produit={produit} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-400">
                    <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p>Aucun produit populaire</p>
                  </div>
                )}
              </div>
            </section>

            {/* RECOMMENDED */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <Award className="w-6 h-6 text-purple-400" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Recommandé pour vous</h2>
                  <p className="text-gray-400 text-sm">Basé sur vos objectifs</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {loading ? (
                  <div className="col-span-full flex items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
                  </div>
                ) : reco.length > 0 ? (
                  reco.slice(0, 4).map((produit) => (
                    <ProductCard key={produit.id} produit={produit} />
                  ))
                ) : (
                  <div className="col-span-full bg-[#12121A] rounded-2xl border border-white/10 p-8 text-center">
                    <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">Aucune recommandation disponible</p>
                    <p className="text-gray-500 text-sm mt-1">Complétez votre profil pour recevoir des recommandations</p>
                  </div>
                )}
              </div>
            </section>

            {/* TOUS LES PRODUITS */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-bold text-white">Tous les produits</h2>
                  <p className="text-gray-400 text-sm">{total} produits disponibles</p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-10 h-10 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
                </div>
              ) : produits.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {produits.map((produit) => (
                      <ProductCard key={produit.id} produit={produit} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-6 py-2.5 bg-[#12121A] border border-white/10 rounded-xl text-gray-400 hover:border-[#D4AF37] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Précédent
                    </button>
                    <span className="text-gray-400 text-sm">
                      Page <span className="text-white font-medium">{page}</span> / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="px-6 py-2.5 bg-[#12121A] border border-white/10 rounded-xl text-gray-400 hover:border-[#D4AF37] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant →
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-[#12121A] rounded-2xl border border-white/10">
                  <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Aucun produit trouvé</p>
                  <p className="text-gray-500 text-sm mt-1">Essayez de modifier votre recherche</p>
                </div>
              )}
            </section>
          </div>

          {/* ===== PANIER ===== */}
          <aside className="xl:sticky xl:top-8 self-start">
            <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-5">
                <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
                <h2 className="text-xl font-bold text-white">Mon panier</h2>
                {cart.length > 0 && (
                  <span className="ml-auto px-2.5 py-0.5 bg-[#D4AF37] text-black rounded-full text-xs font-semibold">
                    {cart.length}
                  </span>
                )}
              </div>

              {cartLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Votre panier est vide</p>
                  <p className="text-gray-500 text-xs mt-1">Ajoutez des produits pour commencer</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-[#D4AF37]/30">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2.5 bg-[#1A1A24] rounded-xl border border-white/5">
                      <div className="w-12 h-12 bg-[#0F0F15] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.nom} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingBag className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.nom}</p>
                        <p className="text-[#D4AF37] text-xs font-semibold">{(Number(item.prix) * item.qty).toLocaleString()} Ar</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-[#D4AF37]">{totalCart.toLocaleString()} Ar</span>
                </div>
                <button
                  onClick={validateCart}
                  disabled={cart.length === 0 || cartLoading}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8940F] text-black rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cartLoading ? 'Patientez...' : 'Valider le panier'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ===== MODAL DE CONFIRMATION ===== */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-[#D4AF37]/30 w-full max-w-lg p-6 shadow-2xl shadow-[#D4AF37]/10 max-h-[90vh] overflow-y-auto">

            {/* HEADER */}
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h2 className="text-xl font-bold text-white">Confirmer la réservation</h2>
              <p className="text-gray-400 text-sm mt-1">
                Remplissez les informations pour finaliser
              </p>
            </div>

            {/* ===== RÉCAPITULATIF ===== */}
            <div className="bg-[#1A1A24] rounded-xl p-4 mb-4">
              <p className="text-gray-400 text-sm mb-2">📦 Produits réservés</p>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">Panier vide</p>
              ) : (
                <>
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0">
                      <div>
                        <span className="text-white">{item.nom}</span>
                        <span className="text-gray-400 text-xs ml-2">×{item.qty}</span>
                      </div>
                      <span className="text-[#D4AF37] font-medium">
                        {(item.prix * item.qty).toLocaleString()} Ar
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 mt-3 pt-3 flex justify-between font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-[#D4AF37] text-lg">
                      {cart.reduce((sum, item) => sum + (item.prix * item.qty), 0).toLocaleString()} Ar
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* ===== FORMULAIRE ===== */}
            <form onSubmit={(e) => { e.preventDefault(); confirmValidation(); }} className="space-y-4">

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
                  className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Type de réservation */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <Truck className="w-4 h-4 inline mr-2 text-[#D4AF37]" />
                  Type de réservation
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type_livraison: 'retrait_salle' })}
                    className={`p-3 rounded-xl border transition ${formData.type_livraison === 'retrait_salle'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-white/10 hover:border-[#D4AF37]/50'
                      }`}
                  >
                    <Store className={`w-5 h-5 mx-auto ${formData.type_livraison === 'retrait_salle' ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                    <span className={`text-xs ${formData.type_livraison === 'retrait_salle' ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
                      Retrait en salle
                    </span>
                    <span className="text-[10px] text-gray-500 block">Gratuit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type_livraison: 'livraison' })}
                    className={`p-3 rounded-xl border transition ${formData.type_livraison === 'livraison'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-white/10 hover:border-[#D4AF37]/50'
                      }`}
                  >
                    <Truck className={`w-5 h-5 mx-auto ${formData.type_livraison === 'livraison' ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                    <span className={`text-xs ${formData.type_livraison === 'livraison' ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
                      Livraison
                    </span>
                    <span className="text-[10px] text-gray-500 block">5 000 Ar</span>
                  </button>
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
                    value={formData.adresse_livraison}
                    onChange={(e) => setFormData({ ...formData, adresse_livraison: e.target.value })}
                    className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition"
                    rows="2"
                    placeholder="Votre adresse complète..."
                    required={formData.type_livraison === 'livraison'}
                  />
                </div>
              )}

              {/* Téléphone */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <Phone className="w-4 h-4 inline mr-2 text-[#D4AF37]" />
                  Numéro de téléphone <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition"
                  placeholder="032 00 000 00"
                  required
                />
              </div>

              {/* Mode de paiement */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <CreditCard className="w-4 h-4 inline mr-2 text-[#D4AF37]" />
                  Mode de paiement
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'mobile_money', label: 'Mobile Money', icon: '📱' },
                    { value: 'carte', label: 'Carte bancaire', icon: '💳' },
                    { value: 'especes', label: 'Espèces', icon: '💰' }
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, mode_paiement: mode.value })}
                      className={`p-3 rounded-xl border transition text-center ${formData.mode_paiement === mode.value
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-white/10 hover:border-[#D4AF37]/50'
                        }`}
                    >
                      <span className="text-2xl block mb-1">{mode.icon}</span>
                      <span className={`text-xs ${formData.mode_paiement === mode.value ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
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
                  className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition"
                  rows="2"
                  placeholder="Informations supplémentaires..."
                />
              </div>

              {/* BOUTONS */}
              <div className="flex gap-3 pt-2 border-t border-white/10">
                <button
                  type="submit"
                  disabled={confirmLoading || cart.length === 0}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B8940F] text-black py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition disabled:opacity-50"
                >
                  {confirmLoading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto"></div>
                  ) : (
                    '✅ Confirmer la réservation'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowConfirmModal(false); resetFormData(); }}
                  className="px-6 py-3 border border-white/10 rounded-xl text-gray-400 hover:bg-white/5 transition"
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
}

export default Boutique;
