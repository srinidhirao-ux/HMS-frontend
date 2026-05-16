import { Save } from 'lucide-react';

function PatientForm({ formData, onChange, onSubmit, submitText, loading }) {
  return (
    <form onSubmit={onSubmit} className="rounded-lg bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full Name" name="fullName" value={formData.fullName} onChange={onChange} required />
        <Field label="Age" name="age" type="number" value={formData.age} onChange={onChange} required />
        <SelectField label="Gender" name="gender" value={formData.gender} onChange={onChange} required options={['Male', 'Female', 'Other']} />
        <Field label="Phone" name="phone" value={formData.phone} onChange={onChange} required />
        <Field label="Email" name="email" type="email" value={formData.email} onChange={onChange} />
        <Field label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={onChange} />
        <Field label="Disease" name="disease" value={formData.disease} onChange={onChange} />
        <label className="md:col-span-2">
          <span className="mb-1 block text-sm font-medium text-gray-700">Address</span>
          <textarea
            name="address"
            value={formData.address}
            onChange={onChange}
            rows="3"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Save className="h-4 w-4" />
        {loading ? 'Saving...' : submitText}
      </button>
    </form>
  );
}

function Field({ label, name, value, onChange, type = 'text', required = false }) {
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

function SelectField({ label, name, value, onChange, required, options }) {
  return (
    <label>
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default PatientForm;
