# Project Brief

## Problem

When taking breaks from focused work, it's easy to fill them with passive, screen-based activities (social media, browsing) that don't actually rest the brain. UkeDoro replaces that habit with something active and creative: practicing ukulele. The timer creates a structured rhythm — focus hard, then do something genuinely restorative.

## Users

Primary user: the developer themselves, plus anyone who:
- Uses the Pomodoro technique for focused work
- Is learning ukulele and wants to build a consistent daily practice
- Wants their breaks to feel productive and brain-resting rather than mindlessly screen-based

These users care about simplicity, habit formation, and not having to think too hard about their tool during the workday.

## Current State

A working full-stack web app with:
- **Pomodoro timer** — circular SVG countdown ring, configurable work and break durations (25 min / 5 min defaults)
- **Dual modes** — "Focus" (work) and "Learn Uke" (break), with animated panel transitions
- **Ukulele content during breaks** — chord charts (custom SVG diagrams for C, F, G, Am) or a YouTube tutorial video, user's choice
- **Settings modal** — adjust work and break durations, select break resource type
- **Session persistence** — browser UUID in localStorage ties settings and history to the user
- **Stats** — total completed sessions and total focus minutes displayed in the header

**Tech stack:** React 19 + TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Framer Motion, Express.js, Drizzle ORM, PostgreSQL. Originally built on Replit.

## Vision

A personal daily-use tool that the developer continues to refine over time. "Done" looks like an app that gets opened every workday without friction — the timer runs, the breaks feel good, and ukulele practice becomes a natural part of the work rhythm.

No plans to scale publicly; quality of personal experience is the priority.

## Missing / Next Priority

- **Long break after every N sessions** — after every 5 completed work sessions, trigger a longer break (duration configurable alongside short break duration). This is the next meaningful feature gap.

## Competitive Landscape

Standard Pomodoro apps (Pomofocus, Forest, Be Focused, etc.) handle the timer well but treat breaks as empty time. None combine the timer with embedded instrument learning content. UkeDoro's differentiator is the intentional break activity — ukulele practice — baked directly into the product.

## Open Questions

- Should the long break also show different ukulele content (e.g., a longer lesson) compared to a short break?
- Could the chord chart content eventually rotate or progress over time to reflect the user's skill level?
- Is there value in audio cues (a ding or strum) when the timer ends, or is visual sufficient?
