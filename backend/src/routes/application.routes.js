const express = require("express");
const router = express.Router();
const { validateApplication } = require("../middleware/validate");
const {
  submitApplication,
  getApplication,
  listApplications,
} = require("../controllers/application.controller");

// Wrap async handlers so Express catches thrown errors
const asyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next);

router.post("/", validateApplication, asyncHandler(submitApplication));
router.get("/", asyncHandler(listApplications));
router.get("/:id", asyncHandler(getApplication));

// Global error handler for this router
router.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR: ${err.message}`);
  res.status(500).json({ error: "Internal server error." });
});

module.exports = router;
