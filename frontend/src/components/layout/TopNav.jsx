import { NavLink, useLocation } from 'react-router-dom';

const titles = {
  '/': 'Dashboard',
  '/ingredients': 'Ingredients',
  '/purchases': 'Purchase History',
  '/statistics': 'Statistics',
};

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/ingredients', label: 'Ingredients' },
  { to: '/purchases', label: 'Purchases' },
  { to: '/statistics', label: 'Stats' },
];

export default function TopNav() {
  const { pathname } = useLocation();
  const title = titles[pathname] || 'Market Price Tracker';

  return (
    <header className="sticky top-0 z-20 border-b border-grocery-100 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-grocery-600">Grocery Tracker</p>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-grocery-100 px-4 py-2 text-sm font-medium text-grocery-800 sm:flex">
          <span className="h-2 w-2 rounded-full bg-grocery-500" />
          Live pricing data
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-grocery-50 px-4 py-2 lg:hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ${
                isActive ? 'bg-grocery-600 text-white' : 'text-gray-600 hover:bg-grocery-50'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
