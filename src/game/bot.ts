import { gems } from "./data";
import { actionLabel, canAffordCard, tokenTotal } from "./rules";
import type { Card, GameAction, GameState, Gem, Player, Tier, Token, Tokens } from "./types";

const tiers: Tier[] = [1, 2, 3];
const tokenOrder = [...gems, "gold"] as Token[];

const combos = (items: Gem[], size: number): Gem[][] => {
  if (size === 0) return [[]];
  if (items.length < size) return [];
  const [head, ...tail] = items;
  return [
    ...combos(tail, size - 1).map((combo) => [head, ...combo]),
    ...combos(tail, size),
  ];
};

const returnedTokensFor = (player: Player, gained: Partial<Tokens>): Token[] | undefined => {
  const projected = { ...player.tokens };
  tokenOrder.forEach((token) => {
    projected[token] += gained[token] ?? 0;
  });

  const excess = tokenTotal(projected) - 10;
  if (excess <= 0) return undefined;

  const returned: Token[] = [];
  const returnPriority = [...gems].sort((a, b) => projected[b] - projected[a]);
  for (const token of [...returnPriority, "gold"] as Token[]) {
    while (projected[token] > 0 && returned.length < excess) {
      projected[token] -= 1;
      returned.push(token);
    }
    if (returned.length === excess) break;
  }

  return returned;
};

const legalActions = (state: GameState): GameAction[] => {
  const player = state.players[state.activePlayerIndex];
  const actions: GameAction[] = [];

  tiers.forEach((tier) => {
    state.market[tier].forEach((card) => {
      if (canAffordCard(player, card)) actions.push({ type: "BUY_MARKET", tier, cardId: card.id });
    });
  });

  player.reserved.forEach((card) => {
    if (canAffordCard(player, card)) actions.push({ type: "BUY_RESERVED", cardId: card.id });
  });

  if (player.reserved.length < 3) {
    const returnedTokens = returnedTokensFor(player, { gold: state.supply.gold > 0 ? 1 : 0 });
    tiers.forEach((tier) => {
      state.market[tier].forEach((card) => {
        if (card.points >= 2 || tier >= 2) {
          actions.push({ type: "RESERVE_MARKET", tier, cardId: card.id, returnedTokens });
        }
      });
      if (state.decks[tier].length > 0 && tier >= 2) actions.push({ type: "RESERVE_DECK", tier, returnedTokens });
    });
  }

  const availableGems = gems.filter((gem) => state.supply[gem] > 0);
  ([1, 2, 3] as const).forEach((size) => {
    combos(availableGems, size).forEach((colors) => {
      const gained = colors.reduce((tokens, color) => {
        tokens[color] = (tokens[color] ?? 0) + 1;
        return tokens;
      }, {} as Partial<Tokens>);
      actions.push({ type: "TAKE_THREE", colors, returnedTokens: returnedTokensFor(player, gained) });
    });
  });

  gems.forEach((gem) => {
    if (state.supply[gem] >= 4) actions.push({ type: "TAKE_TWO", color: gem, returnedTokens: returnedTokensFor(player, { [gem]: 2 }) });
  });

  return actions;
};

const cardByAction = (state: GameState, action: GameAction): Card | undefined => {
  if (action.type === "BUY_MARKET" || action.type === "RESERVE_MARKET") {
    return state.market[action.tier].find((card) => card.id === action.cardId);
  }
  if (action.type === "BUY_RESERVED") {
    return state.players[state.activePlayerIndex].reserved.find((card) => card.id === action.cardId);
  }
  return undefined;
};

const nobleProgress = (player: Player, card?: Card) => {
  const nextBonuses = { ...player.bonuses };
  if (card) nextBonuses[card.color] += 1;
  return (stateNobles: GameState["nobles"]) =>
    Math.max(
      0,
      ...stateNobles.map((noble) =>
        gems.reduce((ready, gem) => ready + Math.min(nextBonuses[gem], noble.cost[gem]), 0),
      ),
    );
};

const scoreAction = (state: GameState, action: GameAction): number => {
  const player = state.players[state.activePlayerIndex];
  const card = cardByAction(state, action);

  if (action.type === "BUY_MARKET" || action.type === "BUY_RESERVED") {
    const nobleValue = nobleProgress(player, card)(state.nobles) * 0.2;
    return 100 + (card?.points ?? 0) * 18 + (card?.tier ?? 0) * 4 + nobleValue;
  }

  if (action.type === "RESERVE_MARKET") {
    return 45 + (card?.points ?? 0) * 8 + (card?.tier ?? 0) * 3;
  }

  if (action.type === "RESERVE_DECK") {
    return 36 + action.tier * 4;
  }

  if (action.type === "TAKE_TWO") {
    const visibleNeed = tiers
      .flatMap((tier) => state.market[tier])
      .filter((cardInMarket) => cardInMarket.cost[action.color] > player.bonuses[action.color])
      .length;
    return 20 + visibleNeed;
  }

  if (action.type === "TAKE_THREE") {
    const diversity = action.colors.filter((color) => player.tokens[color] === 0).length;
    return 18 + diversity * 3;
  }

  return 0;
};

export const chooseBotAction = (state: GameState): GameAction | undefined => {
  const player = state.players[state.activePlayerIndex];
  const actions = legalActions(state);
  if (actions.length === 0) return undefined;

  if (player.difficulty === "easy") {
    return actions[Math.floor(Math.random() * actions.length)];
  }

  const scored = actions
    .map((action) => ({
      action,
      score: scoreAction(state, action) + (player.difficulty === "hard" ? Math.random() * 3 : Math.random()),
      label: actionLabel(state, action),
    }))
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));

  if (player.difficulty === "medium") {
    const greedy = scored.filter((item) => item.action.type.startsWith("BUY"));
    return (greedy[0] ?? scored[0]).action;
  }

  return scored[0].action;
};
