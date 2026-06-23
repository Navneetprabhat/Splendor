# Splendor

A frontend-only Splendor pilot with single-player Player vs Bot and local multiplayer modes.

## Current Pilot

- Vite + React + TypeScript app.
- Minimalistic tabletop-inspired UI.
- Landing page with generated hero artwork, rulebook prompt, and mode selection.
- Single Player: 1 v 1 Player vs Bot with Easy, Medium, and Hard difficulty choices.
- Multiplayer: local 2 to 4 player setup with player names.
- Mockup-aligned compact board with a top status strip, left action panel, center market, right player panel, selectable cards, coin indicators, card bonus indicators, and small deck tiles.
- Turn timer that records elapsed seconds per completed action.
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

Pilot 1 implements the core browser game loop and rule validation. Remaining known follow-ups are tracked in `PRD/pending-tasks.md`, including a fuller token-return flow for the official ten-token limit and final card/noble data expansion.
