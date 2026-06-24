export type Gem = "diamond" | "sapphire" | "emerald" | "ruby" | "onyx";
export type Token = Gem | "gold";
export type Difficulty = "easy" | "medium" | "hard";
export type Tier = 1 | 2 | 3;

export type Cost = Record<Gem, number>;
export type Tokens = Record<Token, number>;

export interface Card {
  id: string;
  tier: Tier;
  color: Gem;
  points: number;
  cost: Cost;
  name: string;
}

export interface Noble {
  id: string;
  name: string;
  points: number;
  cost: Cost;
}

export interface Player {
  id: string;
  name: string;
  isBot: boolean;
  difficulty?: Difficulty;
  tokens: Tokens;
  bonuses: Cost;
  reserved: Card[];
  purchased: Card[];
  nobles: Noble[];
  turnsTaken: number;
}

export interface ActionRecord {
  id: string;
  turnNumber: number;
  round: number;
  playerId: string;
  playerName: string;
  actionType: GameAction["type"];
  details: Record<string, unknown>;
  elapsedSeconds: number;
  timestamp: string;
}

export interface GameState {
  players: Player[];
  activePlayerIndex: number;
  turnNumber: number;
  round: number;
  supply: Tokens;
  decks: Record<Tier, Card[]>;
  market: Record<Tier, Card[]>;
  nobles: Noble[];
  log: ActionRecord[];
  turnStartedAt: number;
  message: string;
  finalRoundTargetTurns?: number;
  winner?: {
    playerIds: string[];
    message: string;
  };
}

export type GameAction =
  | { type: "TAKE_THREE"; colors: Gem[]; returnedTokens?: Token[] }
  | { type: "TAKE_TWO"; color: Gem; returnedTokens?: Token[] }
  | { type: "RESERVE_MARKET"; tier: Tier; cardId: string; returnedTokens?: Token[] }
  | { type: "RESERVE_DECK"; tier: Tier; returnedTokens?: Token[] }
  | { type: "BUY_MARKET"; tier: Tier; cardId: string }
  | { type: "BUY_RESERVED"; cardId: string };

export interface SetupPlayer {
  name: string;
  isBot?: boolean;
  difficulty?: Difficulty;
}
