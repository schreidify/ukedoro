# Codebase Review

Overall the app is clean and well-structured for its scope — a focused personal tool with a clear purpose. The client/server/shared split is sensible, the data model is simple, and the timer logic in `use-pomodoro.ts` is readable. The main risks are around missing error handling, a UX gap in the core feature, and a data model that will need to change soon.

---

## Must Fix

**1. No error handling in API routes (`server/routes.ts`)**
Every route handler is an unguarded `async` function. If the database is unavailable, the query throws, Express 5 propagates it as an unhandled error, and the client gets either a raw stack trace or a silent crash. None of the five routes have a `try/catch`. A simple `try/catch` with a `res.status(500).json({ message: "..." })` pattern on each route (or a shared error handler middleware) would prevent this.

**2. Timer completes silently — no audio or visual alert**
When a work or break session ends, `switchMode()` fires and the mode flips automatically. There is no sound, browser notification, page title flash, or visual pop — nothing to interrupt a user who isn't actively watching the screen. For a productivity timer, this is a core UX gap. The project brief even lists audio cues as an open question, which confirms it's known. This needs to be resolved before the app is reliably usable.

**3. The data model doesn't support the next planned feature**
The project brief lists "long break after every N sessions" as the immediate next priority. The `pomodoro_sessions` table only stores `mode: 'work' | 'break'` — there is no `long_break` value and no way to distinguish a regular break from a long break in the history. More importantly, `getSessionStats` computes `totalSessions` as a flat count, with no way to derive "consecutive work sessions since the last long break" — the counter you'd need to trigger a long break. The schema and stats logic will need to change before this feature can be built cleanly.

---

## Should Improve

**1. `upsertSettings` is not atomic (`server/storage.ts`, lines 31–41)**
The upsert is implemented as a `getSettings` → `update` or `insert`. This is two database round trips and a classic read-modify-write race. Drizzle supports `db.insert(...).onConflictDoUpdate(...)` which would collapse this to a single atomic query. Low risk at personal-tool scale, but the pattern is worth fixing before it becomes a habit.

**2. `getSessionStats` fetches every row to compute aggregates (`server/storage.ts`, lines 68–81)**
The stats query selects all sessions for a user and then filters and reduces them in JavaScript. As the session log grows this will get slower and transfer more data than needed. PostgreSQL can compute `SUM`, `COUNT`, and `FILTER` in a single query — this should move to SQL aggregates.

**3. `switchMode` auto-starts the next timer without confirmation**
When a work session ends, `setIsActive(true)` is called immediately in `switchMode()`, so the break timer starts running whether or not the user is ready. There's no option to pause between sessions. This is common in strict pomodoro implementations, but worth making configurable (especially since the planned long-break feature implies a more intentional pause at the end of a cycle).

---

## Nice to Have

**1. ~5 unused packages should be removed**
`passport`, `passport-local`, `express-session`, `connect-pg-simple`, `memorystore`, and `ws` are all installed but never imported or configured. They inflate the install, add patching surface, and imply auth infrastructure that doesn't exist. If auth is a future goal, add them then.

**2. Replit artifacts are committed to the repo**
`.replit`, `replit.md`, and Replit-specific Vite plugins (`cartographer`, `devBanner`, `runtimeErrorModal`) are wired into `vite.config.ts`. If this project is moving off Replit these should be cleaned up — they add noise to every config file a collaborator (or AI) reads.

**3. Package name in `package.json` is `rest-express`**
The `name` field is still the scaffolding default. Not functional, but it'll be confusing in logs, error messages, and to anyone reading the project. Should be `ukedoro`.
