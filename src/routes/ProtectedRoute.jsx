import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await api.get('/auth/status');
        setLoggedIn(response.data.data.loggedIn);
      } catch {
        setLoggedIn(false);
      } finally {
        setChecking(false);
      }
    }

    checkLogin();
  }, []);

  if (checking) {
    return <LoadingSpinner text="Checking login..." />;
  }

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
