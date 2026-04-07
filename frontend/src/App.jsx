import React, { useState } from "react";
import ApplicationForm from "./components/ApplicationForm";
import DecisionCard from "./components/DecisionCard";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export default function App() {
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(formData) {
    setLoading(true);
    setError(null);
    setDecision(null);

    const response = await fetch(`${API_BASE}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    setDecision(data);
  }

  function handleReset() {
    setDecision(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <h1 className="text-xl font-semibold text-gray-900">Vitto</h1>
          <p className="text-sm text-gray-500 mt-0.5">MSME Lending Decision System</p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-10">
        {decision ? (
          <DecisionCard decision={decision} onReset={handleReset} />
        ) : (
          <ApplicationForm onSubmit={handleSubmit} loading={loading} error={error} />
        )}
      </main>
    </div>
  );
}