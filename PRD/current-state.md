# Current State

## Product Summary

Splendor is a frontend-only browser version of the board game, planned for GitHub Pages hosting. Pilot 1 supports single-player Player vs Bot and local multiplayer.

## Repository State

- Branch: `dev`
- Framework: Vite + React + TypeScript
- Styling: plain CSS
- Build output: `dist/`
- Static assets:
  - `public/rulebook.md`
  - `public/hero-splendor.webp`
- PRD workflow:
  - `PRD/current-state.md`
  - `PRD/new-features-and-improvements.md`
  - `PRD/pending-tasks.md`

## Implemented Features

- Landing page with generated tabletop hero artwork and headline "Welcome to Splendor".
- Rulebook page loaded from `public/rulebook.md`.
- Single Player setup with Easy, Medium, and Hard bot difficulty.
- 1 v 1 Player vs Bot game mode.
- Local multiplayer setup for 2 to 4 named players.
- Game state model for players, tokens, cards, nobles, turns, market, decks, reserved cards, and action history.
- Compact color-first board UI with compressed spacing for desktop play.
- Mockup-aligned game layout with top strip, left action panel, center market, and right player panel.
- Top strip displays turn state, supply, nobles, controls, and elapsed seconds.
- Market and reserved cards are selected directly from the board instead of using per-card action buttons.
- Buy and Reserve commands live in the action panel for the selected card.
- Each level row starts with a small deck tile for reserving from the deck.
- Card costs use larger colored cost circles with small numeric count badges.
- Player token holdings use circular coin indicators with counts.
- Player card bonuses use rectangular color indicators with counts.
- Action panel uses graphic token/card controls for take, buy, and reserve actions.
- Core actions:
  - Take three different gems.
  - Take two gems of the same color when at least four are available.
  - Reserve a visible market card.
  - Reserve the top card from a deck.
  - Buy a visible market card.
  - Buy a reserved card.
- Rule validation for affordability, reserve limits, token availability, token cap prevention, noble visits, final round, winner, and tie-break by fewer purchased cards.
- Per-turn elapsed seconds timer.
- Action history with player, turn, action details, timestamp, and elapsed seconds.
- Downloadable JSON action history.
- Production build via `npm run build`.
- GitHub Pages deployment workflow added at `.github/workflows/deploy-pages.yml`.
- Static build has also been pushed to the `gh-pages` branch as a fallback publishing source.

## Known Decisions

- The product will support both single-player and multiplayer modes.
- Pilot 1 will be a frontend-only browser app hosted on GitHub Pages.
- Pilot 1 will use Vite + React + TypeScript with plain CSS.
- Pilot 1 will use a minimalistic and aesthetic visual direction.
- Pilot 1 will model official Splendor rules from the start.
- Pilot 1 single-player mode will be 1 v 1: Player vs Bot.
- Pilot 1 bot difficulties will be Easy, Medium, and Hard.
- Easy bot will make random legal moves.
- Medium bot will use short-term greedy choices.
- Hard bot will use a stronger strategic heuristic.
- Pilot 1 local multiplayer will support 2 to 4 players.
- Pilot 1 will include a fetched static rulebook file.
- Pilot 1 will include player turn timers and downloadable JSON action history.
- Rulebook content is repo-owned explanatory text, not copied proprietary rulebook text.
- Agent support is planned for a later stage.
- New feature discussions should be captured in the PRD before implementation starts.

## Known Gaps

- Token-limit handling currently prevents actions that would exceed ten tokens instead of opening a return-token flow.
- Card and noble data is compact pilot data and should be expanded or verified before calling the component set final.
- There is no automated test suite yet.
- GitHub Pages is not enabled in repository settings yet. The first deployment workflow failed with GitHub's "Ensure GitHub Pages has been enabled" error.
- Repository owner/admin needs to enable Pages in GitHub settings, preferably with Source set to GitHub Actions.

## Update Rule

Update this file whenever implemented behavior, architecture, or project assumptions change.
