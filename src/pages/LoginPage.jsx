import { useState } from 'react';
import { HeartPulse, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { getErrorMessage } from '../utils/errors.js';
import { useToast } from '../components/Toast.jsx';

function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ username: 'admin', password: 'admin123' });
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/login', formData);
      showToast('Login successful');
      navigate('/');
    } catch (error) {
      showToast(getErrorMessage(error, 'Invalid login details'), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <HeartPulse className="h-8 w-8 text-blue-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Hospital Management System</h1>
          <p className="mt-2 text-sm text-gray-500">Sign in to manage patients, appointments, and bills.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label>
            <span className="mb-1 block text-sm font-medium text-gray-700">Username</span>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LogIn className="h-4 w-4" />
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="mt-5 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
          Demo user: <strong>admin</strong> / <strong>admin123</strong>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
