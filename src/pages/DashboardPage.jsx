import { CalendarDays, CreditCard, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import api from '../services/api.js';
import { formatCurrency, formatDate } from '../utils/format.js';

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data.data);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  const cards = [
    { label: 'Total Patients', value: stats.totalPatients, icon: Users },
    { label: 'Appointments', value: stats.totalAppointments, icon: CalendarDays },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: CreditCard }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Quick overview of hospital activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className="rounded-full bg-blue-50 p-3">
                  <Icon className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Patients</h2>
        {stats.recentPatients.length === 0 ? (
          <EmptyState title="No patients yet" message="Add your first patient to see recent activity here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Disease</th>
                  <th className="px-4 py-3">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{patient.fullName}</td>
                    <td className="px-4 py-3 text-gray-600">{patient.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{patient.disease || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(patient.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
