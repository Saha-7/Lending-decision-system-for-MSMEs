const Application = require("../models/application.model");
const { computeDecision } = require("../services/decision.service");

// POST /api/applications
// Accepts profile + loan data, runs decision engine, saves and returns result
async function submitApplication(req, res) {
  const {
    businessName, pan, businessType, monthlyRevenue,
    loanAmount, tenureMonths, loanPurpose,
  } = req.body;

  // Check for duplicate PAN with a pending/approved application
  const existing = await Application.findOne({ pan, status: { $in: ["pending", "approved"] } });
  if (existing) {
    return res.status(409).json({ error: "An active application already exists for this PAN." });
  }

  const { decision, creditScore, reasonCodes } = computeDecision({
    monthlyRevenue, loanAmount, tenureMonths, businessType,
  });

  const application = await Application.create({
    businessName, pan, businessType, monthlyRevenue,
    loanAmount, tenureMonths, loanPurpose,
    status: decision,
    creditScore,
    reasonCodes,
    processedAt: new Date(),
  });

  return res.status(201).json(formatResponse(application));
}

// GET /api/applications/:id
async function getApplication(req, res) {
  const application = await Application.findById(req.params.id);
  if (!application) {
    return res.status(404).json({ error: "Application not found." });
  }
  return res.json(formatResponse(application));
}

// GET /api/applications
// Supports ?page=1&limit=10
async function listApplications(req, res) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const [applications, total] = await Promise.all([
    Application.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Application.countDocuments(),
  ]);

  return res.json({
    data: applications.map(formatResponse),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

// Consistent response shape
function formatResponse(app) {
  return {
    id: app._id,
    businessName: app.businessName,
    pan: app.pan,
    businessType: app.businessType,
    monthlyRevenue: app.monthlyRevenue,
    loanAmount: app.loanAmount,
    tenureMonths: app.tenureMonths,
    loanPurpose: app.loanPurpose,
    decision: app.status,
    creditScore: app.creditScore,
    reasonCodes: app.reasonCodes,
    processedAt: app.processedAt,
    createdAt: app.createdAt,
  };
}

module.exports = { submitApplication, getApplication, listApplications };