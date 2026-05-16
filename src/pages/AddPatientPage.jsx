import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PatientForm from '../components/PatientForm.jsx';
import { useToast } from '../components/Toast.jsx';
import api from '../services/api.js';
import { getErrorMessage } from '../utils/errors.js';

const emptyPatient = {
  fullName: '',
  age: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  bloodGroup: '',
  disease: ''
};

function AddPatientPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(emptyPatient);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post('/patients', { ...formData, age: Number(formData.age) });
      showToast('Patient added successfully');
      navigate('/patients');
    } catch (error) {
      showToast(getErrorMessage(error, 'Could not add patient'), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/patients" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-blue-700">
          <ArrowLeft className="h-4 w-4" />
          Back to patients
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add Patient</h1>
        <p className="text-sm text-gray-500">Create a new patient record.</p>
      </div>

      <PatientForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitText="Save Patient"
        loading={loading}
      />
    </div>
  );
}

export default AddPatientPage;
