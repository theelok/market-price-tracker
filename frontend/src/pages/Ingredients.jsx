import { useEffect, useMemo, useState } from 'react';
import { ingredientsApi } from '../api/ingredients';
import Button from '../components/ui/Button';
import ErrorAlert from '../components/ui/ErrorAlert';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useNotification } from '../context/NotificationContext';
import Modal from '../components/ui/Modal';

const emptyForm = { name: '', category: '' };

export default function Ingredients() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { success, error: notifyError } = useNotification();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ingredientsApi.getAll();
      setItems(data);
    } catch (err) {
      setError(err.message);
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    load();
}, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.category?.toLowerCase().includes(q) ?? false)
    );
  }, [items, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ name: item.name, category: item.category || '' });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await ingredientsApi.update(editing.id, form);
        success('Ingredient updated successfully.');
      } else {
        await ingredientsApi.create(form);
        success('Ingredient created successfully.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.message);
      notifyError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.name}" and all its purchases?`)) return;
    setDeletingId(item.id);
    try {
      await ingredientsApi.remove(item.id);
      success(`"${item.name}" deleted successfully.`);
      await load();
    } catch (err) {
      setError(err.message);
      notifyError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ingredients or categories..."
            className="w-full rounded-xl border border-grocery-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition focus:border-grocery-500 focus:outline-none focus:ring-2 focus:ring-grocery-200"
          />
        </div>
        <Button onClick={openCreate} className="shrink-0 rounded-xl px-5 py-2.5 shadow-sm">
          + Add Ingredient
        </Button>
      </div>

      {error && !modalOpen && <ErrorAlert message={error} onRetry={load} />}

      <div className="overflow-hidden rounded-2xl border border-grocery-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-grocery-50 px-6 py-4">
          <div>
            <h4 className="font-bold text-gray-900">All Ingredients</h4>
            <p className="text-sm text-gray-500">
              {filtered.length} of {items.length} ingredient{items.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {loading ? <LoadingSpinner label="Loading ingredients..." /> : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-4xl">🥬</p>
            <p className="mt-3 font-medium text-gray-900">
              {search ? 'No ingredients match your search' : 'No ingredients yet'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {search ? 'Try a different search term.' : 'Add your first ingredient to start tracking prices.'}
            </p>
            {!search && (
              <Button onClick={openCreate} className="mt-4 rounded-xl">+ Add Ingredient</Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-grocery-100 bg-grocery-50/80 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-3.5 font-semibold">Name</th>
                  <th className="px-6 py-3.5 font-semibold">Category</th>
                  <th className="px-6 py-3.5 font-semibold">Purchases</th>
                  <th className="px-6 py-3.5 font-semibold">Latest Price</th>
                  <th className="px-6 py-3.5 font-semibold">Last Updated</th>
                  <th className="px-6 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-grocery-50/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-grocery-100 text-lg">🌿</span>
                        <span className="font-semibold text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.category ? (
                        <span className="inline-flex rounded-full bg-grocery-100 px-2.5 py-1 text-xs font-medium text-grocery-800">
                          {item.category}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{item.purchaseCount}</td>
                    <td className="px-6 py-4">
                      {item.latestPrice != null ? (
                        <span className="font-bold text-grocery-700">${item.latestPrice.toFixed(2)}</span>
                      ) : (
                        <span className="text-gray-400">No data</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.latestPurchaseDate
                        ? new Date(item.latestPurchaseDate).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="rounded-lg px-3 py-1.5 text-sm font-medium text-grocery-700 ring-1 ring-grocery-200 transition hover:bg-grocery-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item)} disabled={deletingId === item.id}
                          className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 ring-1 ring-red-100 transition hover:bg-red-50"
                        >
                          {deletingId === item.id ? 'Deleting...' : 'Delete'}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Ingredient' : 'Add Ingredient'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && modalOpen && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Name *</label>
            <input
              required
              maxLength={200}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-grocery-500 focus:outline-none focus:ring-2 focus:ring-grocery-200"
              placeholder="e.g. Tomatoes"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
            <input
              maxLength={100}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-grocery-500 focus:outline-none focus:ring-2 focus:ring-grocery-200"
              placeholder="e.g. Vegetables"
            />
          </div>
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving} className="rounded-xl">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

