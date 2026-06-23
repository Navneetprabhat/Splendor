# Splendor Rulebook Reference

This is a repo-owned rules reference for the digital Splendor implementation. It explains the base game rules in original wording so the app can fetch and display it without copying proprietary rulebook text.

## Objective

Players collect gems, buy development cards, attract nobles, and compete to reach the highest prestige score. The endgame is triggered when a player reaches 15 prestige points.

## Components to Model

- Development cards in three levels.
- Noble tiles.
- Gem tokens: diamond, sapphire, emerald, ruby, and onyx.
- Gold tokens that act as wild gems.
- Player areas containing purchased cards, reserved cards, tokens, and prestige points.

## Setup Summary

- Shuffle each development card level separately.
- Reveal four cards from each level.
- Reveal nobles based on player count.
- Place gem and gold tokens in the shared supply based on player count.
- Choose a starting player.

## Turn Options

On a player's turn, they perform one main action:

- Take three gems of different colors.
- Take two gems of the same color, if enough tokens of that color remain available.
- Reserve one visible card or one card from the top of a deck, then take one gold token if available.
- Buy one visible or reserved development card by paying its cost.

Players may not end a turn with more than ten tokens. If they exceed the limit, they must return tokens to the supply until they have ten.

## Buying Cards

Purchased development cards give permanent gem bonuses. These bonuses reduce future card costs by matching color. Gold tokens may be spent as any gem color.

## Nobles

After a player buys a card, check whether they meet any noble requirements. If they qualify, one matching noble visits that player and adds its prestige points.

## Endgame

When any player reaches at least 15 prestige points, finish the current round so every player has taken the same number of turns. The player with the most prestige wins. If tied, the tied player with fewer purchased development cards wins.

## Player Count Note

The base board game supports 2 to 4 players. Pilot 1 follows that range for local multiplayer.
