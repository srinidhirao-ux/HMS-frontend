import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import PatientForm from '../components/PatientForm.jsx';
import { useToast } from '../components/Toast.jsx';
import api from '../services/api.js';
import { getErrorMessage } from '../utils/errors.js';

function EditPatientPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchPatient() {
      try {
        const response = await api.get(`/patients/${id}`);
        setFormData(response.data.data);
      } catch (error) {
        showToast(getErrorMessage(error, 'Could not load patient'), 'error');
        navigate('/patients');
      } finally {
        setLoading(false);
      }
    }

    fetchPatient();
  }, [id, navigate, showToast]);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      await api.put(`/patients/${id}`, { ...formData, age: Number(formData.age) });
      showToast('Patient updated successfully');
      navigate('/patients');
    } catch (error) {
      showToast(getErrorMessage(error, 'Could not update patient'), 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading patient..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/patients" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-blue-700">
          <ArrowLeft className="h-4 w-4" />
          Back to patients
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Patient</h1>
        <p className="text-sm text-gray-500">Update patient information.</p>
      </div>

      <PatientForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitText="Update Patient"
        loading={saving}
      />
    </div>
  );
}

export default EditPatientPage;
