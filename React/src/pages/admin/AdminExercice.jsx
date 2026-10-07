import { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, Grid3x3, List, Edit, Trash2,
  Eye, MoreVertical, Tag, Package, TrendingUp, DollarSign,
  ShoppingBag, CheckCircle, AlertCircle, Sparkles, Star, X,
  Play, Dumbbell, Clock, Target, Flame
} from 'lucide-react';
import AddExerciceModal from './AddExerciceModal';
import { exerciceService } from '../../services/exerciceService';
// import { exerciceService  from '../../services/exerciceService';

const AdminExercice = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedNiveau, setSelectedNiveau] = useState('all');
  const [exercices, setExercices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingExercice, setEditingExercice] = useState(null);

  // Niveaux pour les filtres
  const niveaux = [
    { id: 'all', name: 'Tous', count: 0, icon: Package },
    { id: 'debutant', name: '🟢 Débutant', count: 0, icon: Target },
    { id: 'intermediaire', name: '🟡 Intermédiaire', count: 0, icon: Flame },
    { id: 'avance', name: '🔴 Avancé', count: 0, icon: TrendingUp },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
  setIsLoading(true);
  try {
    const response = await exerciceService.getAll();
    console.log('📥 Réponse brute:', response);
    
    // ✅ Si response est un tableau, l'utiliser directement
    // ✅ Si response a une propriété data, l'utiliser
    const data = Array.isArray(response) ? response : response?.data || [];
    
    console.log('📥 Données extraites:', data);
    console.log('📥 Nombre d\'exercices:', data.length);
    
    setExercices(data);
    
    // Mettre à jour les compteurs des filtres
    niveaux.forEach(n => {
      if (n.id !== 'all') {
        n.count = data.filter(e => e.niveau === n.id).length;
      } else {
        n.count = data.length;
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur chargement:', error);
    setError('Erreur lors du chargement des exercices');
  } finally {
    setIsLoading(false);
  }
};

  // ===== FILTRAGE =====
  const filteredExercices = exercices.filter(e => {
    const matchSearch = e.nomE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        e.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchNiveau = selectedNiveau === 'all' || e.niveau === selectedNiveau;
    return matchSearch && matchNiveau;
  });

  // ===== FORMATS =====
  const getNiveauColor = (niveau) => {
    const n = niveau?.toLowerCase() || '';
    if (n === 'debutant') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (n === 'intermediaire') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (n === 'avance') return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getNiveauLabel = (niveau) => {
    const n = niveau?.toLowerCase() || '';
    if (n === 'debutant') return '🟢 Débutant';
    if (n === 'intermediaire') return '🟡 Intermédiaire';
    if (n === 'avance') return '🔴 Avancé';
    return niveau || 'Non défini';
  };

  // ===== CRUD =====
  const handleSave = async (data) => {
    try {
      let response;
      if (editingExercice) {
        response = await exerciceService.updateWithFile(editingExercice.id, data);
        setSuccess('✅ Exercice modifié avec succès !');
      } else {
        response = await exerciceService.createEx(data);
        setSuccess('✅ Exercice créé avec succès !');
      }
      setShowModal(false);
      setEditingExercice(null);
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
      return response;
    } catch (error) {
      console.error('❌ Erreur:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('⚠️ Supprimer cet exercice définitivement ?')) return;
    try {
      await exerciceService.delete(id);
      setSuccess('✅ Exercice supprimé !');
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Erreur lors de la suppression');
    }
  };

  const openCreateModal = () => {
    setEditingExercice(null);
    setShowModal(true);
  };

  const openEditModal = (exercice) => {
    setEditingExercice(exercice);
    setShowModal(true);
  };

  // ===== RENDU =====
  return (
    <div className="min-h-screen bg-[#0A0A0F] py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ===== EN-TÊTE ===== */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
              <Dumbbell className="w-8 h-8 text-[#D4AF37]" />
              Bibliothèque d'exercices
            </h1>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              Gérez votre bibliothèque d'exercices
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              {exercices.length} exercices disponibles
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="group flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8940F] text-black px-6 py-3 rounded-xl font-semibold shadow-lg shadow-[#D4AF37]/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Nouvel exercice
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
              placeholder="Rechercher un exercice..."
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
              className={`p-2.5 rounded-lg transition-all duration-300 ${
                viewMode === 'grid' 
                  ? 'bg-[#D4AF37] text-black shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg transition-all duration-300 ${
                viewMode === 'list' 
                  ? 'bg-[#D4AF37] text-black shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ===== FILTRES PAR NIVEAU ===== */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-[#D4AF37]/30">
          {niveaux.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelectedNiveau(n.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-300 whitespace-nowrap ${
                selectedNiveau === n.id
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                  : 'bg-[#12121A] border-white/10 text-gray-400 hover:text-white hover:border-[#D4AF37]/50'
              }`}
            >
              <n.icon className={`w-4 h-4 ${selectedNiveau === n.id ? 'text-[#D4AF37]' : ''}`} />
              <span className="font-medium">{n.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selectedNiveau === n.id ? 'bg-[#D4AF37]/30 text-[#D4AF37]' : 'bg-white/10 text-gray-400'
              }`}>
                {n.count}
              </span>
            </button>
          ))}
        </div>

        {/* ===== CHARGEMENT ===== */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">Chargement des exercices...</p>
            </div>
          </div>
        ) : (
          <>
            {/* ===== VUE GRILLE ===== */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredExercices.length === 0 ? (
                  <div className="col-span-full text-center py-16">
                    <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Aucun exercice trouvé</p>
                    <p className="text-gray-500 text-sm mt-1">Essayez de modifier votre recherche</p>
                  </div>
                ) : (
                  filteredExercices.map((exercice) => (
                    <div 
                      key={exercice.id} 
                      className="group bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#D4AF37]/5 transition-all duration-500"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] flex items-center justify-center overflow-hidden">
                        {exercice.video ? (
                          <video 
                            src={exercice.video} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            muted
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <Dumbbell className="w-12 h-12 text-[#D4AF37]/30" />
                          </div>
                        )}
                        
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getNiveauColor(exercice.niveau)}`}>
                            {getNiveauLabel(exercice.niveau)}
                          </span>
                        </div>
                        
                        {exercice.muscle && (
                          <div className="absolute bottom-3 right-3 px-2.5 py-0.5 bg-black/60 rounded-full text-xs text-gray-300">
                            {Array.isArray(exercice.muscle) ? exercice.muscle.join(', ') : exercice.muscle}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5">
                        <h3 className="font-semibold text-white group-hover:text-[#D4AF37] transition-colors duration-300 text-lg">
                          {exercice.nomE || exercice.nom}
                        </h3>
                        
                        {exercice.description && (
                          <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                            {exercice.description}
                          </p>
                        )}
                        
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center gap-2 text-gray-400 text-xs">
                            {exercice.materiel && (
                              <span className="flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {exercice.materiel}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <button 
                            onClick={() => openEditModal(exercice)}
                            className="flex-1 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg text-[#D4AF37] text-sm font-medium hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                          >
                            <Edit className="w-4 h-4 inline mr-1" />
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleDelete(exercice.id)}
                            className="p-2 bg-red-500/10 border border-red-500/40 rounded-lg text-red-400 hover:bg-red-500/20 transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* ===== VUE LISTE ===== */
              <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#1A1A24] border-b border-white/10">
                      <tr>
                        <th className="text-left p-4 text-gray-400 font-medium">Exercice</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Niveau</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Muscles</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Matériel</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Vidéo</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExercices.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center p-8 text-gray-400">
                            Aucun exercice trouvé
                          </td>
                        </tr>
                      ) : (
                        filteredExercices.map((exercice) => (
                          <tr key={exercice.id} className="border-b border-white/5 hover:bg-white/5 transition-all duration-300">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#1A1A24] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                  {exercice.video ? (
                                    <video src={exercice.video} className="w-full h-full object-cover" muted />
                                  ) : (
                                    <Dumbbell className="w-5 h-5 text-gray-500" />
                                  )}
                                </div>
                                <span className="text-white font-medium">{exercice.nomE || exercice.nom}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getNiveauColor(exercice.niveau)}`}>
                                {getNiveauLabel(exercice.niveau)}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">
                              {Array.isArray(exercice.muscle) ? exercice.muscle.join(', ') : exercice.muscle || 'N/A'}
                            </td>
                            <td className="p-4 text-gray-300">{exercice.materiel || 'N/A'}</td>
                            <td className="p-4">
                              {exercice.video ? (
                                <span className="text-emerald-400 text-xs">✅</span>
                              ) : (
                                <span className="text-gray-500 text-xs">❌</span>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => openEditModal(exercice)}
                                  className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-all duration-300"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(exercice.id)}
                                  className="p-1.5 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 transition-all duration-300"
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
            )}
          </>
        )}
      </div>

      {/* ===== MODAL ===== */}
      <AddExerciceModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingExercice(null); }}
        onSave={handleSave}
        exercice={editingExercice}
        isLoading={false}
      />
    </div>
  );
};

export default AdminExercice;