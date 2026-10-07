import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Calendar, Weight, 
  Dumbbell, Target, Award, Clock, TrendingUp,
  Shield, LogOut, Loader2, CheckCircle, XCircle
} from 'lucide-react';
import authService from '../services/authService';
import { userService } from '../services/userService';

const Profil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const objectifs = {
    1: '💪 Prise de masse',
    2: '🔥 Perte de poids',
    3: '🏋️ Force',
    4: '🏃 Endurance'
  };

  const niveaux = {
    'debutant': '🟢 Débutant',
    'intermediaire': '🟡 Intermédiaire',
    'avance': '🔴 Avancé'
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }

      const response = await userService.getById(currentUser.id);
      const userData = response.data || response;
      setUser(userData);
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      setError('Impossible de charger votre profil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <p className="text-gray-400">Utilisateur non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ===== EN-TÊTE ===== */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
              <User className="w-8 h-8 text-[#D4AF37]" />
              Mon profil
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Consultez vos informations personnelles
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 text-red-400 px-5 py-2.5 rounded-xl hover:bg-red-500/20 transition"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>

        {/* ===== MESSAGE D'ERREUR ===== */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          </div>
        )}

        {/* ===== PHOTO DE PROFIL ===== */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border-4 border-[#D4AF37]/50 flex items-center justify-center overflow-hidden">
            {user.photo || user.photo_url ? (
              <img src={user.photo || user.photo_url} alt="Photo de profil" className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-[#D4AF37]" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mt-4">
            {user.prenom} {user.nom}
          </h2>
          <p className="text-gray-400 text-sm">{user.email}</p>
          <span className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
            user.status === 'active' 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {user.status === 'active' ? '✅ Compte actif' : '⛔ Compte inactif'}
          </span>
        </div>

        {/* ===== INFORMATIONS PERSONNELLES ===== */}
        <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-white/10 p-6 space-y-5">
          
          <h3 className="text-[#D4AF37] font-semibold text-lg border-b border-white/10 pb-3">
            📋 Informations personnelles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prénom */}
            <div className="bg-[#0F0F15] rounded-xl p-4 border border-white/5">
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <User className="w-3 h-3" />
                Prénom
              </p>
              <p className="text-white font-medium mt-1">{user.prenom || 'Non renseigné'}</p>
            </div>

            {/* Nom */}
            <div className="bg-[#0F0F15] rounded-xl p-4 border border-white/5">
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <User className="w-3 h-3" />
                Nom
              </p>
              <p className="text-white font-medium mt-1">{user.nom || 'Non renseigné'}</p>
            </div>

            {/* Email */}
            <div className="bg-[#0F0F15] rounded-xl p-4 border border-white/5">
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Email
              </p>
              <p className="text-white font-medium mt-1">{user.email || 'Non renseigné'}</p>
            </div>

            {/* Téléphone */}
            <div className="bg-[#0F0F15] rounded-xl p-4 border border-white/5">
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <Phone className="w-3 h-3" />
                Téléphone
              </p>
              <p className="text-white font-medium mt-1">{user.numero || 'Non renseigné'}</p>
            </div>

            {/* Adresse */}
            <div className="bg-[#0F0F15] rounded-xl p-4 border border-white/5 md:col-span-2">
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Adresse
              </p>
              <p className="text-white font-medium mt-1">{user.addresse || 'Non renseigné'}</p>
            </div>

            {/* Date de naissance */}
            <div className="bg-[#0F0F15] rounded-xl p-4 border border-white/5">
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Date de naissance
              </p>
              <p className="text-white font-medium mt-1">
                {user.date_naissance || user.datedn ? new Date(user.date_naissance || user.datedn).toLocaleDateString('fr-FR') : 'Non renseigné'}
              </p>
            </div>

            {/* Poids */}
            <div className="bg-[#0F0F15] rounded-xl p-4 border border-white/5">
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <Weight className="w-3 h-3" />
                Poids
              </p>
              <p className="text-white font-medium mt-1">{user.poids ? `${user.poids} kg` : 'Non renseigné'}</p>
            </div>

            {/* Genre */}
            <div className="bg-[#0F0F15] rounded-xl p-4 border border-white/5">
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <User className="w-3 h-3" />
                Genre
              </p>
              <p className="text-white font-medium mt-1">{user.genre || 'Non renseigné'}</p>
            </div>

            {/* Objectif */}
            <div className="bg-[#0F0F15] rounded-xl p-4 border border-white/5">
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <Target className="w-3 h-3" />
                Objectif
              </p>
              <p className="text-white font-medium mt-1">
                {user.objectif_id ? objectifs[user.objectif_id] || 'Non défini' : 'Non défini'}
              </p>
            </div>

            {/* Niveau */}
            <div className="bg-[#0F0F15] rounded-xl p-4 border border-white/5">
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <Award className="w-3 h-3" />
                Niveau
              </p>
              <p className="text-white font-medium mt-1">
                {user.niveau || user.fitness_level ? niveaux[user.niveau || user.fitness_level] || 'Non défini' : 'Non défini'}
              </p>
            </div>
          </div>
        </div>

        {/* ===== STATISTIQUES ===== */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#12121A] rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#D4AF37]/10 rounded-xl">
                <Dumbbell className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Programmes suivis</p>
                <p className="text-white font-bold text-xl">{user.programmes_suivis || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#12121A] rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#D4AF37]/10 rounded-xl">
                <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Progression</p>
                <p className="text-white font-bold text-xl">{user.progression || 0}%</p>
              </div>
            </div>
          </div>
          <div className="bg-[#12121A] rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#D4AF37]/10 rounded-xl">
                <Award className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Niveau</p>
                <p className="text-white font-bold text-xl">
                  {user.niveau || user.fitness_level ? niveaux[user.niveau || user.fitness_level] || 'Non défini' : 'Non défini'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#12121A] rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#D4AF37]/10 rounded-xl">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Membre depuis</p>
                <p className="text-white font-bold text-xl">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RÔLE ===== */}
        <div className="mt-6 bg-[#12121A] rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <p className="text-gray-400 text-xs">Rôle</p>
              <p className="text-white font-medium">
                {user.role === 'super_admin' ? '👑 Super Administrateur' :
                 user.role === 'admin' ? '🛡️ Administrateur' :
                 user.role === 'coach' ? '👨‍🏫 Coach' :
                 '👤 Client'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;