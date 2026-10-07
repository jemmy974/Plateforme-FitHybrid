import { useEffect, useState } from 'react';
import { produitService } from '../../services/produitService';

const initialForm = {
  nom: '',
  description: '',
  prix: '',
  stock: 0,
  image: '',
  categorie_id: '',
  objectif_id: '',
  statut: 'actif',
  popularite: 0,
  est_nouveau: false,
};

function AdminProduits() {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('[AdminProduits] Chargement des produits');
      const [produitsRes, categoriesRes] = await Promise.all([
        produitService.getAll({ limit: 100 }),
        produitService.getCategories(),
      ]);
      setProduits(produitsRes?.data || []);
      setCategories(categoriesRes?.data || []);
    } catch (error) {
      console.error('[AdminProduits] Erreur chargement', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[AdminProduits] Soumission formulaire', form);

    const payload = {
      ...form,
      prix: Number(form.prix),
      stock: Number(form.stock),
      popularite: Number(form.popularite || 0),
      est_nouveau: form.est_nouveau === true || form.est_nouveau === 'true',
    };

    if (!payload.nom?.trim()) {
      alert('Le nom est requis');
      return;
    }
    if (!payload.prix || payload.prix <= 0) {
      alert('Le prix doit être supérieur à 0');
      return;
    }
    if (payload.stock < 0) {
      alert('Le stock ne peut pas être négatif');
      return;
    }

    try {
      if (editingId) {
        await produitService.update(editingId, payload);
      } else {
        await produitService.create(payload);
      }
      setForm(initialForm);
      setEditingId(null);
      await loadData();
    } catch (error) {
      console.error('[AdminProduits] Erreur de sauvegarde', error);
      alert(error?.response?.data?.message || 'Erreur sauvegarde');
    }
  };

  const handleEdit = (produit) => {
    setEditingId(produit.id);
    setForm({
      nom: produit.nom || '',
      description: produit.description || '',
      prix: produit.prix || '',
      stock: produit.stock || 0,
      image: produit.image || '',
      categorie_id: produit.categorie_id || '',
      objectif_id: produit.objectif_id || '',
      statut: produit.statut || 'actif',
      popularite: produit.popularite || 0,
      est_nouveau: Boolean(produit.est_nouveau),
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      await produitService.delete(id);
      await loadData();
    } catch (error) {
      console.error('[AdminProduits] Erreur suppression', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des produits</h1>
          <p className="text-slate-500">CRUD complet des produits</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Nom du produit" className="border rounded-xl px-4 py-3" required />
          <input value={form.prix} onChange={(e) => setForm({ ...form, prix: e.target.value })} placeholder="Prix" type="number" step="0.01" className="border rounded-xl px-4 py-3" required />
          <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" type="number" className="border rounded-xl px-4 py-3" />
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="URL image" className="border rounded-xl px-4 py-3" />
          <select value={form.categorie_id} onChange={(e) => setForm({ ...form, categorie_id: e.target.value })} className="border rounded-xl px-4 py-3">
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.nomCat}</option>)}
          </select>
          <input value={form.objectif_id} onChange={(e) => setForm({ ...form, objectif_id: e.target.value })} placeholder="Objectif ID" className="border rounded-xl px-4 py-3" />
          <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })} className="border rounded-xl px-4 py-3">
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
          <input value={form.popularite} onChange={(e) => setForm({ ...form, popularite: e.target.value })} placeholder="Popularité" type="number" className="border rounded-xl px-4 py-3" />
        </div>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full border rounded-xl px-4 py-3" rows="4" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={Boolean(form.est_nouveau)} onChange={(e) => setForm({ ...form, est_nouveau: e.target.checked })} />
          Nouveau produit
        </label>
        <div className="flex gap-3">
          <button type="submit" className="rounded-xl bg-slate-900 text-white px-5 py-3">{editingId ? 'Mettre à jour' : 'Créer'}</button>
          {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(initialForm); }} className="rounded-xl border px-5 py-3">Annuler</button> : null}
        </div>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Prix</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Catégorie</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td className="p-4" colSpan="6">Chargement...</td></tr> : produits.map((produit) => (
              <tr key={produit.id} className="border-t">
                <td className="p-3">{produit.nom}</td>
                <td className="p-3">{Number(produit.prix).toLocaleString()} Ar</td>
                <td className="p-3">{produit.stock}</td>
                <td className="p-3">{produit.categorie?.nomCat || produit.categorie_id}</td>
                <td className="p-3">{produit.statut}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleEdit(produit)} className="text-blue-600">Modifier</button>
                  <button onClick={() => handleDelete(produit.id)} className="text-red-600">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProduits;
