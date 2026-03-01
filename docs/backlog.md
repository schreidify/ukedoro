# Backlog

---

### 1. Add error handling to API routes

**Story:** As a user, I want the app to handle server errors gracefully so that I see a clear message instead of a crash or raw stack trace.

**Why:** All five API routes are unguarded `async` functions. A database hiccup silently crashes the server or exposes raw errors to the client — a fragile foundation for everything else.

**Done when:**
- [ ] Each route has a `try/catch` or a shared Express error-handler middleware
- [ ] A failed DB call returns a JSON `{ message: "..." }` with a 500 status instead of a crash
- [ ] Tested by temporarily breaking the DB URL and verifying the app shows a recoverable error

**Size:** Small
**Model:** Fast
**Status:** Not Started

---

### 2. Alert the user when the timer ends

**Story:** As a user, I want to be notified when a work or break session ends so that I don't miss the transition while focused on something else.

**Why:** Right now the mode flips silently. If you're heads-down in work, you'll never know the break started. This is the most consequential UX gap for daily use.

**Done when:**
- [ ] An audio cue plays when the timer reaches zero (a short ding or chime)
- [ ] A visual cue also fires (e.g., page title flash or brief fullscreen overlay) as fallback when when audio is blocked
- [ ] The alert works for both work → break and break → work transitions
- [ ] The sound can be triggered without needing browser notification permissions

**Size:** Small
**Model:** Fast
**Status:** Pending Test

---

### 3. Fix the data model to support long breaks

**Story:** As a developer, I want the session schema and stats logic to distinguish long breaks from short breaks so that the long-break feature can be built on a solid foundation.

**Why:** The `pomodoro_sessions` table only has `mode: 'work' | 'break'`. There's no `long_break` value and no way to count "work sessions since the last long break" — both are required before the long-break feature can be implemented cleanly.

**Done when:**
- [ ] `mode` in the schema accepts `'work' | 'break' | 'long_break'`
- [ ] `getSessionStats` can return "sessions since last long break" (or equivalent count) without fetching all rows
- [ ] Existing data is unaffected (no migration errors)
- [ ] Stats displayed in the UI still show correct totals

**Size:** Small
**Model:** Standard
**Status:** Not Started

---

### 4. Long break after every N work sessions

**Story:** As a user, I want a longer break to trigger automatically after every N completed work sessions so that I get a deeper rest at the end of each full Pomodoro cycle.

**Why:** This is the next planned feature in the project brief and the core missing rhythm of the standard Pomodoro technique (25/5/25/5/25/5/25/5/30).

**Done when:**
- [ ] After every N work sessions (N configurable in Settings, default 4), the break timer runs for the "long break" duration instead of the short break duration
- [ ] Long break duration is configurable in the Settings modal (default 15 min)
- [ ] The UI clearly labels the upcoming break as "Long Break" vs "Short Break"
- [ ] The session logged to the DB uses `mode: 'long_break'`
- [ ] Stats still display correctly after a long break cycle

**Size:** Medium
**Model:** Standard
**Status:** Not Started

---

### 5. Make `upsertSettings` atomic

**Story:** As a developer, I want settings saves to be a single DB operation so that there's no read-modify-write race condition.

**Why:** The current implementation reads first, then inserts or updates — two round trips and a potential race. Drizzle's `onConflictDoUpdate` collapses this to one atomic query.

**Done when:**
- [ ] `upsertSettings` in `server/storage.ts` uses a single `INSERT ... ON CONFLICT DO UPDATE`
- [ ] Settings save still works correctly in the UI (no visible change to the user)

**Size:** Small
**Model:** Fast
**Status:** Not Started

---

### 6. Move session stats aggregation to SQL

**Story:** As a developer, I want session stats computed in the database so that the query stays fast as the session log grows.

**Why:** `getSessionStats` currently fetches all rows for a user and reduces them in JavaScript. PostgreSQL `SUM`, `COUNT`, and `FILTER` can do this in one round trip.

**Done when:**
- [ ] `getSessionStats` uses a SQL aggregate query instead of fetching all rows
- [ ] Stats displayed in the header still show correct values
- [ ] No change visible to the user

**Size:** Small
**Model:** Fast
**Status:** Not Started

---

### 7. Make auto-start of next timer optional

**Story:** As a user, I want the option to pause between sessions so that I can consciously choose when to start the next work block or break.

**Why:** Right now `switchMode()` immediately sets the next timer active — the break starts whether you're ready or not. A "ready to start?" confirmation or pause-then-click-to-begin pattern would make the rhythm more intentional, especially before long breaks.

**Done when:**
- [ ] A setting in the Settings modal controls whether the next session auto-starts or waits for a manual start
- [ ] When auto-start is off, the timer shows a "Start" prompt after each session ends
- [ ] The default behavior (auto-start on) is unchanged for existing users

**Size:** Small
**Model:** Standard
**Status:** Not Started

---

### 8. Remove unused packages

**Story:** As a developer, I want the dependency list to reflect what's actually used so that the install is lean and there's no false implication of auth infrastructure.

**Why:** `passport`, `passport-local`, `express-session`, `connect-pg-simple`, `memorystore`, and `ws` are all installed but never imported. They add patching surface and imply unbuilt features.

**Done when:**
- [ ] All six packages removed from `package.json` and `node_modules`
- [ ] `npm install` and `npm run dev` succeed with no errors
- [ ] `npm run build` still produces a working production build

**Size:** Small
**Model:** Fast
**Status:** Not Started

---

### 9. Remove Replit artifacts

**Story:** As a developer, I want the repo free of Replit-specific config so that the codebase reflects its current hosting context and is clean for collaborators (and AI tools).

**Why:** `.replit`, `replit.md`, and Replit Vite plugins (`cartographer`, `devBanner`, `runtimeErrorModal`) are still wired in. They add noise to every config file.

**Done when:**
- [ ] `.replit` and `replit.md` deleted
- [ ] Replit-specific Vite plugins removed from `vite.config.ts`
- [ ] `npm run dev` and `npm run build` still work

**Size:** Small
**Model:** Fast
**Status:** Not Started

---

### 10. Fix package name in `package.json`

**Story:** As a developer, I want the package name to say `ukedoro` so that logs, error messages, and anyone reading the project aren't confused by the scaffolding default.

**Why:** The `name` field still reads `rest-express` — the Replit/Express template default.

**Done when:**
- [ ] `name` in `package.json` is `ukedoro`

**Size:** Small
**Model:** Fast
**Status:** Not Started
