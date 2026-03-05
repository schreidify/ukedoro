---
name: Immersive Background Timer
overview: Redesign the Ukedoro app with a full-bleed landscape photography backdrop and a frosted-glass timer overlay, inspired by the Oura iOS aesthetic. Each focus session cycles through a different curated nature photograph.
todos:
  - id: fonts
    content: Update client/index.html with Cormorant Garamond + DM Sans fonts
    status: pending
  - id: css-tokens
    content: "Update client/src/index.css: new font vars, glass overlay tokens, ring accent color"
    status: pending
  - id: timer-display
    content: Redesign TimerDisplay.tsx as dark frosted-glass circle with sky-blue ring and elegant serif time
    status: pending
  - id: home-bg
    content: "Redesign Home.tsx: full-bleed crossfading nature images, dark gradient overlay, all-white UI layer"
    status: pending
  - id: home-layout
    content: "Redesign Home.tsx layout: minimal header, centered timer, controls, frosted glass break panel"
    status: pending
isProject: false
---

# Immersive Background Timer Redesign

## Design Direction: Refined Nature Immersion

Inspired by the Oura "In Session" screen — full-bleed landscape photography, dark frosted-glass timer circle, thin sky-blue progress ring, white typography, minimal controls. Professional wellness-app aesthetic.

- **Fonts**: Replace Roboto/Poppins with Cormorant Garamond (elegant serif for the time digits) + DM Sans (clean sans for labels and UI)
- **Color**: Whites and warm ivory on dark glass overlays; sky-blue ring accent (`#8ECAE6`)
- **Motion**: Smooth crossfade between background images; subtle scale-in on timer mount
- **Layout**: Timer dead-center screen, thin top bar, pill "End session" button pinned to bottom

## Image Cycling Strategy

A curated array of 8 high-res Unsplash landscape photos is defined in `Home.tsx`. The displayed image index is derived from `stats.totalSessions % images.length`, so it advances automatically each time the pomodoro hook records a completed session (i.e., when mode switches and the API is called).

A `useEffect` watches `stats.totalSessions` to crossfade to the next image with a CSS `opacity` transition on two stacked `<img>` layers (current / next).

## Files Changed

### 1. `[client/index.html](client/index.html)`

Replace Google Fonts import:

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

### 2. `[client/src/index.css](client/src/index.css)`

- Update `--font-sans` → `'DM Sans'`, `--font-display` → `'Cormorant Garamond'`
- Add glass overlay tokens: `--glass-bg`, `--glass-border`, `--ring-accent`
- Remove solid `bg-background` dependency from body (backgrounds now come from imagery)

### 3. `[client/src/components/timer/TimerDisplay.tsx](client/src/components/timer/TimerDisplay.tsx)`

Complete redesign:

- Outer container becomes a dark frosted-glass circle (`backdrop-blur-xl`, `bg-black/40`, `border border-white/10`)
- SVG ring: `strokeWidth=3`, background track `stroke-white/15`, progress `stroke-[#8ECAE6]`
- Time digits: Cormorant Garamond, large, white
- "Time remaining" label above digits (small, DM Sans, `text-white/60`)
- Mode badge ("Focus" / "Break") at top-center of glass circle
- Props: add `label` (string for mode display), remove `ringColor` (always sky-blue)

### 4. `[client/src/pages/Home.tsx](client/src/pages/Home.tsx)`

Full layout redesign:

- Full-screen background with two stacked `<img>` layers for crossfade (`object-cover absolute inset-0`)
- Dark gradient overlay (`bg-gradient-to-b from-black/30 via-transparent to-black/50`)
- All text flips to white
- Minimal header: logo (left) + stat pills (center-ish) + settings icon (right) — all white/translucent
- Mode toggle pill redesigned with white/translucent glass style
- Timer centered vertically with `TimerDisplay` receiving new `label` prop
- Controls row: reset icon (ghost, white) + large play/pause circle (white fill)
- Break resource panel becomes a frosted glass drawer sliding up from the bottom instead of a side panel, preserving the ukulele feature without breaking the immersive layout
- "End session early" ghost pill at very bottom

