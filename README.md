# Vitto – MSME Lending Decision System

A lightweight credit decision system built for the Vitto SDE assignment. You fill in your business details and loan ask, and the system tells you if you're approved or rejected — along with a credit score and the reasons behind the decision.

---

## What it does

- Takes your business profile (name, PAN, type, monthly revenue) and loan details (amount, tenure, purpose)
- Runs it through a scoring engine
- Spits out: **Approved / Rejected**, a **credit score (300–900)**, and **reason codes** explaining why

---

## Tech Stack

| Layer    | Tech                     |
|----------|--------------------------|
| Frontend | React + Vite + Tailwind  |
| Backend  | Node.js + Express        |
| Database | MongoDB (Atlas)          |

---


## Running Locally

### Backend

```bash
cd backend
cp .env.example .env
# add your MongoDB URI to .env
npm install
npm run dev
# runs on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# runs on http://localhost:5173
```

---

## API Endpoints

### `POST /api/applications`
Submit a loan application.

```json
{
  "businessName": "Sharma Traders Pvt. Ltd.",
  "pan": "ABCDE1234F",
  "businessType": "trading",
  "monthlyRevenue": 500000,
  "loanAmount": 2000000,
  "tenureMonths": 24,
  "loanPurpose": "Working capital"
}
```

`businessType` options: `manufacturing` | `services` | `trading` | `other`

Response:
```json
{
  "id": "...",
  "decision": "approved",
  "creditScore": 680,
  "reasonCodes": []
}
```

### `GET /api/applications`
List all applications. Supports `?page=1&limit=10`.

### `GET /api/applications/:id`
Get a single application by ID.

---

## Decision Logic

Score starts at **500** (base). Three factors move it up or down. Anything **≥ 600 = Approved**.

### 1. Revenue-to-EMI Ratio
EMI = `loanAmount / tenureMonths` (flat rate, no interest)

| Revenue / EMI | Points | Reason Code (if bad) |
|---------------|--------|----------------------|
| ≥ 5×          | +150   | —                    |
| ≥ 3×          | +80    | —                    |
| ≥ 2×          | +20    | —                    |
| ≥ 1.5×        | −50    | `LOW_REVENUE_TO_EMI` |
| < 1.5×        | −150   | `INSUFFICIENT_REVENUE_FOR_EMI` |

### 2. Loan-to-Revenue Ratio
How big is the loan relative to monthly earnings?

| Loan / Revenue | Points | Reason Code (if bad) |
|----------------|--------|----------------------|
| ≤ 5×           | +100   | —                    |
| ≤ 10×          | +40    | —                    |
| ≤ 15×          | −20    | —                    |
| > 15×          | −150   | `LOAN_AMOUNT_TOO_HIGH_FOR_REVENUE` |

### 3. Business Type Risk
| Type           | Points |
|----------------|--------|
| Manufacturing  | +50    |
| Services       | +30    |
| Trading        | +10    |
| Other          | 0      |

Score is clamped between **300 and 900**.

---

## Assumptions

- **EMI is flat-rate** (no interest factored in). Keeps the scoring logic simple and transparent.
- **One active application per PAN** — submitting the same PAN twice while an application is active returns a `409 Conflict`.
- **PAN format** follows the Indian standard: 5 letters + 4 digits + 1 letter (e.g. `ABCDE1234F`).
- **No auth** — this is a demo. In production, applications would be tied to authenticated users.
- **Decisions are instant** — the `status: "pending"` field is modeled into the schema to support async/queue processing if needed later.

---

## Edge Case Handling

| Situation | What happens |
|-----------|-------------|
| Missing fields | `400` with a list of what's missing |
| Invalid PAN format | `400` with format hint |
| Negative revenue or loan | `400` validation error |
| Tenure outside 3–60 months | `400` with allowed range |
| Duplicate active PAN | `409 Conflict` |
| Too many requests | `429` — rate limited at 50 req / 15 min |
| DB or server error | `500` caught by async error handler |

---

## Bonus Features Included

- Rate limiting (express-rate-limit)
- Input validation middleware (separate from controllers)
- Duplicate PAN guard (idempotency)
- Pagination on list endpoint
- Logging on errors with timestamps
- Docker support (see `docker-compose.yml`)