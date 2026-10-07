import { useState, useEffect } from 'react';
import { X, Save, Play, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { exerciceService } from '../../services/exerciceService';

const AddExerciceModal = ({ isOpen, onClose, onSave, exercice = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    nomE: '',
    description: '',
    niveau: 'debutant',
    materiel: '',
    muscle: [],
    conseil: '',
    video: null
  });
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const niveaux = [
    { value: 'debutant', label: '🟢 Débutant' },
    { value: 'intermediaire', label: '🟡 Intermédiaire' },
    { value: 'avance', label: '🔴 Avancé' }
  ];

  const musclesOptions = [
    'Pectoraux', 'Dorsaux', 'Quadriceps', 'Ischio-jambiers',
    'Fessiers', 'Biceps', 'Triceps', 'Épaules',
    'Abdominaux', 'Lombaires', 'Mollets'
  ];

  useEffect(() => {
    if (exercice) {
      setFormData({
        nomE: exercice.nomE || exercice.nom || '',
        description: exercice.description || '',
        niveau: exercice.niveau || 'debutant',
        materiel: exercice.materiel || '',
        muscle: exercice.muscle ? (Array.isArray(exercice.muscle) ? exercice.muscle : [exercice.muscle]) : [],
        conseil: exercice.conseil || '',
        video: exercice.video || null
      });
      if (exercice.video) {
        setVideoPreview(exercice.video);
      }
    } else {
      resetForm();
    }
  }, [exercice]);

  const resetForm = () => {
    setFormData({
      nomE: '',
      description: '',
      niveau: 'debutant',
      materiel: '',
      muscle: [],
      conseil: '',
      video: null
    });
    setVideoPreview(null);
    setVideoFile(null);
    setError('');
    setSuccess('');
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const toggleMuscle = (muscle) => {
    if (formData.muscle.includes(muscle)) {
      setFormData({ ...formData, muscle: formData.muscle.filter(m => m !== muscle) });
    } else {
      setFormData({ ...formData, muscle: [...formData.muscle, muscle] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const data = new FormData();
      data.append('nomE', formData.nomE);
      data.append('description', formData.description || '');
      data.append('muscle', JSON.stringify(formData.muscle));
      data.append('niveau', formData.niveau);
      data.append('materiel', formData.materiel || '');
      data.append('conseil', formData.conseil || '');
      if (videoFile) {
        data.append('video', videoFile);
      }

      await onSave(data);
      setSuccess('✅ Exercice enregistré !');
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Erreur');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-[#12121A] rounded-2xl border border-[#D4AF37]/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {exercice ? '✏️ Modifier l\'exercice' : '📝 Nouvel exercice'}
          </h2>
          <button onClick={() => { onClose(); resetForm(); }} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Nom *</label>
              <input
                type="text"
                value={formData.nomE}
                onChange={(e) => setFormData({ ...formData, nomE: e.target.value })}
                className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                placeholder="Pompes"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Niveau *</label>
              <select
                value={formData.niveau}
                onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white"
              >
                {niveaux.map(n => (
                  <option key={n.value} value={n.value}>{n.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white"
              rows="2"
              placeholder="Description..."
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Muscles ciblés</label>
            <div className="flex flex-wrap gap-2 p-3 bg-[#0F0F15] rounded-xl border border-white/10">
              {musclesOptions.map(muscle => (
                <button
                  key={muscle}
                  type="button"
                  onClick={() => toggleMuscle(muscle)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    formData.muscle.includes(muscle) ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-gray-400'
                  }`}
                >
                  {muscle}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Matériel</label>
            <input
              type="text"
              value={formData.materiel}
              onChange={(e) => setFormData({ ...formData, materiel: e.target.value })}
              className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white"
              placeholder="Table, haltère..."
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Vidéo</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white file:bg-[#D4AF37] file:text-black file:border-0 file:rounded-xl file:px-4 file:py-2 file:font-semibold file:cursor-pointer"
            />
            {videoPreview && (
              <div className="mt-2">
                <video src={videoPreview} className="w-full max-h-48 object-cover rounded-xl" controls />
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Conseils</label>
            <textarea
              value={formData.conseil}
              onChange={(e) => setFormData({ ...formData, conseil: e.target.value })}
              className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white"
              rows="2"
              placeholder="Conseils pour l'exercice..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#D4AF37] text-black py-3 rounded-xl font-semibold hover:bg-[#D4AF37]/90 disabled:opacity-50"
            >
              {isLoading ? 'Chargement...' : (exercice ? 'Modifier' : 'Créer')}
            </button>
            <button
              type="button"
              onClick={() => { onClose(); resetForm(); }}
              className="px-6 py-3 border border-white/10 rounded-xl text-gray-400 hover:bg-white/5"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExerciceModal;