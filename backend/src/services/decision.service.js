/**
 * Decision Engine
 *
 * Credit Score: 300 – 900 (higher is better)
 * Approval threshold: score >= 600
 *
 * Scoring Factors:
 * 1. Revenue-to-EMI ratio  → ability to repay
 * 2. Loan-to-revenue ratio → size of loan relative to earnings
 * 3. Business type         → risk profile of the sector
 */

const BASE_SCORE = 500;
const APPROVAL_THRESHOLD = 600;

function calculateEMI(loanAmount, tenureMonths) {
  // Simple flat-rate EMI (no interest for scoring purposes)
  return loanAmount / tenureMonths;
}

function scoreRevenueToEMI(monthlyRevenue, emi) {
  const ratio = monthlyRevenue / emi;

  if (ratio >= 5) return { points: +150, reason: null };
  if (ratio >= 3) return { points: +80, reason: null };
  if (ratio >= 2) return { points: +20, reason: null };
  if (ratio >= 1.5) return { points: -50, reason: "LOW_REVENUE_TO_EMI" };
  return { points: -150, reason: "INSUFFICIENT_REVENUE_FOR_EMI" };
}

function scoreLoanToRevenue(loanAmount, monthlyRevenue) {
  const ratio = loanAmount / monthlyRevenue;

  if (ratio <= 5) return { points: +100, reason: null };
  if (ratio <= 10) return { points: +40, reason: null };
  if (ratio <= 15) return { points: -20, reason: null };
  return { points: -150, reason: "LOAN_AMOUNT_TOO_HIGH_FOR_REVENUE" };
}

function scoreBusinessType(businessType) {
  const scoreMap = {
    manufacturing: +50,
    services: +30,
    trading: +10,
    other: 0,
  };
  return scoreMap[businessType] ?? 0;
}

function computeDecision(applicationData) {
  const { monthlyRevenue, loanAmount, tenureMonths, businessType } = applicationData;

  const emi = calculateEMI(loanAmount, tenureMonths);

  const revenueEMIResult = scoreRevenueToEMI(monthlyRevenue, emi);
  const loanRevenueResult = scoreLoanToRevenue(loanAmount, monthlyRevenue);
  const businessTypePoints = scoreBusinessType(businessType);

  const rawScore =
    BASE_SCORE +
    revenueEMIResult.points +
    loanRevenueResult.points +
    businessTypePoints;

  // Clamp score between 300 and 900
  const creditScore = Math.min(900, Math.max(300, rawScore));

  const reasonCodes = [revenueEMIResult.reason, loanRevenueResult.reason].filter(Boolean);

  const decision = creditScore >= APPROVAL_THRESHOLD ? "approved" : "rejected";

  // Always include a human-readable reason for rejections
  if (decision === "rejected" && reasonCodes.length === 0) {
    reasonCodes.push("CREDIT_SCORE_BELOW_THRESHOLD");
  }

  return { decision, creditScore, reasonCodes, emi };
}

module.exports = { computeDecision };