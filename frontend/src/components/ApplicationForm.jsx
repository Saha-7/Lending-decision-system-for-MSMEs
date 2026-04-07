import React, { useState } from "react";

const BUSINESS_TYPES = [
  { value: "manufacturing", label: "Manufacturing" },
  { value: "services", label: "Services" },
  { value: "trading", label: "Trading" },
  { value: "other", label: "Other" },
];

const INITIAL_FORM = {
  businessName: "",
  pan: "",
  businessType: "",
  monthlyRevenue: "",
  loanAmount: "",
  tenureMonths: "",
  loanPurpose: "",
};

export default function ApplicationForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState(INITIAL_FORM);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      ...form,
      monthlyRevenue: Number(form.monthlyRevenue),
      loanAmount: Number(form.loanAmount),
      tenureMonths: Number(form.tenureMonths),
    });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Loan Application</h2>
      <p className="text-sm text-gray-500 mb-8">Fill in your business and loan details to get an instant decision.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Profile Section */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">Business Profile</p>
          <div className="space-y-4">
            <Field label="Business Name" name="businessName" type="text" placeholder="Sharma Traders Pvt. Ltd." value={form.businessName} onChange={handleChange} required />
            <Field label="PAN" name="pan" type="text" placeholder="ABCDE1234F" value={form.pan} onChange={handleChange} required maxLength={10} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
              <select
                name="businessType"
                value={form.businessType}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">Select type</option>
                {BUSINESS_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <Field label="Monthly Revenue (₹)" name="monthlyRevenue" type="number" placeholder="500000" value={form.monthlyRevenue} onChange={handleChange} required min={1} />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Loan Details Section */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">Loan Details</p>
          <div className="space-y-4">
            <Field label="Loan Amount (₹)" name="loanAmount" type="number" placeholder="2000000" value={form.loanAmount} onChange={handleChange} required min={1} />
            <Field label="Tenure (months)" name="tenureMonths" type="number" placeholder="24" value={form.tenureMonths} onChange={handleChange} required min={3} max={60} />
            <Field label="Loan Purpose" name="loanPurpose" type="text" placeholder="Working capital, equipment purchase..." value={form.loanPurpose} onChange={handleChange} required />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Processing..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}

// Reusable field component to avoid repetition
function Field({ label, name, type, placeholder, value, onChange, required, min, max, maxLength }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        maxLength={maxLength}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      />
    </div>
  );
}