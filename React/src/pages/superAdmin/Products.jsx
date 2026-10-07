import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Package, Search, Eye, Trash2, X,
    CheckCircle, XCircle, AlertCircle, Edit
} from 'lucide-react';
import authService from '../../services/authService';
import api from '../../services/api';

const SuperAdminProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
            const response = await api.get('/superadmin/products');
            setProducts(response.data.data || []);
        } catch (error) {
            console.error('Erreur chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('⚠️ Supprimer définitivement ce produit ?')) return;
        try {
            await api.delete(`/superadmin/products/${id}`);
            alert('✅ Produit supprimé !');
            await loadData();
        } catch (error) {
            alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleVerify = async (id, verifie) => {
        try {
            await api.patch(`/superadmin/products/${id}/verify`, { verifie });
            alert(`✅ Produit ${verifie ? 'vérifié' : 'non vérifié'} !`);
            await loadData();
        } catch (error) {
            alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
        }
    };

    const filteredProducts = products.filter(p =>
        p.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <h1 className="text-2xl font-bold text-white">📦 Gestion des produits</h1>
                        <p className="text-gray-400 text-sm mt-1">{products.length} produits publiés</p>
                    </div>
                </div>

                {/* Recherche */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#12121A] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition"
                    />
                </div>

                {/* Tableau */}
                <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#1A1A24] border-b border-white/10">
                                <tr>
                                    <th className="text-left p-4 text-gray-400 font-medium">Produit</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Prix</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Stock</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Vérifié</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center p-8 text-gray-400">
                                            Aucun produit trouvé
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                                                        <Package className="w-5 h-5 text-[#D4AF37]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{product.nom}</p>
                                                        <p className="text-gray-400 text-xs line-clamp-1">{product.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-[#D4AF37] font-semibold">
                                                {Number(product.prix).toLocaleString()} Ar
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                    product.stock > 20 ? 'text-emerald-400 bg-emerald-500/10' :
                                                    product.stock > 5 ? 'text-yellow-400 bg-yellow-500/10' :
                                                    'text-red-400 bg-red-500/10'
                                                }`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleVerify(product.id, !product.verifie)}
                                                    className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                                                        product.verifie
                                                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                                    }`}
                                                >
                                                    {product.verifie ? '✅ Vérifié' : '⏳ En attente'}
                                                </button>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-1.5 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 transition"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminProducts;
