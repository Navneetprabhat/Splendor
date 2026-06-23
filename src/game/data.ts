import type { Card, Cost, Gem, Noble, Tier } from "./types";

export const gems: Gem[] = ["diamond", "sapphire", "emerald", "ruby", "onyx"];

export const gemLabels: Record<Gem, string> = {
  diamond: "Diamond",
  sapphire: "Sapphire",
  emerald: "Emerald",
  ruby: "Ruby",
  onyx: "Onyx",
};

export const gemShort: Record<Gem, string> = {
  diamond: "D",
  sapphire: "S",
  emerald: "E",
  ruby: "R",
  onyx: "O",
};

export const emptyCost = (): Cost => ({
  diamond: 0,
  sapphire: 0,
  emerald: 0,
  ruby: 0,
  onyx: 0,
});

const c = (
  diamond = 0,
  sapphire = 0,
  emerald = 0,
  ruby = 0,
  onyx = 0,
): Cost => ({ diamond, sapphire, emerald, ruby, onyx });

const card = (
  id: string,
  tier: Tier,
  color: Gem,
  points: number,
  cost: Cost,
): Card => ({
  id,
  tier,
  color,
  points,
  cost,
  name: `${gemLabels[color]} ${tier}-${id.split("-").pop()}`,
});

export const cards: Card[] = [
  card("t1-d-1", 1, "diamond", 0, c(0, 1, 1, 1, 1)),
  card("t1-d-2", 1, "diamond", 0, c(0, 2, 0, 2, 0)),
  card("t1-d-3", 1, "diamond", 1, c(0, 0, 4, 0, 0)),
  card("t1-d-4", 1, "diamond", 0, c(0, 1, 2, 1, 1)),
  card("t1-s-1", 1, "sapphire", 0, c(1, 0, 1, 1, 1)),
  card("t1-s-2", 1, "sapphire", 0, c(2, 0, 0, 0, 2)),
  card("t1-s-3", 1, "sapphire", 1, c(0, 0, 0, 4, 0)),
  card("t1-s-4", 1, "sapphire", 0, c(1, 0, 1, 2, 1)),
  card("t1-e-1", 1, "emerald", 0, c(1, 1, 0, 1, 1)),
  card("t1-e-2", 1, "emerald", 0, c(0, 2, 0, 0, 2)),
  card("t1-e-3", 1, "emerald", 1, c(0, 0, 0, 0, 4)),
  card("t1-e-4", 1, "emerald", 0, c(1, 1, 0, 1, 2)),
  card("t1-r-1", 1, "ruby", 0, c(1, 1, 1, 0, 1)),
  card("t1-r-2", 1, "ruby", 0, c(2, 0, 2, 0, 0)),
  card("t1-r-3", 1, "ruby", 1, c(4, 0, 0, 0, 0)),
  card("t1-r-4", 1, "ruby", 0, c(2, 1, 1, 0, 1)),
  card("t1-o-1", 1, "onyx", 0, c(1, 1, 1, 1, 0)),
  card("t1-o-2", 1, "onyx", 0, c(0, 0, 2, 2, 0)),
  card("t1-o-3", 1, "onyx", 1, c(0, 4, 0, 0, 0)),
  card("t1-o-4", 1, "onyx", 0, c(1, 2, 1, 1, 0)),

  card("t2-d-1", 2, "diamond", 1, c(0, 3, 2, 2, 0)),
  card("t2-d-2", 2, "diamond", 2, c(0, 0, 1, 4, 2)),
  card("t2-d-3", 2, "diamond", 3, c(0, 0, 0, 0, 6)),
  card("t2-s-1", 2, "sapphire", 1, c(0, 0, 3, 2, 2)),
  card("t2-s-2", 2, "sapphire", 2, c(5, 0, 0, 0, 3)),
  card("t2-s-3", 2, "sapphire", 3, c(6, 0, 0, 0, 0)),
  card("t2-e-1", 2, "emerald", 1, c(2, 0, 0, 3, 2)),
  card("t2-e-2", 2, "emerald", 2, c(3, 5, 0, 0, 0)),
  card("t2-r-1", 2, "ruby", 1, c(2, 2, 0, 0, 3)),
  card("t2-r-2", 2, "ruby", 2, c(0, 3, 5, 0, 0)),
  card("t2-o-1", 2, "onyx", 1, c(3, 2, 2, 0, 0)),
  card("t2-o-2", 2, "onyx", 2, c(0, 0, 3, 5, 0)),

  card("t3-d-1", 3, "diamond", 3, c(0, 3, 3, 5, 3)),
  card("t3-d-2", 3, "diamond", 4, c(0, 0, 0, 7, 0)),
  card("t3-d-3", 3, "diamond", 5, c(0, 0, 0, 7, 3)),
  card("t3-s-1", 3, "sapphire", 3, c(3, 0, 3, 3, 5)),
  card("t3-s-2", 3, "sapphire", 4, c(7, 0, 0, 0, 0)),
  card("t3-s-3", 3, "sapphire", 5, c(7, 3, 0, 0, 0)),
  card("t3-e-1", 3, "emerald", 4, c(0, 7, 0, 0, 0)),
  card("t3-e-2", 3, "emerald", 5, c(0, 7, 3, 0, 0)),
  card("t3-r-1", 3, "ruby", 4, c(0, 0, 7, 0, 0)),
  card("t3-r-2", 3, "ruby", 5, c(0, 0, 7, 3, 0)),
  card("t3-o-1", 3, "onyx", 4, c(0, 0, 0, 0, 7)),
  card("t3-o-2", 3, "onyx", 5, c(3, 0, 0, 0, 7)),
];

export const nobles: Noble[] = [
  { id: "n-anne", name: "Anne of Brittany", points: 3, cost: c(3, 3, 3, 0, 0) },
  { id: "n-charles", name: "Charles V", points: 3, cost: c(0, 3, 3, 3, 0) },
  { id: "n-isabella", name: "Isabella", points: 3, cost: c(0, 0, 3, 3, 3) },
  { id: "n-francis", name: "Francis I", points: 3, cost: c(3, 0, 0, 3, 3) },
  { id: "n-mary", name: "Mary Stuart", points: 3, cost: c(3, 3, 0, 0, 3) },
  { id: "n-henry", name: "Henry VIII", points: 3, cost: c(4, 4, 0, 0, 0) },
  { id: "n-catherine", name: "Catherine", points: 3, cost: c(0, 4, 4, 0, 0) },
  { id: "n-philip", name: "Philip II", points: 3, cost: c(0, 0, 4, 4, 0) },
  { id: "n-elizabeth", name: "Elizabeth", points: 3, cost: c(0, 0, 0, 4, 4) },
  { id: "n-lorenzo", name: "Lorenzo", points: 3, cost: c(4, 0, 0, 0, 4) },
];
