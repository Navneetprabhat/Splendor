# Splendor

Version 1 of a frontend-only Splendor game with single-player Player vs Bot and local multiplayer modes.

## Current Version

- Vite + React + TypeScript app.
- Minimalistic tabletop-inspired UI.
- Landing page with generated hero artwork, rulebook prompt, and mode selection.
- Single Player: 1 v 1 Player vs Bot with Easy, Medium, and Hard difficulty choices.
- Multiplayer: local 2 to 4 player setup with player names.
- Full 90-card base development deck with 40 level 1, 30 level 2, and 20 level 3 cards.
- Mockup-aligned compact board with a top status strip, left action panel, center market, selectable cards, small deck tiles, and a one-player-at-a-time holdings panel.
- Guided action panel with clear active-turn banner, contextual Take 3 / Take 2 / Buy / Reserve controls, and selectable board highlights.
- Recent actions are collapsed by default, and token-taking actions support return-token selection when crossing ten tokens.
- Turn labels follow round/player order, such as `1.1`, `1.2`, `1.3`, then `2.1`.
- Final-round winner determination waits until the current table round is complete.
- Player holdings use a reference-style panel: aligned faded per-color sums, labeled Coins/Cards rows, stacked coin piles, and stacked vertical card piles.
- Visible cards show printed costs; discounts are applied only when validating and paying for buys.
- Short board-to-holdings movement animation after successful token/card actions.
- Turn timer that records elapsed seconds per completed action, with pause/resume and undo controls.
- Action history export as JSON.
- Static rulebook fetched from `public/rulebook.md`.

## Run Locally

```bash
npm install
npm run dev
```

The dev server usually opens at `http://127.0.0.1:5173/`.

## Build

```bash
npm run build
```

The production output is generated in `dist/`. The Vite config uses a relative base path so the build can be hosted on GitHub Pages.

## Deploy

Merging to `main` triggers the GitHub Pages workflow in `.github/workflows/deploy-pages.yml`.

Live site: `https://navneetprabhat.github.io/Splendor/`

The repository also keeps root static assets for the current GitHub Pages branch-root setting. Re-run `npm run build` and copy `dist/assets/index.js` plus `dist/assets/index.css` into `assets/` before publishing app changes.

## Notes

Version 1 implements the core browser game loop and rule validation. Remaining known follow-ups are tracked in `PRD/pending-tasks.md`, including final component-data audit and automated tests.
