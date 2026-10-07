import { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

const ProductModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  produit = null,
  categories = [],
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    ancien_prix: '',
    stock: '',
    categorie_id: '',
    objectif_id: '',
    statut: 'actif',
    est_nouveau: false,
    image: null,
    imagePreview: null
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const objectifs = [
    { id: 1, label: '💪 Prise de masse' },
    { id: 2, label: '🔥 Perte de poids' },
    { id: 3, label: '🏋️ Force' },
    { id: 4, label: '🏃 Endurance' }
  ];

  const statuts = [
    { value: 'actif', label: '🟢 Actif' },
    { value: 'inactif', label: '🔴 Inactif' }
  ];

  useEffect(() => {
    if (produit) {
      setFormData({
        nom: produit.nom || '',
        description: produit.description || '',
        prix: produit.prix || '',
        ancien_prix: produit.ancien_prix || '',
        stock: produit.stock || '',
        categorie_id: produit.categorie_id || '',
        objectif_id: produit.objectif_id || '',
        statut: produit.statut || 'actif',
        est_nouveau: produit.est_nouveau || false,
        image: null,
        imagePreview: produit.image || null
      });
    } else {
      resetForm();
    }
  }, [produit]);

  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
      prix: '',
      ancien_prix: '',
      stock: '',
      categorie_id: '',
      objectif_id: '',
      statut: 'actif',
      est_nouveau: false,
      image: null,
      imagePreview: null
    });
    setErrors({});
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData({
          ...formData,
          image: file,
          imagePreview: URL.createObjectURL(file)
        });
      }
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prix || parseFloat(formData.prix) <= 0) {
      newErrors.prix = 'Le prix doit être supérieur à 0';
    }
    if (formData.stock && parseInt(formData.stock) < 0) {
      newErrors.stock = 'Le stock ne peut pas être négatif';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


// const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     // ✅ Utiliser FormData pour envoyer l'image
//     const formData = new FormData();
//     formData.append('nom', formData.nom.trim());
//     formData.append('description', formData.description.trim());
//     formData.append('prix', formData.prix);
//     formData.append('ancien_prix', formData.ancien_prix || '');
//     formData.append('stock', formData.stock || '0');
//     formData.append('categorie_id', formData.categorie_id || '');
//     formData.append('objectif_id', formData.objectif_id || '');
//     formData.append('statut', formData.statut);
//     formData.append('est_nouveau', formData.est_nouveau);
    
//     // ✅ Ajouter l'image (le fichier)
//     if (imageFile) {
//         formData.append('image', imageFile);
//     }

//     try {
//         await onSave(formData);
//         setSuccess('✅ Produit enregistré avec succès !');
//         setTimeout(() => {
//             onClose();
//             resetForm();
//         }, 1500);
//     } catch (err) {
//         setError(err.message || 'Erreur lors de l\'enregistrement');
//     }
// };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // ✅ Renommer en formDataToSend pour éviter la confusion
    const formDataToSend = new FormData();
    
    // ✅ Ajouter les champs depuis le state "formData"
    formDataToSend.append('nom', formData.nom.trim());
    formDataToSend.append('description', formData.description.trim());
    formDataToSend.append('prix', formData.prix);
    formDataToSend.append('ancien_prix', formData.ancien_prix || '');
    formDataToSend.append('stock', formData.stock || '0');
    formDataToSend.append('categorie_id', formData.categorie_id || '');
    formDataToSend.append('objectif_id', formData.objectif_id || '');
    formDataToSend.append('statut', formData.statut);
    formDataToSend.append('est_nouveau', formData.est_nouveau);
    
    // ✅ Ajouter l'image (depuis formData.image)
    if (formData.image) {
        formDataToSend.append('image', formData.image);
    }

    try {
        await onSave(formDataToSend);
        setSuccess('✅ Produit enregistré avec succès !');
        setTimeout(() => {
            onClose();
            resetForm();
        }, 1500);
    } catch (err) {
        setError(err.message || 'Erreur lors de l\'enregistrement');
    }
};

// ✅ Gestion de l'image
const [imageFile, setImageFile] = useState(null);


