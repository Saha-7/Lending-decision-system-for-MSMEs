const VALID_BUSINESS_TYPES = ["manufacturing", "services", "trading", "other"];

// PAN format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

function validateApplication(req, res, next) {
  const {
    businessName,
    pan,
    businessType,
    monthlyRevenue,
    loanAmount,
    tenureMonths,
    loanPurpose,
  } = req.body;

  const missing = [];
  if (!businessName) missing.push("businessName");
  if (!pan) missing.push("pan");
  if (!businessType) missing.push("businessType");
  if (monthlyRevenue == null) missing.push("monthlyRevenue");
  if (loanAmount == null) missing.push("loanAmount");
  if (tenureMonths == null) missing.push("tenureMonths");
  if (!loanPurpose) missing.push("loanPurpose");

  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing fields: ${missing.join(", ")}` });
  }

  if (!PAN_REGEX.test(pan.toUpperCase())) {
    return res.status(400).json({ error: "Invalid PAN format. Expected: ABCDE1234F" });
  }

  if (!VALID_BUSINESS_TYPES.includes(businessType)) {
    return res.status(400).json({ error: `businessType must be one of: ${VALID_BUSINESS_TYPES.join(", ")}` });
  }

  if (monthlyRevenue <= 0) {
    return res.status(400).json({ error: "monthlyRevenue must be greater than 0" });
  }

  if (loanAmount <= 0) {
    return res.status(400).json({ error: "loanAmount must be greater than 0" });
  }

  if (tenureMonths < 3 || tenureMonths > 60) {
    return res.status(400).json({ error: "tenureMonths must be between 3 and 60" });
  }

  // Normalize PAN to uppercase before passing to controller
  req.body.pan = pan.toUpperCase();

  next();
}

module.exports = { validateApplication };