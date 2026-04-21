# System Health Dashboard

Production-oriented frontend dashboard for the System Health Simulation API.

## Stack

- React + TypeScript
- Vite
- Polling-based data refresh every 5 seconds
- Real API integration via `VITE_API_BASE_URL`

## Local setup

1. Start the System Health Simulation API locally.
2. Copy `.env.example` to `.env`.
3. Set `VITE_API_BASE_URL` if your API is not running at `http://localhost:3000`.
4. Install dependencies:

```bash
npm install
```

5. Start the development server:

```bash
npm run dev
```

6. Open the Vite URL shown in the terminal, usually `http://127.0.0.1:5173` or `http://localhost:5173`.

7. Create a production build:

```bash
npm run build
```

8. Optionally preview the production build locally:

```bash
npm run preview
```

## Environment

```env
VITE_API_BASE_URL=http://localhost:3000
```

## App structure

```text
.
├── src
│   ├── components
│   │   ├── DependencySummary.tsx
│   │   ├── EmptyState.tsx
│   │   ├── FiltersBar.tsx
│   │   ├── ServiceDetailDrawer.tsx
│   │   ├── ServiceTable.tsx
│   │   ├── StatusBadge.tsx
│   │   └── SummaryCards.tsx
│   ├── hooks
│   │   ├── useDashboardData.ts
│   │   ├── useServiceDetails.ts
│   │   └── useServiceLogs.ts
│   ├── lib
│   │   ├── api.ts
│   │   └── format.ts
│   ├── types
│   │   └── api.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   └── vite-env.d.ts
├── .env.example
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Features

- Summary row for total, healthy, degraded, and unhealthy services
- Search, status, and type filters
- Service table with dependency summaries
- Detail drawer with metadata, dependency list, recent logs, and simulation controls
- Manual refresh plus 5-second polling from `GET /health`
- Real API calls for service detail, logs, and simulation updates
- Loading, error, and empty states across the dashboard

## Notes

- Service names are treated as case-sensitive and passed through exactly as selected.
- After a simulation change, the dashboard refreshes from `GET /health` to align with backend-derived state.
- The UI keeps previous data visible while polling so the dashboard does not flash or jump.
- If the frontend loads but shows API errors, confirm the backend is running and `VITE_API_BASE_URL` points to the correct host.