const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, imagePreview: reader.result });
        };
        reader.readAsDataURL(file);
    }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-2xl border border-[#D4AF37]/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-[#D4AF37]/10">
        
        {/* Header */}
        <div className="sticky top-0 bg-[#12121A]/90 backdrop-blur-sm border-b border-white/10 p-5 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {produit ? '✏️ Modifier le produit' : '✨ Nouveau produit'}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {produit ? 'Modifiez les informations du produit' : 'Ajoutez un nouveau produit au catalogue'}
              </p>
            </div>
            <button 
              onClick={() => { onClose(); resetForm(); }} 
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-5 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          </div>
        )}
        {success && (
          <div className="mx-5 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <p className="text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {success}
            </p>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          
          {/* Section 1 : Informations générales */}
          <div className="bg-[#1A1A24] rounded-xl p-4 border border-white/5">
              <h3 className="text-[#D4AF37] text-sm font-semibold mb-3 flex items-center gap-2">
                <span>📝</span> Informations générales
              </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Nom du produit <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={`w-full bg-[#0F0F15] border ${errors.nom ? 'border-red-500' : 'border-white/10'} rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all duration-300`}
                  placeholder="ISO WHEY GOLD"
                />
                {errors.nom && <p className="text-red-400 text-xs mt-1">{errors.nom}</p>}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Prix (Ar) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  className={`w-full bg-[#0F0F15] border ${errors.prix ? 'border-red-500' : 'border-white/10'} rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all duration-300`}
                  placeholder="145000"
                />
                {errors.prix && <p className="text-red-400 text-xs mt-1">{errors.prix}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Ancien prix (Ar)</label>
                <input
                  type="number"
                  name="ancien_prix"
                  value={formData.ancien_prix}
                  onChange={handleChange}
                  className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
                  placeholder="189000"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className={`w-full bg-[#0F0F15] border ${errors.stock ? 'border-red-500' : 'border-white/10'} rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all duration-300`}
                  placeholder="45"
                />
                {errors.stock && <p className="text-red-400 text-xs mt-1">{errors.stock}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
                rows="3"
                placeholder="Description du produit..."
              />
            </div>
          </div>

          {/* Section 2 : Catégorie & Objectif */}
          <div className="bg-[#1A1A24] rounded-xl p-4 border border-white/5">
              <h3 className="text-[#D4AF37] text-sm font-semibold mb-3 flex items-center gap-2">
                <span>🏷️</span> Catégorie & Objectif
              </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Catégorie</label>
                <select
                  name="categorie_id"
                  value={formData.categorie_id}
                  onChange={handleChange}
                  className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
                >
                  <option value="">Sélectionner</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nom || cat.nomCat || 'Sans nom'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Objectif</label>
                <select
                  name="objectif_id"
                  value={formData.objectif_id}
                  onChange={handleChange}
                  className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
                >
                  <option value="">Sélectionner</option>
                  {objectifs.map(obj => (
                    <option key={obj.id} value={obj.id}>{obj.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3 : Image */}
          <div className="bg-[#1A1A24] rounded-xl p-4 border border-white/5">
              <h3 className="text-[#D4AF37] text-sm font-semibold mb-3 flex items-center gap-2">
                <span>🖼️</span> Image du produit
              </h3>
            
            <div className="relative">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="flex items-center justify-center w-full h-36 bg-[#0F0F15] border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-300 overflow-hidden"
              >
                {formData.imagePreview ? (
                  <img 
                    src={formData.imagePreview} 
                    alt="Aperçu" 
                    className="h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Cliquez pour importer une image</p>
                    <p className="text-gray-500 text-xs mt-1">PNG, JPG, JPEG (max 5MB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Section 4 : Options */}
          <div className="bg-[#1A1A24] rounded-xl p-4 border border-white/5">
              <h3 className="text-[#D4AF37] text-sm font-semibold mb-3 flex items-center gap-2">
                <span>⚙️</span> Options
              </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="est_nouveau"
                  checked={formData.est_nouveau}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-white/20 bg-[#0F0F15] accent-[#D4AF37]"
                />
                <label className="text-gray-300 text-sm flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Marquer comme nouveau
                </label>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Statut</label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  className="w-full bg-[#0F0F15] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
                >
                  {statuts.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B8940F] text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {produit ? 'Modifier le produit' : 'Créer le produit'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => { onClose(); resetForm(); }}
              className="px-6 py-3 border border-white/10 rounded-xl text-gray-400 hover:bg-white/5 transition-all duration-300"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;