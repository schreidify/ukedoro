# Architecture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js, TypeScript 5.6 |
| **Frontend framework** | React 19 |
| **Backend framework** | Express 5 |
| **Build tooling** | Vite 7 (client), esbuild (server), tsx (dev) |
| **Styling** | Tailwind CSS v4 (via `@tailwindcss/vite`), shadcn/ui |
| **Routing (client)** | Wouter |
| **Animations** | Framer Motion |

## Dependencies

| Package | Purpose |
|---------|---------|
| `drizzle-orm` + `drizzle-zod` | Database ORM and schema-derived Zod types |
| `pg` | PostgreSQL client for Drizzle |
| `@tanstack/react-query` v5 | Server state fetching and caching |
| `zod` | Runtime validation (shared between client and server) |
| `wouter` | Lightweight client-side routing |
| `framer-motion` | Timer ring animations and panel transitions |
| `lucide-react` | Icon set |
| `@radix-ui/*` | Headless UI primitives (via shadcn/ui) |
| `passport` + `passport-local` | **Installed but unused** — no auth routes exist |
| `express-session` + `connect-pg-simple` + `memorystore` | **Installed but unused** — session infrastructure never wired up |
| `ws` | **Installed but unused** |

## Data Layer

- **Database:** PostgreSQL, connected via `DATABASE_URL` environment variable
- **ORM:** Drizzle ORM (`drizzle-orm/node-postgres`)
- **Schema:** Defined in `shared/schema.ts` — shared between client and server via `@shared/*` path alias
- **Migrations:** `drizzle-kit push` (no migration files, schema is pushed directly)

### Key Tables

**`settings`** — one row per session key, stores timer preferences

| Column | Type | Default |
|--------|------|---------|
| `id` | serial PK | — |
| `session_key` | varchar(255) UNIQUE | — |
| `work_duration` | integer (seconds) | 1500 (25 min) |
| `break_duration` | integer (seconds) | 300 (5 min) |
| `resource` | text | `'chords'` |

**`pomodoro_sessions`** — append-only log of completed sessions

| Column | Type |
|--------|------|
| `id` | serial PK |
| `session_key` | varchar(255) |
| `mode` | text (`'work'` or `'break'`) |
| `duration` | integer (seconds) |
| `completed_at` | timestamp (default now()) |

## Project Structure

```
ukedoro/
├── client/src/
│   ├── App.tsx               # Root component, providers, routing
│   ├── pages/Home.tsx        # Entire app UI
│   ├── hooks/use-pomodoro.ts # All timer state and server sync logic
│   ├── components/timer/     # TimerDisplay, ResourceViewer, SettingsModal
│   ├── components/ui/        # ~40 shadcn/ui primitives
│   └── lib/queryClient.ts    # TanStack Query setup + apiRequest helper
├── server/
│   ├── index.ts              # Express app setup, middleware, server start
│   ├── routes.ts             # All API route handlers
│   ├── storage.ts            # IStorage interface + DatabaseStorage class
│   ├── static.ts             # Production static file serving
│   └── vite.ts               # Dev Vite middleware integration
├── shared/
│   └── schema.ts             # Drizzle table definitions + Zod insert schemas
├── script/
│   ├── build.ts              # Dual Vite + esbuild build script
│   └── db-import.ts          # DB reset + seed script
└── docs/
    └── project-brief.md
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/settings/:sessionKey` | Fetch user settings; returns hardcoded defaults if none exist |
| `PUT` | `/api/settings` | Upsert settings (Zod-validated body) |
| `POST` | `/api/sessions` | Record a completed pomodoro session |
| `GET` | `/api/sessions/:sessionKey` | Get last 20 sessions (history) |
| `GET` | `/api/stats/:sessionKey` | Get aggregate stats (total sessions, focus minutes, break minutes) |

## Identity Model

There is no login or authentication. Each browser generates a UUID on first load via `crypto.randomUUID()` and stores it in `localStorage` under `ukedoro-session-key`. All API calls pass this key. Data is isolated per-key but there is no verification — anyone with a UUID can read or write its data.

## Build & Run

| Command | What it does |
|---------|-------------|
| `npm run dev` | Starts Express on port 5000; Vite HMR served at `/vite-hmr` |
| `npm run build` | Vite builds client → `dist/public/`; esbuild bundles server → `dist/index.cjs` |
| `npm start` | Runs production build (`node dist/index.cjs`) |
| `npm run db:push` | Pushes schema to DB via drizzle-kit |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string, e.g. `postgresql://user:pass@host:5432/ukedoro` |
| `PORT` | No | Server port (defaults to 5000) |
| `NODE_ENV` | No | Set to `production` to disable Vite middleware |
