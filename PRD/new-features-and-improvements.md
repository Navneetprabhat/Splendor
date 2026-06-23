# New Features and Improvements

This file is the intake area for product ideas before they become implementation tasks.

## Workflow

1. Add every discussed feature, improvement, or product decision here first.
2. Clarify the goal, expected behavior, and acceptance criteria.
3. Convert approved items into concrete work in `PRD/pending-tasks.md`.
4. Build from `PRD/pending-tasks.md`.
5. After implementation, update `PRD/current-state.md` and mark the task complete.

## Proposed Features

### Pilot 1: Frontend-Only Playable Splendor

**Status:** Approved for planning

Create the first pilot version of Splendor as a frontend-only GitHub Pages app. The pilot should support single-player and multiplayer setup, official Splendor rule handling, a rulebook page fetched from the repo, player timers, and downloadable action history.

**Pilot goals:**

- Establish a frontend-only technical foundation that can be hosted on GitHub Pages.
- Build the official board game rule model from the start.
- Support both single-player and multiplayer entry flows.
- Create a polished first page with a graphic, the headline "Welcome to Splendor", a rulebook link, and mode selection.
- Track each player's turn time in seconds.
- Record player actions and allow the action history to be downloaded as JSON.

**Pilot 1 scope:**

- Frontend-only app, deployable to GitHub Pages.
- Tech stack: Vite + React + TypeScript with plain CSS.
- Visual direction: minimalistic, aesthetic, calm, and game-table focused.
- Static rulebook file in the repo, fetched by the app.
- Landing page with graphic treatment, headline, rulebook prompt, and buttons for Single Player and Multiplayer.
- Single Player flow:
  - User chooses opponent difficulty: Easy, Medium, or Hard.
  - Game starts as 1 v 1: one human player versus one bot.
  - Easy bot makes random legal moves.
  - Medium bot uses short-term greedy choices, prioritizing affordable cards, prestige, and useful token collection.
  - Hard bot uses a stronger heuristic, considering card value, discounts, nobles, points, and near-future buying potential.
- Multiplayer flow:
  - User chooses number of players from 2 to 4.
  - App asks for each player's name.
  - Game starts after all names are entered.
- In-game timer:
  - Counts how many seconds each player takes on each turn.
  - Stores timing data with action records.
- Action record:
  - Captures player, turn number, action type, action details, timestamp, and elapsed turn seconds.
  - Can be downloaded as a JSON file.
- Official Splendor rules from the first implementation.

**Out of scope for first pilot:**

- Backend services.
- Online matchmaking or networked multiplayer.
- Account systems.
- Persistent save games.
- Analytics.
- Production-grade AI. Difficulty can start with progressively better heuristics if full strategy is too large for Pilot 1.

**Acceptance criteria draft:**

- The app runs entirely in the browser and can be hosted from GitHub Pages.
- The first page shows a graphic, "Welcome to Splendor", a new-player rulebook prompt, and Single Player / Multiplayer buttons.
- The rulebook content is loaded from a separate repo file.
- Single Player setup asks for Easy, Medium, or Hard opponent difficulty.
- Single Player starts a 1 v 1 Player vs Bot game.
- Multiplayer setup asks for 2 to 4 players and collects player names.
- The game uses official Splendor action validation and turn progression.
- The game displays available cards, tokens, player holdings, scores, nobles, and current turn.
- Invalid actions are rejected.
- The game tracks elapsed seconds for each player's turn.
- The game records actions with timing data.
- The user can download the action history as JSON.
- The game can identify the end condition and winner.

### Core Game Foundation

**Status:** Approved for Pilot 1 planning

Build the basic Splendor game foundation.

**Confirmed for Pilot 1:**

- The first version is a browser frontend hosted on GitHub Pages.
- The selected stack is Vite + React + TypeScript with plain CSS.
- The visual direction is minimalistic and aesthetic.
- The first version supports both single-player and local multiplayer setup.
- Official board game rules should be modeled from the start.

**Acceptance criteria draft:**

- Game state can represent players, tokens, cards, nobles, turns, and victory points.
- Core actions can be validated against Splendor rules.
- The game can detect a winner or end condition.

### Single-Player Mode

