import { NavLink, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-grocery-50">
      <Sidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <TopNav />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { NavLink };
