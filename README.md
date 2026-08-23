# AutoDrive — Car Dealership Inventory System

## Project Overview

AutoDrive is a full-stack car dealership inventory system built as a TDD kata
assignment. It demonstrates end-to-end product thinking: a secured REST API,
a role-based authorization model, atomic inventory operations, and a modern
React frontend — all grown test-first from a red suite to a green one.
The project is designed to be read by technical reviewers as much as it is
meant to be run, so every layer — routing, data access, authentication, and UI
— is covered by deliberate, behaviour-driven tests.

---

## Key Features

### Authenticated Users
- **Register & log in** — bcrypt-hashed passwords, JWT issued on success and
  required on every protected route via `Authorization: Bearer <token>`
- **Browse inventory** — vehicle grid with make, model, category, and
  price-range filtering; results update live as filters change
- **Purchase vehicles** — single-click purchase atomically decrements stock;
  the button is disabled and labelled "Sold Out" when quantity reaches zero,
  preventing over-purchasing at the database level
- **Wishlist** — save and manage favourite vehicles across sessions; wishlist
  state is persisted per user in `localStorage`

### Admin Users *(all user capabilities, plus)*
- **Add vehicles** — create a new inventory record with make, model, category,
  price, quantity, and an automatically resolved brand image
- **Edit vehicles** — update any field on an existing record; image resolves
  live as make/model changes
- **Delete vehicles** — remove a vehicle from inventory via a confirmation
  modal (no accidental `window.confirm` calls)
- **Restock inventory** — increment stock for any vehicle directly from the
  dashboard card without leaving the page
- **Dashboard stats** — animated summary cards showing total fleet size, total
  inventory value, low-stock count, and out-of-stock count

---

## Tech Stack

### Backend
| Concern | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express |
| Database | SQLite via `better-sqlite3` |
| Auth | JSON Web Tokens (`jsonwebtoken`) |
| Password hashing | `bcrypt` |
| Testing | Vitest + Supertest |

### Frontend
| Concern | Technology |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| HTTP client | Axios |
| Icons | Lucide React |
| Testing | Vitest + React Testing Library |

---

## Architecture

The backend follows a strict layered pattern: **routes → controllers →
repositories → database**. Authentication and admin-role enforcement are
pure middleware concerns, keeping business logic out of route handlers.
The frontend mirrors this separation: API calls live in `services/`, shared
state in `context/`, and pages compose from small, independently testable
components.

```
backend/
  src/
    routes/         # Express routers — no logic, just wiring
    controllers/    # Request/response handling, input validation
    repositories/   # All SQL queries — one file per entity
    middleware/     # JWT verification, admin-role guard
    db/             # Database factory and schema migrations

frontend/
  src/
    pages/          # Route-level components (Dashboard, Login, Wishlist …)
    components/     # Reusable UI (VehicleCard, Navbar, Toast, ConfirmModal)
    context/        # AuthContext, VehicleContext, WishlistContext
    services/       # Axios wrappers (api.js, vehicleImages.js)
```

---

## Database Design

Two tables. Vehicle quantity has a `CHECK (quantity >= 0)` constraint at the
database level — the application cannot accidentally oversell.

```sql
users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,       -- bcrypt hash, never returned in responses
  role TEXT NOT NULL DEFAULT 'user',
  created_at TEXT
)

vehicles (
  id TEXT PRIMARY KEY,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  image_url TEXT NOT NULL DEFAULT '',
  created_at TEXT,
  updated_at TEXT
)
```

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login, receive JWT |

### Vehicles
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/vehicles` | User | List all vehicles |
| GET | `/api/vehicles/search` | User | Filter by make, model, category, price range |
| POST | `/api/vehicles` | Admin | Add a new vehicle |
| PUT | `/api/vehicles/:id` | Admin | Update vehicle details |
| DELETE | `/api/vehicles/:id` | Admin | Remove a vehicle |
| POST | `/api/vehicles/:id/purchase` | User | Purchase — decrements quantity atomically |
| POST | `/api/vehicles/:id/restock` | Admin | Restock — increments quantity |

---

## TDD Approach

Every feature was written test-first using the **Red → Green → Refactor**
cycle:

1. Write a failing test that describes the desired behaviour
2. Write the minimum implementation to make it pass
3. Refactor without breaking the suite

Authentication tests were authored and run to failure before a single line of
implementation existed. The vehicle behaviour suite was retained as a living
contract throughout all subsequent changes. The result is `44/44` backend
tests and `33/33` frontend tests passing.

---

## Test Report

### Backend — `npm test` (Vitest + Supertest)

```
 ✓ src/__tests__/auth.test.ts
 ✓ src/__tests__/vehicle.test.ts

 Test Files  2 passed (2)
 Tests       44 passed (44)
 Duration    ~2s
