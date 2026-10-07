import { useState, useEffect } from 'react';
import { 
  Search, X, Play, CheckCircle, Clock, 
  Repeat, Timer, Dumbbell, Flame, ThumbsUp, Loader2, AlertCircle, BookOpen
} from 'lucide-react';
import { programmeService } from '../../services/programmeService';
import authService from '../../services/authService';

const Exercice = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programmes, setProgrammes] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Récupérer l'utilisateur connecté
        const user = authService.getCurrentUser();
        if (!user || !user.objectif_id) {
          setError("Vous devez être connecté avec un objectif défini pour voir les exercices.");
          setLoading(false);
          return;
        }

        // 2. Récupérer les programmes filtrés par objectif
        const programmesData = await programmeService.getByObjectif(user.objectif_id);
        
        if (!programmesData || programmesData.length === 0) {
          setExercises([]);
          setProgrammes([]);
          setLoading(false);
          return;
        }

        setProgrammes(programmesData);

        // 3. Extraire tous les exercices uniques des programmes
        const allExercises = [];
        const seenIds = new Set();

        programmesData.forEach(prog => {
          if (prog.exercices && prog.exercices.length > 0) {
            prog.exercices.forEach(ex => {
              if (!seenIds.has(ex.id)) {
                seenIds.add(ex.id);
                // Récupérer les infos de la table pivot (programmeExo)
                const pivotInfo = ex.programmeExo || ex.programme_exo || {};
                allExercises.push({
                  id: ex.id,
                  name: ex.nomE || ex.nom,
                  description: ex.description || '',
                  muscles: ex.muscle ? ex.muscle.split(',').map(m => m.trim()) : ['Général'],
                  level: ex.niveau || 'Débutant',
                  videoUrl: ex.video || '',
                  thumbnail: ex.video || '',
                  series: pivotInfo.series || ex.series || 3,
                  reps: pivotInfo.repetition || pivotInfo.repetitions || ex.repetition || '10',
                  rest: ex.rest || '60 sec',
                  duration: ex.duree || '10 min',
                  calories: ex.calories || '~50 kcal',
                  conseil: ex.conseil || '',
                  materiel: ex.materiel || '',
                  programmeNom: prog.nomPro || prog.nom
                });
              }
            });
          }
        });

        setExercises(allExercises);
      } catch (err) {
        console.error('Erreur lors du chargement des exercices:', err);
        setError("Impossible de charger les exercices. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Déterminer la catégorie d'un exercice en fonction du muscle
  const getCategory = (muscles) => {
    const haut = ['poitrine', 'triceps', 'biceps', 'dos', 'épaule', 'epaule', 'pectoraux', 'dorsaux'];
    const bas = ['quadriceps', 'fessiers', 'ischio', 'mollets', 'cuisse', 'jambe', 'adducteurs'];
    
    for (const m of muscles) {
      const lower = m.toLowerCase();
      if (haut.some(h => lower.includes(h))) return 'haut';
      if (bas.some(b => lower.includes(b))) return 'bas';
    }
    return 'full';
  };

  // Filtrer les exercices
  const filteredExercises = exercises.filter(ex => {
    const category = getCategory(ex.muscles);
    if (activeFilter === 'haut' && category !== 'haut') return false;
    if (activeFilter === 'bas' && category !== 'bas') return false;
    if (activeFilter === 'full' && category !== 'full') return false;
    if (searchTerm && !ex.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const openModal = (exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExercise(null);
    document.body.style.overflow = 'auto';
  };

  // Formater le niveau
  const formatLevel = (level) => {
    if (!level) return 'Débutant';
    const map = {
      'debutant': 'Débutant',
      'intermediare': 'Intermédiaire',
      'intermédiaire': 'Intermédiaire',
      'avance': 'Avancé',
      'avancé': 'Avancé'
    };
    return map[level.toLowerCase()] || level;
  };

  // Rendu du chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] to-[#0F0F15] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-400 text-lg">Chargement des exercices...</p>
          </div>
        </div>
      </div>
    );
  }

  // Rendu de l'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] to-[#0F0F15] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-16 h-16 text-orange-500 mb-4" />
            <p className="text-gray-300 text-lg text-center">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] to-[#0F0F15] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Bibliothèque d'exercices
          </h1>
          <p className="text-orange-400/70 text-sm mt-2">
            {programmes.length > 0 
              ? `Programme : ${programmes.map(p => p.nomPro || p.nom).join(', ')}`
              : 'Découvrez les exercices adaptés à votre niveau'}
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative max-w-md mx-auto mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400/50" />
          <input
            type="text"
            placeholder="Rechercher un exercice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#12121A] border border-orange-500/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        {/* Filtres */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'haut', label: 'Haut du corps' },
            { id: 'bas', label: 'Bas du corps' },
            { id: 'full', label: 'Full body' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                activeFilter === filter.id
                  ? 'bg-orange-500 text-black'
                  : 'bg-[#12121A] text-gray-400 border border-orange-500/20 hover:text-white hover:border-orange-500/50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Message si aucun exercice */}
        {exercises.length === 0 && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-20">
            <BookOpen className="w-16 h-16 text-orange-500/50 mb-4" />
            <p className="text-gray-400 text-lg text-center">
              Aucun exercice disponible pour votre objectif actuel.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Contactez votre coach pour ajouter des exercices à votre programme.
            </p>
          </div>
        )}

        {/* Message si aucun résultat de recherche */}
        {exercises.length > 0 && filteredExercises.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="w-16 h-16 text-orange-500/50 mb-4" />
            <p className="text-gray-400 text-lg text-center">
              Aucun exercice ne correspond à votre recherche.
            </p>
          </div>
        )}

        {/* Grille des exercices */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExercises.map((ex) => {
            return (
              <div key={ex.id} className="group bg-[#12121A] rounded-2xl border border-orange-500/20 overflow-hidden hover:border-orange-500/60 hover:-translate-y-1 transition-all duration-300">
                {/* Miniature vidéo */}
                <div className="relative h-48 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] overflow-hidden">
                  {ex.videoUrl ? (
                    <video 
                      src={ex.videoUrl}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      preload="metadata"
                      muted
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-12 h-12 text-orange-500/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-orange-500/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 rounded-md text-xs text-white">
                    {ex.duration}
                  </div>
                </div>

                {/* Infos */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition">
                        {ex.name}
                      </h3>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {ex.muscles.slice(0, 3).map((muscle, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 bg-orange-500/10 rounded-full text-orange-400/80">
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full whitespace-nowrap">
                      {formatLevel(ex.level)}
                    </span>
                  </div>
                  <button
                    onClick={() => openModal(ex)}
                    className="w-full mt-4 py-2 bg-orange-500/10 border border-orange-500/40 rounded-xl text-orange-400 text-sm font-medium flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-black transition"
                  >
                    <Play className="w-4 h-4" />
                    Voir l'exercice
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========== MODAL EXERCICE ========== */}
      {isModalOpen && selectedExercise && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
          
          {/* Modal Content - AVEC SCROLL */}
          <div 
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-orange-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Vidéo - reste en haut */}
            <div className="relative aspect-video bg-black sticky top-0">
              {selectedExercise.videoUrl ? (
                <video
                  src={selectedExercise.videoUrl}
                  className="w-full h-full"
                  controls
                  playsInline
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1A1A24] to-[#0F0F15]">
                  <Play className="w-16 h-16 text-orange-500/50" />
                </div>
              )}
              <button 
                onClick={closeModal}
                className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition z-10"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Contenu scrollable */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedExercise.name}</h2>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {selectedExercise.muscles.map((muscle, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-orange-500/10 rounded-full text-orange-400">
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm whitespace-nowrap">
                  {formatLevel(selectedExercise.level)}
                </span>
              </div>

              {/* Description / Conseil */}
              {selectedExercise.conseil && (
                <div className="mb-4 p-3 bg-[#1A1A24] rounded-xl border border-orange-500/20">
                  <p className="text-gray-400 text-xs mb-1">Conseil</p>
                  <p className="text-gray-200 text-sm">{selectedExercise.conseil}</p>
                </div>
              )}

              {/* Matériel */}
              {selectedExercise.materiel && (
                <div className="mb-4 flex items-center gap-2 text-gray-400 text-sm">
                  <Dumbbell className="w-4 h-4 text-orange-400" />
                  <span>Matériel : {selectedExercise.materiel}</span>
                </div>
              )}

              {/* Grille des infos */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#1A1A24] rounded-xl p-3 text-center border border-orange-500/20">
                  <Repeat className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <p className="text-gray-400 text-xs">Séries</p>
                  <p className="text-white font-bold text-lg">{selectedExercise.series}</p>
                </div>
                <div className="bg-[#1A1A24] rounded-xl p-3 text-center border border-orange-500/20">
                  <Dumbbell className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <p className="text-gray-400 text-xs">Répétitions</p>
                  <p className="text-white font-bold text-lg">{selectedExercise.reps}</p>
                </div>
                <div className="bg-[#1A1A24] rounded-xl p-3 text-center border border-orange-500/20">
                  <Timer className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <p className="text-gray-400 text-xs">Repos</p>
                  <p className="text-white font-bold text-lg">{selectedExercise.rest}</p>
                </div>
                <div className="bg-[#1A1A24] rounded-xl p-3 text-center border border-orange-500/20">
                  <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <p className="text-gray-400 text-xs">Calories</p>
                  <p className="text-white font-bold text-lg">{selectedExercise.calories}</p>
                </div>
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-xl mb-4 border border-orange-500/20">
                <input 
                  type="checkbox" 
                  id="exercise-done"
                  className="w-5 h-5 rounded border-orange-500/50 accent-orange-500"
                />
                <label htmlFor="exercise-done" className="text-gray-300 text-sm flex-1">
                  Marquer comme terminé
                </label>
                <ThumbsUp className="w-4 h-4 text-orange-400" />
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 pb-2">
                <button className="flex-1 py-3 bg-orange-500 text-black rounded-xl font-semibold hover:bg-orange-400 transition flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Valider
                </button>
                <button 
                  onClick={closeModal}
                  className="px-6 py-3 border border-orange-500/30 rounded-xl text-gray-300 hover:bg-orange-500/10 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercice;