import { cards, emptyCost, gems, nobles } from "./data";
import type {
  ActionRecord,
  Card,
  Cost,
  GameAction,
  GameState,
  Gem,
  Noble,
  Player,
  SetupPlayer,
  Tier,
  Token,
  Tokens,
} from "./types";

const emptyTokens = (): Tokens => ({
  diamond: 0,
  sapphire: 0,
  emerald: 0,
  ruby: 0,
  onyx: 0,
  gold: 0,
});

const clone = <T>(value: T): T => structuredClone(value);

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const tokenSupplyFor = (playerCount: number): Tokens => {
  const colorCount = playerCount === 2 ? 4 : playerCount === 3 ? 5 : 7;
  return {
    diamond: colorCount,
    sapphire: colorCount,
    emerald: colorCount,
    ruby: colorCount,
    onyx: colorCount,
    gold: 5,
  };
};

const totalTokens = (tokens: Tokens): number =>
  Object.values(tokens).reduce((sum, count) => sum + count, 0);

export const playerScore = (player: Player): number =>
  player.purchased.reduce((sum, card) => sum + card.points, 0) +
  player.nobles.reduce((sum, noble) => sum + noble.points, 0);

const canPay = (player: Player, card: Card): boolean => {
  let goldNeeded = 0;
  for (const gem of gems) {
    const required = Math.max(0, card.cost[gem] - player.bonuses[gem]);
    goldNeeded += Math.max(0, required - player.tokens[gem]);
  }
  return goldNeeded <= player.tokens.gold;
};

const payForCard = (player: Player, supply: Tokens, card: Card) => {
  for (const gem of gems) {
    const required = Math.max(0, card.cost[gem] - player.bonuses[gem]);
    const colored = Math.min(required, player.tokens[gem]);
    player.tokens[gem] -= colored;
    supply[gem] += colored;
    const gold = required - colored;
    if (gold > 0) {
      player.tokens.gold -= gold;
      supply.gold += gold;
    }
  }
};

const refillMarket = (state: GameState, tier: Tier) => {
  while (state.market[tier].length < 4 && state.decks[tier].length > 0) {
    const next = state.decks[tier].shift();
    if (next) state.market[tier].push(next);
  }
};

const findMarketCard = (state: GameState, tier: Tier, cardId: string) =>
  state.market[tier].find((card) => card.id === cardId);

const removeMarketCard = (state: GameState, tier: Tier, cardId: string) => {
  const index = state.market[tier].findIndex((card) => card.id === cardId);
  if (index < 0) return undefined;
  const [card] = state.market[tier].splice(index, 1);
  refillMarket(state, tier);
  return card;
};

const visitNobleIfEligible = (player: Player, noblesInPlay: Noble[]) => {
  const noble = noblesInPlay.find((candidate) =>
    gems.every((gem) => player.bonuses[gem] >= candidate.cost[gem]),
  );
  if (!noble) return;
  player.nobles.push(noble);
  noblesInPlay.splice(noblesInPlay.indexOf(noble), 1);
};

const finishTurn = (
  state: GameState,
  action: GameAction,
  details: Record<string, unknown>,
  elapsedSeconds: number,
) => {
  const player = state.players[state.activePlayerIndex];
  player.turnsTaken += 1;

  const record: ActionRecord = {
    id: `${Date.now()}-${state.log.length + 1}`,
    turnNumber: state.turnNumber,
    round: state.round,
    playerId: player.id,
    playerName: player.name,
    actionType: action.type,
    details,
    elapsedSeconds,
    timestamp: new Date().toISOString(),
  };
  state.log.push(record);

  const score = playerScore(player);
  if (score >= 15 && state.finalRoundTargetTurns === undefined) {
    state.finalRoundTargetTurns = Math.max(
      ...state.players.map((candidate) => candidate.turnsTaken),
    );
    state.message = `${player.name} reached 15 prestige. Finish the round.`;
  }

  if (
    state.finalRoundTargetTurns !== undefined &&
    state.players.every((candidate) => candidate.turnsTaken >= state.finalRoundTargetTurns!)
  ) {
    const winner = determineWinner(state.players);
    state.winner = winner;
    state.message = winner.message;
    return state;
  }

  state.activePlayerIndex = (state.activePlayerIndex + 1) % state.players.length;
  if (state.activePlayerIndex === 0) state.round += 1;
  state.turnNumber += 1;
  state.turnStartedAt = Date.now();
  return state;
};

