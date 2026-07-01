import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Ingredients from './pages/Ingredients';
import PurchaseHistory from './pages/PurchaseHistory';
import Statistics from './pages/Statistics';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/purchases" element={<PurchaseHistory />} />
          <Route path="/statistics" element={<Statistics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
