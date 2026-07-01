import { useEffect, useMemo, useState } from 'react';
import { statisticsApi } from '../api/statistics';
import ErrorAlert from '../components/ui/ErrorAlert';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useNotification } from '../context/NotificationContext';
import PriceHistoryChart from '../components/charts/PriceHistoryChart';

function StatPill({ label, value, highlight }) {
  return (
    <div className={`rounded-xl px-3 py-2.5 ${highlight ? 'bg-grocery-100 ring-1 ring-grocery-200' : 'bg-gray-50'}`}>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`mt-0.5 text-sm font-bold ${highlight ? 'text-grocery-800' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

function DiffBadge({ diff }) {
  if (diff == null) return <span className="text-xs text-gray-400">N/A</span>;
  const up = diff > 0;
  const down = diff < 0;
  const cls = up
    ? 'bg-red-50 text-red-700 ring-red-100'
    : down
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
      : 'bg-gray-50 text-gray-600 ring-gray-100';
  const sign = up ? '+' : '';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}>
      {sign}${Math.abs(diff).toFixed(2)} {up ? '↑' : down ? '↓' : '→'}
    </span>
  );
}

function IngredientCard({ item }) {
  const fmt = (v) => (v != null ? `$${v.toFixed(2)}` : '—');

  return (
    <article className="overflow-hidden rounded-2xl border border-grocery-100 bg-white shadow-sm">
      <div className="border-b border-grocery-50 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🥬</span>
              <h4 className="text-lg font-bold text-gray-900">{item.ingredientName}</h4>
            </div>
            {item.category && (
              <span className="mt-1 inline-flex rounded-full bg-grocery-100 px-2.5 py-0.5 text-xs font-medium text-grocery-800">
                {item.category}
              </span>
            )}
            <p className="mt-1 text-xs text-gray-500">{item.purchaseCount} purchase{item.purchaseCount !== 1 ? 's' : ''} recorded</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">vs. previous</p>
            <DiffBadge diff={item.priceDifferenceFromPrevious} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4">
        <StatPill label="Lowest" value={fmt(item.lowestPrice)} />
        <StatPill label="Highest" value={fmt(item.highestPrice)} />
        <StatPill label="Average" value={fmt(item.averagePrice)} />
        <StatPill label="Latest" value={fmt(item.latestPrice)} highlight />
      </div>

      <div className="border-t border-grocery-50 px-4 pb-4 pt-2">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Price History</p>
        <PriceHistoryChart data={item.priceHistory} />
      </div>
    </article>
  );
}

export default function Statistics() {
  const { error: notifyError } = useNotification();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await statisticsApi.getIngredients();
      setItems(data);
    } catch (err) {
      setError(err.message);
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.ingredientName.toLowerCase().includes(q) ||
        (i.category?.toLowerCase().includes(q) ?? false)
    );
  }, [items, search]);

  const withData = filtered.filter((i) => i.purchaseCount > 0);
  const withoutData = filtered.filter((i) => i.purchaseCount === 0);

  if (loading) return <LoadingSpinner label="Loading statistics..." />;

  if (error) return <ErrorAlert message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ingredients..."
          className="w-full rounded-xl border border-grocery-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-grocery-500 focus:outline-none focus:ring-2 focus:ring-grocery-200"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-grocery-100 bg-white p-10 text-center shadow-sm">
          <p className="text-4xl">📈</p>
          <p className="mt-3 font-medium text-gray-900">No ingredients found</p>
          <p className="mt-1 text-sm text-gray-500">Add ingredients and purchases to see price statistics.</p>
        </div>
      ) : (
        <>
          {withData.length > 0 && (
            <div className="grid gap-6 xl:grid-cols-2">
              {withData.map((item) => (
                <IngredientCard key={item.ingredientId} item={item} />
              ))}
            </div>
          )}

          {withoutData.length > 0 && (
            <div className="rounded-2xl border border-dashed border-grocery-200 bg-grocery-50/50 p-6">
              <h4 className="font-semibold text-gray-700">No purchase data yet</h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-500">
                {withoutData.map((i) => (
                  <li key={i.ingredientId}>• {i.ingredientName}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

