import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { gemLabels, gems } from "./game/data";
import { chooseBotAction } from "./game/bot";
import {
  applyAction,
  canAffordCard,
  createGame,
  exportableGame,
  playerScore,
  tokenTotal,
} from "./game/rules";
import type { Card, Difficulty, GameAction, GameState, Gem, Player, Tier, Token } from "./game/types";

type Screen = "landing" | "rulebook" | "single" | "multi" | "game";
type SelectedCard =
  | { source: "market"; tier: Tier; card: Card }
  | { source: "reserved"; card: Card };
type ActionMode = "take3" | "take2" | "buy" | "reserve";
type MovementCue = {
  id: string;
  playerId: string;
  tokens: Token[];
  cardColor?: Gem;
  from: MovementPoint;
  to: MovementPoint;
};
type MovementPoint = {
  x: number;
  y: number;
};
type UndoSnapshot = {
  game: GameState;
  elapsedBeforeAction: number;
};

const tiers: Tier[] = [1, 2, 3];
const tokenOrder = [...gems, "gold"] as const;
const turnKeyFor = (state: GameState) => `${state.turnNumber}-${state.activePlayerIndex}`;

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const renderRulebook = (content: string) =>
  content.split("\n").map((line, index) => {
    if (line.startsWith("# ")) return <h1 key={index}>{line.slice(2)}</h1>;
    if (line.startsWith("## ")) return <h2 key={index}>{line.slice(3)}</h2>;
    if (line.startsWith("- ")) return <li key={index}>{line.slice(2)}</li>;
    if (!line.trim()) return <br key={index} />;
    return <p key={index}>{line}</p>;
  });

const cueId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const centerOf = (element: HTMLElement | null, fallback: MovementPoint): MovementPoint => {
  if (!element) return fallback;
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
};

const movementCueFor = (
  state: GameState,
  action: GameAction,
  from: MovementPoint,
  to: MovementPoint,
): MovementCue => {
  const player = state.players[state.activePlayerIndex];
  const base = { id: cueId(), playerId: player.id, tokens: [] as Token[], from, to };

  if (action.type === "TAKE_THREE") {
    return { ...base, tokens: action.colors };
  }

  if (action.type === "TAKE_TWO") {
    return { ...base, tokens: [action.color, action.color] };
  }

  if (action.type === "RESERVE_MARKET" || action.type === "RESERVE_DECK") {
    return { ...base, tokens: state.supply.gold > 0 ? ["gold"] : [] };
  }

  if (action.type === "BUY_MARKET") {
    const card = state.market[action.tier].find((candidate) => candidate.id === action.cardId);
    return { ...base, cardColor: card?.color };
  }

  const card = player.reserved.find((candidate) => candidate.id === action.cardId);
  return { ...base, cardColor: card?.color };
};

const Cost = ({ card }: { card: Card }) => {
  const cost = card.cost;
  return (
    <div className="cost-row">
      {gems.map((gem) =>
        cost[gem] > 0 ? (
          <span className="cost-token" key={gem} title={`${gemLabels[gem]} ${cost[gem]}`}>
            <span className={`cost-coin cost-${gem}`} />
            <span className="cost-count">{cost[gem]}</span>
          </span>
        ) : null,
      )}
      {gems.every((gem) => cost[gem] === 0) && <span className="free">Free</span>}
    </div>
  );
};

const HoldingMatrix = ({ cue, player }: { cue?: MovementCue; player: Player }) => (
  <div className="holding-matrix" title="Token and card holdings">
    <div className="discount-strip" title="Owned card discounts">
      <span className="discount-spacer" aria-hidden="true" />
      {gems.map((gem) => (
        <span className={`holding-token faded token-${gem}`} key={gem} title={`${gemLabels[gem]} coins plus cards`}>
          {player.tokens[gem] + player.bonuses[gem]}
        </span>
      ))}
      <span className="discount-gold-spacer" aria-hidden="true" />
    </div>
    <div className="holdings-board">
      <div className="holding-label">Coins ({tokenTotal(player.tokens)})</div>
      <div className="holding-token-row">
        {tokenOrder.map((token) => {
          const tokenReceiving = cue?.playerId === player.id && cue.tokens.includes(token);
          return (
            <span
              className={`holding-token stacked-coin token-${token}${tokenReceiving ? " receiving" : ""}`}
              key={token}
              title={`${titleCase(token)} tokens`}
            >
              {player.tokens[token]}
            </span>
          );
        })}
      </div>
      <div className="holding-label">Cards ({player.purchased.length})</div>
      <div className="holding-card-row">
        {gems.map((gem) => {
          const cardReceiving = cue?.playerId === player.id && cue.cardColor === gem;
          return (
            <span
              className={`holding-card stacked-card card-${gem}${cardReceiving ? " receiving" : ""}`}
              key={gem}
              title={`${gemLabels[gem]} cards`}
            >
              {player.bonuses[gem]}
            </span>
          );
        })}
        <span className="holding-card-placeholder" aria-hidden="true" />
      </div>
    </div>
  </div>
);