const determineWinner = (players: Player[]): NonNullable<GameState["winner"]> => {
  const ranked = [...players].sort((a, b) => {
    const scoreDelta = playerScore(b) - playerScore(a);
    if (scoreDelta !== 0) return scoreDelta;
    return a.purchased.length - b.purchased.length;
  });
  const top = ranked[0];
  const tied = ranked.filter(
    (player) =>
      playerScore(player) === playerScore(top) &&
      player.purchased.length === top.purchased.length,
  );
  return {
    playerIds: tied.map((player) => player.id),
    message:
      tied.length === 1
        ? `${top.name} wins with ${playerScore(top)} prestige.`
        : `${tied.map((player) => player.name).join(" and ")} tie with ${playerScore(top)} prestige.`,
  };
};

export const createGame = (setupPlayers: SetupPlayer[]): GameState => {
  const byTier = {
    1: shuffle(cards.filter((card) => card.tier === 1)),
    2: shuffle(cards.filter((card) => card.tier === 2)),
    3: shuffle(cards.filter((card) => card.tier === 3)),
  } satisfies Record<Tier, Card[]>;

  const market = {
    1: byTier[1].splice(0, 4),
    2: byTier[2].splice(0, 4),
    3: byTier[3].splice(0, 4),
  } satisfies Record<Tier, Card[]>;

  return {
    players: setupPlayers.map((setup, index) => ({
      id: `p-${index + 1}`,
      name: setup.name,
      isBot: Boolean(setup.isBot),
      difficulty: setup.difficulty,
      tokens: emptyTokens(),
      bonuses: emptyCost(),
      reserved: [],
      purchased: [],
      nobles: [],
      turnsTaken: 0,
    })),
    activePlayerIndex: 0,
    turnNumber: 1,
    round: 1,
    supply: tokenSupplyFor(setupPlayers.length),
    decks: byTier,
    market,
    nobles: shuffle(nobles).slice(0, setupPlayers.length + 1),
    log: [],
    turnStartedAt: Date.now(),
    message: "Game started.",
  };
};

export const actionLabel = (state: GameState, action: GameAction): string => {
  switch (action.type) {
    case "TAKE_THREE":
      return `Take ${action.colors.join(", ")}`;
    case "TAKE_TWO":
      return `Take 2 ${action.color}`;
    case "RESERVE_MARKET":
      return `Reserve ${findMarketCard(state, action.tier, action.cardId)?.name ?? "card"}`;
    case "RESERVE_DECK":
      return `Reserve a level ${action.tier} deck card`;
    case "BUY_MARKET":
      return `Buy ${findMarketCard(state, action.tier, action.cardId)?.name ?? "card"}`;
    case "BUY_RESERVED":
      return `Buy reserved ${
        state.players[state.activePlayerIndex].reserved.find((card) => card.id === action.cardId)
          ?.name ?? "card"
      }`;
  }
};

