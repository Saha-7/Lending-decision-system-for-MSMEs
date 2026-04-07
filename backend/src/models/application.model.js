const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // Business Profile
    businessName: { type: String, required: true },
    pan: { type: String, required: true },
    businessType: {
      type: String,
      enum: ["manufacturing", "services", "trading", "other"],
      required: true,
    },
    monthlyRevenue: { type: Number, required: true },

    // Loan Details
    loanAmount: { type: Number, required: true },
    tenureMonths: { type: Number, required: true },
    loanPurpose: { type: String, required: true },

    // Decision Output (populated after processing)
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    creditScore: { type: Number },
    reasonCodes: [{ type: String }],
    processedAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Application", applicationSchema);
