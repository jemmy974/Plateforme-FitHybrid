import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Edit, Trash2, Search, ChevronDown,
    Save, X, Clock, Target, Users, ArrowLeft,
    AlertCircle, CheckCircle, Eye, Move
} from 'lucide-react';
import { programmeService } from '../../services/programmeService';
import { exerciceService } from '../../services/exerciceService';

const ProgrammeExercice = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // État pour les programmes
    const [programmes, setProgrammes] = useState([]);
    const [programmeForm, setProgrammeForm] = useState({
        nomPro: '',
        description: '',
        niveau: '',
        objectif_id: '',
        duree: '',
        status: 'actif'
    });

    // État pour les exercices du programme
    const [exercicesProgramme, setExercicesProgramme] = useState([]);
    const [exerciceForm, setExerciceForm] = useState({
        exercice_id: '',
        repetition: '',
        serie: '',
        ordre: 1
    });

    // État pour la liste des exercices disponibles
    const [exercicesDisponibles, setExercicesDisponibles] = useState([]);

    // Options
    const niveaux = [
        { value: 'debutant', label: '🟢 Débutant' },
        { value: 'intermediaire', label: '🟡 Intermédiaire' },
        { value: 'avance', label: '🔴 Avancé' }
    ];

    const objectifs = [
        { id: 1, label: '💪 Prise de masse' },
        { id: 2, label: '🔥 Perte de poids' },
        { id: 3, label: '🏋️ Force' },
        { id: 4, label: '🏃 Endurance' }
    ];

    // Charger les données
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            console.log('🔍 Chargement des données...');

            const progsResponse = await programmeService.getAll();
            const exosResponse = await exerciceService.getAll();

            console.log('📥 exosResponse:', exosResponse);
            console.log('📥 progsResponse:', progsResponse);

            // ✅ Extraire les exercices
            let exercices = [];
            if (Array.isArray(exosResponse)) {
                exercices = exosResponse;
            } else if (exosResponse && exosResponse.data) {
                exercices = exosResponse.data;
            } else if (exosResponse && exosResponse.success && exosResponse.data) {
                exercices = exosResponse.data;
            }

            // ✅ Extraire les programmes
            let programmes = [];
            if (Array.isArray(progsResponse)) {
                programmes = progsResponse;
            } else if (progsResponse && progsResponse.data) {
                programmes = progsResponse.data;
            } else if (progsResponse && progsResponse.success && progsResponse.data) {
                programmes = progsResponse.data;
            }

            const normalizedProgrammes = programmes.map((programme) => {
                const exercisesSource = Array.isArray(programme.exercices)
                    ? programme.exercices
                    : Array.isArray(programme.ProgrammeExos)
                        ? programme.ProgrammeExos
                        : Array.isArray(programme.programmeExos)
                            ? programme.programmeExos
                            : [];

                return {
                    ...programme,
                    exercices: exercisesSource
                };
            });

            console.log('📥 Exercices extraits:', exercices);
            console.log('📥 Programmes extraits:', normalizedProgrammes);

            setExercicesDisponibles(exercices);
            setProgrammes(normalizedProgrammes);

        } catch (error) {
            console.error('❌ Erreur chargement:', error);
            setError('Erreur lors du chargement des données');
        }
    };

    const getExerciceCount = (programme) => {
        const source = programme?.exercices ?? programme?.ProgrammeExos ?? programme?.programmeExos ?? [];

        if (Array.isArray(source)) {
            return source.length;
        }

        if (Array.isArray(source?.data)) {
            return source.data.length;
        }

        return 0;
    };

    // Gestion des programmes
    const handleProgrammeSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        console.log('🔍 exercicesProgramme avant envoi:', exercicesProgramme);
        console.log('🔍 Nombre d\'exercices:', exercicesProgramme.length);

        if (exercicesProgramme.length === 0) {
            setError('⚠️ Veuillez ajouter au moins un exercice');
            setIsLoading(false);
            return;
        }

        try {
            const data = {
                nomPro: programmeForm.nomPro,
                description: programmeForm.description || '',
                objectif_id: parseInt(programmeForm.objectif_id),
                niveau: programmeForm.niveau || 'debutant',
                duree: programmeForm.duree || '',
                status: programmeForm.status || 'actif',
                exercices: exercicesProgramme.map(ex => ({
                    exercice_id: ex.exercice_id,
                    serie: ex.serie || '0',
                    repetition: ex.repetition || '0',
                    ordre: ex.ordre || 0
                }))
            };

            console.log('📤 Données envoyées:', data);

            let response;
            if (editingId) {
                response = await programmeService.update(editingId, data);
                setSuccess('✅ Programme mis à jour avec succès !');
            } else {
                response = await programmeService.createP(data);
                setSuccess('✅ Programme créé avec succès !');
            }

            setShowModal(false);
            resetProgrammeForm();
            loadData();
        } catch (error) {
            console.error('❌ Erreur:', error);
            setError(error.message || 'Erreur lors de la sauvegarde');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProgramme = async (id) => {
        if (!confirm('Supprimer ce programme ?')) return;
        try {
            await programmeService.delete(id);
            setSuccess('✅ Programme supprimé !');
            loadData();
        } catch (error) {
            setError(error.message || 'Erreur lors de la suppression');
        }
    };

    const resetProgrammeForm = () => {
        setProgrammeForm({
            nomPro: '',
            description: '',
            niveau: 'debutant',
            objectif_id: '',
            duree: '',
            status: 'actif'
        });
        setEditingId(null);
        setExercicesProgramme([]);
    };

    const openEditProgramme = (programme) => {
        setProgrammeForm({
            nomPro: programme.nomPro || programme.nom || '',
            description: programme.description || '',
            niveau: programme.niveau || '',
            objectif_id: programme.objectif_id || '',
            duree: programme.duree || '',
            status: programme.status || 'actif'
        });
        setEditingId(programme.id);
        setExercicesProgramme(programme.exercices || programme.ProgrammeExos || []);
        setShowModal(true);
    };

    // Gestion des exercices du programme
    const addExerciceToProgramme = () => {
        if (!exerciceForm.exercice_id) {
            setError('Veuillez sélectionner un exercice');
            return;
        }
        const exercice = exercicesDisponibles.find(e => e.id === parseInt(exerciceForm.exercice_id));
        if (!exercice) return;

        setExercicesProgramme([
            ...exercicesProgramme,
            {
                id: Date.now(),
                exercice_id: parseInt(exerciceForm.exercice_id),
                nom: exercice.nomE || exercice.nom || 'Exercice',
                serie: exerciceForm.serie || '0',
                repetition: exerciceForm.repetition || '0',
                ordre: exercicesProgramme.length + 1
            }
        ]);

        setExerciceForm({
            exercice_id: '',
            repetition: '',
            serie: ''
        });
    };

    const removeExerciceFromProgramme = (index) => {
        setExercicesProgramme(exercicesProgramme.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen bg-[#0A0A0F] py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Programmes & Exercices</h1>
                        <p className="text-gray-400 text-sm">Gérez vos programmes d'entraînement</p>
                    </div>
                    <button
                        onClick={() => {
                            resetProgrammeForm();
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 bg-[#D4AF37] text-black px-5 py-2.5 rounded-xl font-semibold hover:bg-[#D4AF37]/90 transition"
                    >
                        <Plus className="w-4 h-4" />
                        Nouveau programme
                    </button>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <p className="text-red-400 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </p>
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                        <p className="text-emerald-400 text-sm flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            {success}
                        </p>
                    </div>
                )}

                {/* Liste des programmes */}
                <div className="space-y-4">
                    {programmes.map((programme) => (
                        <div key={programme.id} className="bg-[#12121A] rounded-2xl border border-white/10 p-5 hover:border-[#D4AF37]/40 transition">
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center">
                                            <Target className="w-6 h-6 text-[#D4AF37]" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{programme.nomPro || programme.nom}</h3>
                                            <p className="text-gray-400 text-sm">{programme.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-4 mt-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${programme.niveau === 'debutant' ? 'bg-emerald-500/20 text-emerald-400' :
                                                programme.niveau === 'intermediaire' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-orange-500/20 text-orange-400'
                                            }`}>
                                            {programme.niveau}
                                        </span>
                                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                                            <Clock className="w-3 h-3" />
                                            {programme.duree || 'N/A'}
                                        </span>
                                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                                            <Users className="w-3 h-3" />
                                            {getExerciceCount(programme)} exercices
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${programme.status === 'actif'
                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                            }`}>
                                            {programme.status === 'actif' ? '● Actif' : '○ Inactif'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openEditProgramme(programme)}
                                        className="p-2 hover:bg-white/5 rounded-xl transition"
                                    >
                                        <Edit className="w-4 h-4 text-gray-400" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProgramme(programme.id)}
                                        className="p-2 hover:bg-red-500/10 rounded-xl transition"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {programmes.length === 0 && (
                    <div className="text-center py-12">
                        <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">Aucun programme créé</p>
                        <button
                            onClick={() => { resetProgrammeForm(); setShowModal(true); }}
                            className="mt-4 text-[#D4AF37] hover:underline"
                        >
                            Créer votre premier programme
                        </button>
                    </div>
                )}

                {/* Modal Programme */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#12121A] rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white">
                                    {editingId ? 'Modifier le programme' : 'Nouveau programme'}
                                </h2>
                                <button onClick={() => { setShowModal(false); resetProgrammeForm(); }} className="text-gray-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleProgrammeSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">Nom du programme *</label>
                                        <input
                                            type="text"
                                            value={programmeForm.nomPro || ''}
                                            onChange={(e) => setProgrammeForm({ ...programmeForm, nomPro: e.target.value })}
                                            className="w-full bg-[#1A1A24] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                            placeholder="Prise de masse débutant"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">Objectif *</label>
                                        <select
                                            value={programmeForm.objectif_id}
                                            onChange={(e) => setProgrammeForm({ ...programmeForm, objectif_id: e.target.value })}
                                            className="w-full bg-[#1A1A24] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                            required
                                        >
                                            <option value="">Sélectionner</option>
                                            {objectifs.map(obj => (
                                                <option key={obj.id} value={obj.id}>{obj.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                                    <textarea
                                        value={programmeForm.description}
                                        onChange={(e) => setProgrammeForm({ ...programmeForm, description: e.target.value })}
                                        className="w-full bg-[#1A1A24] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                        rows="2"
                                        placeholder="Description du programme..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">Niveau *</label>
                                        <select
                                            value={programmeForm.niveau}
                                            onChange={(e) => setProgrammeForm({ ...programmeForm, niveau: e.target.value })}
                                            className="w-full bg-[#1A1A24] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                        >
                                            {niveaux.map(n => (
                                                <option key={n.value} value={n.value}>{n.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">Durée</label>
                                        <input
                                            type="text"
                                            value={programmeForm.duree}
                                            onChange={(e) => setProgrammeForm({ ...programmeForm, duree: e.target.value })}
                                            className="w-full bg-[#1A1A24] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                            placeholder="8 semaines"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Statut</label>
                                    <select
                                        value={programmeForm.status}
                                        onChange={(e) => setProgrammeForm({ ...programmeForm, status: e.target.value })}
                                        className="w-full bg-[#1A1A24] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                                    >
                                        <option value="actif">Actif</option>
                                        <option value="inactif">Inactif</option>
                                    </select>
                                </div>

                                {/* Section : Ajouter des exercices au programme */}
                                <div className="border-t border-white/10 pt-4 mt-4">
                                    <h3 className="text-white font-semibold mb-3">Exercices du programme</h3>

                                    <div className="flex flex-wrap gap-3 mb-3">
                                        <div className="flex-1 min-w-[150px]">
                                            <select
                                                value={exerciceForm.exercice_id}
                                                onChange={(e) => setExerciceForm({ ...exerciceForm, exercice_id: e.target.value })}
                                                className="w-full bg-[#1A1A24] border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                                            >
                                                <option value="">Choisir un exercice</option>
                                                {exercicesDisponibles && exercicesDisponibles.length > 0 ? (
                                                    exercicesDisponibles.map((ex) => (
                                                        <option key={ex.id} value={ex.id}>
                                                            {ex.nomE || ex.nom || 'Exercice sans nom'}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="" disabled>Aucun exercice disponible</option>
                                                )}
                                            </select>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Séries"
                                            value={exerciceForm.serie || ''}
                                            onChange={(e) => setExerciceForm({ ...exerciceForm, serie: e.target.value })}
                                            className="w-20 bg-[#1A1A24] border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Reps"
                                            value={exerciceForm.repetition || ''}
                                            onChange={(e) => setExerciceForm({ ...exerciceForm, repetition: e.target.value })}
                                            className="w-20 bg-[#1A1A24] border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={addExerciceToProgramme}
                                            className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-xl text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Liste des exercices du programme */}
                                    <div className="space-y-2">
                                        {exercicesProgramme.length === 0 ? (
                                            <p className="text-gray-500 text-sm text-center py-4">
                                                Aucun exercice ajouté pour le moment
                                            </p>
                                        ) : (
                                            exercicesProgramme.map((ex, index) => (
                                                <div key={ex.id || index} className="flex items-center justify-between p-3 bg-[#1A1A24] rounded-xl">
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-gray-500 text-sm">{index + 1}</span>
                                                        <span className="text-white">{ex.nom}</span>
                                                        <span className="text-gray-400 text-xs">⚡ {ex.serie || '0'} séries</span>
                                                        <span className="text-gray-400 text-xs">🔄 {ex.repetition || '0'} reps</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExerciceFromProgramme(index)}
                                                        className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-white/10">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 bg-[#D4AF37] text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#D4AF37]/90 transition disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                {editingId ? 'Modifier' : 'Créer'} le programme
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setShowModal(false); resetProgrammeForm(); }}
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
        </div>
    );
};

export default ProgrammeExercice;