# Mini Pomodoro — Design Document

**Date:** 2026-01-22  
**Status:** Ready for implementation

---

## Overview

A single-page, ultra-minimalist Pomodoro timer focused on zero-distraction utility. Designed for use in a small floating browser window or full-screen with elegant centered layout.

---

## Core Requirements

### Timer Logic
- **Work session:** Fixed 25 minutes
- **Break session:** Optional 5 minutes
- **Manual transitions:** Timer stops at 00:00, user must manually start next session
- **Display:** Countdown in `MM:SS` format

### Session Flow

| State | Display | Actions Available |
|-------|---------|-------------------|
| Idle | `25:00` | Start Pomodoro |
| Running | Countdown | Pause |
| Paused | Frozen time | Continue, Reset |
| Pomodoro Complete | `00:00` | 5 minute break, Start Pomodoro |
| Break Complete | `00:00` | Start Pomodoro |

### Tracking & Persistence
- **Daily counter:** Tracks completed 25-minute sessions
- **Storage:** localStorage
- **Auto-reset:** Counter resets at 3:00 AM daily
- **Manual clear:** "Clear" button resets counter without interrupting active timer
- **Count rules:** Only sessions reaching 00:00 count (pauses OK, resets don't count)

### Audio & Notifications
- **Completion sound:** Soft chime/bell via Web Audio API
- **Fade on interaction:** Sound fades out (200ms) when user clicks next action
- **Tab title updates:**
  - Running pomodoro: `14:59`
  - Running break: `14:59 Break`
  - Paused pomodoro: `14:59 ⏸`
  - Paused break: `14:59 ⏸ Break`
  - Complete: `✓ Done` or `✓ Break over`
  - Idle: `Mini Pomodoro`

---

## Technical Architecture

### File Structure

```
mini-pomodoro/
├── index.html    (structure + script)
└── styles.css    (all styles)
```

Zero dependencies. No build step.

### State Management

```javascript
state = {
  mode: 'idle' | 'running' | 'paused' | 'complete',
  type: 'pomodoro' | 'break',
  timeRemaining: number,       // seconds
  sessionsToday: number,
  lastUpdate: string           // ISO timestamp
}
```

### Core Functions

- `startTimer(type)` — begins countdown for pomodoro or break
- `pauseTimer()` — freezes countdown
- `resumeTimer()` — continues from paused state
- `resetTimer()` — returns to idle at 25:00
- `tick()` — decrements time each second, triggers completion at 00:00
- `completeSession()` — plays sound, increments counter (if pomodoro), updates UI
- `render()` — updates DOM to reflect current state
- `updateTabTitle()` — syncs document.title with timer state
- `playChime()` — generates and plays completion sound
- `fadeOutChime()` — gracefully stops sound on interaction

### localStorage Schema

```javascript
{
  "miniPomodoro": {
    "sessionsToday": 4,
    "lastUpdate": "2026-01-22T14:30:00Z"
  }
}
```

### 3 AM Reset Logic

On page load:
1. Read `lastUpdate` from storage
2. Calculate most recent 3 AM boundary
3. If `lastUpdate` < 3 AM boundary → reset `sessionsToday` to 0
4. Save updated state

---

## Visual Design

### Aesthetic
- **Style:** Dark mode, Oura-inspired
- **Feel:** Premium, calm, minimalist

### Color Palette

| Role | Value |
|------|-------|
| Background | `#0d0d0f` |
| Surface | `#1a1a1f` |
| Text primary | `#e8e8ea` |
| Text muted | `#6b6b70` |
| Accent | `#7c8aff` |
| Accent glow | `rgba(124, 138, 255, 0.15)` |

### Typography
- **Font:** Cormorant Garamond (Google Fonts)
- **Timer:** Large, medium weight, tabular numerals
- **Labels/buttons:** Smaller, slightly letterspaced

### Components

**Timer Display**
- Centered vertically and horizontally
- Fluid sizing: `clamp(56px, 15vw, 120px)`
- Subtle text shadow for depth

**Buttons**
- Pill-shaped (fully rounded)
- Ghost style (transparent bg, subtle border)
- Hover: soft accent glow, slight scale up
- Active: quick scale down
- Transitions: 150ms ease-out

**Session Counter**
- Bottom of viewport
- Format: "4 Pomodoros done today"
- "Clear" as subtle text link beside it

---

## Responsive Behavior

### Layout Strategy
- Max-width container: `600px`
- Centered on wide screens
- Scales down fluidly for smaller viewports

### Breakpoints

**Large (>600px)**
- Container: 600px centered
- Timer: ~120px
- Generous spacing

**Medium (400-600px)**
- Container: 100% width, 24px padding
- Timer: ~80px
- Comfortable spacing

**Compact (<400px)**
- Minimal padding (16px)
- Timer: ~56px
- Buttons may stack vertically
- Counter: smaller text

### Implementation
- CSS `clamp()` for fluid typography
- Flexbox for centering
- Single media query at 400px for compact adjustments

---

## Audio Implementation

### Web Audio API Chime

Synthesized bell using layered sine waves:
- Fundamental: ~440Hz
- Overtone: ~880Hz
- Attack: immediate
- Decay: ~2 seconds natural fade

### Fade-out Behavior

When user interacts while sound playing:
- GainNode ramps to 0 over 200ms
- Graceful stop, not abrupt cut

---

## Summary

| Aspect | Decision |
|--------|----------|
| Tech | Vanilla HTML + CSS + JS, two files |
| Aesthetic | Dark, Oura-inspired, Cormorant Garamond |
| Layout | 600px max centered, fluid down to 300px |
| Timer | MM:SS, clamp sizing 56-120px |
| Flow | Idle → Running → Paused → Complete |
| Counter | "X Pomodoros done today" + Clear |
| Sound | Web Audio synthesized chime |
| Tab title | Dynamic based on state |
| Persistence | localStorage, 3 AM reset |
