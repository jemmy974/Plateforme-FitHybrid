import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { Dumbbell, Mail, Lock, Eye, EyeOff, LogIn, Shield, Sparkles } from 'lucide-react';
import authService from '../../services/authService.js';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    mdp: '',
    rememberMe: false
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Appel API réel
      const response = await authService.login(formData.email, formData.mdp);


      // ✅ Vérifier que le token existe
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('✅ Token stocké:', response.token);
      } else {
        console.error('❌ Pas de token reçu');
      }

      // Redirection après connexion
      if (response.user?.role === 'super_admin') {
        navigate('/superadmin');
      } else if (response.user?.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError(error.message || 'Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] to-[#0F0F15] flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-[#D4AF37] to-[#9C7E2C] w-35 h-35 rounded-2xl flex items-center justify-center shadow-2xl shadow-[#D4AF37]/20">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <Link to={"/"}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            HYBRIDFIT
          </h1>
          </Link>
          <p className="text-gray-400 text-sm mt-2">Connectez-vous à votre compte</p>
        </div>

        {/* Formulaire */}
        <div className="bg-[#12121A]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#1A1A24] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition"
                  placeholder="admin@fitnessforge.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.mdp}
                  onChange={(e) => setFormData({ ...formData, mdp: e.target.value })}
                  className="w-full bg-[#1A1A24] border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-[#1A1A24] accent-[#D4AF37]"
                />
                <span className="text-gray-400 text-sm">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-[#D4AF37] text-sm hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8940F] text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#D4AF37]/20 transition disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </>
              )}
            </button>

            {/* Demo credentials */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-gray-500 text-xs mb-2">Compte de démonstration</p>
              <div className="flex justify-center gap-4 text-xs">
                <div>
                  <span className="text-gray-400">Email:</span>
                  <span className="text-[#D4AF37] ml-1">admin@fitnessforge.com</span>
                </div>
                <div>
                  <span className="text-gray-400">Mot de passe:</span>
                  <span className="text-[#D4AF37] ml-1">admin123</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Espace réservé aux notre clients • HybridFitness
        </p>
      </div>
    </div>
  );
};

export default Login;
