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

### Full Base Development Deck

**Status:** Approved

Replace the compact pilot development-card dataset with the full base Splendor development deck.

**Requirements:**

- Include 90 development cards total.
- Use the official base-game tier distribution: 40 level 1 cards, 30 level 2 cards, and 20 level 3 cards.
- Keep every card modeled with tier, bonus color, prestige points, and gem cost.
- Preserve the existing browser-local shuffle, market, buying, and reserving behavior.

**Acceptance criteria:**

- Level 1 deck contains 40 cards before the market is dealt.
- Level 2 deck contains 30 cards before the market is dealt.
- Level 3 deck contains 20 cards before the market is dealt.
- Total development-card count is 90.

### Board Interaction Polish

**Status:** Approved

Improve the in-game board interaction details so turn order, player inspection, resource movement, and holdings visuals are clearer.

**Requirements:**

- Display turn labels as `round.player`, using the active player's table position rather than that player's personal turn count. For example, a three-player game should show `1.1`, `1.2`, `1.3`, `2.1`, `2.2`, `2.3`, and so on.
- The right player panel should show only one selected player's details.
- The selected player should default to the active player whose turn it is.
- Player tabs should allow inspecting another player without changing the active turn.
- Remove supply from the noble row/top strip because supply is already shown in the action panel.
- Add a simple 0.5 second movement animation when tokens or cards are added to the active player's holdings.
- In player holdings, show gems as colored circles with the count centered inside. White/diamond circles should use black text, while other token circles should use white text.
- In player holdings, show card bonuses as colored rectangles with the count centered inside.

**Acceptance criteria:**

- Turn labels are correct for two, three, and four player games.
- The right panel renders only the selected player's holdings, defaulting back to the active player on turn change.
- The top strip shows nobles without duplicating supply.
- Successful take, reserve, and buy actions trigger a short holdings highlight/movement animation.
- Player holdings use centered numeric circles for gems and centered numeric rectangles for card bonuses.

### Board Controls and Readability Polish

**Status:** Approved

Improve board readability and control ergonomics for the next pilot iteration.

**Requirements:**

- Increase development-card cost coin and cost-count visuals by roughly 25%.
- In the right player panel, show total token count and total purchased-card count.
- Align player token and card holdings by color so token circles and card rectangles can be summed quickly.
- Make card bonus rectangles vertical.
- Show a slightly faded notional total marker above the holdings rows.
- Visible cards on the board and selected-card panel should always show printed card cost, not discounted cost.
- Card discounts should continue to apply only in affordability validation and buying/payment.
- Add a pause/resume option for the active turn timer.
- Add an undo option that restores the previous game state while adding elapsed time since the undone move back onto the restored active player's timer.
- Animate gained tokens/cards from the main playing area to player holdings across the screen.

**Acceptance criteria:**

- Cost chips are visibly larger without breaking card layout.
- Right panel shows token/card totals plus aligned per-color token/card holdings.
- Printed card costs do not change when the active player has discounts.
- Pause stops the timer until resumed.
- Undo restores the last pre-action state and keeps elapsed timing cumulative.
- Token/card movement animation starts from the board/action area and ends near the player holdings panel.

### Reference-Style Player Holdings Panel

**Status:** Approved

Update the player holdings layout to match the supplied visual reference more closely.

**Requirements:**

- Show a faded top strip of owned-card discounts above the main holdings block.
- Show a framed main holdings block with two labeled rows: `Coins (n)` and `Cards (n)`.
- Coins row should show six colored circles in the standard token order.
- Cards row should show five vertical colored rectangles aligned directly under matching gem coins.
- Keep the gold coin column in the coins row, with no card rectangle below it.
- Keep counts centered inside each circle or rectangle.

**Acceptance criteria:**

- Player holdings visually read as two rows, coins above cards, with labels on the left.
- Card rectangles align under the matching non-gold token circles.
- The top discount strip is visible but slightly faded.

**Refinement:**

- Narrow coin and card markers slightly so the main holdings rows align better with the top strip.
- The faded top strip should show the per-color sum of owned coins plus owned cards.

