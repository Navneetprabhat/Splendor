# Pending Tasks

Tasks are created here only after the related feature or improvement has been captured in `PRD/new-features-and-improvements.md`.

## Workflow Rules

- Every task must reference a PRD item.
- Keep tasks small enough to implement and verify.
- Move completed tasks to the completed section with the completion date.
- After a task changes product behavior or architecture, update `PRD/current-state.md`.

## Pending

### PRD-023: Revamp action-taking user flow

**Source:** `PRD/new-features-and-improvements.md` - Action Flow Revamp

**Status:** Pending

**Outcome needed:**

- Add prominent active-turn banner inside the action panel.
- Convert action controls into a guided step-based flow.
- Show only relevant controls for the selected action type.
- Add clear helper and validation text for incomplete actions.
- Make primary action buttons specific to the pending action.
- Visually distinguish bot turns from human turns.
- Highlight selectable gems/cards based on the active action mode.

### PRD-011: Add official token-return flow

**Source:** `PRD/new-features-and-improvements.md` - Pilot 1: Frontend-Only Playable Splendor

**Status:** Pending

**Outcome needed:**

- Allow actions that temporarily take a player above ten tokens.
- Prompt the player to return tokens until they have ten.
- Record returned tokens in the action history.
- Apply the same behavior for bot turns.

### PRD-012: Verify card and noble data

**Source:** `PRD/new-features-and-improvements.md` - Core Game Foundation

**Status:** Pending

**Outcome needed:**

- Decide the final source of card and noble data.
- Audit card costs, points, colors, and noble requirements against the selected source.
- Confirm the full 90-card development deck and 10 nobles are final.

### PRD-013: Add automated tests for game rules

**Source:** `PRD/new-features-and-improvements.md` - Core Game Foundation

**Status:** Pending

**Outcome needed:**

- Add focused unit tests for token taking, reserving, buying, noble visits, final round, and winner tie-breaks.
- Add at least one bot action smoke test per difficulty.

## In Progress

No tasks are currently in progress.

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

### PRD-017: Add full 90-card development deck

**Source:** `PRD/new-features-and-improvements.md` - Full Base Development Deck

**Status:** Completed on 2026-06-24

**Outcome:**

- Replaced compact pilot card data with 90 development cards.
- Verified tier counts are 40, 30, and 20.
- Verified total card count is 90.
- Rebuilt static assets for local and GitHub Pages compatibility.

### PRD-018: Polish board interaction details

**Source:** `PRD/new-features-and-improvements.md` - Board Interaction Polish

**Status:** Completed on 2026-06-24

**Outcome:**

- Fixed turn labels to use round and active player position.
- Changed the right-side panel to show one selected player, defaulting to the active player on turn change.
- Removed supply from the top noble strip.
- Added 0.5 second holdings animation after successful take, reserve, and buy actions.
- Updated holdings visuals to centered numeric coin circles and card rectangles.

### PRD-019: Add board controls and readability polish

**Source:** `PRD/new-features-and-improvements.md` - Board Controls and Readability Polish

**Status:** Completed on 2026-06-24

**Outcome:**

- Increased cost chip sizes.
- Added token/card totals and aligned holdings in the player panel.
- Kept visible card costs printed while preserving discount-aware buying.
- Added pause/resume timer control.
- Added undo with cumulative elapsed timing.
- Animated gained tokens/cards from the board/action area to player holdings.

### PRD-020: Match player holdings reference layout

**Source:** `PRD/new-features-and-improvements.md` - Reference-Style Player Holdings Panel

**Status:** Completed on 2026-06-24

**Outcome:**

- Added faded discount strip above player holdings.
- Added labeled Coins and Cards rows.
- Aligned six token circles above five matching vertical card rectangles.
- Kept counts centered inside all holding markers.

### PRD-021: Refine player holdings alignment and top sums

**Source:** `PRD/new-features-and-improvements.md` - Reference-Style Player Holdings Panel

**Status:** Completed on 2026-06-24

**Outcome:**

- Reduced holding coin/card marker widths slightly.
- Aligned main holdings rows more closely with the faded top strip.
- Changed the faded top strip to show each color's coin plus card sum.

### PRD-022: Improve holdings panel clarity and stacked visuals

**Source:** `PRD/new-features-and-improvements.md` - Holdings Panel Clarity Pass

**Status:** Completed on 2026-06-25

**Outcome:**

- Kept prestige text contained in the selected player panel.
- Aligned faded per-color totals above matching color columns.
- Added stacked visuals for card holdings.
- Added stacked/piled visuals for coin holdings.
- Ensured the holdings block fits inside the right panel without clipping.

### PRD-014: Add GitHub Pages deployment workflow

**Source:** `PRD/new-features-and-improvements.md` - Pilot 1: Frontend-Only Playable Splendor

**Status:** Completed on 2026-06-24

**Outcome:**

- Added `.github/workflows/deploy-pages.yml`.
- Pushed static fallback output to the `gh-pages` branch.
- Added root-compatible static assets for the current Pages branch-root setting.
- Verified the live GitHub Pages URL and deployed assets return HTTP 200.
