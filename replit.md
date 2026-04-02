# UkeDoro - Ukulele Pomodoro Timer

## Overview
A web-based Pomodoro timer that helps users stay productive while learning ukulele during breaks. Features configurable work/break durations, visual countdown, and an embedded ukulele resource viewer (chord charts or YouTube tutorials) that appears during break periods.

## Architecture
- **Frontend**: React + TypeScript with Vite, TailwindCSS v4, shadcn/ui components
- **Backend**: Express.js with Drizzle ORM
- **Database**: PostgreSQL (Replit built-in)
- **Routing**: wouter (frontend), Express (API)

## Key Files
- `shared/schema.ts` - Data models (settings, pomodoroSessions)
- `server/routes.ts` - API routes prefixed with `/api`
- `server/storage.ts` - DatabaseStorage implementing IStorage interface
- `client/src/pages/Home.tsx` - Main timer page
- `client/src/hooks/use-pomodoro.ts` - Core timer logic + API integration
- `client/src/components/timer/` - Timer UI components (TimerDisplay, ResourceViewer, SettingsModal)

## Data Model
- **settings**: Per-session preferences (work/break durations, resource type) keyed by a random session UUID stored in localStorage
- **pomodoroSessions**: Completed session history tracking mode, duration, and timestamp

## API Endpoints
- `GET /api/settings/:sessionKey` - Get user settings
- `PUT /api/settings` - Upsert user settings
- `POST /api/sessions` - Record a completed pomodoro session
- `GET /api/sessions/:sessionKey` - Get session history
- `GET /api/stats/:sessionKey` - Get aggregated stats

## Design
- Colors: Primary #D84315 (tomato), Break #4CAF50 (green), Accent #8D6E63 (wood brown)
- Fonts: Poppins (display) + Roboto (body)
- Circular SVG timer with animated progress ring