export const applyAction = (
  current: GameState,
  action: GameAction,
  elapsedSeconds: number,
): { game: GameState; ok: boolean; message: string } => {
  const state = clone(current);
  if (state.winner) return { game: state, ok: false, message: "Game is already complete." };

  const player = state.players[state.activePlayerIndex];

  const fail = (message: string) => {
    state.message = message;
    return { game: state, ok: false, message };
  };

  if (action.type === "TAKE_THREE") {
    const unique = [...new Set(action.colors)];
    if (unique.length !== 3) return fail("Choose three different gem colors.");
    if (unique.some((gem) => state.supply[gem] <= 0)) {
      return fail("One of those gem colors is not available.");
    }
    if (totalTokens(player.tokens) + 3 > 10) {
      return fail("A player may not end a turn with more than ten tokens.");
    }
    unique.forEach((gem) => {
      player.tokens[gem] += 1;
      state.supply[gem] -= 1;
    });
    state.message = `${player.name} took three gems.`;
    return {
      game: finishTurn(state, action, { colors: unique }, elapsedSeconds),
      ok: true,
      message: state.message,
    };
  }

  if (action.type === "TAKE_TWO") {
    if (state.supply[action.color] < 4) {
      return fail("Two of the same gem can only be taken when at least four are available.");
    }
    if (totalTokens(player.tokens) + 2 > 10) {
      return fail("A player may not end a turn with more than ten tokens.");
    }
    player.tokens[action.color] += 2;
    state.supply[action.color] -= 2;
    state.message = `${player.name} took two ${action.color}.`;
    return {
      game: finishTurn(state, action, { color: action.color }, elapsedSeconds),
      ok: true,
      message: state.message,
    };
  }

  if (action.type === "RESERVE_MARKET") {
    if (player.reserved.length >= 3) return fail("A player can reserve at most three cards.");
    const card = removeMarketCard(state, action.tier, action.cardId);
    if (!card) return fail("That card is no longer available.");
    if (state.supply.gold > 0 && totalTokens(player.tokens) + 1 > 10) {
      return fail("Reserve would exceed the ten-token limit.");
    }
    player.reserved.push(card);
    if (state.supply.gold > 0) {
      player.tokens.gold += 1;
      state.supply.gold -= 1;
    }
    state.message = `${player.name} reserved ${card.name}.`;
    return {
      game: finishTurn(state, action, { cardId: card.id, cardName: card.name }, elapsedSeconds),
      ok: true,
      message: state.message,
    };
  }

  if (action.type === "RESERVE_DECK") {
    if (player.reserved.length >= 3) return fail("A player can reserve at most three cards.");
    const card = state.decks[action.tier].shift();
    if (!card) return fail("That deck is empty.");
    if (state.supply.gold > 0 && totalTokens(player.tokens) + 1 > 10) {
      return fail("Reserve would exceed the ten-token limit.");
    }
    player.reserved.push(card);
    if (state.supply.gold > 0) {
      player.tokens.gold += 1;
      state.supply.gold -= 1;
    }
    state.message = `${player.name} reserved a deck card.`;
    return {
      game: finishTurn(
        state,
        action,
        { tier: action.tier, cardId: card.id, cardName: card.name, hiddenSource: true },
        elapsedSeconds,
      ),
      ok: true,
      message: state.message,
    };
  }

  if (action.type === "BUY_MARKET") {
    const card = findMarketCard(state, action.tier, action.cardId);
    if (!card) return fail("That card is no longer available.");
    if (!canPay(player, card)) return fail("This player cannot afford that card.");
    const bought = removeMarketCard(state, action.tier, action.cardId)!;
    payForCard(player, state.supply, bought);
    player.purchased.push(bought);
    player.bonuses[bought.color] += 1;
    visitNobleIfEligible(player, state.nobles);
    state.message = `${player.name} bought ${bought.name}.`;
    return {
      game: finishTurn(
        state,
        action,
        { cardId: bought.id, cardName: bought.name, points: bought.points },
        elapsedSeconds,
      ),
      ok: true,
      message: state.message,
    };
  }

  if (action.type === "BUY_RESERVED") {
    const reservedIndex = player.reserved.findIndex((card) => card.id === action.cardId);
    if (reservedIndex < 0) return fail("That reserved card is not available.");
    const card = player.reserved[reservedIndex];
    if (!canPay(player, card)) return fail("This player cannot afford that reserved card.");
    player.reserved.splice(reservedIndex, 1);
    payForCard(player, state.supply, card);
    player.purchased.push(card);
    player.bonuses[card.color] += 1;
    visitNobleIfEligible(player, state.nobles);
    state.message = `${player.name} bought reserved ${card.name}.`;
    return {
      game: finishTurn(
        state,
        action,
        { cardId: card.id, cardName: card.name, points: card.points },
        elapsedSeconds,
      ),
      ok: true,
      message: state.message,
    };
  }

  return fail("Unsupported action.");
};

export const affordableCards = (player: Player, market: Record<Tier, Card[]>) =>
  ([1, 2, 3] as Tier[]).flatMap((tier) =>
    market[tier].filter((card) => canPay(player, card)).map((card) => ({ tier, card })),
  );

export const canAffordCard = canPay;

export const tokenTotal = totalTokens;

export const costAfterBonus = (player: Player, card: Card): Tokens => {
  const needed = emptyTokens();
  for (const gem of gems) {
    needed[gem] = Math.max(0, card.cost[gem] - player.bonuses[gem]);
  }
  return needed;
};

export const exportableGame = (state: GameState) => ({
  exportedAt: new Date().toISOString(),
  players: state.players.map((player) => ({
    id: player.id,
    name: player.name,
    isBot: player.isBot,
    difficulty: player.difficulty,
    score: playerScore(player),
    turnsTaken: player.turnsTaken,
    purchasedCards: player.purchased.map((card) => card.id),
    reservedCards: player.reserved.map((card) => card.id),
    nobles: player.nobles.map((noble) => noble.id),
  })),
  actions: state.log,
  winner: state.winner,
});
