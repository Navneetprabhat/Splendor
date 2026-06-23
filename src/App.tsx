import { useEffect, useMemo, useState } from "react";
import { gemLabels, gems } from "./game/data";
import { chooseBotAction } from "./game/bot";
import {
  applyAction,
  costAfterBonus,
  createGame,
  exportableGame,
  playerScore,
} from "./game/rules";
import type { Card, Difficulty, GameAction, GameState, Gem, Player, Tier } from "./game/types";

type Screen = "landing" | "rulebook" | "single" | "multi" | "game";
type SelectedCard =
  | { source: "market"; tier: Tier; card: Card }
  | { source: "reserved"; card: Card };

const tiers: Tier[] = [1, 2, 3];
const tokenOrder = [...gems, "gold"] as const;

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const renderRulebook = (content: string) =>
  content.split("\n").map((line, index) => {
    if (line.startsWith("# ")) return <h1 key={index}>{line.slice(2)}</h1>;
    if (line.startsWith("## ")) return <h2 key={index}>{line.slice(3)}</h2>;
    if (line.startsWith("- ")) return <li key={index}>{line.slice(2)}</li>;
    if (!line.trim()) return <br key={index} />;
    return <p key={index}>{line}</p>;
  });

const TokenRow = ({ tokens, compact = false }: { tokens: Record<string, number>; compact?: boolean }) => (
  <div className="token-row">
    {tokenOrder.map((token) => (
      <span className={compact ? "token-stack compact" : "token-stack"} key={token} title={titleCase(token)}>
        <span className={`coin token-${token}`} />
        <strong>{tokens[token] ?? 0}</strong>
      </span>
    ))}
  </div>
);

