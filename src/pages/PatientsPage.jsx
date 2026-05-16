import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useToast } from '../components/Toast.jsx';
import api from '../services/api.js';
import { getErrorMessage } from '../utils/errors.js';
import { formatDate } from '../utils/format.js';

function PatientsPage() {
  const { showToast } = useToast();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  async function fetchPatients(searchText = '') {
    setLoading(true);
    try {
      const response = await api.get('/patients', { params: { search: searchText } });
      setPatients(response.data.data);
    } catch (error) {
      showToast(getErrorMessage(error, 'Could not load patients'), 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    fetchPatients(search);
  }

  async function handleDelete() {
    try {
      await api.delete(`/patients/${deleteId}`);
      showToast('Patient deleted successfully');
      setDeleteId(null);
      fetchPatients(search);
    } catch (error) {
      showToast(getErrorMessage(error, 'Could not delete patient'), 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-500">Manage patient records and medical details.</p>
        </div>
        <Link to="/patients/add" className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Patient
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 rounded-lg bg-white p-4 shadow-sm">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, phone, or disease"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
          <Search className="h-4 w-4" />
          Search
        </button>
      </form>

      {loading ? (
        <LoadingSpinner text="Loading patients..." />
      ) : patients.length === 0 ? (
        <EmptyState title="No patients found" message="Create a patient record or try another search term." />
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Disease</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{patient.fullName}</td>
                  <td className="px-4 py-3 text-gray-600">{patient.age}</td>
                  <td className="px-4 py-3 text-gray-600">{patient.gender}</td>
                  <td className="px-4 py-3 text-gray-600">{patient.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{patient.disease || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(patient.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link to={`/patients/edit/${patient.id}`} className="rounded-md p-2 text-blue-700 hover:bg-blue-50">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button onClick={() => setDeleteId(patient.id)} className="rounded-md p-2 text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete patient"
        message="This patient record will be permanently removed."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default PatientsPage;