**Status:** Approved for Pilot 1 planning

Allow one human player to play against one or more computer-controlled opponents.

**Confirmed for Pilot 1:**

- The user chooses opponent difficulty from Easy, Medium, and Hard.
- Single-player mode is 1 v 1: Player vs Bot.
- Easy bot makes random legal moves.
- Medium bot uses short-term greedy choices.
- Hard bot uses a stronger strategic heuristic.

### Multiplayer Mode

**Status:** Approved for Pilot 1 planning

Support multiple human players.

**Confirmed for Pilot 1:**

- Multiplayer is local in-browser setup, with no backend.
- The setup flow asks for number of players and player names.
- Supported player count range is 2 to 4.

### Agent Players

**Status:** Proposed

Add automated players that can participate in games.

**Notes to clarify:**

- Agent type and difficulty levels.
- Whether agents are part of the first playable release or a later milestone.

## Improvements

### Compact Visual Game Board

**Status:** Approved

Improve the in-game board so it is more visual, compressed, and easier to scan in one screen.

**Requirements:**

- Use color-heavy card visuals instead of writing color names or abbreviations as the primary signal.
- Remove Buy and Reserve buttons from each visible card.
- Let the action panel handle selected-card actions.
- Compress board spacing so the game fits better in one screen on desktop.
- Use rectangle icons for card holdings and circular icons for coin/token holdings.
- Do not write gem abbreviations such as S, O, D, E, or R on coin icons.
- Make the action panel more graphic and space-efficient.

**Acceptance criteria:**

- Market cards are clickable/selectable without per-card Buy/Reserve buttons.
- Buy/Reserve controls appear in the action panel for the selected card.
- Player token holdings use circles with counts and no gem-letter labels inside the coins.
- Player card/bonus holdings use rectangular color icons.
- The board is denser and more likely to fit in a single desktop viewport.

### Mockup-Aligned Board Layout

**Status:** Approved

Align the in-game board more closely with the provided mockup while keeping the earlier visual improvements.

**Requirements:**

- Use a single top strip for turn status, supply, nobles, and elapsed time.
- Put the action panel on the left, market rows in the center, and player state on the right.
- Make card costs larger and easier to read.
- Render card costs as a colored circle plus a smaller count circle.
- Put small deck rectangles inside each level row instead of a full-size deck control.
- Keep market cards compact and mostly visual.

**Acceptance criteria:**

- Each level row starts with a small deck tile showing remaining cards.
- Market card costs use visible colored cost chips with numeric badges.
- The board layout resembles the supplied mockup at desktop widths.

## Decision Log

| Date | Decision | Reason |
| --- | --- | --- |
| 2026-06-23 | Create PRD-first workflow before implementation. | Keeps feature discussion, tasks, and implementation aligned. |
| 2026-06-23 | Start with a first pilot agenda before implementation. | Keeps the first build small, playable, and useful for validating the core loop. |
| 2026-06-23 | Pilot 1 will be frontend-only and hosted on GitHub Pages. | Avoids backend scope and keeps deployment simple. |
| 2026-06-23 | Pilot 1 includes both single-player and local multiplayer setup. | Validates the two main play paths from the beginning. |
| 2026-06-23 | Pilot 1 should model official board game rules from the start. | Prevents a throwaway rules model and makes later improvements safer. |
| 2026-06-23 | Use Vite + React + TypeScript with plain CSS for Pilot 1. | Provides a clean frontend-only setup that can still grow. |
| 2026-06-23 | Use a minimalistic and aesthetic visual direction. | Keeps the first app focused, readable, and polished. |
| 2026-06-23 | Single-player mode is 1 v 1 Player vs Bot. | Keeps the first bot experience clear and manageable. |
| 2026-06-23 | Multiplayer supports 2 to 4 players for now. | Matches the official base game player count. |
| 2026-06-23 | Bot difficulties use random, greedy, and strategic heuristic behavior. | Gives difficulty levels useful distinction without requiring production-grade AI. |
| 2026-06-24 | Move card Buy/Reserve actions into the action panel. | Keeps cards visual and reduces repeated controls on the board. |
| 2026-06-24 | Align the game board with the supplied mockup. | Improves scanability and uses space more like a physical board. |