const Cost = ({ card, player }: { card: Card; player?: Player }) => {
  const cost = player ? costAfterBonus(player, card) : card.cost;
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

const BonusRow = ({ player }: { player: Player }) => (
  <div className="bonus-row" title="Purchased card bonuses">
    {gems.map((gem) => (
      <span className="bonus-stack" key={gem} title={`${gemLabels[gem]} cards`}>
        <span className={`card-icon card-${gem}`} />
        <strong>{player.bonuses[gem]}</strong>
      </span>
    ))}
  </div>
);

function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState(["Player 1", "Player 2", "Player 3", "Player 4"]);
  const [game, setGame] = useState<GameState | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<Gem[]>([]);
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [rulebook, setRulebook] = useState("Loading rulebook...");

  const activePlayer = game?.players[game.activePlayerIndex];
  const humanTurn = Boolean(activePlayer && !activePlayer.isBot && !game?.winner);

  useEffect(() => {
    if (!game || game.winner) return;
    setElapsed(0);
    const interval = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - game.turnStartedAt) / 1000));
    }, 500);
    return () => window.clearInterval(interval);
  }, [game?.turnNumber, game?.turnStartedAt, game?.winner]);

  useEffect(() => {
    if (!game || !activePlayer?.isBot || game.winner) return;
    const timeout = window.setTimeout(() => {
      const action = chooseBotAction(game);
      if (!action) {
        setGame({ ...game, message: `${activePlayer.name} has no legal action available.` });
        return;
      }
      const result = applyAction(game, action, Math.max(1, elapsed));
      setGame(result.game);
    }, 900);
    return () => window.clearTimeout(timeout);
  }, [game, activePlayer, elapsed]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}rulebook.md`)
      .then((response) => response.text())
      .then(setRulebook)
      .catch(() => setRulebook("Rulebook could not be loaded."));
  }, []);

  const startSingle = () => {
    setGame(
      createGame([
        { name: "Player", isBot: false },
        { name: `${titleCase(difficulty)} Bot`, isBot: true, difficulty },
      ]),
    );
    setSelectedTokens([]);
    setSelectedCard(null);
    setScreen("game");
  };

  const startMulti = () => {
    const players = names.slice(0, playerCount).map((name, index) => ({
      name: name.trim() || `Player ${index + 1}`,
      isBot: false,
    }));
    setGame(createGame(players));
    setSelectedTokens([]);
    setSelectedCard(null);
    setScreen("game");
  };

  const perform = (action: GameAction) => {
    if (!game || !humanTurn) return;
    const result = applyAction(game, action, elapsed);
    setGame(result.game);
    if (result.ok) {
      setSelectedTokens([]);
      setSelectedCard(null);
    }
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

  const selectedAction = useMemo<GameAction | undefined>(
    () =>
      selectedTokens.length === 3
        ? { type: "TAKE_THREE", colors: selectedTokens }
        : undefined,
    [selectedTokens],
  );

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
            <strong>Turn {game.round}.{activePlayer.turnsTaken + 1}</strong>
            <span>{activePlayer.isBot ? `${activePlayer.name} move` : "your move"}</span>
          </div>
          <div className="top-supply">
            <span>supply</span>
            <TokenRow tokens={game.supply} compact />
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
            <strong className="timer-readout">{elapsed}s</strong>
          </div>
        </header>

        {game.winner && <section className="winner-banner">{game.winner.message}</section>}
        <section className="message-line">{game.message}</section>

        <section className="board-layout">
          <aside className="panel action-panel">
            <div className="action-head">
              <h2>Action</h2>
              <span>{humanTurn ? "Your turn" : "Bot turn"}</span>
            </div>

            <div className="action-mode-grid">
              <button className="mode-button active">Pick 3</button>
              <button className="mode-button">Pick 2 same</button>
              <button className="mode-button">Buy</button>
              <button className="mode-button">Reserve</button>
            </div>

            <section className="action-block">
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
              <button
                className="primary-button compact-command"
                disabled={!humanTurn || !selectedAction}
                onClick={() => selectedAction && perform(selectedAction)}
              >
                Take gems
              </button>
              <div className="two-grid">
              {gems.map((gem) => (
                <button
                  className="two-token-button"
                  disabled={!humanTurn || game.supply[gem] < 4}
                  title={`Take two ${gemLabels[gem]}`}
                  key={gem}
                  onClick={() => perform({ type: "TAKE_TWO", color: gem })}
                >
                  <span className={`coin token-${gem}`} />
                  <span className={`coin token-${gem}`} />
                </button>
              ))}
              </div>
            </section>

            <section className="action-block selected-card-block">
              <h3>Selected Card</h3>
              {selectedCard ? (
                <div className={`selected-card-preview ${selectedCard.card.color}`}>
                  <div>
                    <strong>{selectedCard.card.points}</strong>
                    <span>{selectedCard.source === "market" ? `Level ${selectedCard.tier}` : "Reserved"}</span>
                  </div>
                  <Cost card={selectedCard.card} player={activePlayer} />
                </div>
              ) : (
                <p>Select a card on the table.</p>
              )}
              <div className="selected-actions">
                <button
                  className="icon-command buy-command"
                  disabled={!humanTurn || !selectedCard}
                  onClick={() => {
                    if (!selectedCard) return;
                    if (selectedCard.source === "market") {
                      perform({
                        type: "BUY_MARKET",
                        tier: selectedCard.tier,
                        cardId: selectedCard.card.id,
                      });
                    } else {
                      perform({ type: "BUY_RESERVED", cardId: selectedCard.card.id });
                    }
                  }}
                  title="Buy selected card"
                >
                  <span className="command-card-icon" />
                  <span>Buy</span>
                </button>
                <button
                  className="icon-command reserve-command"
                  disabled={!humanTurn || selectedCard?.source !== "market"}
                  onClick={() => {
                    if (selectedCard?.source === "market") {
                      perform({
                        type: "RESERVE_MARKET",
                        tier: selectedCard.tier,
                        cardId: selectedCard.card.id,
                      });
                    }
                  }}
                  title="Reserve selected card"
                >
                  <span className="command-card-icon outline" />
                  <span>Reserve</span>
                </button>
              </div>
            </section>

            <h2>Reserved</h2>
            {activePlayer.reserved.length === 0 && <p>No reserved cards.</p>}
            {activePlayer.reserved.map((card) => (
              <CardView
                card={card}
                compact
                disabled={!humanTurn}
                player={activePlayer}
                selected={selectedCard?.source === "reserved" && selectedCard.card.id === card.id}
                key={card.id}
                onSelect={() => setSelectedCard({ source: "reserved", card })}
              />
            ))}

            <h2>Recent Actions</h2>
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
          </aside>

          <section className="table-area">
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
                      disabled={!humanTurn || activePlayer.reserved.length >= 3 || game.decks[tier].length === 0}
                      onReserve={() => perform({ type: "RESERVE_DECK", tier })}
                      tier={tier}
                    />
                    {game.market[tier].map((card) => (
                      <CardView
                        card={card}
                        player={activePlayer}
                        disabled={!humanTurn}
                        selected={selectedCard?.source === "market" && selectedCard.card.id === card.id}
                        key={card.id}
                        onSelect={() => setSelectedCard({ source: "market", tier, card })}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <aside className="panel player-panel">
            <div className="player-tabs">
              {game.players.map((player, index) => (
                <span className={index === game.activePlayerIndex ? "player-tab active" : "player-tab"} key={player.id}>
                  {player.name}
                </span>
              ))}
            </div>
            {game.players.map((player, index) => (
              <article className={index === game.activePlayerIndex ? "player active" : "player"} key={player.id}>
                <div className="player-heading">
                  <strong>{player.name}</strong>
                  <span><strong>{playerScore(player)}</strong> prestige</span>
                </div>
                <h3>Gems</h3>
                <TokenRow tokens={player.tokens} compact />
                <h3>Cards</h3>
                <BonusRow player={player} />
                <small>
                  Cards {player.purchased.length} | Reserved {player.reserved.length} | Turns {player.turnsTaken}
                </small>
              </article>
            ))}
          </aside>
        </section>
      </main>
    );
  }

  return (
    <main className="landing">
      <img className="hero-image" src={`${import.meta.env.BASE_URL}hero-splendor.webp`} alt="" />
      <section className="landing-content">
        <p className="eyebrow">A browser board game pilot</p>
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
  player,
  compact = false,
  disabled = false,
  selected = false,
  onSelect,
}: {
  card: Card;
  player: Player;
  compact?: boolean;
  disabled?: boolean;
  selected?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={
        compact
          ? `game-card compact ${card.color}${selected ? " selected-card" : ""}`
          : `game-card ${card.color}${selected ? " selected-card" : ""}`
      }
      disabled={disabled}
      onClick={onSelect}
      title={`${card.points} prestige ${gemLabels[card.color]} card`}
    >
      <div className="card-top">
        <strong>{card.points}</strong>
        <span className={`card-icon card-${card.color}`} />
      </div>
      <Cost card={card} player={player} />
    </button>
  );
}

function DeckTile({
  count,
  disabled,
  onReserve,
  tier,
}: {
  count: number;
  disabled: boolean;
  onReserve: () => void;
  tier: Tier;
}) {
  return (
    <button
      className={`deck-tile tier-${tier}`}
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
