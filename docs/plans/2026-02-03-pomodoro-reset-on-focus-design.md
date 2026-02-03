# Pomodoro Reset On Focus Design

**Goal:** Reset the daily pomodoro counter the next time the user returns to the tab after the 3am boundary, without a full page reload.

## Context
The app already stores `sessionsToday` and `lastUpdate` in `localStorage` and resets counts when `checkDayReset()` runs at initialization. If the tab stays open overnight, the user can return the next day with a stale count.

## Requirements
- Reset `sessionsToday` to 0 when the user returns after the 3am boundary.
- Update the UI immediately (no reload).
- Keep behavior idempotent and safe to call multiple times.
- Preserve existing timer behavior; only the counter is affected.

## Proposed Approach (Recommended)
- Replace `checkDayReset()` with a reusable helper `maybeResetForNewDay()`.
- Call it in:
  - `init()`
  - `window` `focus` event
  - `document` `visibilitychange` event (when visible)
  - `startTimer()` (guard before starting a new session)
- Keep the same 3am boundary logic.

## Data Flow
1. On app load or tab activation, call `maybeResetForNewDay()`.
2. Compute the most recent 3am boundary from `now`.
3. If `state.lastUpdate` is before the boundary, reset `sessionsToday` and save state.
4. Re-render to update the counter text.

## Alternatives Considered
- **Scheduled timer to 3am:** reliable but needs background timers and more moving parts.
- **Interval polling:** simple but unnecessary work and battery use.
- **Hard reload on focus:** heavy-handed, could disrupt the timer.

## Error Handling
- If `lastUpdate` is missing or invalid, no reset occurs.
- If `localStorage` access fails, the app logs a warning and continues (existing behavior).

## Testing (Manual)
- Set `lastUpdate` to before the boundary, reload, verify count resets.
- Leave tab open past 3am, refocus, verify count resets without reload.
- Start a pomodoro after boundary; verify counter resets first.
- Verify no reset occurs if `lastUpdate` is after the boundary.
