import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AddPatientPage from './pages/AddPatientPage.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import BillingPage from './pages/BillingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EditPatientPage from './pages/EditPatientPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PatientsPage from './pages/PatientsPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="patients/add" element={<AddPatientPage />} />
        <Route path="patients/edit/:id" element={<EditPatientPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="billing" element={<BillingPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
