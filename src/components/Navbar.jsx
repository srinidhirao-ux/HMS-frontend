import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useToast } from './Toast.jsx';

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleLogout() {
    try {
      await api.post('/auth/logout');
      showToast('Logged out successfully');
      navigate('/login');
    } catch {
      showToast('Logout failed', 'error');
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={onMenuClick} className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden">
          <Menu className="h-6 w-6" />
        </button>
        <div>
          <p className="text-sm text-gray-500">Welcome back</p>
          <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
