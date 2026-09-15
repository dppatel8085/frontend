# Visitor Management Mini System

React admin dashboard for managing building visitors: login, list, add, approve, reject, and delete.

## Tech stack

- React 19 + TypeScript
- Redux Toolkit
- Axios
- React Router
- Tailwind CSS
- Vite (includes a mock REST API middleware)
- Vitest + Testing Library

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Demo admin credentials

| Field    | Value             |
| -------- | ----------------- |
| Email    | `admin@gmail.com` |
| Password | `password123`     |

### Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start app + mock API                 |
| `npm run build`   | Typecheck and production build       |
| `npm run preview` | Preview production build             |
| `npm test`        | Run unit/integration tests           |
| `npm run lint`    | Lint `src` with Oxlint               |

## Mock API approach

Backend development is **not** required. The app uses a **Vite middleware mock API** that:

1. Reads/writes seed data from `mock-api/db.json`
2. Exposes REST endpoints under `/api`
3. Is consumed by Axios exactly like a real backend (`baseURL: "/api"`)

This keeps a production-like client architecture without running a separate JSON Server process.

### Endpoints

| Method | Path                     | Purpose              |
| ------ | ------------------------ | -------------------- |
| POST   | `/api/auth/login`        | Admin login          |
| GET    | `/api/visitors`          | List visitors        |
| GET    | `/api/visitors/:id`      | Get one visitor      |
| POST   | `/api/visitors`          | Create visitor       |
| PUT    | `/api/visitors/:id`      | Update visitor       |
| DELETE | `/api/visitors/:id`      | Delete visitor       |
| PATCH  | `/api/visitors/:id/approve` | Approve visitor   |
| PATCH  | `/api/visitors/:id/reject`  | Reject visitor    |

Files:

- `mock-api/db.json` — dummy users + visitors
- `mock-api/vite-plugin.js` — REST handler wired in `vite.config.js`
- `src/api/*` — Axios service layer used by Redux thunks

## Architecture / project structure

```text
src/
  api/                 Axios client + auth/visitors services
  components/          Reusable UI (Field, Button, ConfirmDialog, Toast, PageHeader)
  features/
    auth/              Auth slice + thunks
    visitors/          Visitors slice + thunks
  hooks/               Typed Redux hooks
  pages/               Login, Visitor list, Add visitor
  routes/              Route guards + route tree
  store/               Redux store
  utils/               Validation + toast helpers
  test/                Test setup
mock-api/              Dummy JSON + Vite mock REST plugin
```

### Data flow

1. UI dispatches a Redux Toolkit async thunk
2. Thunk calls `src/api/*` (Axios)
3. Axios hits `/api/...` mock middleware
4. Slice updates loading / data / error state
5. UI shows loading, toasts, and field errors

Visitor rows are **never hardcoded in components**; list data always comes from the API via Redux.

## Features covered

- Login with email/password
- Visitor list: Name, Phone, Unit, Visit Date, Status, Actions
- Actions: Approve, Reject, Delete (with confirmation)
- Add visitor form
- Form validation (field-level)
- Loading states (login, list, submit, row actions)
- Error handling + success/error toast notifications
- Responsive layout (mobile stacked rows / desktop table)
- Reusable components
- TypeScript throughout

## Testing

```bash
npm test
```

Included tests:

- `src/utils/validation.test.ts` — form validation rules
- `src/features/auth/authSlice.test.ts` — login/logout session behaviour
- `src/features/visitors/visitorsSlice.test.ts` — fetch / approve / delete flows (API mocked)

## Screenshots / demo

Run `npm run dev`, then capture:

1. Login page
2. Visitor list with actions
3. Add visitor form
4. Delete confirmation dialog
5. Success toast after approve/add

Optional: record a short screen capture of the full flow (login → list → add → approve/reject/delete).

## Assumptions & technical decisions

1. **Single admin role** — only authenticated admins use the dashboard; there is no visitor-facing UI.
2. **Mock auth** — login checks email/password against `mock-api/db.json` and returns a mock bearer token stored in `localStorage`.
3. **Vite mock API** — chosen instead of a separate JSON Server so `npm run dev` starts everything in one process while still using Axios against REST-shaped URLs.
4. **Tailwind CSS** — used for a lightweight, responsive UI without a heavy component library.
5. **Toasts** — lightweight custom toast helper (no extra notification library) for success/error feedback.
6. **Delete confirmation** — modal required before `DELETE /visitors/:id`.
7. **Phone validation** — exactly 10 digits (non-digits stripped before submit).
8. **GET/PUT by id** — available in the Axios service layer for a real backend; the current UI focuses on list + create + status actions.
9. **Persistence** — visitor mutations persist to `mock-api/db.json` during local development.

## Evaluation checklist mapping

| Requirement                         | Status |
| ----------------------------------- | ------ |
| Login / List / Add screens          | Yes    |
| React + TypeScript                  | Yes    |
| Redux Toolkit                       | Yes    |
| Axios API service layer             | Yes    |
| Mock REST API                       | Yes    |
| Form validation                     | Yes    |
| Loading states                      | Yes    |
| Error handling                      | Yes    |
| Success/error notifications         | Yes    |
| Delete confirmation                 | Yes    |
| Responsive UI                       | Yes    |
| Reusable components                 | Yes    |
| No hardcoded visitors in UI         | Yes    |
| Tests                               | Yes    |
| README / architecture docs          | Yes    |
