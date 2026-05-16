import { CalendarPlus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useToast } from '../components/Toast.jsx';
import api from '../services/api.js';
import { getErrorMessage } from '../utils/errors.js';

const emptyAppointment = {
  patientName: '',
  doctorName: '',
  appointmentDate: '',
  appointmentTime: '',
  status: 'Booked'
};

function AppointmentsPage() {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState(emptyAppointment);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  async function fetchAppointments() {
    setLoading(true);
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data.data);
    } catch (error) {
      showToast(getErrorMessage(error, 'Could not load appointments'), 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      await api.post('/appointments', formData);
      showToast('Appointment booked successfully');
      setFormData(emptyAppointment);
      fetchAppointments();
    } catch (error) {
      showToast(getErrorMessage(error, 'Could not book appointment'), 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/appointments/${deleteId}`);
      showToast('Appointment deleted successfully');
      setDeleteId(null);
      fetchAppointments();
    } catch (error) {
      showToast(getErrorMessage(error, 'Could not delete appointment'), 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <p className="text-sm text-gray-500">Book and manage doctor appointments.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          <Input label="Patient Name" name="patientName" value={formData.patientName} onChange={handleChange} required />
          <Input label="Doctor Name" name="doctorName" value={formData.doctorName} onChange={handleChange} required />
          <Input label="Date" name="appointmentDate" type="date" value={formData.appointmentDate} onChange={handleChange} required />
          <Input label="Time" name="appointmentTime" type="time" value={formData.appointmentTime} onChange={handleChange} required />
          <label>
            <span className="mb-1 block text-sm font-medium text-gray-700">Status</span>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option>Booked</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </label>
        </div>
        <button
          disabled={saving}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <CalendarPlus className="h-4 w-4" />
          {saving ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>

      {loading ? (
        <LoadingSpinner text="Loading appointments..." />
      ) : appointments.length === 0 ? (
        <EmptyState title="No appointments" message="Book an appointment to see it in this list." />
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{appointment.patientName}</td>
                  <td className="px-4 py-3 text-gray-600">{appointment.doctorName}</td>
                  <td className="px-4 py-3 text-gray-600">{appointment.appointmentDate}</td>
                  <td className="px-4 py-3 text-gray-600">{appointment.appointmentTime}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDeleteId(appointment.id)} className="rounded-md p-2 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete appointment"
        message="This appointment will be removed from the schedule."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function Input({ label, name, value, onChange, type = 'text', required = false }) {
  return (
    <label>
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

export default AppointmentsPage;
