import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/ingredients', label: 'Ingredients', icon: '🥬' },
  { to: '/purchases', label: 'Purchase History', icon: '🛒' },
  { to: '/statistics', label: 'Statistics', icon: '📈' },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-grocery-200 bg-white shadow-sm lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-grocery-100 px-6">
        <span className="text-2xl">🌿</span>
        <div>
          <h1 className="text-lg font-bold text-grocery-800">Market Price</h1>
          <p className="text-xs text-grocery-600">Tracker</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-grocery-600 text-white shadow-md shadow-grocery-200'
                  : 'text-gray-600 hover:bg-grocery-50 hover:text-grocery-700'
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-grocery-100 p-4 text-xs text-gray-500">
        Track grocery prices across shops
      </div>
    </aside>
  );
}
