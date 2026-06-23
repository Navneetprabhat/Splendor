# Pending Tasks

Tasks are created here only after the related feature or improvement has been captured in `PRD/new-features-and-improvements.md`.

## Workflow Rules

- Every task must reference a PRD item.
- Keep tasks small enough to implement and verify.
- Move completed tasks to the completed section with the completion date.
- After a task changes product behavior or architecture, update `PRD/current-state.md`.

## Pending

### PRD-011: Add official token-return flow

**Source:** `PRD/new-features-and-improvements.md` - Pilot 1: Frontend-Only Playable Splendor

**Status:** Pending

**Outcome needed:**

- Allow actions that temporarily take a player above ten tokens.
- Prompt the player to return tokens until they have ten.
- Record returned tokens in the action history.
- Apply the same behavior for bot turns.

### PRD-012: Expand and verify card and noble data

**Source:** `PRD/new-features-and-improvements.md` - Core Game Foundation

**Status:** Pending

**Outcome needed:**

- Decide the final source of card and noble data.
- Expand the current pilot dataset if needed.
- Verify costs, points, colors, and noble requirements.

### PRD-013: Add automated tests for game rules

**Source:** `PRD/new-features-and-improvements.md` - Core Game Foundation

**Status:** Pending

**Outcome needed:**

- Add focused unit tests for token taking, reserving, buying, noble visits, final round, and winner tie-breaks.
- Add at least one bot action smoke test per difficulty.

## In Progress

### PRD-014: Add GitHub Pages deployment workflow

**Source:** `PRD/new-features-and-improvements.md` - Pilot 1: Frontend-Only Playable Splendor

**Status:** Blocked pending repository owner setting

**Outcome needed:**

- GitHub Pages workflow has been added.
- Static `dist/` output has also been pushed to the `gh-pages` branch as a fallback.
- Repository owner/admin must enable GitHub Pages in repository settings before the site can publish.
- Recommended setting: Settings -> Pages -> Build and deployment -> Source: GitHub Actions.
- Current repo setting appears to serve `main` branch root, so add a root-compatible static loader and committed built assets as an immediate workaround.

## Completed

### PRD-000: Finalize Pilot 1 agenda

**Source:** `PRD/new-features-and-improvements.md` - Pilot 1: Frontend-Only Playable Splendor

**Status:** Completed on 2026-06-23

**Outcome:**

- Confirmed Pilot 1 as frontend-only and GitHub Pages friendly.
- Selected Vite + React + TypeScript with plain CSS.
- Confirmed minimalistic and aesthetic visual direction.
- Confirmed single-player as 1 v 1 Player vs Bot.
- Confirmed multiplayer as 2 to 4 players.
- Defined initial Easy, Medium, and Hard bot behavior.

### PRD-001: Scaffold frontend app platform

**Source:** `PRD/new-features-and-improvements.md` - Pilot 1: Frontend-Only Playable Splendor

**Status:** Completed on 2026-06-23

**Outcome:**

- Added Vite + React + TypeScript project structure.
- Added local run and production build scripts.
- Configured Vite with relative asset paths for GitHub Pages compatibility.

### PRD-002: Define first playable rule scope

**Source:** `PRD/new-features-and-improvements.md` - Pilot 1: Frontend-Only Playable Splendor

**Status:** Completed on 2026-06-23

**Outcome:**

- Implemented a first playable local browser game loop.
- Confirmed 1 v 1 Player vs Bot and 2 to 4 player local multiplayer.
- Implemented core Splendor-style action validation and end condition.

### PRD-003: Design initial game state model

**Source:** `PRD/new-features-and-improvements.md` - Core Game Foundation

**Status:** Completed on 2026-06-23

**Outcome:**

- Added typed entities for cards, nobles, tokens, players, turns, setup, and actions.
- Added browser-local game state transitions.
- Added validation boundaries in the rules module.

### PRD-004: Create static rulebook file and fetch contract

**Source:** `PRD/new-features-and-improvements.md` - Pilot 1: Frontend-Only Playable Splendor

**Status:** Completed on 2026-06-23

**Outcome:**

- Added `public/rulebook.md`.
- The app fetches the rulebook from the public asset path.
- Rulebook uses original explanatory wording.

### PRD-005: Build landing and mode selection flow

**Source:** `PRD/new-features-and-improvements.md` - Pilot 1: Frontend-Only Playable Splendor

**Status:** Completed on 2026-06-23

**Outcome:**

- Added generated hero artwork.
- Added "Welcome to Splendor" landing page.
- Added rulebook prompt, Single Player button, and Multiplayer button.

### PRD-006: Build single-player setup flow

**Source:** `PRD/new-features-and-improvements.md` - Single-Player Mode

**Status:** Completed on 2026-06-23

**Outcome:**

- Added Easy, Medium, and Hard difficulty selection.
- Added 1 v 1 Player vs Bot game start.
- Implemented initial bot behavior for all three difficulty levels.

### PRD-007: Build multiplayer setup flow

**Source:** `PRD/new-features-and-improvements.md` - Multiplayer Mode

**Status:** Completed on 2026-06-23

**Outcome:**

- Added 2 to 4 player count selection.
- Added player name inputs.
- Added local multiplayer game start.

### PRD-008: Implement player turn timer

**Source:** `PRD/new-features-and-improvements.md` - Pilot 1: Frontend-Only Playable Splendor

**Status:** Completed on 2026-06-23

**Outcome:**

- Added active-turn elapsed seconds timer.
- Stored elapsed seconds when actions complete.
- Displayed timing in the game top bar and action log.

### PRD-009: Implement action history and JSON download

**Source:** `PRD/new-features-and-improvements.md` - Pilot 1: Frontend-Only Playable Splendor

**Status:** Completed on 2026-06-23

**Outcome:**

- Added structured action records.
- Added downloadable JSON export.
- Included player summary, action list, timing, and winner data.

### PRD-010: Implement rule validation and end condition

**Source:** `PRD/new-features-and-improvements.md` - Core Game Foundation

**Status:** Completed on 2026-06-23

**Outcome:**

- Added validation for token taking, reserving, buying, scoring, noble visits, turn progression, final round, and winner tie-breaks.
- Added user-facing rejection messages for invalid actions.
- Created follow-up PRD tasks for token-return flow and final data verification.

### PRD-015: Compact visual board UI

**Source:** `PRD/new-features-and-improvements.md` - Compact Visual Game Board

**Status:** Completed on 2026-06-24

**Outcome:**

- Replaced text-heavy card/token displays with color-first visual indicators.
- Removed per-card Buy/Reserve buttons from market cards.
- Moved selected-card Buy/Reserve actions into the action panel.
- Added circular coin indicators and rectangular card bonus indicators for holdings.
- Compressed board spacing for a denser desktop layout.

### PRD-016: Align board layout with supplied mockup

**Source:** `PRD/new-features-and-improvements.md` - Mockup-Aligned Board Layout

**Status:** Completed on 2026-06-24

**Outcome:**

- Moved turn state, supply, nobles, controls, and timer into a top strip.
- Moved the action panel to the left, market rows to the center, and player state to the right.
- Increased card cost readability with larger colored circle plus numeric badge chips.
- Replaced large reserve-deck controls with small deck tiles inside each level row.
