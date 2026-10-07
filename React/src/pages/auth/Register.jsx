import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import {
  Dumbbell, User, Mail, Lock, Eye, EyeOff, UserPlus,
  Phone, MapPin, Calendar, Weight, Camera, ChevronDown,
  CheckCircle, Shield, AlertCircle
} from 'lucide-react';
import authService from '../../services/authService.js';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    numero: '',
    addresse: '',
    mdp: '',
    confirmPassword: '',
    datedn: '',
    poids: '',
    genre: '',
    objectif_id: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});

  const genreOptions = [
    { value: 'Homme', label: 'Homme' },
    { value: 'Femme', label: 'Femme' }
  ];

  const objectifOptions = [
    { id: 1, label: '💪 Prise de masse musculaire' },
    { id: 2, label: '🔥 Perte de poids' },
    { id: 3, label: '🏋️ Développement de la force' }
  ];

  // ✅ Compression d'image
  const compressImage = (file, maxWidth = 300, maxHeight = 300, quality = 0.6) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // ✅ Convertir en base64 avec qualité réduite
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        };
      };
    });
  };

  // ✅ Gestion de la photo avec compression
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier
      if (file.size > 5 * 1024 * 1024) {
        setError('La photo ne doit pas dépasser 5MB');
        return;
      }
      
      setProfilePhotoFile(file);
      
      try {
        // Compresser l'image
        const compressed = await compressImage(file, 300, 300, 0.6);
        setProfilePhotoPreview(compressed);
      } catch (error) {
        console.error('Erreur compression:', error);
        // Fallback: afficher sans compression
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = 'Nom requis';
    if (!formData.prenom) newErrors.prenom = 'Prénom requis';
    if (!formData.email) newErrors.email = 'Email requis';
    if (!formData.email.includes('@')) newErrors.email = 'Email invalide';
    if (!formData.numero) newErrors.numero = 'Téléphone requis';
    if (!formData.addresse) newErrors.addresse = 'Localisation requise';
    if (!formData.mdp) newErrors.mdp = 'Mot de passe requis';
    if (formData.mdp.length < 6) newErrors.mdp = '6 caractères minimum';
    if (formData.mdp !== formData.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    if (!formData.datedn) newErrors.datedn = 'Date de naissance requise';
    if (!formData.poids) newErrors.poids = 'Poids requis';
    if (!formData.genre) newErrors.genre = 'Genre requis';
    if (!formData.objectif_id) newErrors.objectif_id = 'Objectif requis';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Vous devez accepter les conditions';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      const userData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        numero: formData.numero,
        addresse: formData.addresse,
        mdp: formData.mdp,
        datedn: formData.datedn,
        poids: parseFloat(formData.poids) || 0,
        genre: formData.genre,
        objectif_id: parseInt(formData.objectif_id),
        photo: profilePhotoPreview || ""  // ✅ Image compressée
      };

      console.log('📤 Données envoyées (taille photo:', userData.photo.length, 'caractères)');
      
      const response = await authService.register(userData);
      
      if (response.success) {
        navigate('/admin/users');
      } else {
        setError(response.message || 'Erreur lors de l\'inscription');
      }
      
    } catch (err) {
      console.error('❌ Erreur inscription:', err);
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] to-[#0F0F15] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-[#D4AF37] to-[#9C7E2C] w-35 h-35 rounded-2xl flex items-center justify-center shadow-2xl shadow-[#D4AF37]/20">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Créer un compte
          </h1>
          <p className="text-gray-400 text-sm mt-2">Rejoignez FitnessForge et transformez votre vie</p>
        </div>

        {/* Formulaire */}
        <div className="bg-[#12121A]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm text-center flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              </div>
            )}

            {/* Ligne 1: Nom + Prénom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Nom <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className={`w-full bg-[#1A1A24] border ${errors.nom ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition`}
                    placeholder="Rakotonandrasana"
                  />
                </div>
                {errors.nom && <p className="text-red-400 text-xs mt-1">{errors.nom}</p>}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Prénom <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className={`w-full bg-[#1A1A24] border ${errors.prenom ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition`}
                    placeholder="Mô"
                  />
                </div>
                {errors.prenom && <p className="text-red-400 text-xs mt-1">{errors.prenom}</p>}
              </div>
            </div>

            {/* Ligne 2: Email + Téléphone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full bg-[#1A1A24] border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition`}
                    placeholder="jean@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Téléphone <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    className={`w-full bg-[#1A1A24] border ${errors.numero ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition`}
                    placeholder="032 00 000 00"
                  />
                </div>
                {errors.numero && <p className="text-red-400 text-xs mt-1">{errors.numero}</p>}
              </div>
            </div>

            {/* Ligne 3: Localisation + Date de naissance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Localisation <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={formData.addresse}
                    onChange={(e) => setFormData({ ...formData, addresse: e.target.value })}
                    className={`w-full bg-[#1A1A24] border ${errors.addresse ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition`}
                    placeholder="Antananarivo"
                  />
                </div>
                {errors.addresse && <p className="text-red-400 text-xs mt-1">{errors.addresse}</p>}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Date de naissance <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="date"
                    value={formData.datedn}
                    onChange={(e) => setFormData({ ...formData, datedn: e.target.value })}
                    className={`w-full bg-[#1A1A24] border ${errors.datedn ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition`}
                  />
                </div>
                {errors.datedn && <p className="text-red-400 text-xs mt-1">{errors.datedn}</p>}
              </div>
            </div>

            {/* Ligne 4: Genre + Poids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Genre <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className={`w-full bg-[#1A1A24] border ${errors.genre ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 px-4 text-white appearance-none focus:outline-none focus:border-[#D4AF37] transition cursor-pointer`}
                  >
                    <option value="">Sélectionner</option>
                    {genreOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
                {errors.genre && <p className="text-red-400 text-xs mt-1">{errors.genre}</p>}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Poids (kg) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    step="0.1"
                    value={formData.poids}
                    onChange={(e) => setFormData({ ...formData, poids: e.target.value })}
                    className={`w-full bg-[#1A1A24] border ${errors.poids ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition`}
                    placeholder="70.5"
                  />
                </div>
                {errors.poids && <p className="text-red-400 text-xs mt-1">{errors.poids}</p>}
              </div>
            </div>

            {/* Ligne 5: Objectif fitness */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Objectif fitness <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.objectif_id}
                  onChange={(e) => setFormData({ ...formData, objectif_id: e.target.value })}
                  className={`w-full bg-[#1A1A24] border ${errors.objectif_id ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 px-4 text-white appearance-none focus:outline-none focus:border-[#D4AF37] transition cursor-pointer`}
                >
                  <option value="">Sélectionner votre objectif</option>
                  {objectifOptions.map(goal => (
                    <option key={goal.id} value={goal.id}>
                      {goal.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              {errors.objectif_id && <p className="text-red-400 text-xs mt-1">{errors.objectif_id}</p>}
            </div>

            {/* Ligne 6: Photo de profil */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Photo de profil</label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border-2 border-[#D4AF37]/50 flex items-center justify-center overflow-hidden">
                    {profilePhotoPreview ? (
                      <img src={profilePhotoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-[#D4AF37]" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-7 h-7 bg-[#D4AF37] rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                    <Camera className="w-3.5 h-3.5 text-black" />
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>
                <p className="text-gray-500 text-xs">Cliquez pour ajouter une photo</p>
              </div>
            </div>

            {/* Ligne 7: Mot de passe + Confirmation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Mot de passe <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.mdp}
                    onChange={(e) => setFormData({ ...formData, mdp: e.target.value })}
                    className={`w-full bg-[#1A1A24] border ${errors.mdp ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-10 pr-12 text-white focus:outline-none focus:border-[#D4AF37] transition`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.mdp && <p className="text-red-400 text-xs mt-1">{errors.mdp}</p>}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Confirmer <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full bg-[#1A1A24] border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Conditions */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-[#1A1A24] accent-[#D4AF37]"
              />
              <label className="text-gray-400 text-sm">
                J'accepte les{' '}
                <a href="#" className="text-[#D4AF37] hover:underline">conditions générales</a>
                {' '}et la{' '}
                <a href="#" className="text-[#D4AF37] hover:underline">politique de confidentialité</a>
              </label>
            </div>
            {errors.acceptTerms && <p className="text-red-400 text-xs">{errors.acceptTerms}</p>}

            {/* Bouton submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8940F] text-black py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#D4AF37]/20 transition disabled:opacity-50 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Créer mon compte
                </>
              )}
            </button>

            {/* Lien vers login */}
            <div className="text-center pt-4">
              <p className="text-gray-400 text-sm">
                Déjà un compte ?{' '}
                <a href="/login" className="text-[#D4AF37] font-medium hover:underline">
                  Se connecter
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Avantages */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="text-center">
            <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <p className="text-gray-500 text-xs">Accès illimité</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <p className="text-gray-500 text-xs">Données sécurisées</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <p className="text-gray-500 text-xs">Support 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;