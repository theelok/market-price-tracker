import { useCallback, useEffect, useMemo, useState } from 'react';
import { purchasesApi } from '../api/purchases';
import { ingredientsApi } from '../api/ingredients';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ErrorAlert from '../components/ui/ErrorAlert';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useNotification } from '../context/NotificationContext';

const emptyForm = {
  ingredientId: '',
  shopName: '',
  quantity: '',
  unit: 'kg',
  price: '',
  purchaseDate: new Date().toISOString().slice(0, 10),
  notes: '',
};

const SORT_KEYS = {
  ingredientName: (p) => p.ingredientName.toLowerCase(),
  shopName: (p) => p.shopName.toLowerCase(),
  quantity: (p) => p.quantity,
  unit: (p) => p.unit.toLowerCase(),
  price: (p) => p.price,
  purchaseDate: (p) => new Date(p.purchaseDate).getTime(),
  notes: (p) => (p.notes || '').toLowerCase(),
};

function SortHeader({ label, sortKey, activeKey, direction, onSort }) {
  const active = activeKey === sortKey;
  return (
    <th className="px-4 py-3.5 font-semibold">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-gray-500 transition hover:text-grocery-700"
      >
        {label}
        <span className={`text-grocery-600 ${active ? 'opacity-100' : 'opacity-30'}`}>
          {active ? (direction === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </button>
    </th>
  );
}

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [filterIngredient, setFilterIngredient] = useState('');
  const [sortKey, setSortKey] = useState('purchaseDate');
  const [sortDir, setSortDir] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loadingIngredients, setLoadingIngredients] = useState(true);
  const { success, error: notifyError } = useNotification();

  const loadPurchases = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await purchasesApi.getAll(filterIngredient || undefined);
      setPurchases(data);
    } catch (err) {
      setError(err.message);
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterIngredient, notifyError]);

  useEffect(() => {
    (async () => {
      setLoadingIngredients(true);
      try {
        const data = await ingredientsApi.getAll();
        setIngredients(data);
      } catch (err) {
        setError(err.message);
        notifyError(err.message);
      } finally {
        setLoadingIngredients(false);
      }
    })();
  }, [notifyError]);

  useEffect(() => { loadPurchases(); }, [loadPurchases]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    const getter = SORT_KEYS[sortKey];
    if (!getter) return purchases;
    return [...purchases].sort((a, b) => {
      const av = getter(a);
      const bv = getter(b);
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [purchases, sortKey, sortDir]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, ingredientId: ingredients[0]?.id || '' });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (purchase) => {
    setEditing(purchase);
    setForm({
      ingredientId: purchase.ingredientId,
      shopName: purchase.shopName,
      quantity: String(purchase.quantity),
      unit: purchase.unit,
      price: String(purchase.price),
      purchaseDate: purchase.purchaseDate.slice(0, 10),
      notes: purchase.notes || '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      shopName: form.shopName,
      quantity: parseFloat(form.quantity),
      unit: form.unit,
      price: parseFloat(form.price),
      purchaseDate: new Date(form.purchaseDate).toISOString(),
      notes: form.notes || null,
    };
    try {
      if (editing) {
        await purchasesApi.update(editing.id, payload);
        success('Purchase updated successfully.');
      } else {
        await purchasesApi.create({ ...payload, ingredientId: form.ingredientId });
        success('Purchase created successfully.');
      }
      setModalOpen(false);
      await loadPurchases();
    } catch (err) {
      setError(err.message);
      notifyError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (purchase) => {
    if (!confirm('Delete purchase from ' + purchase.shopName + '?')) return;
    setDeletingId(purchase.id);
    try {
      await purchasesApi.remove(purchase.id);
      success('Purchase deleted successfully.');
      await loadPurchases();
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
        <select
          value={filterIngredient}
          onChange={(e) => setFilterIngredient(e.target.value)}
          className="rounded-xl border border-grocery-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-grocery-500 focus:outline-none focus:ring-2 focus:ring-grocery-200"
        >
          <option value="">All ingredients</option>
          {ingredients.map((i) => (
            <option key={i.id} value={i.id}>{i.name}</option>
          ))}
        </select>
        <Button onClick={openCreate} disabled={ingredients.length === 0 || loadingIngredients} className="rounded-xl px-5">
          + Add Purchase
        </Button>
      </div>

      {ingredients.length === 0 && (
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-amber-800">
          Add an ingredient first before recording purchases.
        </div>
      )}
      {error && !modalOpen && <ErrorAlert message={error} onRetry={loadPurchases} />}

      <div className="overflow-hidden rounded-2xl border border-grocery-100 bg-white shadow-sm">
        <div className="border-b border-grocery-50 px-6 py-4">
          <h4 className="font-bold text-gray-900">Purchase History</h4>
          <p className="text-sm text-gray-500">{sorted.length} record{sorted.length !== 1 ? 's' : ''} · Click column headers to sort</p>
        </div>

{loading ? (
          <LoadingSpinner label="Loading purchases..." />
        ) : sorted.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-4xl">🛒</p>
            <p className="mt-3 font-medium text-gray-900">No purchases found</p>
            <p className="mt-1 text-sm text-gray-500">Record your first grocery purchase to start tracking prices.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-grocery-100 bg-grocery-50/80">
                <tr>
                  <SortHeader label="Ingredient" sortKey="ingredientName" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                  <SortHeader label="Shop" sortKey="shopName" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                  <SortHeader label="Quantity" sortKey="quantity" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                  <SortHeader label="Unit" sortKey="unit" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                  <SortHeader label="Price" sortKey="price" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                  <SortHeader label="Purchase Date" sortKey="purchaseDate" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                  <SortHeader label="Notes" sortKey="notes" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                  <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sorted.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-grocery-50/50">
                    <td className="px-4 py-3.5 font-semibold text-gray-900">{p.ingredientName}</td>
                    <td className="px-4 py-3.5 text-gray-700">{p.shopName}</td>
                    <td className="px-4 py-3.5 text-gray-700">{p.quantity}</td>
                    <td className="px-4 py-3.5 text-gray-600">{p.unit}</td>
                    <td className="px-4 py-3.5 font-bold text-grocery-700">${p.price.toFixed(2)}</td>
                    <td className="px-4 py-3.5 text-gray-600">{new Date(p.purchaseDate).toLocaleDateString()}</td>
                    <td className="max-w-[160px] truncate px-4 py-3.5 text-gray-500" title={p.notes || ''}>
                      {p.notes || '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded-lg px-3 py-1.5 text-sm font-medium text-grocery-700 ring-1 ring-grocery-200 hover:bg-grocery-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p)} disabled={deletingId === p.id}
                          className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 ring-1 ring-red-100 hover:bg-red-50"
                        >
                          {deletingId === p.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} title={editing ? 'Edit Purchase' : 'Add Purchase'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && modalOpen && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}
          {!editing && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Ingredient *</label>
              <select
                required
                value={form.ingredientId}
                onChange={(e) => setForm({ ...form, ingredientId: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-grocery-500 focus:outline-none focus:ring-2 focus:ring-grocery-200"
              >
                <option value="">Select ingredient</option>
                {ingredients.map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Shop *</label>
            <input
              required
              maxLength={200}
              value={form.shopName}
              onChange={(e) => setForm({ ...form, shopName: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-grocery-500 focus:outline-none focus:ring-2 focus:ring-grocery-200"
              placeholder="e.g. Fresh Market"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Quantity *</label>
              <input
                required
                type="number"
                min="0.001"
                step="0.001"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-grocery-500 focus:outline-none focus:ring-2 focus:ring-grocery-200"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Unit *</label>
              <input
                required
                maxLength={20}
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-grocery-500 focus:outline-none focus:ring-2 focus:ring-grocery-200"
                placeholder="kg, lb, pcs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Price *</label>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-grocery-500 focus:outline-none focus:ring-2 focus:ring-grocery-200"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Purchase Date *</label>
              <input
                required
                type="date"
                value={form.purchaseDate}
                onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-grocery-500 focus:outline-none focus:ring-2 focus:ring-grocery-200"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              maxLength={500}
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-grocery-500 focus:outline-none focus:ring-2 focus:ring-grocery-200"
              placeholder="Optional notes about this purchase"
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



