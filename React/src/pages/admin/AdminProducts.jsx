// src/pages/admin/Products.jsx
import { useEffect, useState } from 'react';
import {
  Plus, Search, Filter, Grid3x3, List, Edit, Trash2, Copy,
  Eye, MoreVertical, Tag, Package, TrendingUp, DollarSign,
  ShoppingBag, CheckCircle,
  AlertCircle,
  Sparkles,
  Star,
  X
} from 'lucide-react';
import ProductModal from './ProductModal';
import { produitService } from '../../services/produitService';
import { categorieService } from '../../services/categorieService';

const AdminProducts = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);


  const [showCategorieModal, setShowCategorieModal] = useState(false);
  const [nouvelleCategorie, setNouvelleCategorie] = useState({ nomCat: '', description: '', icone: '' });
  const [categorieLoading, setCategorieLoading] = useState(false);


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [produitsRes, categoriesRes] = await Promise.all([
        produitService.getAll(),
        categorieService.getAll()
      ]);

      setProducts(produitsRes?.data || []);
      setCategories(categoriesRes?.data || []);
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };
  const dynamicCategories = [
    { id: 'all', name: 'Tous', count: products.length, icon: Package },
    ...categories.map(cat => ({
      id: cat.id,
      name: cat.nom || cat.nomCat || 'Sans nom',
      count: products.filter(p => p.categorie_id === cat.id).length,
      icon: Tag
    }))
  ];
  // ===== FILTRAGE =====
  const filteredProducts = products.filter(p => {
    const matchSearch = p.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'all' || p.categorie_id === parseInt(selectedCategory);
    return matchSearch && matchCategory;
  });

  // ===== FORMATS =====
  const formatPrix = (prix) => {
    return prix?.toLocaleString() + ' Ar' || '0 Ar';
  };

  const getStatusColor = (statut) => {
    return statut === 'actif'
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      : 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };
  const getStockBadge = (stock) => {
    if (stock > 20) return { color: 'text-emerald-400 bg-emerald-500/10', label: '✅ Stock' };
    if (stock > 5) return { color: 'text-yellow-400 bg-yellow-500/10', label: '⚠️ Faible' };
    return { color: 'text-red-400 bg-red-500/10', label: '🚨 Rupture' };
  };

  // ===== CRUD =====
  const handleSave = async (data) => {
    try {
      let response;
      if (editingProduct) {
        response = await produitService.update(editingProduct.id, data);
        setSuccess('✅ Produit modifié avec succès !');
      } else {
        response = await produitService.create(data);
        setSuccess('✅ Produit créé avec succès !');
      }
      setShowModal(false);
      setEditingProduct(null);
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
      return response;
    } catch (error) {
      console.error('❌ Erreur:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('⚠️ Supprimer ce produit définitivement ?')) return;
    try {
      await produitService.delete(id);
      setSuccess('✅ Produit supprimé !');
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Erreur lors de la suppression');
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const openEditModal = (produit) => {
    setEditingProduct(produit);
    setShowModal(true);
  };
  // Ajouter une catégorie
const handleAddCategorie = async (e) => {
    e.preventDefault();
    if (!nouvelleCategorie.nomCat.trim()) {
        setError('Le nom de la catégorie est requis');
        return;
    }
    
    setCategorieLoading(true);
    try {
        await categorieService.create(nouvelleCategorie);
        setSuccess('✅ Catégorie ajoutée !');
        setShowCategorieModal(false);
        setNouvelleCategorie({ nomCat: '', description: '', icone: '' });
        await loadData(); // Recharger les catégories
        setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
        setError(error.response?.data?.message || 'Erreur lors de l\'ajout');
    } finally {
        setCategorieLoading(false);
    }
};

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ===== EN-TÊTE ===== */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
              Catalogue produits
            </h1>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              Gérez votre inventaire et vos produits
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              {products.length} produits disponibles
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="group flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8940F] text-black px-6 py-3 rounded-xl font-semibold shadow-lg shadow-[#D4AF37]/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Nouveau produit
          </button>
        </div>

        {/* ===== MESSAGES ===== */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </p>
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <p className="text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {success}
            </p>
          </div>
        )}

        {/* ===== BARRE DE RECHERCHE ===== */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#12121A] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-[#12121A] border border-white/10 rounded-xl text-gray-300 hover:border-[#D4AF37] hover:text-white transition-all duration-300">
            <Filter className="w-5 h-5" />
            Filtres
          </button>
          <div className="flex bg-[#12121A] rounded-xl border border-white/10 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-all duration-300 ${viewMode === 'grid'
                  ? 'bg-[#D4AF37] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg transition-all duration-300 ${viewMode === 'list'
                  ? 'bg-[#D4AF37] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ===== CATÉGORIES ===== */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-[#D4AF37]/30">
          {dynamicCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-300 whitespace-nowrap ${selectedCategory === cat.id
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                  : 'bg-[#12121A] border-white/10 text-gray-400 hover:text-white hover:border-[#D4AF37]/50'
                }`}
            >
              <cat.icon className={`w-4 h-4 ${selectedCategory === cat.id ? 'text-[#D4AF37]' : ''}`} />
              <span className="font-medium">{cat.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === cat.id ? 'bg-[#D4AF37]/30 text-[#D4AF37]' : 'bg-white/10 text-gray-400'
                }`}>
                {cat.count}
              </span>
            </button>
          ))}

          <button
            onClick={() => setShowCategorieModal(true)}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-dashed border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Catégorie</span>
          </button>
        </div>

        {/* ===== CHARGEMENT ===== */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">Chargement des produits...</p>
            </div>
          </div>
        ) : (
          <>
            {/* ===== VUE GRILLE ===== */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.length === 0 ? (
                  <div className="col-span-full text-center py-16">
                    <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Aucun produit trouvé</p>
                    <p className="text-gray-500 text-sm mt-1">Essayez de modifier votre recherche</p>
                  </div>
                ) : (
                  filteredProducts.map((product) => {
                    const stockBadge = getStockBadge(product.stock);
                    return (
                      <div
                        key={product.id}
                        className="group bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#D4AF37]/5 transition-all duration-500"
                      >
                        <div className="relative h-48 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] flex items-center justify-center overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.nom}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                              <Package className="w-12 h-12 text-[#D4AF37]/30" />
                            </div>
                          )}

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${product.statut === 'actif'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                              }`}>
                              {product.statut === 'actif' ? '● Actif' : '○ Inactif'}
                            </span>
                            {product.est_nouveau && (
                              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-medium flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Nouveau
                              </span>
                            )}
                          </div>

                          <div className={`absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${stockBadge.color}`}>
                            {stockBadge.label} ({product.stock})
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="font-semibold text-white group-hover:text-[#D4AF37] transition-colors duration-300 text-lg">
                            {product.nom}
                          </h3>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {categories.find(c => c.id === product.categorie_id)?.nom || 'N/A'}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mt-3">
                            <div>
                              <p className="text-[#D4AF37] font-bold text-xl">{formatPrix(product.prix)}</p>
                              {product.ancien_prix && (
                                <p className="text-gray-500 text-xs line-through">{formatPrix(product.ancien_prix)}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-gray-400 text-xs">
                                <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                                {product.note || 'N/A'}
                              </div>
                              <p className="text-gray-500 text-xs">{product.popularite || 0} ventes</p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => openEditModal(product)}
                              className="flex-1 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg text-[#D4AF37] text-sm font-medium hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                            >
                              <Edit className="w-4 h-4 inline mr-1" />
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 bg-red-500/10 border border-red-500/40 rounded-lg text-red-400 hover:bg-red-500/20 transition-all duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* ===== VUE LISTE ===== */
              <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#1A1A24] border-b border-white/10">
                      <tr>
                        <th className="text-left p-4 text-gray-400 font-medium">Produit</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Catégorie</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Prix</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Stock</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Ventes</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Statut</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center p-8 text-gray-400">
                            Aucun produit trouvé
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => {
                          const stockBadge = getStockBadge(product.stock);
                          return (
                            <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-all duration-300">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-[#1A1A24] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {product.image ? (
                                      <img src={product.image} alt={product.nom} className="w-full h-full object-cover" />
                                    ) : (
                                      <Package className="w-5 h-5 text-gray-500" />
                                    )}
                                  </div>
                                  <div>
                                    <span className="text-white font-medium">{product.nom}</span>
                                    {product.est_nouveau && (
                                      <span className="ml-2 text-xs text-blue-400">🆕</span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-gray-300">
                                {categories.find(c => c.id === product.categorie_id)?.nom || 'N/A'}
                              </td>
                              <td className="p-4">
                                <span className="text-[#D4AF37] font-semibold">{formatPrix(product.prix)}</span>
                                {product.ancien_prix && (
                                  <span className="ml-2 text-gray-500 text-xs line-through">
                                    {formatPrix(product.ancien_prix)}
                                  </span>
                                )}
                              </td>
                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${stockBadge.color}`}>
                                  {product.stock}
                                </span>
                              </td>
                              <td className="p-4 text-gray-300">{product.popularite || 0}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(product.statut)}`}>
                                  {product.statut === 'actif' ? '● Actif' : '○ Inactif'}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openEditModal(product)}
                                    className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-all duration-300"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(product.id)}
                                    className="p-1.5 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 transition-all duration-300"
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
          </>
        )}
      </div>

      {/* ===== MODAL AJOUT CATÉGORIE ===== */}
      {showCategorieModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-[#D4AF37]/30 w-full max-w-md p-6 shadow-2xl shadow-[#D4AF37]/10">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">🏷️ Nouvelle catégorie</h2>
              <button
                onClick={() => { setShowCategorieModal(false); setNouvelleCategorie({ nomCat: '', description: '', icone: '' }); }}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddCategorie} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Nom de la catégorie <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={nouvelleCategorie.nomCat}
                  onChange={(e) => setNouvelleCategorie({ ...nouvelleCategorie, nomCat: e.target.value })}
                  className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
                  placeholder="Nutrition, Équipement..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Icône (emoji)</label>
                <input
                  type="text"
                  value={nouvelleCategorie.icone}
                  onChange={(e) => setNouvelleCategorie({ ...nouvelleCategorie, icone: e.target.value })}
                  className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
                  placeholder="🥤, 👕, 🏋️..."
                  maxLength="5"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={nouvelleCategorie.description}
                  onChange={(e) => setNouvelleCategorie({ ...nouvelleCategorie, description: e.target.value })}
                  className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
                  rows="2"
                  placeholder="Description de la catégorie..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={categorieLoading}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B8940F] text-black py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 disabled:opacity-50"
                >
                  {categorieLoading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto"></div>
                  ) : (
                    'Ajouter la catégorie'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCategorieModal(false); setNouvelleCategorie({ nomCat: '', description: '', icone: '' }); }}
                  className="px-6 py-2.5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/5 transition-all duration-300"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL ===== */}
      <ProductModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingProduct(null); }}
        onSave={handleSave}
        produit={editingProduct}
        categories={categories}
        isLoading={false}
      />
    </div>
  );
};

export default AdminProducts;