```

### Backend Coverage — `npm run test:coverage`

```
Statements : 78.4%
Branches   : 93.8%
```

### Frontend — `npm run test:run` (Vitest + React Testing Library)

```
 ✓ src/components/Navbar.test.jsx
 ✓ src/components/VehicleCard.test.jsx
 ✓ src/components/VehicleSearch.test.jsx
 ✓ src/context/AuthContext.test.jsx
 ✓ src/context/VehicleContext.test.jsx
 ✓ src/pages/Dashboard.test.jsx
 ✓ src/pages/Inventory.test.jsx
 ✓ src/pages/Login.test.jsx
 ✓ src/pages/Register.test.jsx
 ✓ src/pages/AddVehicle.test.jsx

 Test Files  10 passed (10)
 Tests       33 passed (33)
```

### Frontend Production Build — `npx vite build`
```
✓ built in ~3s — no errors, no warnings
```

---

## Screenshots

> Add screenshots to the `screenshots/` folder and update the paths below.
> Required: login, register, dashboard, search/filter, admin controls,
> add vehicle, edit vehicle, purchase flow, out-of-stock state, test results.

| Screen | Preview |
|---|---|
| Login | `screenshots/login.png` |
| Register | `screenshots/register.png` |
| Admin Controls | `screenshots/admin.png` |
| Add Vehicle | `screenshots/add-vehicle.png` |
| Purchase Flow | `screenshots/purchase.png` |
| Out of Stock | `screenshots/out-of-stock.png` |
| Wishlist | `screenshots/wishlist.png` |
| Test Results | `screenshots/test-results.png` |

---

## Local Setup

### Prerequisites
- Node.js 18+
- npm 9+

### 1 — Clone the repository
```bash
git clone <your-repo-url>
cd car-dealership-inventory-system
```

### 2 — Install dependencies
```powershell
cd backend
npm install

cd ../frontend
npm install
```

### 3 — Configure environment variables

**`backend/.env`**
```text
PORT=5000
JWT_SECRET=replace_with_a_strong_random_secret
DATABASE_PATH=./data/dealership.db
```

**`frontend/.env`**
```text
VITE_API_URL=http://localhost:5000/api
```

### 4 — Seed the database *(optional — adds sample vehicles)*
```powershell
cd backend
node seed.js
```

### 5 — Create an admin account
Register normally via the UI or API, then promote the user:
```powershell
cd backend
node make-admin.js your@email.com
```

### 6 — Run the application

**Terminal 1 — Backend**
```powershell
cd backend
npm run dev
# Listening on http://localhost:5000
```

**Terminal 2 — Frontend**
```powershell
cd frontend
npm run dev
# Running on http://localhost:5173
```

---

## Running Tests

```powershell
# Backend
cd backend
npm test                  # run all tests
npm run test:coverage     # with coverage report

# Frontend
cd frontend
npm run test:run          # run all tests once
npm run build             # production build check
```

---

## AI Usage and Co-Authorship

AI tools were used selectively during the development of this project as development assistants.

AI assistance was used for specific tasks such as:
- Generating and refining some boilerplate code
- Debugging and resolving implementation issues
- Suggesting improvements to React components and backend logic
- Assisting with test cases and documentation
- Reviewing code and suggesting possible improvements

The AI tools used during development included **ChatGPT** and **Amazon Q**.

All AI-generated or AI-assisted code was reviewed, tested, modified, and integrated by the project developer. The overall project architecture, feature requirements, implementation decisions, testing, and final integration were handled by the developer.

AI assistance was used only where helpful and does not represent the entirety of the project implementation.

### AI Co-Authorship

For commits where AI assistance was used to generate or substantially modify code, the relevant AI tool is credited as a co-author in the Git commit, in accordance with the project requirements.

Examples:

`Co-authored-by: ChatGPT <chatgpt@openai.com>`

`Co-authored-by: Amazon Q <amazonq@users.noreply.github.com>`


## Git Workflow

Commits follow the Conventional Commits format:

```
feat: implement JWT login endpoint
test: add registration API tests (red)
feat: implement user registration (green)
refactor: extract auth validation to middleware
feat: add vehicle purchase with atomic stock decrement
docs: add README and AI usage section
```

AI-assisted commits include the co-author trailer as required by the
assignment brief.