### Holdings Panel Clarity Pass

**Status:** Approved

Improve the selected player's holdings panel so coins, cards, totals, and prestige are visually balanced and easy to understand.

**Requirements:**

- Blend the coin and card visuals better so they feel like one holdings system.
- Prevent prestige text from overflowing outside the selected player panel.
- Keep faded per-color totals directly above the matching color column.
- Use stacked visuals for owned card counts.
- Use a stacked/piled treatment for holding coin counts.
- Preserve centered counts and readable color contrast.

**Acceptance criteria:**

- Prestige stays inside the selected player header at desktop widths.
- Faded total circles align above same-color coins/cards.
- Coin and card holdings use related stacked visual styling.
- The holdings block does not horizontally overflow the right panel.

### Action Flow Revamp

**Status:** Approved for planning

Revamp the action-taking flow so the player always understands whose turn it is, what action mode is active, what can be selected, and what will happen next.

**Current problems to solve:**

- The active player is not prominent enough inside the action area.
- The action panel presents all action types at once, so it feels like a toolbox rather than a guided turn.
- `Pick 3`, `Pick 2 same`, `Buy`, and `Reserve` do not clearly explain the next required step.
- The disabled `Take gems`, `Buy`, and `Reserve` buttons do not explain what is missing.
- Card selection and action selection are disconnected: selecting a card on the board does not strongly focus the action panel.
- Bot turns and human turns are visually similar.

**UX direction:**

- Treat the left action panel as the active turn command center.
- Add a strong active-turn header with player name, turn label, timer, and turn state.
- Use a step-based action flow:
  1. Choose action type.
  2. Select gems or card.
  3. Review summary.
  4. Confirm action.
- Keep only the relevant controls visible for the selected action type.
- Show clear helper text for the current step.
- Disable impossible actions earlier and explain why they are unavailable.
- Highlight selectable board cards only when `Buy` or `Reserve` is active.
- Highlight selectable gems only when a token-taking action is active.
- During bot turns, collapse the action area into a clear bot-thinking state with no human controls.

**Proposed panel layout:**

- Turn banner:
  - Active player name.
  - `Turn round.player` label.
  - Timer plus pause/resume.
  - Human/bot status.
- Action selector:
  - Four large segmented choices: `Take 3`, `Take 2`, `Buy`, `Reserve`.
  - Selected action has strongest visual emphasis.
- Context body:
  - `Take 3`: show available gem circles; selected gems move into a small preview row.
  - `Take 2`: show only gem colors with at least four in supply.
  - `Buy`: prompt user to select an affordable visible/reserved card; show selected card summary.
  - `Reserve`: prompt user to select a visible card or deck tile; show selected card/deck summary.
- Action footer:
  - Single primary confirm button with a specific label, such as `Take 3 gems`, `Buy card`, or `Reserve card`.
  - Secondary clear/cancel selection button.
  - Inline validation message when action is incomplete or invalid.

**Acceptance criteria:**

- Active player identity is visible in the action panel without relying on the top bar.
- Human and bot turns are visually distinct.
- Only relevant controls are shown for the current action type.
- The primary button always describes the exact action that will happen.
- Incomplete actions explain what the user must select next.
- Board cards and gems visually indicate when they are selectable.
- The flow remains compact enough for the existing desktop board layout.

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
| 2026-06-24 | Use the full 90-card base development deck. | Matches the physical game's development-card count and tier distribution. |
| 2026-06-24 | Show only one selected player in the right panel. | Keeps the board compressed while still allowing player inspection. |
| 2026-06-24 | Keep visible card costs as printed costs. | Discounts should affect affordability and payment, not mutate the displayed card reference data. |
| 2026-06-24 | Use a reference-style holdings panel. | Makes coin/card totals easier to scan and sum during play. |
| 2026-06-25 | Use stacked holdings markers. | Makes owned coins and cards look more tangible while reducing visual confusion. |
| 2026-06-25 | Revamp action-taking as a guided command center. | The current toolbox-style action panel does not make turn ownership or next steps clear enough. |
