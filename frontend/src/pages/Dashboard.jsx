import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { statisticsApi } from '../api/statistics';
import ErrorAlert from '../components/ui/ErrorAlert';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useNotification } from '../context/NotificationContext';

function StatCard({ label, value, sub, icon, accent = 'default' }) {
  const accents = {
    default: 'from-grocery-500 to-grocery-600',
    low: 'from-emerald-500 to-teal-600',
    high: 'from-amber-500 to-orange-600',
    avg: 'from-lime-500 to-grocery-600',
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-grocery-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${accents[accent]} opacity-10 transition-transform group-hover:scale-110`} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-grocery-900">{value}</p>
          {sub && <p className="mt-1.5 text-xs text-gray-400">{sub}</p>}
        </div>
        <span className="rounded-2xl bg-grocery-50 p-3 text-2xl ring-1 ring-grocery-100">{icon}</span>
      </div>
    </div>
  );
}

function ChangeBadge({ amount, percent }) {
  const up = amount > 0;
  const down = amount < 0;
  const neutral = amount === 0;

  const cls = up
    ? 'bg-red-50 text-red-700 ring-red-100'
    : down
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
      : 'bg-gray-50 text-gray-600 ring-gray-100';

  const arrow = up ? '↑' : down ? '↓' : '→';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}>
      {arrow} {neutral ? 'No change' : `${Math.abs(percent)}%`}
    </span>
  );
}

export default function Dashboard() {
  const { error: notifyError } = useNotification();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await statisticsApi.get();
      setStats(data);
    } catch (err) {
      setError(err.message);
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;

  if (error) return <ErrorAlert message={error} onRetry={load} />;

  const fmt = (v) => (v != null ? `$${v.toFixed(2)}` : '—');

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-grocery-700 via-grocery-600 to-grocery-500 p-6 text-white shadow-lg sm:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 translate-x-1/4 -translate-y-1/4 rounded-full bg-white/10" />
        <div className="relative">
          <p className="text-sm font-medium text-grocery-100">Market Price Tracker</p>
          <h3 className="mt-1 text-2xl font-bold sm:text-3xl">Your Grocery Dashboard</h3>
          <p className="mt-2 max-w-xl text-grocery-100/90">
            Monitor ingredient prices, spot trends, and compare spending across shops.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/ingredients" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-grocery-700 shadow-sm hover:bg-grocery-50">
              Manage Ingredients
            </Link>
            <Link to="/purchases" className="rounded-xl border border-white/30 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              Add Purchase
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Ingredients" value={stats.totalIngredients} icon="🥬" sub="Items being tracked" />
        <StatCard label="Total Purchases" value={stats.totalPurchases} icon="🛒" sub="Recorded transactions" />
        <StatCard label="Average Price" value={fmt(stats.averagePrice)} icon="📊" accent="avg" sub="Per unit across all purchases" />
        <StatCard label="Lowest Price" value={fmt(stats.lowestPrice)} icon="📉" accent="low" sub="Best unit price found" />
        <StatCard label="Highest Price" value={fmt(stats.highestPrice)} icon="📈" accent="high" sub="Highest unit price recorded" />
        <StatCard label="Total Spent" value={fmt(stats.totalSpent)} icon="💰" sub={`Avg. purchase ${fmt(stats.averagePurchasePrice)}`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-grocery-100 bg-white shadow-sm">
          <div className="border-b border-grocery-50 px-6 py-4">
            <h4 className="text-lg font-bold text-gray-900">Recent Purchases</h4>
            <p className="text-sm text-gray-500">Latest grocery transactions</p>
          </div>
          {stats.recentPurchases.length === 0 ? (
            <p className="p-6 text-gray-500">
              No purchases yet.{' '}
              <Link to="/purchases" className="font-medium text-grocery-600 hover:underline">Add your first purchase</Link>.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-grocery-50/50 text-gray-500">
                    <th className="px-6 py-3 font-medium">Ingredient</th>
                    <th className="px-6 py-3 font-medium">Shop</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentPurchases.map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-grocery-50/40">
                      <td className="px-6 py-3.5 font-medium text-gray-900">{p.ingredientName}</td>
                      <td className="px-6 py-3.5 text-gray-600">{p.shopName}</td>
                      <td className="px-6 py-3.5 text-gray-600">{new Date(p.purchaseDate).toLocaleDateString()}</td>
                      <td className="px-6 py-3.5 text-right font-semibold text-grocery-700">${p.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-grocery-100 bg-white shadow-sm">
          <div className="border-b border-grocery-50 px-6 py-4">
            <h4 className="text-lg font-bold text-gray-900">Latest Price Changes</h4>
            <p className="text-sm text-gray-500">Unit price vs. previous purchase</p>
          </div>
          {stats.latestPriceChanges.length === 0 ? (
            <p className="p-6 text-gray-500">Need at least two purchases per ingredient to show changes.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {stats.latestPriceChanges.map((c) => (
                <div key={`${c.ingredientId}-${c.latestDate}`} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-grocery-50/40">
                  <div>
                    <p className="font-semibold text-gray-900">{c.ingredientName}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {new Date(c.previousDate).toLocaleDateString()} → {new Date(c.latestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm">
                      <p className="text-gray-400 line-through">${c.previousUnitPrice.toFixed(2)}</p>
                      <p className="font-bold text-grocery-800">${c.latestUnitPrice.toFixed(2)}</p>
                    </div>
                    <ChangeBadge amount={c.changeAmount} percent={c.changePercent} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