const movementStyle = (cue: MovementCue, index = 0): CSSProperties =>
  ({
    "--from-x": `${cue.from.x + index * 8}px`,
    "--from-y": `${cue.from.y + index * 6}px`,
    "--to-x": `${cue.to.x}px`,
    "--to-y": `${cue.to.y}px`,
    animationDelay: `${index * 45}ms`,
  }) as CSSProperties;

const MovementOverlay = ({ cue }: { cue?: MovementCue }) => {
  if (!cue || (cue.tokens.length === 0 && !cue.cardColor)) return null;
  return (
    <div className="movement-overlay screen-movement" aria-hidden="true">
      {cue.tokens.map((token, index) => (
        <span
          className={`moving-token token-${token}`}
          key={`${cue.id}-${token}-${index}`}
          style={movementStyle(cue, index)}
        />
      ))}
      {cue.cardColor && <span className={`moving-card card-${cue.cardColor}`} style={movementStyle(cue)} />}
    </div>
  );
};

function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState(["Player 1", "Player 2", "Player 3", "Player 4"]);
  const [game, setGame] = useState<GameState | null>(null);
  const [actionMode, setActionMode] = useState<ActionMode>("take3");
  const [selectedTokens, setSelectedTokens] = useState<Gem[]>([]);
  const [selectedTwoToken, setSelectedTwoToken] = useState<Gem | null>(null);
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<Tier | null>(null);
  const [returnedTokens, setReturnedTokens] = useState<Token[]>([]);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);
  const [movementCue, setMovementCue] = useState<MovementCue | undefined>();
  const [undoStack, setUndoStack] = useState<UndoSnapshot[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [rulebook, setRulebook] = useState("Loading rulebook...");
  const actionPanelRef = useRef<HTMLElement | null>(null);
  const tableAreaRef = useRef<HTMLElement | null>(null);
  const playerHoldingsRef = useRef<HTMLElement | null>(null);
  const lastTurnKeyRef = useRef<string | undefined>(undefined);
  const elapsedRef = useRef(0);

  const activePlayer = game?.players[game.activePlayerIndex];
  const humanTurn = Boolean(activePlayer && !activePlayer.isBot && !game?.winner);
  const selectedPlayer = game?.players[selectedPlayerIndex] ?? activePlayer;

  const resetActionSelection = () => {
    setSelectedTokens([]);
    setSelectedTwoToken(null);
    setSelectedCard(null);
    setSelectedDeck(null);
    setReturnedTokens([]);
  };

  const changeActionMode = (mode: ActionMode) => {
    setActionMode(mode);
    resetActionSelection();
  };

  const showMovementCue = (beforeAction: GameState, action: GameAction, nextActivePlayerIndex: number) => {
    const actingPlayerIndex = beforeAction.activePlayerIndex;
    const fallbackFrom = { x: window.innerWidth * 0.52, y: window.innerHeight * 0.48 };
    const fallbackTo = { x: window.innerWidth - 130, y: window.innerHeight * 0.42 };
    const sourceElement =
      action.type === "TAKE_THREE" || action.type === "TAKE_TWO"
        ? actionPanelRef.current
        : tableAreaRef.current;
    const cue = movementCueFor(
      beforeAction,
      action,
      centerOf(sourceElement, fallbackFrom),
      centerOf(playerHoldingsRef.current, fallbackTo),
    );
    setSelectedPlayerIndex(actingPlayerIndex);
    setMovementCue(cue);
    window.setTimeout(() => {
      setMovementCue((current) => (current?.id === cue.id ? undefined : current));
      setSelectedPlayerIndex(nextActivePlayerIndex);
    }, 520);
  };

  useEffect(() => {
    if (!game || game.winner) return;
    const turnKey = turnKeyFor(game);
    if (lastTurnKeyRef.current !== turnKey) {
      lastTurnKeyRef.current = turnKey;
      setElapsed(0);
      setIsTimerPaused(false);
    }
  }, [game?.turnNumber, game?.activePlayerIndex, game?.winner]);

  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  useEffect(() => {
    if (!game || game.winner || isTimerPaused) return;
    const interval = window.setInterval(() => {
      setElapsed((current) => current + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [game?.turnNumber, game?.activePlayerIndex, game?.winner, isTimerPaused]);

  useEffect(() => {
    if (!game || movementCue) return;
    setSelectedPlayerIndex(game.activePlayerIndex);
  }, [game?.activePlayerIndex, game?.turnNumber, movementCue]);

  useEffect(() => {
    if (!game || !activePlayer?.isBot || game.winner || isTimerPaused) return;
    const timeout = window.setTimeout(() => {
      const action = chooseBotAction(game);
      if (!action) {
        setGame({ ...game, message: `${activePlayer.name} has no legal action available.` });
        return;
      }
      const actionElapsed = Math.max(1, elapsedRef.current);
      const result = applyAction(game, action, actionElapsed);
      setGame(result.game);
      if (result.ok) {
        setUndoStack((current) => [...current, { game, elapsedBeforeAction: actionElapsed }]);
        showMovementCue(game, action, result.game.activePlayerIndex);
      }
    }, 900);
    return () => window.clearTimeout(timeout);
  }, [game?.turnNumber, activePlayer?.id, game?.winner, isTimerPaused]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}rulebook.md`)
      .then((response) => response.text())
      .then(setRulebook)
      .catch(() => setRulebook("Rulebook could not be loaded."));
  }, []);

  const startSingle = () => {
    const nextGame = createGame([
      { name: "Player", isBot: false },
      { name: `${titleCase(difficulty)} Bot`, isBot: true, difficulty },
    ]);
    lastTurnKeyRef.current = turnKeyFor(nextGame);
    setGame(nextGame);
    setSelectedTokens([]);
    setSelectedTwoToken(null);
    setSelectedCard(null);
    setSelectedDeck(null);
    setActionMode("take3");
    setSelectedPlayerIndex(0);
    setUndoStack([]);
    setElapsed(0);
    setIsTimerPaused(false);
    setScreen("game");
  };

  const startMulti = () => {
    const players = names.slice(0, playerCount).map((name, index) => ({
      name: name.trim() || `Player ${index + 1}`,
      isBot: false,
    }));
    const nextGame = createGame(players);
    lastTurnKeyRef.current = turnKeyFor(nextGame);
    setGame(nextGame);
    setSelectedTokens([]);
    setSelectedTwoToken(null);
    setSelectedCard(null);
    setSelectedDeck(null);
    setActionMode("take3");
    setSelectedPlayerIndex(0);
    setUndoStack([]);
    setElapsed(0);
    setIsTimerPaused(false);
    setScreen("game");
  };

  const perform = (action: GameAction) => {
    if (!game || !humanTurn) return;
    const actionElapsed = elapsed;
    const result = applyAction(game, action, actionElapsed);
    setGame(result.game);
    if (result.ok) {
      setUndoStack((current) => [...current, { game, elapsedBeforeAction: actionElapsed }]);
      resetActionSelection();
      showMovementCue(game, action, result.game.activePlayerIndex);
    }
  };

  const undoLastAction = () => {
    if (undoStack.length === 0) return;
    const snapshot = undoStack[undoStack.length - 1];
    const restored = structuredClone(snapshot.game);
    restored.message = "Last action undone.";
    const restoredElapsed = snapshot.elapsedBeforeAction + elapsed;
    lastTurnKeyRef.current = turnKeyFor(restored);
    setUndoStack((current) => current.slice(0, -1));
    setGame(restored);
    resetActionSelection();
    setMovementCue(undefined);
    setSelectedPlayerIndex(restored.activePlayerIndex);
    setElapsed(restoredElapsed);
  };

  const downloadLog = () => {
    if (!game) return;
    const blob = new Blob([JSON.stringify(exportableGame(game), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `splendor-actions-${new Date().toISOString().slice(0, 19).replaceAll(":", "-")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const projectedTokens = useMemo(() => {
    if (!activePlayer) return undefined;
    const next = { ...activePlayer.tokens };

    if (actionMode === "take3") {
      selectedTokens.forEach((gem) => {
        next[gem] += 1;
      });
    }

    if (actionMode === "take2" && selectedTwoToken) {
      next[selectedTwoToken] += 2;
    }

    if (actionMode === "reserve" && (selectedCard?.source === "market" || selectedDeck) && game?.supply.gold) {
      next.gold += 1;
    }

    return next;
  }, [actionMode, activePlayer, game?.supply.gold, selectedCard, selectedDeck, selectedTokens, selectedTwoToken]);

  const returnedTokenCounts = useMemo(
    () =>
      returnedTokens.reduce(
        (counts, token) => {
          counts[token] += 1;
          return counts;
        },
        {
          diamond: 0,
          sapphire: 0,
          emerald: 0,
          ruby: 0,
          onyx: 0,
          gold: 0,
        } as Record<Token, number>,
      ),
    [returnedTokens],
  );

  const requiredReturns = projectedTokens ? Math.max(0, tokenTotal(projectedTokens) - 10) : 0;
  const returnsValid = projectedTokens
    ? tokenOrder.every((token) => returnedTokenCounts[token] <= projectedTokens[token])
    : returnedTokens.length === 0;
  const returnsComplete = requiredReturns === returnedTokens.length && returnsValid;
  const selectedReturnTokens = returnedTokens.length > 0 ? returnedTokens : undefined;

  useEffect(() => {
    if (returnedTokens.length === 0) return;
    if (requiredReturns === 0) {
      setReturnedTokens([]);
      return;
    }
    if (returnedTokens.length > requiredReturns) {
      setReturnedTokens((current) => current.slice(0, requiredReturns));
    }
  }, [requiredReturns, returnedTokens.length]);

  const toggleReturnedToken = (token: Token) => {
    const existingIndex = returnedTokens.indexOf(token);
    if (existingIndex >= 0) {
      setReturnedTokens((current) => current.filter((_, index) => index !== existingIndex));
      return;
    }
    if (!projectedTokens || returnedTokens.length >= requiredReturns) return;
    if (returnedTokenCounts[token] >= projectedTokens[token]) return;
    setReturnedTokens((current) => [...current, token]);
  };

  const pendingAction = useMemo<GameAction | undefined>(() => {
    if (!returnsComplete) return undefined;
    if (actionMode === "take3" && selectedTokens.length > 0 && selectedTokens.length <= 3) {
      return { type: "TAKE_THREE", colors: selectedTokens, returnedTokens: selectedReturnTokens };
    }
    if (actionMode === "take2" && selectedTwoToken) {
      return { type: "TAKE_TWO", color: selectedTwoToken, returnedTokens: selectedReturnTokens };
    }
    if (actionMode === "buy" && selectedCard) {
      return selectedCard.source === "market"
        ? { type: "BUY_MARKET", tier: selectedCard.tier, cardId: selectedCard.card.id }
        : { type: "BUY_RESERVED", cardId: selectedCard.card.id };
    }
    if (actionMode === "reserve") {
      if (selectedCard?.source === "market") {
        return {
          type: "RESERVE_MARKET",
          tier: selectedCard.tier,
          cardId: selectedCard.card.id,
          returnedTokens: selectedReturnTokens,
        };
      }
      if (selectedDeck) return { type: "RESERVE_DECK", tier: selectedDeck, returnedTokens: selectedReturnTokens };
    }
    return undefined;
  }, [
    actionMode,
    returnsComplete,
    selectedCard,
    selectedDeck,
    selectedReturnTokens,
    selectedTokens,
    selectedTwoToken,
  ]);

  const actionHint = useMemo(() => {
    if (!humanTurn) {
      return activePlayer?.isBot ? `${activePlayer.name} is thinking...` : "Game is complete.";
    }
    if (requiredReturns > 0 && !returnsValid) {
      return "Adjust returned tokens to match your projected holdings.";
    }
    if (requiredReturns > 0 && !returnsComplete) {
      return `Return ${requiredReturns - returnedTokens.length} token${
        requiredReturns - returnedTokens.length === 1 ? "" : "s"
      } before confirming.`;
    }
    if (actionMode === "take3") {
      return selectedTokens.length === 0
        ? "Select 1 to 3 different gem colors."
        : `Ready to take ${selectedTokens.length} gem${selectedTokens.length === 1 ? "" : "s"}.`;
    }
    if (actionMode === "take2") {
      return selectedTwoToken ? `Ready to take 2 ${gemLabels[selectedTwoToken]}.` : "Select one color with at least 4 gems in supply.";
    }
    if (actionMode === "buy") {
      return selectedCard ? "Review the selected card, then confirm buy." : "Select an affordable card from the table or your reserved cards.";
    }
    if (selectedDeck) return `Ready to reserve a level ${selectedDeck} deck card.`;
    return selectedCard ? "Review the selected card, then confirm reserve." : "Select a visible card or deck tile to reserve.";
  }, [
    actionMode,
    activePlayer,
    humanTurn,
    requiredReturns,
    returnedTokens.length,
    returnsComplete,
    returnsValid,
    selectedCard,
    selectedDeck,
    selectedTokens.length,
    selectedTwoToken,
  ]);

  const primaryLabel = (() => {
    if (actionMode === "take3") {
      const count = selectedTokens.length || 3;
      return `Take ${count} gem${count === 1 ? "" : "s"}`;
    }
    if (actionMode === "take2") return selectedTwoToken ? `Take 2 ${gemLabels[selectedTwoToken]}` : "Take 2 gems";
    if (actionMode === "buy") return "Buy selected card";
    if (selectedDeck) return `Reserve level ${selectedDeck} deck`;
    return "Reserve selected card";
  })();

  const actionModeName = (() => {
    if (actionMode === "take3") return "Take 3";
    if (actionMode === "take2") return "Take 2 same";
    if (actionMode === "buy") return "Buy";
    return "Reserve";
  })();

  if (screen === "rulebook") {
    return (
      <main className="page rulebook-page">
        <button className="ghost-button" onClick={() => setScreen("landing")}>
          Back
        </button>
        <article className="rulebook-panel">{renderRulebook(rulebook)}</article>
      </main>
    );
  }

  if (screen === "single") {
    return (
      <main className="page setup-page">
        <section className="setup-panel">
          <button className="ghost-button" onClick={() => setScreen("landing")}>
            Back
          </button>
          <h1>Single Player</h1>
          <p>Choose the opponent difficulty for a 1 v 1 Player vs Bot game.</p>
          <div className="segmented">
            {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
              <button
                className={difficulty === level ? "active" : ""}
                key={level}
                onClick={() => setDifficulty(level)}
              >
                {titleCase(level)}
              </button>
            ))}
          </div>
          <button className="primary-button" onClick={startSingle}>
            Start Game
          </button>
        </section>
      </main>
    );
  }

  if (screen === "multi") {
    return (
      <main className="page setup-page">
        <section className="setup-panel">
          <button className="ghost-button" onClick={() => setScreen("landing")}>
            Back
          </button>
          <h1>Multiplayer</h1>
          <label className="field">
            Players
            <select
              value={playerCount}
              onChange={(event) => setPlayerCount(Number(event.target.value))}
            >
              {[2, 3, 4].map((count) => (
                <option value={count} key={count}>
                  {count}
                </option>
              ))}
            </select>
          </label>
          <div className="name-grid">
            {Array.from({ length: playerCount }, (_, index) => (
              <label className="field" key={index}>
                Player {index + 1}
                <input
                  value={names[index]}
                  onChange={(event) => {
                    const next = [...names];
                    next[index] = event.target.value;
                    setNames(next);
                  }}
                />
              </label>
            ))}
          </div>
          <button className="primary-button" onClick={startMulti}>
            Start Game
          </button>
        </section>
      </main>
    );
  }

  if (screen === "game" && game && activePlayer) {
    return (
      <main className="game-shell">
        <header className="game-topbar">
          <div className="turn-status">
            <strong>{game.winner ? "Game Complete" : `Turn ${game.round}.${game.activePlayerIndex + 1}`}</strong>
            <span>{game.winner ? "winner decided" : activePlayer.isBot ? `${activePlayer.name} move` : "your move"}</span>
          </div>
          <div className="top-nobles">
            <span>nobles</span>
            {game.nobles.map((noble) => (
              <span className="noble-pill" key={noble.id}>
                <strong>{noble.name}</strong>
                <span>{noble.points}</span>
                <Cost card={{ ...noble, tier: 1, color: "diamond" }} />
              </span>
            ))}
          </div>
          <div className="top-actions">
            <button className="ghost-button" onClick={() => setScreen("landing")}>
              New Game
            </button>
            <button className="ghost-button" onClick={downloadLog}>
              Download JSON
            </button>
            <button className="ghost-button" onClick={() => setIsTimerPaused((current) => !current)}>
              {isTimerPaused ? "Resume" : "Pause"}
            </button>
            <button className="ghost-button" disabled={undoStack.length === 0} onClick={undoLastAction}>
              Undo
            </button>
            <strong className="timer-readout">{elapsed}s</strong>
          </div>
        </header>

        {game.winner && <section className="winner-banner">{game.winner.message}</section>}
        <section className="message-line">{game.message}</section>

        <section className="board-layout">
          <aside className="panel action-panel" ref={actionPanelRef}>
            <div className={game.winner ? "turn-command complete-turn" : activePlayer.isBot ? "turn-command bot-turn" : "turn-command"}>
              <div>
                <span>{game.winner ? "Game complete" : activePlayer.isBot ? "Bot turn" : "Your turn"}</span>
                <strong>{game.winner ? "Final score" : activePlayer.name}</strong>
              </div>
              <div className="turn-command-meta">
                <span>{game.winner ? "Ended" : `Turn ${game.round}.${game.activePlayerIndex + 1}`}</span>
                <strong>{elapsed}s</strong>
              </div>
            </div>

            {game.winner ? (
              <section className="action-block game-complete">
                <strong>{game.winner.message}</strong>
                <p>The final round is complete.</p>
              </section>
            ) : activePlayer.isBot ? (
              <section className="action-block bot-thinking">
                <div className="thinking-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <strong>{activePlayer.name} is choosing an action.</strong>
                <p>The board will update after the bot completes its move.</p>
              </section>
            ) : (
              <>
                <div className="action-mode-grid guided">
                  {[
                    ["take3", "Take 3"],
                    ["take2", "Take 2"],
                    ["buy", "Buy"],
                    ["reserve", "Reserve"],
                  ].map(([mode, label]) => (
                    <button
                      className={actionMode === mode ? "mode-button active" : "mode-button"}
                      key={mode}
                      onClick={() => changeActionMode(mode as ActionMode)}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <section className="action-block guided-step">
                  <div className="step-heading">
                    <span>{actionModeName}</span>
                    <strong>{actionHint}</strong>
                  </div>

                  {actionMode === "take3" && (
                    <>
                      <div className="take-grid">
                        {gems.map((gem) => (
                          <button
                            className={selectedTokens.includes(gem) ? `gem-button selected ${gem}` : `gem-button ${gem}`}
                            disabled={!humanTurn || game.supply[gem] <= 0}
                            title={gemLabels[gem]}
                            key={gem}
                            onClick={() =>
                              setSelectedTokens((current) =>
                                current.includes(gem)
                                  ? current.filter((item) => item !== gem)
                                  : current.length < 3
                                    ? [...current, gem]
                                    : current,
                              )
                            }
                          >
                            <span className={`coin token-${gem}`} />
                            <strong>{game.supply[gem]}</strong>
                          </button>
                        ))}
                      </div>
                      <div className="selection-preview">
                        {selectedTokens.length === 0 && <span>No gems selected</span>}
                        {selectedTokens.map((gem) => (
                          <span className={`coin token-${gem}`} key={gem} title={gemLabels[gem]} />
                        ))}
                      </div>
                    </>
                  )}

                  {actionMode === "take2" && (
                    <div className="two-grid guided-two">
                      {gems.map((gem) => (
                        <button
                          className={selectedTwoToken === gem ? "two-token-button selected" : "two-token-button"}
                          disabled={!humanTurn || game.supply[gem] < 4}
                          title={
                            game.supply[gem] >= 4
                              ? `Take two ${gemLabels[gem]}`
                              : `${gemLabels[gem]} needs at least 4 in supply`
                          }
                          key={gem}
                          onClick={() => setSelectedTwoToken(gem)}
                        >
                          <span className={`coin token-${gem}`} />
                          <span className={`coin token-${gem}`} />
                          <strong>{game.supply[gem]}</strong>
                        </button>
                      ))}
                    </div>
                  )}

                  {(actionMode === "buy" || actionMode === "reserve") && (
                    <div className="selection-card-area">
                      {selectedDeck && (
                        <div className="selection-summary">
                          <strong>Level {selectedDeck} deck</strong>
                          <span>Top card will be reserved hidden.</span>
                        </div>
                      )}
                      {selectedCard ? (
                        <div className={`selected-card-preview ${selectedCard.card.color}`}>
                          <div>
                            <strong>{selectedCard.card.points}</strong>
                            <span>{selectedCard.source === "market" ? `Level ${selectedCard.tier}` : "Reserved"}</span>
                          </div>
                          <Cost card={selectedCard.card} />
                        </div>
                      ) : !selectedDeck ? (
                        <p>{actionMode === "buy" ? "Select a card to buy." : "Select a card or deck tile to reserve."}</p>
                      ) : null}
                    </div>
                  )}
                </section>

                {requiredReturns > 0 && projectedTokens && (
                  <section className="action-block return-block">
                    <div className="step-heading">
                      <span>Return tokens</span>
                      <strong>
                        Choose {requiredReturns} token{requiredReturns === 1 ? "" : "s"} to return.
                      </strong>
                    </div>
                    <div className="return-token-grid">
                      {tokenOrder.map((token) => {
                        const selectedCount = returnedTokenCounts[token];
                        const availableCount = projectedTokens[token];
                        return (
                          <button
                            className={selectedCount > 0 ? "return-token selected" : "return-token"}
                            disabled={
                              (availableCount === 0 && selectedCount === 0) ||
                              (returnedTokens.length >= requiredReturns && selectedCount === 0)
                            }
                            key={token}
                            onClick={() => toggleReturnedToken(token)}
                            title={`Return ${titleCase(token)} token`}
                            type="button"
                          >
                            <span className={`coin token-${token}`} />
                            <strong>{selectedCount > 0 ? selectedCount : availableCount}</strong>
                          </button>
                        );
                      })}
                    </div>
                    <small>
                      Selected {returnedTokens.length}/{requiredReturns}
                    </small>
                  </section>
                )}

                <section className="action-footer">
                  <button
                    className="primary-button compact-command"
                    disabled={!pendingAction}
                    onClick={() => pendingAction && perform(pendingAction)}
                  >
                    {primaryLabel}
                  </button>
                  <button className="ghost-button compact-clear" onClick={resetActionSelection}>
                    Clear
                  </button>
                  <small>{pendingAction ? "Ready to confirm." : actionHint}</small>
                </section>
              </>
            )}

            <h2>Reserved</h2>
            {activePlayer.reserved.length === 0 && <p>No reserved cards.</p>}
            {activePlayer.reserved.map((card) => {
              const canBuy = canAffordCard(activePlayer, card);
              return (
                <CardView
                  card={card}
                  compact
                  disabled={!humanTurn || actionMode !== "buy" || !canBuy}
                  selected={selectedCard?.source === "reserved" && selectedCard.card.id === card.id}
                  selectable={humanTurn && actionMode === "buy" && canBuy}
                  key={card.id}
                  onSelect={() => {
                    if (actionMode === "buy" && canBuy) {
                      setSelectedDeck(null);
                      setSelectedCard({ source: "reserved", card });
                    }
                  }}
                />
              );
            })}

            <details className="recent-actions">
              <summary>Recent Actions</summary>
              <div className="action-log">
                {game.log.slice(-6).reverse().map((record) => (
                  <article key={record.id}>
                    <strong>{record.playerName}</strong>
                    <span>{record.actionType.replaceAll("_", " ")}</span>
                    <small>{record.elapsedSeconds}s</small>
                  </article>
                ))}
                {game.log.length === 0 && <p>No actions yet.</p>}
              </div>
            </details>
          </aside>

          <section className="table-area" ref={tableAreaRef}>
            <div className="market">
              {tiers.map((tier) => (
                <section className="tier" key={tier}>
                  <div className="tier-header">
                    <h2>Level {tier}</h2>
                    <span>{game.decks[tier].length} left</span>
                  </div>
                  <div className="card-grid">
                    <DeckTile
                      count={game.decks[tier].length}
                      disabled={
                        !humanTurn ||
                        actionMode !== "reserve" ||
                        activePlayer.reserved.length >= 3 ||
                        game.decks[tier].length === 0
                      }
                      selected={selectedDeck === tier}
                      selectable={
                        humanTurn &&
                        actionMode === "reserve" &&
                        activePlayer.reserved.length < 3 &&
                        game.decks[tier].length > 0
                      }
                      onReserve={() => {
                        if (actionMode === "reserve") {
                          setSelectedCard(null);
                          setSelectedDeck(tier);
                        }
                      }}
                      tier={tier}
                    />
                    {game.market[tier].map((card) => {
                      const buyable = canAffordCard(activePlayer, card);
                      const canSelectForBuy = humanTurn && actionMode === "buy" && buyable;
                      const canSelectForReserve =
                        humanTurn && actionMode === "reserve" && activePlayer.reserved.length < 3;
                      return (
                        <CardView
                          card={card}
                          disabled={!canSelectForBuy && !canSelectForReserve}
                          selected={selectedCard?.source === "market" && selectedCard.card.id === card.id}
                          selectable={canSelectForBuy || canSelectForReserve}
                          unavailable={humanTurn && actionMode === "buy" && !buyable}
                          key={card.id}
                          onSelect={() => {
                            if (canSelectForBuy || canSelectForReserve) {
                              setSelectedDeck(null);
                              setSelectedCard({ source: "market", tier, card });
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <aside className="panel player-panel">
            <div className="player-tabs">
              {game.players.map((player, index) => (
                <button
                  className={[
                    "player-tab",
                    index === selectedPlayerIndex ? "active" : "",
                    index === game.activePlayerIndex ? "current-turn" : "",
                  ].filter(Boolean).join(" ")}
                  key={player.id}
                  onClick={() => setSelectedPlayerIndex(index)}
                  type="button"
                >
                  <span className="player-tab-name">{player.name}</span>
                  <span className="player-tab-stats">
                    <span className="tab-token-total" title="Total tokens">
                      {tokenTotal(player.tokens)}
                    </span>
                    <span className="tab-card-total" title="Total purchased cards">
                      {player.purchased.length}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            {selectedPlayer && (
              <article
                className={selectedPlayer.id === activePlayer.id ? "player active" : "player"}
                key={selectedPlayer.id}
                ref={playerHoldingsRef}
              >
                <div className="player-heading">
                  <strong>{selectedPlayer.name}</strong>
                  <span><strong>{playerScore(selectedPlayer)}</strong> prestige</span>
                </div>
                <h3>Holdings</h3>
                <HoldingMatrix
                  cue={movementCue?.playerId === selectedPlayer.id ? movementCue : undefined}
                  player={selectedPlayer}
                />
                <small>
                  Cards {selectedPlayer.purchased.length} | Reserved {selectedPlayer.reserved.length} | Turns{" "}
                  {selectedPlayer.turnsTaken}
                </small>
              </article>
            )}
          </aside>
        </section>
        <MovementOverlay cue={movementCue} />
      </main>
    );
  }

  return (
    <main className="landing">
      <img className="hero-image" src={`${import.meta.env.BASE_URL}hero-splendor.webp`} alt="" />
      <section className="landing-content">
        <p className="eyebrow">A browser board game v1</p>
        <h1>Welcome to Splendor</h1>
        <p>
          If you are a new player, see the{" "}
          <button className="text-button" onClick={() => setScreen("rulebook")}>
            rulebook
          </button>
          .
        </p>
        <div className="landing-actions">
          <button className="primary-button" onClick={() => setScreen("single")}>
            Single Player
          </button>
          <button className="secondary-button" onClick={() => setScreen("multi")}>
            Multiplayer
          </button>
        </div>
      </section>
    </main>
  );
}

function CardView({
  card,
  compact = false,
  disabled = false,
  selected = false,
  selectable = false,
  unavailable = false,
  onSelect,
}: {
  card: Card;
  compact?: boolean;
  disabled?: boolean;
  selected?: boolean;
  selectable?: boolean;
  unavailable?: boolean;
  onSelect: () => void;
}) {
  const classes = [
    "game-card",
    compact ? "compact" : "",
    card.color,
    selected ? "selected-card" : "",
    selectable ? "selectable-card" : "",
    unavailable ? "unavailable-card" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={onSelect}
      title={`${card.points} prestige ${gemLabels[card.color]} card`}
    >
      <div className="card-top">
        <strong>{card.points}</strong>
        <span className={`card-icon card-${card.color}`} />
      </div>
      <Cost card={card} />
    </button>
  );
}

function DeckTile({
  count,
  disabled,
  onReserve,
  selectable = false,
  selected = false,
  tier,
}: {
  count: number;
  disabled: boolean;
  onReserve: () => void;
  selectable?: boolean;
  selected?: boolean;
  tier: Tier;
}) {
  return (
    <button
      className={[
        "deck-tile",
        `tier-${tier}`,
        selectable ? "selectable-card" : "",
        selected ? "selected-card" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      onClick={onReserve}
      title={`Reserve a level ${tier} deck card`}
    >
      <strong>{count}</strong>
      <span>deck</span>
    </button>
  );
}

export default App;
