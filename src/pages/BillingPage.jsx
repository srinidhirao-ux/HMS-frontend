import { Receipt, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useToast } from '../components/Toast.jsx';
import api from '../services/api.js';
import { getErrorMessage } from '../utils/errors.js';
import { formatCurrency, formatDate } from '../utils/format.js';

const emptyBill = {
  patientName: '',
  consultationFee: '',
  medicineFee: '',
  testFee: ''
};

function BillingPage() {
  const { showToast } = useToast();
  const [bills, setBills] = useState([]);
  const [formData, setFormData] = useState(emptyBill);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const preview = useMemo(() => {
    const consultationFee = Number(formData.consultationFee || 0);
    const medicineFee = Number(formData.medicineFee || 0);
    const testFee = Number(formData.testFee || 0);
    const subTotal = consultationFee + medicineFee + testFee;
    const gst = subTotal * 0.18;
    return { gst, totalAmount: subTotal + gst };
  }, [formData]);

  async function fetchBills() {
    setLoading(true);
    try {
      const response = await api.get('/bills');
      setBills(response.data.data);
    } catch (error) {
      showToast(getErrorMessage(error, 'Could not load bills'), 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBills();
  }, []);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      await api.post('/bills', {
        patientName: formData.patientName,
        consultationFee: Number(formData.consultationFee),
        medicineFee: Number(formData.medicineFee),
        testFee: Number(formData.testFee)
      });
      showToast('Bill created successfully');
      setFormData(emptyBill);
      fetchBills();
    } catch (error) {
      showToast(getErrorMessage(error, 'Could not create bill'), 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/bills/${deleteId}`);
      showToast('Bill deleted successfully');
      setDeleteId(null);
      fetchBills();
    } catch (error) {
      showToast(getErrorMessage(error, 'Could not delete bill'), 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-sm text-gray-500">Generate bills with GST and total amount.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Input label="Patient Name" name="patientName" value={formData.patientName} onChange={handleChange} required />
          <Input label="Consultation Fee" name="consultationFee" type="number" value={formData.consultationFee} onChange={handleChange} required />
          <Input label="Medicine Fee" name="medicineFee" type="number" value={formData.medicineFee} onChange={handleChange} required />
          <Input label="Test Fee" name="testFee" type="number" value={formData.testFee} onChange={handleChange} required />
        </div>

        <div className="mt-5 grid gap-3 rounded-lg bg-gray-50 p-4 text-sm md:grid-cols-2">
          <div>
            <span className="text-gray-500">GST 18%</span>
            <p className="font-semibold text-gray-900">{formatCurrency(preview.gst)}</p>
          </div>
          <div>
            <span className="text-gray-500">Total Amount</span>
            <p className="font-semibold text-gray-900">{formatCurrency(preview.totalAmount)}</p>
          </div>
        </div>

        <button
          disabled={saving}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Receipt className="h-4 w-4" />
          {saving ? 'Creating...' : 'Create Bill'}
        </button>
      </form>

      {loading ? (
        <LoadingSpinner text="Loading bills..." />
      ) : bills.length === 0 ? (
        <EmptyState title="No bills" message="Create a bill to start tracking hospital revenue." />
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Consultation</th>
                <th className="px-4 py-3">Medicine</th>
                <th className="px-4 py-3">Test</th>
                <th className="px-4 py-3">GST</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bills.map((bill) => (
                <tr key={bill.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{bill.patientName}</td>
                  <td className="px-4 py-3 text-gray-600">{formatCurrency(bill.consultationFee)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatCurrency(bill.medicineFee)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatCurrency(bill.testFee)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatCurrency(bill.gst)}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(bill.totalAmount)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(bill.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDeleteId(bill.id)} className="rounded-md p-2 text-red-600 hover:bg-red-50">
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
        title="Delete bill"
        message="This billing record will be permanently removed."
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
        min={type === 'number' ? '0' : undefined}
        step={type === 'number' ? '0.01' : undefined}
        required={required}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

export default BillingPage;
