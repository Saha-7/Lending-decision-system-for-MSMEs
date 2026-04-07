import React from "react";

// Maps raw reason codes to human-readable messages
const REASON_LABELS = {
  LOW_REVENUE_TO_EMI: "Revenue is low relative to the monthly EMI",
  INSUFFICIENT_REVENUE_FOR_EMI: "Monthly revenue cannot cover the EMI",
  LOAN_AMOUNT_TOO_HIGH_FOR_REVENUE: "Loan amount is too high relative to monthly revenue",
  CREDIT_SCORE_BELOW_THRESHOLD: "Credit score did not meet the minimum threshold",
};

export default function DecisionCard({ decision, onReset }) {
  const approved = decision.decision === "approved";

  return (
    <div className="space-y-4">
      {/* Decision Banner */}
      <div className={`rounded-xl border p-8 text-center ${approved ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full text-2xl mb-4 ${approved ? "bg-green-100" : "bg-red-100"}`}>
          {approved ? "✓" : "✕"}
        </div>
        <h2 className={`text-2xl font-bold ${approved ? "text-green-800" : "text-red-800"}`}>
          {approved ? "Approved" : "Rejected"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">Application #{decision.id?.slice(-8)}</p>
      </div>

      {/* Credit Score */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <p className="text-sm text-gray-500 mb-1">Credit Score</p>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-gray-900">{decision.creditScore}</span>
          <span className="text-gray-400 text-sm mb-1">/ 900</span>
        </div>
        <ScoreBar score={decision.creditScore} />
        <p className="text-xs text-gray-400 mt-2">Minimum required: 600</p>
      </div>

      {/* Reason Codes */}
      {decision.reasonCodes?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Reason Codes</p>
          <ul className="space-y-2">
            {decision.reasonCodes.map((code) => (
              <li key={code} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-0.5 text-red-400">•</span>
                <span>{REASON_LABELS[code] || code}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Application Summary</p>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <SummaryRow label="Business" value={decision.businessName} />
          <SummaryRow label="PAN" value={decision.pan} />
          <SummaryRow label="Loan Amount" value={`₹${decision.loanAmount?.toLocaleString("en-IN")}`} />
          <SummaryRow label="Tenure" value={`${decision.tenureMonths} months`} />
          <SummaryRow label="Monthly Revenue" value={`₹${decision.monthlyRevenue?.toLocaleString("en-IN")}`} />
          <SummaryRow label="Purpose" value={decision.loanPurpose} />
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        Submit Another Application
      </button>
    </div>
  );
}

function ScoreBar({ score }) {
  const percentage = ((score - 300) / 600) * 100;
  const color = score >= 700 ? "bg-green-500" : score >= 600 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="mt-3 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${percentage}%` }} />
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <>
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </>
  );
}