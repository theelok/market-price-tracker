import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function PriceHistoryChart({ data, unit = 'unit' }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl bg-grocery-50 text-sm text-gray-500">
        No price history yet
      </div>
    );
  }

  const chartData = data.map((point) => ({
    date: new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    price: point.unitPrice,
    shop: point.shopName,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} />
        <YAxis
          tick={{ fontSize: 11, fill: '#6b7280' }}
          tickFormatter={(v) => `$${v}`}
          width={48}
        />
        <Tooltip
          formatter={(value) => [`$${Number(value).toFixed(2)}`, `Per ${unit}`]}
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{ borderRadius: '12px', border: '1px solid #dcfce7' }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#16a34a"
          strokeWidth={2.5}
          dot={{ fill: '#16a34a', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#15803d' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
